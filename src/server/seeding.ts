"use server";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema/auth";
import {
  cartItems,
  orderItems,
  orderPayments,
  orders,
  orderShipments,
  orderStatusHistory,
} from "@/db/schema/cart";
import { colors, sizes } from "@/db/schema/category";
import { products, productVariants } from "@/db/schema/products";
import {
  FREE_SHIPPING_LIMIT,
  SHIPPING_CHARGES,
  TAX_PERCENTAGE,
} from "@/lib/contants";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  DiscountMapValue,
  fetchAllDiscounts,
  getApplicableDiscounts,
  getBestDiscount,
  getDiscountedPricePerItem,
} from "./discounts";

export const getUserBots = async () => {
  const users = await db
    .select()
    .from(user)
    .where(eq(user.role, "userbots"))
    .orderBy(desc(user.createdAt));

  return users;
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
    const newQty = existing[0].quantity + quantity;

    await db
      .update(cartItems)
      .set({ quantity: newQty })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values({
      userId,
      productId,
      productVariantId,
      quantity,
    });
  }

  // Reduce inventory
  await db
    .update(productVariants)
    .set({ quantity: sql`${productVariants.quantity} - ${quantity}` })
    .where(eq(productVariants.id, productVariantId));

  return { success: true };
};

export async function updateOrderStatus() {
  let cancelledCount = 0;
  let shippedCount = 0;
  let deliveredCount = 0;

  // --- Step 1: Move all shipped → delivered ---
  const shippedOrders = await db
    .select({
      orderId: orders.id,
    })
    .from(orders)
    .where(eq(orders.status, "shipped"));

  if (shippedOrders.length > 0) {
    for (const s of shippedOrders) {
      await db
        .update(orders)
        .set({ status: "delivered" })
        .where(eq(orders.id, s.orderId));

      await db.insert(orderStatusHistory).values({
        orderId: s.orderId,
        status: "delivered",
      });

      await db
        .update(orderShipments)
        .set({
          status: "delivered",
        })
        .where(eq(orderShipments.orderId, s.orderId));
    }
    deliveredCount += shippedOrders.length;
  }

  // --- Step 2: Handle pending orders ---
  const pendingOrders = await db
    .select({
      orderId: orders.id,
      userRole: user.role,
    })
    .from(orders)
    .leftJoin(user, eq(orders.userId, user.id))
    .where(eq(orders.status, "pending"));

  if (pendingOrders.length > 0) {
    const botOrders = pendingOrders.filter((o) => o.userRole === "userbots");
    const nonBotOrders = pendingOrders.filter((o) => o.userRole !== "userbots");

    // --- Bot orders ---
    if (botOrders.length > 0) {
      const shuffled = botOrders.sort(() => 0.5 - Math.random());
      const cancelOrders = shuffled.slice(0, 2);
      const shipOrders = shuffled.slice(2);

      // Cancel 2 random
      for (const o of cancelOrders) {
        await db
          .update(orders)
          .set({ status: "cancelled" })
          .where(eq(orders.id, o.orderId));

        await db.insert(orderStatusHistory).values({
          orderId: o.orderId,
          status: "cancelled",
        });
      }
      cancelledCount += cancelOrders.length;

      // Ship the rest
      for (const o of shipOrders) {
        await db
          .update(orders)
          .set({ status: "shipped" })
          .where(eq(orders.id, o.orderId));

        await db.insert(orderStatusHistory).values({
          orderId: o.orderId,
          status: "shipped",
        });
        const trackingNumber = Math.floor(
          10000000 + Math.random() * 90000000
        ).toString();
        await db.insert(orderShipments).values({
          orderId: o.orderId,
          status: "shipped",
          carrier: "Thallu Vandi",
          trackingNumber: trackingNumber,
        });
      }
      shippedCount += shipOrders.length;
    }

    // --- Non-bot orders ---
    for (const o of nonBotOrders) {
      await db
        .update(orders)
        .set({ status: "shipped" })
        .where(eq(orders.id, o.orderId));

      await db.insert(orderStatusHistory).values({
        orderId: o.orderId,
        status: "shipped",
      });
      const trackingNumber = Math.floor(
        10000000 + Math.random() * 90000000
      ).toString();
      await db.insert(orderShipments).values({
        orderId: o.orderId,
        status: "shipped",
        carrier: "Thallu Vandi",
        trackingNumber: trackingNumber,
      });
    }
    shippedCount += nonBotOrders.length;
  }

  return { cancelledCount, shippedCount, deliveredCount };
}

export async function seedCartItems() {
  // get all userbots
  const users = await getUserBots();

  // get products + variants
  const allProducts = await db.select().from(products);
  const allVariants = await db.select().from(productVariants);

  let ordersPlaced = 0;

  for (const u of users) {
    // pick 1–3 random products
    const randomCount = Math.floor(Math.random() * 3) + 1;
    const pickedProducts = allProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, randomCount);

    let hasAdded = false;

    for (const product of pickedProducts) {
      // find variants of this product
      const variants = allVariants.filter((v) => v.productId === product.id);
      if (variants.length === 0) continue;

      // pick random variant
      const variant = variants[Math.floor(Math.random() * variants.length)];

      // random quantity (respect available stock)
      const maxQty = Math.min(variant.quantity, 5);
      if (maxQty <= 0) continue;

      const qty = Math.floor(Math.random() * maxQty) + 1;

      await addToCart({
        userId: u.id,
        productId: product.id,
        productVariantId: variant.id,
        quantity: qty,
      });

      hasAdded = true;
    }

    if (hasAdded) {
      // ✅ Place ONE order per user after adding items
      await placeOrder({
        userId: u.id,
        addressId: 1, // ideally fetch a real default address
        paymentMethod: "cod",
      });
      ordersPlaced++;
    }
  }

  return { ordersPlaced };
}

type PlaceOrderParams = {
  userId: string;
  addressId: number;
  paymentMethod: string;
};

type CartRows = {
  cartItemId: number;
  quantity: number;
  productId: number;
  productName: string;
  productPrice: number;
  variantId: number;
  availableQuantity: number;
  colorId: number;
  colorName: string;
  sizeId: number;
  sizeName: string;
  categoryId: number;
  subcategoryId: number;
};

export type DiscountType = {
  discountId: number;
  name: string;
  type: string;
  value: number;
  minQuantity: number;
  applyTo: string;
  categoryIds: number[];
  subcategoryIds: number[];
  productIds: number[];
};

export async function getFilteredCartItems(userId: string) {
  const rows = await db
    .select({
      cartItemId: cartItems.id,
      quantity: cartItems.quantity,
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
      createdAt: cartItems.createdAt,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .innerJoin(
      productVariants,
      eq(cartItems.productVariantId, productVariants.id)
    )
    .innerJoin(colors, eq(productVariants.colorId, colors.id))
    .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .where(eq(cartItems.userId, userId))
    .orderBy(cartItems.id);

  const seen = new Set<number>();
  return rows.filter((r) => {
    if (seen.has(r.cartItemId)) return false;
    seen.add(r.cartItemId);
    return true;
  });
}

export async function placeOrder({
  userId,
  addressId,
  paymentMethod,
}: PlaceOrderParams) {
  // 1. Fetch & validate cart
  const cartRows = await getFilteredCartItems(userId);
  if (!cartRows.length) {
    return {
      success: false,
      orderId: null,
      type: "cartempty",
      message: "Cart is empty.",
    };
  }
  const discounts = await fetchAllDiscounts();

  const {
    originalAmount,
    totalAmount,
    discountAmount,
    shippingAmount,
    taxAmount,
    finalAmount,
    orderItemValues,
  } = calculateOrderAmounts(cartRows, discounts);

  // 4. Insert order
  const [newOrder] = await db
    .insert(orders)
    .values({
      userId,
      originalAmount: originalAmount,
      totalAmount,
      discountAmount,
      taxAmount,
      taxPercentage: TAX_PERCENTAGE,
      shippingAmount,
      finalAmount,
      addressId: addressId,
    })
    .returning();

  // 5. Insert order items
  const finalOrderItems = orderItemValues.map((item) => ({
    orderId: newOrder.id,
    productId: item.productId,
    productVariantId: item.productVariantId,
    quantity: item.quantity,
    orginalprice: item.price,
    discount: item.discountedPrice,
    finalprice: item.itemtotal,
  }));

  await db.insert(orderItems).values(finalOrderItems);

  await db.insert(orderStatusHistory).values({
    orderId: newOrder.id,
    status: "pending",
  });

  await db.insert(orderShipments).values({
    orderId: newOrder.id,
    status: "pending",
  });

  await db.insert(orderPayments).values({
    orderId: newOrder.id,
    status: "pending",
    paymentMethod: paymentMethod,
    amount: finalAmount,
  });

  // 6. Clear cart
  await db.delete(cartItems).where(eq(cartItems.userId, userId));

  return {
    success: true,
    orderId: newOrder.id,
    type: "",
    message: "Order placed successfully.",
  };
}

function calculateOrderAmounts(
  cartRows: CartRows[],
  discounts: DiscountMapValue[]
) {
  let subtotal = 0;
  let savings = 0;
  let discountAmount = 0;
  const orderItems = [];

  for (const item of cartRows) {
    const price = item.productPrice ?? 0;
    const quantity = item.quantity;

    const applicable = getApplicableDiscounts(
      item.productId,
      item.categoryId,
      item.subcategoryId,
      discounts
    );

    const bestDiscount = getBestDiscount(
      applicable,
      item.productPrice,
      item.quantity
    );

    if (bestDiscount) {
      if (bestDiscount.type === "percentage") {
        discountAmount =
          item.productPrice * (bestDiscount.value / 100) * item.quantity;
      } else {
        discountAmount = bestDiscount.value;
      }
    }
    const original = price * quantity;
    const discountedPrice = getDiscountedPricePerItem(
      item.productPrice ?? 0,
      item.quantity,
      bestDiscount
    );

    subtotal += original;
    savings += discountAmount;
    const itemtotal = original - discountAmount;

    orderItems.push({
      productId: item.productId,
      productVariantId: item.variantId,
      quantity,
      price,
      discountedPrice,
      itemtotal,
    });
  }
  const total = subtotal - savings;
  const shipping = subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_CHARGES;
  const taxRate = TAX_PERCENTAGE / 100;
  const tax = total * taxRate;
  const finaltotal = total + shipping + tax;

  return {
    originalAmount: parseFloat(subtotal.toFixed(2)),
    totalAmount: parseFloat(total.toFixed(2)),
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    shippingAmount: parseFloat(shipping.toFixed(2)),
    taxAmount: tax,
    finalAmount: finaltotal,
    orderItemValues: orderItems,
  };
}
