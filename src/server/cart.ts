"use server";
// server/cart.ts
import { db } from "@/db/drizzle";
import { cartItems } from "@/db/schema/cart";

import {
  colors,
  discounts,
  productImages,
  products,
  productVariants,
  sizes,
} from "@/db/schema/products";
import { DiscountType } from "@/types/products";

import { and, eq, inArray, sql } from "drizzle-orm";

export type CartItemDetail = {
  cartItemId: number;
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  pvId: number;
  colorId: number;
  colorName: string;
  sizeId: number;
  sizeName: string;
  discountedPercentage: number;
  discountedPrice: number;
};

export const getCartItems = async (
  userId: string
): Promise<CartItemDetail[]> => {
  const rows = await db
    .select({
      cartItemId: cartItems.id,
      quantity: cartItems.quantity,
      productId: products.id,
      productName: products.name,
      productPrice: products.price,
      variantId: productVariants.id,
      colorId: colors.id,
      colorName: colors.name,
      colorCode: colors.colorCode,
      sizeId: sizes.id,
      sizeName: sizes.name,
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(
      productVariants,
      eq(cartItems.productVariantId, productVariants.id)
    )
    .leftJoin(colors, eq(productVariants.colorId, colors.id))
    .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .where(eq(cartItems.userId, userId));

  // Deduplicate by cartItemId
  const seen = new Set<number>();
  const filtered = rows.filter((r) => {
    if (seen.has(r.cartItemId)) return false;
    seen.add(r.cartItemId);
    return true;
  });

  const productIds = filtered.map((r) => r.productId);
  const uniqueProductIds = Array.from(new Set(productIds));

  // Get images mapped by productId
  const productImagesDB = await db
    .select({
      url: productImages.url,
      productId: productImages.productId,
      imageColorId: productImages.colorId,
    })
    .from(productImages)
    .where(inArray(productImages.productId, uniqueProductIds as number[]));

  // Index images by productId
  const imageMap = new Map<
    number,
    { url: string; imageColorId: number | null }[]
  >();
  for (const img of productImagesDB) {
    if (!imageMap.has(img.productId)) imageMap.set(img.productId, []);
    imageMap.get(img.productId)!.push(img);
  }

  // Get discounts and map them by productId
  const allDiscounts = await db
    .select({
      productId: discounts.productId,
      type: discounts.type,
      value: discounts.value,
      quantity: discounts.minQuantity,
    })
    .from(discounts)
    .where(inArray(discounts.productId, uniqueProductIds as number[]));

  const discountMap = new Map<number, DiscountType[]>();
  for (const d of allDiscounts) {
    const pid = d.productId!;
    if (!discountMap.has(pid)) discountMap.set(pid, []);
    discountMap.get(pid)!.push({
      type: d.type ?? "percentage",
      value: d.value ?? 0,
      minQuantity: d.quantity ?? 1,
    });
  }

  // Final mapped cart items
  return filtered.map((r) => {
    const basePrice = r.productPrice || 0;
    const quantity = r.quantity || 1;

    const discounts = discountMap.get(r.productId ?? 0) || [];

    // Find the best applicable discount
    let discountedPercentage = 0;
    let discountedPrice = basePrice;

    const bestQuantityDiscount = discounts
      .filter((d) => d.type === "quantity" && quantity >= (d.minQuantity ?? 0))
      .sort((a, b) => (b.minQuantity ?? 0) - (a.minQuantity ?? 0))[0];

    const directDiscount = discounts.find((d) => d.type === "direct");

    const bestDiscount = bestQuantityDiscount || directDiscount;

    if (bestDiscount) {
      discountedPercentage = bestDiscount.value;
      discountedPrice = Math.round(
        basePrice - (basePrice * discountedPercentage) / 100
      );
    }

    // Match image by productId and colorId
    const images = imageMap.get(r?.productId || 0) || [];
    const matchedImage =
      images.find((img) => img.imageColorId === r.colorId) ?? images[0];

    return {
      cartItemId: r.cartItemId,
      productId: r.productId ?? -1,
      name: r.productName ?? "",
      price: basePrice ?? 0,
      imageUrl: matchedImage?.url || "",
      quantity,
      pvId: r.variantId ?? 0,
      colorId: r.colorId ?? 0,
      colorName: r.colorName ?? "",
      sizeId: r.sizeId ?? 0,
      sizeName: r.sizeName ?? "",
      discountedPercentage,
      discountedPrice,
    };
  });
};

export const getCartTotalItems = async (userId: string): Promise<number> => {
  const result = await db
    .select({
      total: sql<number>`SUM(${cartItems.quantity})`.mapWith(Number),
    })
    .from(cartItems)
    .where(eq(cartItems.userId, userId));

  return result[0]?.total ?? 0;
};

export const addToCart = async ({
  userId,
  productId,
  productVariantId,
  quantity = 1,
}: {
  userId: string;
  productId: number;
  productVariantId: number;
  quantity?: number;
}) => {
  // Check if the item already exists in the cart
  const existing = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId),
        eq(cartItems.productVariantId, productVariantId)
      )
    );

  if (existing.length > 0) {
    // Update quantity
    const newQty = existing[0].quantity + quantity;

    await db
      .update(cartItems)
      .set({ quantity: newQty })
      .where(eq(cartItems.id, existing[0].id));

    return { updated: true, quantity: newQty };
  } else {
    // Add new cart item
    const inserted = await db
      .insert(cartItems)
      .values({
        userId,
        productId,
        productVariantId,
        quantity,
      })
      .returning();

    return { added: true, item: inserted[0] };
  }
};

export const updateQuantity = async ({
  userId,
  productId,
  productVariantId,
  newQuantity,
}: {
  userId: string;
  productId: number;
  productVariantId: number;
  newQuantity: number;
}) => {
  if (newQuantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const updated = await db
    .update(cartItems)
    .set({ quantity: newQuantity })
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId),
        eq(cartItems.productVariantId, productVariantId)
      )
    )
    .returning();

  if (updated.length === 0) {
    throw new Error("Cart item not found or does not belong to user");
  }

  return { updated: true, item: updated[0] };
};

export const deleteCartItem = async ({
  userId,
  productId,
  productVariantId,
}: {
  userId: string;
  productId: number;
  productVariantId: number;
}) => {
  const deleted = await db
    .delete(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId),
        eq(cartItems.productVariantId, productVariantId)
      )
    )
    .returning();

  if (deleted.length === 0) {
    throw new Error("Cart item not found or already deleted");
  }

  return { deleted: true, item: deleted[0] };
};
