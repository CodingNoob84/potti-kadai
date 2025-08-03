"use server";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema/auth";
import { categories, colors, countrySizes, sizes, subcategories } from "@/db/schema/category";
import {
  productGenders,
  productImages,
  productReviews,
  products,
  productVariants,
} from "@/db/schema/products";
import { and, avg, eq, gte, inArray, lte, sql } from "drizzle-orm";

export async function getSizes() {
  return await db.select().from(sizes);
}

export async function getColors() {
  return await db.select().from(colors);
}

export async function getColorsUsedInVariants() {
  return await db
    .selectDistinct({
      id: colors.id,
      name: colors.name,
      hex: colors.color_code,
    })
    .from(productVariants)
    .innerJoin(colors, eq(productVariants.colorId, colors.id));
}

export async function getSizesByOptions(categoryId: number) {
  console.log("-->db", categoryId);
  const result = await db
    .select()
    .from(sizes)
    //.where(and(eq(sizes.categoryId, categoryId), eq(sizes.type, type)))
    .orderBy(sizes.id);

  return result;
}

interface CreateProductInput {
  id: number;
  title: string;
  description: string;
  price: number;
  isactive: boolean;
  gender: string[];
  category: number;
  subcategory: number;
  tags: string[];
  images: string[];
  discounts: { type: string; value: number; quantity?: number }[];
  promocodes: { type: string; promocode: string; value: number }[];
  inventory: {
    colorId: number;
    name: string;
    colorCode: string;
    sizes: { sizeId: number; name: string; quantity: number }[];
  }[];
}

export const createOrUpdateProduct = async (input: CreateProductInput) => {
  const {
    id,
    title,
    description,
    price,
    isactive,
    gender,
    category,
    subcategory,
    images,
    inventory,
  } = input;

  let productId = id ?? 0;

  if (productId === 0) {
    // Create product
    const [newProduct] = await db
      .insert(products)
      .values({
        name: title,
        description,
        price,
        isActive: isactive,
        categoryId: category,
        subcategoryId: subcategory,
      })
      .returning();

    productId = newProduct.id;
  } else {
    // Update product
    await db
      .update(products)
      .set({
        name: title,
        description,
        price,
        isActive: isactive,
        categoryId: category,
        subcategoryId: subcategory,
      })
      .where(eq(products.id, productId));

    // Cleanup old data
    await Promise.all([
      db.delete(productImages).where(eq(productImages.productId, productId)),
      db
        .delete(productVariants)
        .where(eq(productVariants.productId, productId)),

      db.delete(productGenders).where(eq(productGenders.productId, productId)),
    ]);
  }

  // Insert new genders
  if (gender && gender.length > 0) {
    await db.insert(productGenders).values(
      gender.map((genderId) => ({
        productId,
        genderId: parseInt(genderId),
      }))
    );
  }

  // Insert images
  if (images.length > 0) {
    await db.insert(productImages).values(
      images.map((url) => ({
        productId,
        url,
      }))
    );
  }

  // Insert inventory
  const variantData = inventory.flatMap((colorEntry) =>
    colorEntry.sizes.map((sizeEntry) => ({
      productId,
      colorId: colorEntry.colorId,
      sizeId: sizeEntry.sizeId,
      quantity: sizeEntry.quantity,
    }))
  );

  if (variantData.length > 0) {
    await db.insert(productVariants).values(variantData);
  }

  // Insert discounts
  
  
  // Insert promocodes


  // Insert tags
  

  return { productId };
};

export const getAllProducts = async () => {
  const baseProducts = await db.select().from(products);

  const result = await Promise.all(
    baseProducts.map(async (product) => {
      const [category] = await db
        .select({ name: categories.name })
        .from(categories)
        .where(eq(categories.id, product.categoryId));

      const [subcategory] = await db
        .select({ name: subcategories.name })
        .from(subcategories)
        .where(eq(subcategories.id, product.subcategoryId));

      const productInventory = await db
        .select({ id: productVariants.id })
        .from(productVariants)
        .where(eq(productVariants.productId, product.id));

      const inventoryIds = productInventory.map((inv) => inv.id);

      const totalSizes = inventoryIds.length
        ? await db
            .select()
            .from(productVariants)
            .where(inArray(productVariants.id, inventoryIds))
        : [];

      const totalQuantity = totalSizes.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        id: product.id,
        title: product.name,
        price: product.price,
        category: category?.name ?? "",
        subcategory: subcategory?.name ?? "",
        totalQuantity,
        is_active: product.isActive,
      };
    })
  );

  return result;
};

export const getTopProducts = async () => {
  // Step 1: Get top 10 active products
  const topProducts = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
    })
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(sql`RANDOM()`)
    .limit(10);

  const productIds = topProducts.map((p) => p.id);

  // Step 2: Get all images for those products
  const images = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
    })
    .from(productImages)
    .where(inArray(productImages.productId, productIds));

  // Group images by productId
  const imageMap = new Map<number, string[]>();
  for (const img of images) {
    const list = imageMap.get(img.productId) ?? [];
    list.push(img.url);
    imageMap.set(img.productId, list);
  }

  // Step 3: Get all discounts for those products




  // Group discounts by productId


  // Step 4: Merge and return final structure
  const merged = topProducts.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    images: imageMap.get(product.id) ?? [],
    discount:  [],
  }));

  return merged;
};

export type ProductDetail = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  category: string | null;
  subcategory: string | null;
  images: { url: string; colorId: number | null }[];
  discounts: {
    type: string;
    value: number;
    minQuantity: number | null;
  }[];
  inventory: {
    colorId: number;
    name: string;
    colorCode: string;
    sizes: {
      sizeId: number;
      name: string;
      quantity: number;
      indiaSize: string;
      usSize: string;
      ukSize: string;
      euSize: string;
      pvId: number;
    }[];
  }[];
  rating: number;
  reviews: {
    id: number;
    userId: string;
    rating: number;
    comment: string | null;
    createdAt: Date | null;
    userName: string | null;
    userEmail: string | null;
    userImage: string | null;
  }[];
};

//Website/Id
export const getProductById = async (
  productId: number
): Promise<ProductDetail | null> => {
  // 1. Fetch basic product info with category, subcategory
  const productData = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      isActive: products.isActive,
      category: categories.name,
      subcategory: subcategories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
    .where(eq(products.id, productId))
    .then((res) => res[0]);

  if (!productData) return null;

  // 2. Fetch all images
  const images = await db
    .select({ url: productImages.url, colorId: productImages.colorId ?? 0 })
    .from(productImages)
    .where(eq(productImages.productId, productId));

  // 3. Fetch discount if available


  // 4. Fetch inventory and group by color
  const variants = await db
  .select({
    colorId: colors.id,
    colorName: colors.name,
    colorCode: colors.color_code,
    sizeId: sizes.id,
    sizeName: sizes.name,
    quantity: productVariants.quantity,
    indiaSize: countrySizes.size_label, // filter or map for IND later
    usSize: countrySizes.size_label,    // same for US...
    ukSize: countrySizes.size_label,
    euSize: countrySizes.size_label,
    countryName: countrySizes.country_name,
    productVariantId: productVariants.id,
  })
  .from(productVariants)
  .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
  .innerJoin(colors, eq(productVariants.colorId, colors.id))
  .innerJoin(countrySizes, eq(sizes.id, countrySizes.size_id))
  .where(eq(productVariants.productId, productId))
  .orderBy(sizes.id);

  // Group by color → colorId, name, colorCode, sizes[]
  type InventoryItem = {
    colorId: number;
    name: string;
    colorCode: string;
    sizes: {
      sizeId: number;
      name: string;
      quantity: number;
      indiaSize: string;
      usSize: string;
      ukSize: string;
      euSize: string;
      pvId: number;
    }[];
  };

  const colorMap = new Map<number, InventoryItem>();

  for (const v of variants) {
    if (!colorMap.has(v.colorId)) {
      colorMap.set(v.colorId, {
        colorId: v.colorId,
        name: v.colorName,
        colorCode: v.colorCode,
        sizes: [],
      });
    }
    colorMap.get(v.colorId)!.sizes.push({
      sizeId: v.sizeId,
      name: v.sizeName,
      quantity: v.quantity,
      indiaSize: v.indiaSize ?? "-",
      usSize: v.usSize ?? "-",
      ukSize: v.ukSize ?? "-",
      euSize: v.euSize ?? "-",
      pvId: v.productVariantId,
    });
  }

  // 5. Average rating
  const ratingRes = await db
    .select({ rating: avg(productReviews.rating).as("rating") })
    .from(productReviews)
    .where(eq(productReviews.productId, productId))
    .then((res) => res[0]?.rating ?? 0.0);

  const averageRating = parseFloat(Number(ratingRes).toFixed(1)) || 0;

  // 6. Reviews list
  const reviews = await db
    .select({
      id: productReviews.id,
      userId: productReviews.userId,
      rating: productReviews.rating,
      comment: productReviews.comment,
      createdAt: productReviews.createdAt,
      userName: user.name, // Optional
      userEmail: user.email, // Optional
      userImage: user.image,
    })
    .from(productReviews)
    .where(eq(productReviews.productId, productId))
    .leftJoin(user, eq(productReviews.userId, user.id))
    .orderBy(productReviews.createdAt);

  return {
    ...productData,
    images,
    discounts: [],
    inventory: Array.from(colorMap.values()),
    rating: averageRating,
    reviews,
  };
};

export const getProductDetailsById = async (productId: number) => {
  // 1. Fetch basic product info with category, subcategory
  const productData = await db
    .select({
      id: products.id,
      title: products.name,
      description: products.description,
      price: products.price,
      isactive: products.isActive,
      category: categories.name,
      subcategory: subcategories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
    .where(eq(products.id, productId))
    .then((res) => res[0]);

  if (!productData) return null;

  // 2. Fetch all images
  const images = (
    await db
      .select({ url: productImages.url })
      .from(productImages)
      .where(eq(productImages.productId, productId))
  ).map((img) => img.url);

  const genderIds = (
    await db
      .select({ genderId: productGenders.genderId })
      .from(productGenders)
      .where(eq(productGenders.productId, productId))
  ).map((g) => g.genderId.toString());

  // 3. Fetch discount if available
 

  

  // 4. Fetch inventory and group by color
  const variants = await db
    .select({
      colorId: colors.id,
      colorName: colors.name,
      colorCode: colors.color_code,
      sizeId: sizes.id,
      sizeName: sizes.name,
      quantity: productVariants.quantity,
    })
    .from(productVariants)
    .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .innerJoin(colors, eq(productVariants.colorId, colors.id))
    .where(eq(productVariants.productId, productId))
    .orderBy(sizes.id); // 👈 order by sizeId

  // Group by color → colorId, name, colorCode, sizes[]
  type InventoryItem = {
    colorId: number;
    name: string;
    colorCode: string;
    sizes: { sizeId: number; name: string; quantity: number }[];
  };

  const colorMap = new Map<number, InventoryItem>();

  for (const v of variants) {
    if (!colorMap.has(v.colorId)) {
      colorMap.set(v.colorId, {
        colorId: v.colorId,
        name: v.colorName,
        colorCode: v.colorCode,
        sizes: [],
      });
    }
    colorMap.get(v.colorId)!.sizes.push({
      sizeId: v.sizeId,
      name: v.sizeName,
      quantity: v.quantity,
    });
  }

  return {
    ...productData,
    images,
    gender: genderIds,
    discounts: [],
    promocodes: [],
    inventory: Array.from(colorMap.values()),
  };
};

type EditProductDetail = {
  id: number;
  title: string;
  description: string;
  price: number;
  isactive: boolean;
  category: number;
  subcategory: number;
  images: string[];
  gender: string[];
  //type: string;
  discounts: {
    type: string;
    value: number;
    quantity: number | undefined;
  }[];
  promocodes: {
    type: string;
    promocode: string;
    value: number;
  }[];
  inventory: {
    colorId: number;
    name: string;
    colorCode: string;
    sizes: {
      sizeId: number;
      name: string;
      quantity: number;
    }[];
  }[];
};

export const getProductDetailsByIdEdit = async (
  productId: number
): Promise<EditProductDetail | null> => {
  // 1. Fetch basic product info with category, subcategory
  const productData = await db
    .select({
      id: products.id,
      title: products.name,
      description: products.description ?? "",
      price: products.price,
      isactive: products.isActive,
      category: categories.id,
      subcategory: subcategories.id,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
    .where(eq(products.id, productId))
    .then((res) => res[0]);

  if (!productData) return null;

  // 2. Fetch all images
  const images = (
    await db
      .select({ url: productImages.url })
      .from(productImages)
      .where(eq(productImages.productId, productId))
  ).map((img) => img.url);

  // 3. Fetch gender
  const genderIds = (
    await db
      .select({ genderId: productGenders.genderId })
      .from(productGenders)
      .where(eq(productGenders.productId, productId))
  ).map((g) => g.genderId.toString());

  // 4. Fetch discounts
  

  //const type= await db.select({type:sizes.type}).from(sizes).eq

  // 6. Fetch inventory with color/size
  const variants = await db
    .select({
      colorId: colors.id,
      colorName: colors.name,
      colorCode: colors.color_code,
      sizeId: sizes.id,
      sizeName: sizes.name,
      //type: sizes.type,
      quantity: productVariants.quantity,
    })
    .from(productVariants)
    .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .innerJoin(colors, eq(productVariants.colorId, colors.id))
    .where(eq(productVariants.productId, productId))
    .orderBy(sizes.id);

  //const type = variants[0].type;
  const colorMap = new Map<number, EditProductDetail["inventory"][0]>();

  for (const v of variants) {
    if (!colorMap.has(v.colorId)) {
      colorMap.set(v.colorId, {
        colorId: v.colorId,
        name: v.colorName,
        colorCode: v.colorCode,
        sizes: [],
      });
    }
    colorMap.get(v.colorId)!.sizes.push({
      sizeId: v.sizeId,
      name: v.sizeName,
      quantity: v.quantity,
    });
  }

  // 7. Return complete object
  const productDetail: EditProductDetail = {
    id: productData.id ?? 0,
    title: productData.title,
    description: productData.description,
    price: productData.price,
    isactive: productData.isactive,
    category: productData.category ?? 0,
    subcategory: productData.subcategory ?? 0,
    images,
    gender: genderIds,
    discounts: [],
    promocodes: [],
    inventory: Array.from(colorMap.values()),
    // type: type ?? "",
  };

  return productDetail;
};

export const getProductRatings = async () => {
  const result = await db
    .select({
      id: products.id,
      productName: products.name,
      averageRating: sql<number>`COALESCE(AVG(${productReviews.rating}), 0)`,
      totalReviews: sql<number>`COALESCE(COUNT(${productReviews.id}), 0)`,
    })
    .from(products)
    .leftJoin(productReviews, eq(products.id, productReviews.productId))
    .groupBy(products.id, products.name)
    .limit(10);

  const parsedResult = result.map((item) => ({
    ...item,
    averageRating: parseFloat(item.averageRating as unknown as string),
    totalReviews: parseInt(item.totalReviews as unknown as string, 10),
  }));

  return parsedResult;
};

export const getProductReviews = async (productId: number) => {
  const result = await db
    .select({
      id: productReviews.id,
      userId: productReviews.userId,
      rating: productReviews.rating,
      comment: productReviews.comment,
      createdAt: productReviews.createdAt,
      updatedAt: productReviews.updatedAt,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
    })
    .from(productReviews)
    .where(eq(productReviews.productId, productId))
    .leftJoin(user, eq(productReviews.userId, user.id)) // Optional
    .orderBy(productReviews.createdAt); // Most recent last (or use `desc()`)

  return result;
};

type ProductFilterParams = {
  genderIds?: number[];
  categoryIds?: number[];
  subcategoryIds?: number[];
  colorIds?: number[];
  priceAbove?: number;
  priceBelow?: number;
  ratings?: number;
  pageNumber?: number;
  limit?: number;
};

export const getProductFilters = async (filters: ProductFilterParams) => {
  const {
    genderIds,
    categoryIds,
    subcategoryIds,
    colorIds,
    priceAbove,
    priceBelow,
    ratings,
    pageNumber = 1,
    limit = 12,
  } = filters;

  const whereClauses = [eq(products.isActive, true)];

  if (genderIds?.length) {
    whereClauses.push(inArray(productGenders.genderId, genderIds));
  }

  if (categoryIds?.length) {
    whereClauses.push(inArray(products.categoryId, categoryIds));
  }

  if (subcategoryIds?.length) {
    whereClauses.push(inArray(products.subcategoryId, subcategoryIds));
  }

  if (priceAbove !== undefined) {
    whereClauses.push(gte(products.price, priceAbove));
  }

  if (priceBelow !== undefined) {
    whereClauses.push(lte(products.price, priceBelow));
  }

  if (colorIds?.length) {
    whereClauses.push(inArray(productVariants.colorId, colorIds));
  }

  // STEP 1: Get all matching product IDs (for total count)
  const totalCountQuery = await db
    .select({ id: products.id })
    .from(products)
    .leftJoin(productGenders, eq(products.id, productGenders.productId))
    .leftJoin(productVariants, eq(products.id, productVariants.productId))
    .where(and(...whereClauses))
    .groupBy(products.id);

  const totalRecords = totalCountQuery.length;

  // STEP 2: Get paginated base products
  const offset = (pageNumber - 1) * limit;
  const baseProducts = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
    })
    .from(products)
    .leftJoin(productGenders, eq(products.id, productGenders.productId))
    .leftJoin(productVariants, eq(products.id, productVariants.productId))
    .where(and(...whereClauses))
    .groupBy(products.id)
    .limit(limit)
    .offset(offset);

  const productIds = baseProducts.map((p) => p.id);
  if (!productIds.length) return { totalRecords, products: [] };

  // STEP 3: Ratings
  const reviewStats = await db
    .select({
      productId: productReviews.productId,
      avgRating: sql<number>`ROUND(AVG(${productReviews.rating}), 1)`,
      reviewCount: sql<number>`COUNT(${productReviews.id})`,
    })
    .from(productReviews)
    .where(inArray(productReviews.productId, productIds))
    .groupBy(productReviews.productId);

  const ratingMap = new Map<
    number,
    { avgRating: number; reviewCount: number }
  >();
  reviewStats.forEach((r) =>
    ratingMap.set(r.productId, {
      avgRating: Number(r.avgRating),
      reviewCount: Number(r.reviewCount),
    })
  );

  const finalProducts = baseProducts.filter((p) => {
    if (ratings !== undefined) {
      const rating = ratingMap.get(p.id)?.avgRating ?? 0;
      return rating >= ratings;
    }
    return true;
  });

  const finalIds = finalProducts.map((p) => p.id);

  // STEP 4: Images
  const images = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
    })
    .from(productImages)
    .where(inArray(productImages.productId, finalIds));

  const imageMap = new Map<number, string>();
  for (const img of images) {
    if (!imageMap.has(img.productId)) {
      imageMap.set(img.productId, img.url);
    }
  }

  // STEP 5: Discounts
 





  // STEP 6: Final return
  const result = finalProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    avgRating: ratingMap.get(p.id)?.avgRating ?? 0,
    reviewCount: ratingMap.get(p.id)?.reviewCount ?? 0,
    imageUrl: imageMap.get(p.id) ?? null,
    discounts:  [],
  }));

  return {
    totalRecords,
    products: result,
  };
};
