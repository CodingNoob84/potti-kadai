"use server";
import { db } from "@/db/drizzle";
import { cartItems } from "@/db/schema/cart";
import { colors, sizes } from "@/db/schema/category";
import { products, productVariants } from "@/db/schema/products";
import { wishlistItems } from "@/db/schema/wishlist";
import { and, eq, sql } from "drizzle-orm";
import { DiscountType } from "./cart";
import { fetchAllDiscounts, getApplicableDiscounts } from "./discounts";
import { fetchProductImages, getImageForProduct } from "./images";

export async function addToWishlist(input: {
  userId: string;
  productId: number;
  productVariantId: number;
}) {
  const { userId, productId, productVariantId } = input;

  try {
    await db.insert(wishlistItems).values({
      userId,
      productId,
      productVariantId,
    });

    return { success: true, message: "Item added to wishlist" };
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return { success: false, message: "Failed to add item to wishlist" };
  }
}

export async function removeFromWishlist(input: {
  userId: string;
  productId: number;
  productVariantId: number;
}) {
  const { userId, productId, productVariantId } = input;

  try {
    const result = await db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, userId),
          eq(wishlistItems.productId, productId),
          eq(wishlistItems.productVariantId, productVariantId)
        )
      );

    if (result.rowCount === 0) {
      return { success: false, message: "Item not found in wishlist" };
    }

    return { success: true, message: "Item removed from wishlist" };
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return { success: false, message: "Failed to remove item from wishlist" };
  }
}

export async function moveToWishlist(input: {
  userId: string;
  productId: number;
  productVariantId: number;
}) {
  const { userId, productId, productVariantId } = input;

  try {
    // 1. Get the cart item
    const cartItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, productId),
          eq(cartItems.productVariantId, productVariantId)
        )
      );

    if (cartItem.length === 0) {
      return { success: false, message: "Cart item not found" };
    }

    const quantity = cartItem[0].quantity;

    // 2. Delete the cart item
    await db.delete(cartItems).where(eq(cartItems.id, cartItem[0].id));

    // 3. Update product variant quantity (restore stock)
    await db
      .update(productVariants)
      .set({
        quantity: sql`${productVariants.quantity} + ${quantity}`,
      })
      .where(eq(productVariants.id, productVariantId));

    // 4. Check if already in wishlist
    const existingWishlistItem = await db
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, userId),
          eq(wishlistItems.productId, productId),
          eq(wishlistItems.productVariantId, productVariantId)
        )
      );

    // 5. Only insert if not already in wishlist
    if (existingWishlistItem.length === 0) {
      await db.insert(wishlistItems).values({
        userId,
        productId,
        productVariantId,
      });
    }

    return { success: true, message: "Moved to wishlist successfully" };
  } catch (error) {
    console.error("❌ Move to wishlist failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getFilteredWishlistItems(userId: string) {
  const rows = await db
    .select({
      wishlistItemId: wishlistItems.id,
      productId: products.id,
      productName: products.name,
      productPrice: products.price,
      variantId: productVariants.id,
      availableQuantity: productVariants.quantity,
      colorId: colors.id,
      colorName: colors.name,
      sizeId: sizes.id,
      sizeName: sizes.name,
      categoryId: products.categoryId,
      subcategoryId: products.subcategoryId,
      createdAt: wishlistItems.createdAt
    })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .innerJoin(
      productVariants,
      eq(wishlistItems.productVariantId, productVariants.id)
    )
    .innerJoin(colors, eq(productVariants.colorId, colors.id))
    .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .where(eq(wishlistItems.userId, userId));

  const seen = new Set<number>();
  return rows.filter((r) => {
    if (seen.has(r.wishlistItemId)) return false;
    seen.add(r.wishlistItemId);
    return true;
  });
}

export type WishlistItemDetail = {
  wishlistItemId: number;
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  availableQuantity: number;
  pvId: number;
  colorId: number;
  colorName: string;
  sizeId: number;
  sizeName: string;
  createdAt:Date |null;
  discounts: DiscountType[];
};

export const getWishlistItems = async (
  userId: string
): Promise<WishlistItemDetail[]> => {
  const wishlistRows = await getFilteredWishlistItems(userId);
  const productIds = Array.from(new Set(wishlistRows.map((r) => r.productId)));
  const imageMap = await fetchProductImages(productIds);
  const discounts = await fetchAllDiscounts();

  return wishlistRows.map((item) => {
    const applicable = getApplicableDiscounts(
      item.productId,
      item.categoryId,
      item.subcategoryId,
      discounts
    );
    const image = getImageForProduct(item.productId, item.colorId, imageMap);

    return {
      wishlistItemId: item.wishlistItemId,
      productId: item.productId,
      name: item.productName,
      price: item.productPrice,
      imageUrl: image?.url || "",
      availableQuantity: item.availableQuantity,
      pvId: item.variantId,
      colorId: item.colorId,
      colorName: item.colorName,
      sizeId: item.sizeId,
      sizeName: item.sizeName,
      createdAt:item.createdAt,
      discounts: applicable,
    };
  });
};
