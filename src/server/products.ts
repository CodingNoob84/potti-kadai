"use server";
import { db } from "@/db/drizzle";
import {
  categories,
  colors,
  discounts,
  productImages,
  products,
  productTags,
  productVariants,
  promocodes,
  sizes,
  subcategories,
} from "@/db/schema/products";
import { eq, inArray, sql } from "drizzle-orm";

export async function getSizes() {
  return await db.select().from(sizes);
}

export async function getColors() {
  return await db.select().from(colors);
}

interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  isactive: boolean;
  category: number;
  subcategory: number;
  tags: string[];
  images: string[];
  discounts: { type: string; value: number; quantity?: number }[];
  promocodes: { type: string; promocode: string; value: number }[];
  colorSelectionType: "single" | "multiple";
  inventory: {
    colorId: number;
    name: string;
    colorCode: string;
    sizes: { sizeId: number; name: string; quantity: number }[];
  }[];
}

export const createProduct = async (input: CreateProductInput) => {
  const {
    title,
    description,
    price,
    isactive,
    category,
    subcategory,
    tags,
    images,
    discounts: inputDiscounts,
    promocodes: inputPromocodes,
    inventory,
  } = input;

  // 1. Insert into products
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

  const productId = newProduct.id;

  // 2. Insert product images
  if (images.length > 0) {
    await db.insert(productImages).values(
      images.map((url) => ({
        productId,
        url,
      }))
    );
  }

  // 3. Insert product variants (size, color, quantity)
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

  // 4. Insert discounts (if table exists)
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

  // 5. Insert promocodes (if table exists)
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

  // 6. Insert product tags (if tag table exists)
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
  const data = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      image: productImages.url,
      discountType: discounts.type,
      discountValue: discounts.value,
      discountMinQ: discounts.minQuantity,
    })
    .from(products)
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .leftJoin(discounts, eq(discounts.productId, products.id))
    .where(eq(products.isActive, true))
    .orderBy(sql`RANDOM()`)
    .limit(10);

  // Ensure only 1 image per product (first found)
  const seen = new Set();
  const filtered = data.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return filtered;
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
    .select({ url: productImages.url })
    .from(productImages)
    .where(eq(productImages.productId, productId));

  // 3. Fetch discount if available
  const discount = await db
    .select({
      type: discounts.type,
      value: discounts.value,
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
      sizeName: sizes.shortform,
      quantity: productVariants.quantity,
    })
    .from(productVariants)
    .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .innerJoin(colors, eq(productVariants.colorId, colors.id))
    .where(eq(productVariants.productId, productId));

  // Group by color → colorId, name, colorCode, sizes[]
  type InventoryItem = {
    colorId: number;
    name: string;
    colorCode: string;
    sizes: { sizeId: number; name: string; quantity: number }[];
  };

  //const inventory: InventoryItem[] = [];

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
    discount,
    inventory: Array.from(colorMap.values()),
  };
};
