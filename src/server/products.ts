"use server";
import { db } from "@/db/drizzle";
import {
  categories,
  colors,
  discounts,
  productGenders,
  productImages,
  products,
  productTags,
  productVariants,
  promocodes,
  sizes,
  subcategories,
} from "@/db/schema/products";
import { and, eq, inArray, sql } from "drizzle-orm";

export async function getSizes() {
  return await db.select().from(sizes);
}

export async function getColors() {
  return await db.select().from(colors);
}

export async function getSizesByOptions(categoryId: number, type: string) {
  console.log("-->db", categoryId, type);
  const result = await db
    .select()
    .from(sizes)
    .where(and(eq(sizes.categoryId, categoryId), eq(sizes.type, type)))
    .orderBy(sizes.sizenumber);

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
    tags,
    images,
    discounts: inputDiscounts,
    promocodes: inputPromocodes,
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
      db.delete(productTags).where(eq(productTags.productId, productId)),
      db.delete(productGenders).where(eq(productGenders.productId, productId)),
      db.delete(discounts).where(eq(discounts.productId, productId)),
      db.delete(promocodes).where(eq(promocodes.productId, productId)),
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
  if (inputDiscounts && inputDiscounts.length > 0) {
    await db.insert(discounts).values(
      inputDiscounts.map((disc) => ({
        productId,
        type: disc.type,
        value: disc.value,
        minQuantity: disc.quantity,
      }))
    );
  }

  // Insert promocodes
  if (inputPromocodes && inputPromocodes.length > 0) {
    await db.insert(promocodes).values(
      inputPromocodes.map((promo) => ({
        productId,
        type: promo.type,
        value: promo.value,
        promocode: promo.promocode,
      }))
    );
  }

  // Insert tags
  if (tags && tags.length > 0) {
    await db.insert(productTags).values(
      tags.map((tag) => ({
        productId,
        tag,
      }))
    );
  }

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
  const discountsData = await db
    .select({
      productId: discounts.productId,
      type: discounts.type,
      value: discounts.value,
      minQuantity: discounts.minQuantity,
    })
    .from(discounts)
    .where(inArray(discounts.productId, productIds));

  type Discount = {
    type: string;
    value: number;
    minQuantity: number | null;
  };

  // Group discounts by productId
  const discountMap = new Map<number, Discount[]>();
  for (const d of discountsData) {
    const list = discountMap.get(d.productId!) ?? [];
    list.push({
      type: d.type,
      value: d.value,
      minQuantity: d.minQuantity,
    });
    discountMap.set(d.productId!, list);
  }

  // Step 4: Merge and return final structure
  const merged = topProducts.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    images: imageMap.get(product.id) ?? [],
    discount: discountMap.get(product.id) ?? [],
  }));

  return merged;
};

export type ProductDetail = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  category: string;
  subcategory: string | null;
  images: { url: string }[];
  discounts: { type: string; value: number; quantity?: number }[];
  promocodes: { type: string; promocode: string; value: number }[];
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

export const getProductById = async (productId: number) => {
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
  const discount = await db
    .select({
      type: discounts.type,
      value: discounts.value,
      minQuantity: discounts.minQuantity,
    })
    .from(discounts)
    .where(eq(discounts.productId, productId))
    .then((res) => res[0] || null);

  // 4. Fetch inventory and group by color
  const variants = await db
    .select({
      colorId: colors.id,
      colorName: colors.name,
      colorCode: colors.colorCode,
      sizeId: sizes.id,
      sizeName: sizes.name,
      quantity: productVariants.quantity,
      indiaSize: sizes.indiaSize,
      usSize: sizes.usSize,
      ukSize: sizes.ukSize,
      euSize: sizes.euSize,
    })
    .from(productVariants)
    .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .innerJoin(colors, eq(productVariants.colorId, colors.id))
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
    });
  }

  return {
    ...productData,
    images,
    discount,
    inventory: Array.from(colorMap.values()),
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
  const discount = await db
    .select({
      type: discounts.type,
      value: discounts.value,
      quantity: discounts.minQuantity,
    })
    .from(discounts)
    .where(eq(discounts.productId, productId));

  const promocode = await db
    .select({
      type: promocodes.type,
      promocode: promocodes.promocode,
      value: promocodes.value,
    })
    .from(promocodes)
    .where(eq(promocodes.productId, productId));

  // 4. Fetch inventory and group by color
  const variants = await db
    .select({
      colorId: colors.id,
      colorName: colors.name,
      colorCode: colors.colorCode,
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
    discounts: discount,
    promocodes: promocode,
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
  type: string;
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
  const discount = await db
    .select({
      type: discounts.type,
      value: discounts.value,
      quantity: discounts.minQuantity,
    })
    .from(discounts)
    .where(eq(discounts.productId, productId))
    .then((res) =>
      res.map((d) => ({
        ...d,
        quantity: d.quantity === null ? undefined : d.quantity,
      }))
    );

  // 5. Fetch promocodes
  const promocode = await db
    .select({
      type: promocodes.type,
      promocode: promocodes.promocode,
      value: promocodes.value,
    })
    .from(promocodes)
    .where(eq(promocodes.productId, productId));

  //const type= await db.select({type:sizes.type}).from(sizes).eq

  // 6. Fetch inventory with color/size
  const variants = await db
    .select({
      colorId: colors.id,
      colorName: colors.name,
      colorCode: colors.colorCode,
      sizeId: sizes.id,
      sizeName: sizes.name,
      type: sizes.type,
      quantity: productVariants.quantity,
    })
    .from(productVariants)
    .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .innerJoin(colors, eq(productVariants.colorId, colors.id))
    .where(eq(productVariants.productId, productId))
    .orderBy(sizes.id);

  const type = variants[0].type;
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
    discounts: discount,
    promocodes: promocode,
    inventory: Array.from(colorMap.values()),
    type: type ?? "",
  };

  return productDetail;
};
