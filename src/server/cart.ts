"use server";
// server/cart.ts
import { db } from "@/db/drizzle";
import { user } from "@/db/schema/auth";
import { cartItems, orderItems, orders } from "@/db/schema/cart";

import {
  colors,
  discounts,
  productImages,
  products,
  productVariants,
  sizes,
} from "@/db/schema/products";
import { userAddresses } from "@/db/schema/user";
import {
  FREE_SHIPPING_LIMIT,
  SHIPPING_CHARGES,
  TAX_PERCENTAGE,
} from "@/lib/contants";
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

// Input type
type PlaceOrderParams = {
  userId: string;
  addressId: number;
  paymentMethod: string;
};

// Main function
export async function placeOrder({
  userId,
  addressId,
  paymentMethod,
}: PlaceOrderParams) {
  // 1. Validate & Prepare Cart Items
  const cartrows = await db
    .select({
      cartItemId: cartItems.id,
      productId: cartItems.productId,
      productVariantId: cartItems.productVariantId,
      orderedQuantity: cartItems.quantity,
      price: products.price,
      availableQuantity: productVariants.quantity,
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(
      productVariants,
      eq(cartItems.productVariantId, productVariants.id)
    )
    .where(eq(cartItems.userId, userId));

  // Remove duplicates (safety check)
  const seen = new Set<number>();
  const filteredCart = cartrows.filter((r) => {
    if (seen.has(r.cartItemId)) return false;
    seen.add(r.cartItemId);
    return true;
  });

  // Check if cart is empty
  if (!filteredCart.length) {
    return {
      success: false,
      orderId: null,
      type: "cartemty",
      message: `Cart is empty.`,
    };
  }

  // Check availability
  for (const item of filteredCart) {
    if (item.orderedQuantity > (item.availableQuantity ?? 0)) {
      return {
        success: false,
        orderId: null,
        type: "outofstock",
        message: `Insufficient stock for product ID ${item.productId}`,
      };
    }
  }

  // Fetch applicable discounts for products in the cart
  const allDiscounts = await db
    .select({
      productId: discounts.productId,
      type: discounts.type,
      value: discounts.value,
      minQuantity: discounts.minQuantity,
    })
    .from(discounts)
    .where(
      inArray(
        discounts.productId,
        filteredCart.map((c) => c.productId)
      )
    );

  // Map discounts per product
  const discountMap = new Map<number, DiscountType[]>();
  for (const d of allDiscounts) {
    const pid = d.productId!;
    const discount: DiscountType = {
      type: d.type ?? "percentage",
      value: d.value ?? 0,
      minQuantity: d.minQuantity ?? 1,
    };
    if (!discountMap.has(pid)) discountMap.set(pid, []);
    discountMap.get(pid)!.push(discount);
  }

  const cartWithDiscount = filteredCart.map((item) => {
    const basePrice = item.price || 0;
    const quantity = item.orderedQuantity || 1;

    const discounts = discountMap.get(item.productId ?? 0) || [];

    let discountedPercentage = 0;
    let discountedPrice = basePrice;
    let bestDiscount: (typeof discounts)[0] | null = null;

    // Quantity-based discount: pick highest % for qualifying quantity
    const quantityDiscount =
      discounts
        .filter(
          (d) => d.type === "quantity" && quantity >= (d.minQuantity ?? 0)
        )
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))[0] || null;

    // Direct discount: pick highest %
    const directDiscount =
      discounts
        .filter((d) => d.type === "direct")
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))[0] || null;

    // Compare by which gives lower final price
    const discountOptions = [quantityDiscount, directDiscount].filter(Boolean);

    if (discountOptions.length > 0) {
      bestDiscount = discountOptions.sort((a, b) => {
        const aPrice = basePrice - (basePrice * (a.value ?? 0)) / 100;
        const bPrice = basePrice - (basePrice * (b.value ?? 0)) / 100;
        return aPrice - bPrice;
      })[0];

      discountedPercentage = bestDiscount.value ?? 0;
      discountedPrice = Math.round(
        basePrice - (basePrice * discountedPercentage) / 100
      );
    }

    return {
      ...item,
      discount: bestDiscount,
      discountedPercentage,
      discountedPrice,
      totalOriginalPrice: basePrice * quantity,
      totalFinalPrice: discountedPrice * quantity,
    };
  });

  // 2. Calculate totals
  let orginalAmount = 0;
  let totalAmount = 0;
  let discountAmount = 0;

  cartWithDiscount.forEach((item) => {
    const quantity = item.orderedQuantity || 1;
    const originalTotal = (item.price || 0) * quantity;
    const discountedTotal =
      (item.discountedPrice || item.price || 0) * quantity;
    orginalAmount += originalTotal;
    totalAmount += discountedTotal;
    discountAmount += originalTotal - discountedTotal;
  });

  let shippingAmount = SHIPPING_CHARGES;
  if (totalAmount > FREE_SHIPPING_LIMIT) {
    shippingAmount = 0;
  }
  const taxPercentage = TAX_PERCENTAGE;
  const taxAmount = (totalAmount + shippingAmount) * TAX_PERCENTAGE;

  const finalAmount = totalAmount + shippingAmount;

  // 3. Create order
  const [newOrder] = await db
    .insert(orders)
    .values({
      userId,
      orginalAmount,
      totalAmount,
      discountAmount,
      taxAmount,
      taxPercentage,
      shippingAmount,
      finalAmount,
      paymentMethod,
      address: addressId,
    })
    .returning();

  // 4. Insert into orderItems
  const orderItemsData = cartWithDiscount.map((item) => ({
    orderId: newOrder.id,
    productId: item.productId,
    productVariantId: item.productVariantId,
    quantity: item.orderedQuantity,
    orginalprice: item.totalOriginalPrice,
    discount: item.discountedPrice,
    finalprice: item.totalFinalPrice,
  }));

  await db.insert(orderItems).values(orderItemsData);

  // 5. Clear cart
  await db.delete(cartItems).where(eq(cartItems.userId, userId));

  return {
    success: true,
    orderId: newOrder.id,
    type: "",
    message: "Order placed successfully.",
  };
}

export async function getOrderDetails({ orderId }: { orderId: number }) {
  try {
    // Get the order
    const orderData = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!orderData.length) throw new Error("Order not found");

    const order = orderData[0];

    // Get the address
    const [address] = await db
      .select()
      .from(userAddresses)
      .where(eq(userAddresses.id, order.address));
    console.log("server-address", address);
    // Get the user
    const [userdetail] = await db
      .select()
      .from(user)
      .where(eq(user.id, order.userId));

    // Get order items with product details
    const items = await db
      .select({
        itemId: orderItems.id,
        quantity: orderItems.quantity,
        orginalprice: orderItems.orginalprice,
        finalprice: orderItems.finalprice,
        productname: products.name,
        size: sizes.name,
        color: colors.name,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .innerJoin(
        productVariants,
        eq(orderItems.productVariantId, productVariants.id)
      )
      .innerJoin(colors, eq(productVariants.colorId, colors.id))
      .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
      .where(eq(orderItems.orderId, orderId));

    return {
      order,
      user: userdetail,
      useraddress: address,
      items,
    };
  } catch (error) {
    console.error("Failed to get order details:", error);
    throw new Error("Order details fetch failed");
  }
}
