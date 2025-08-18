"use server";
// server/cart.ts
import { db } from "@/db/drizzle";
import { user } from "@/db/schema/auth";
import { cartItems, orderItems, orders, shipments } from "@/db/schema/cart";
import { colors, sizes } from "@/db/schema/category";

import { productImages, products, productVariants } from "@/db/schema/products";
import { userAddresses } from "@/db/schema/user";
import {
  FREE_SHIPPING_LIMIT,
  SHIPPING_CHARGES,
  TAX_PERCENTAGE,
} from "@/lib/contants";

import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import {
  DiscountMapValue,
  fetchAllDiscounts,
  getApplicableDiscounts,
  getBestDiscount,
  getDiscountedPricePerItem,
  getDiscountLabel,
} from "./discounts";
import { fetchProductImages, getImageForProduct } from "./images";

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
  if (newQuantity < 1) throw new Error("Quantity must be at least 1");

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

  if (existing.length === 0) {
    throw new Error("Cart item not found");
  }

  const prevQuantity = existing[0].quantity;
  const delta = newQuantity - prevQuantity;

  await db
    .update(cartItems)
    .set({ quantity: newQuantity })
    .where(eq(cartItems.id, existing[0].id));

  // Adjust inventory
  await db
    .update(productVariants)
    .set({
      quantity: sql`${productVariants.quantity} - ${delta}`,
    })
    .where(eq(productVariants.id, productVariantId));

  return { updated: true, newQuantity };
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
  const item = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId),
        eq(cartItems.productVariantId, productVariantId)
      )
    );

  if (item.length === 0) {
    throw new Error("Cart item not found");
  }

  const qtyToRestore = item[0].quantity;

  await db.delete(cartItems).where(eq(cartItems.id, item[0].id));

  await db
    .update(productVariants)
    .set({
      quantity: sql`${productVariants.quantity} + ${qtyToRestore}`,
    })
    .where(eq(productVariants.id, productVariantId));

  return { deleted: true };
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

export type CartItemDetail = {
  cartItemId: number;
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  availableQuantity: number;
  quantity: number;
  pvId: number;
  colorId: number;
  colorName: string;
  sizeId: number;
  sizeName: string;
  createdAt: Date | null;
  discounts: DiscountType[];
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

export const getCartItems = async (
  userId: string
): Promise<CartItemDetail[]> => {
  const cartRows = await getFilteredCartItems(userId);
  const productIds = Array.from(new Set(cartRows.map((r) => r.productId)));
  const imageMap = await fetchProductImages(productIds);
  const discounts = await fetchAllDiscounts();

  return cartRows.map((item) => {
    const applicable = getApplicableDiscounts(
      item.productId,
      item.categoryId,
      item.subcategoryId,
      discounts
    );
    const image = getImageForProduct(item.productId, item.colorId, imageMap);

    return {
      cartItemId: item.cartItemId,
      productId: item.productId,
      name: item.productName,
      price: item.productPrice,
      imageUrl: image?.url || "",
      availableQuantity: item.availableQuantity,
      quantity: item.quantity,
      pvId: item.variantId,
      colorId: item.colorId,
      colorName: item.colorName,
      sizeId: item.sizeId,
      sizeName: item.sizeName,
      createdAt: item.createdAt,
      discounts: applicable,
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

export const getCheckOutItems = async (userId: string) => {
  const cartRows = await getFilteredCartItems(userId);
  if (cartRows.length == 0) {
    return {
      cartItems: [],
      totalItems: 0,
      subtotal: 0,
      savings: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    };
  }
  const productIds = Array.from(new Set(cartRows.map((r) => r.productId)));
  const imageMap = await fetchProductImages(productIds);
  const discounts = await fetchAllDiscounts();

  let subtotal = 0;
  let savings = 0;

  const cartItems = cartRows.map((item) => {
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

    const image = getImageForProduct(item.productId, item.colorId, imageMap);

    const originalPrice = item.productPrice * item.quantity;
    const discountedPricePerItem = getDiscountedPricePerItem(
      item.productPrice ?? 0,
      item.quantity,
      bestDiscount
    );
    const discountedText = getDiscountLabel(bestDiscount);

    let discountAmount = 0;
    if (bestDiscount) {
      if (bestDiscount.type === "percentage") {
        discountAmount =
          item.productPrice * (bestDiscount.value / 100) * item.quantity;
      } else {
        discountAmount = bestDiscount.value;
      }
    }

    subtotal += originalPrice;
    savings += discountAmount;

    return {
      //cartItemId: item.cartItemId,
      productId: item.productId,
      name: item.productName,
      price: item.productPrice,
      discountedPrice: discountedPricePerItem,
      discountedText: discountedText,
      imageUrl: image?.url || "",
      //availableQuantity: item.availableQuantity,
      quantity: item.quantity,
      //pvId: item.variantId,
      //colorId: item.colorId,
      colorName: item.colorName,
      //sizeId: item.sizeId,
      sizeName: item.sizeName,
      discounts: bestDiscount,
    };
  });

  const shipping = subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_CHARGES;
  const taxRate = TAX_PERCENTAGE / 100;
  const tax = (subtotal - savings + shipping) * taxRate;
  const total = subtotal - savings + shipping + tax;

  return {
    cartItems,
    totalItems: cartItems.length,
    subtotal: Number(subtotal.toFixed(2)),
    savings: Number(savings.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

// Input type
type PlaceOrderParams = {
  userId: string;
  addressId: number;
  paymentMethod: string;
};

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
      orginalAmount: originalAmount,
      totalAmount,
      discountAmount,
      taxAmount,
      taxPercentage: TAX_PERCENTAGE,
      shippingAmount,
      finalAmount,
      paymentMethod,
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
      .where(eq(userAddresses.id, order.addressId));
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

export type OrderResponse = {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    sizeName: string;
    colorName: string;
  }[];
  shippingAddress: {
    name: string | null;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  paymentMethod: string;
};

export const getAllUserOrders = async (
  userId: string
): Promise<OrderResponse[]> => {
  // 1. Get all orders for the user
  const rawOrders = await db
    .select({
      id: orders.orderId, // uuid
      orderNumber: orders.id, // serial ID
      date: orders.createdAt,
      status: orders.status,
      total: orders.finalAmount,
      paymentMethod: orders.paymentMethod,
      addressId: orders.addressId,
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(5);

  if (!rawOrders.length) return [];

  const orderIds = rawOrders.map((o) => o.orderNumber);

  // 2. Get all items for these orders
  const itemsRaw = await db
    .select({
      orderId: orderItems.orderId,
      id: orderItems.id,
      productId: products.id,
      name: products.name,
      price: orderItems.finalprice,
      quantity: orderItems.quantity,
      sizeName: sizes.name,
      colorName: colors.name,
      colorId: colors.id,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(
      productVariants,
      eq(orderItems.productVariantId, productVariants.id)
    )
    .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .leftJoin(colors, eq(productVariants.colorId, colors.id))
    .where(inArray(orderItems.orderId, orderIds));

  const productIds = [...new Set(itemsRaw.map((i) => i.productId))];

  // 3. Get all product images
  const productAllImages = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
      colorId: productImages.colorId,
    })
    .from(productImages)
    .where(inArray(productImages.productId, productIds));

  const imageMap = productAllImages.reduce((acc, img) => {
    const key = `${img.productId}_${img.colorId || "default"}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(img.url);
    return acc;
  }, {} as Record<string, string[]>);

  const getImage = (productId: number, colorId?: number | null) =>
    imageMap[`${productId}_${colorId || ""}`]?.[0] ||
    imageMap[`${productId}_default`]?.[0] ||
    "/placeholder.svg?height=80&width=80";

  // 4. Get all addresses
  const addressIds = [...new Set(rawOrders.map((o) => o.addressId))];
  const addresses = await db
    .select({
      id: userAddresses.id,
      name: user.name,
      address: userAddresses.address,
      city: userAddresses.city,
      state: userAddresses.state,
      pincode: userAddresses.pincode,
    })
    .from(userAddresses)
    .leftJoin(user, eq(userAddresses.userId, user.id))
    .where(inArray(userAddresses.id, addressIds));

  const addressMap = Object.fromEntries(addresses.map((a) => [a.id, a]));

  // 5. Get all shipments
  const shipmentsData = await db
    .select({
      orderId: shipments.orderId,
      trackingNumber: shipments.trackingNumber,
      estimatedDelivery: shipments.deliveredAt,
    })
    .from(shipments)
    .where(inArray(shipments.orderId, orderIds));

  const shipmentMap = Object.fromEntries(
    shipmentsData.map((s) => [s.orderId, s])
  );

  // 6. Stitch together
  return rawOrders.map((order) => {
    const orderItemsList = itemsRaw
      .filter((item) => item.orderId === order.orderNumber)
      .map((item) => ({
        id: item.id,
        name: item.name ?? "",
        price: Number(item.price),
        quantity: item.quantity,
        imageUrl: getImage(item.productId, item.colorId),
        sizeName: item.sizeName ?? "N/A",
        colorName: item.colorName ?? "N/A",
      }));

    const addr = addressMap[order.addressId] || {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    };
    const ship = shipmentMap[order.orderNumber] || {};

    return {
      id: `ORD-${new Date(order.date ?? new Date()).getFullYear()}-${String(
        order.orderNumber
      ).padStart(3, "0")}`,
      orderNumber: String(order.orderNumber),
      date: order.date ? order.date.toISOString().split("T")[0] : "",
      status: order.status,
      total: Number(order.total),
      items: orderItemsList,
      shippingAddress: {
        name: addr.name || null,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
      },
      trackingNumber: ship.trackingNumber || null,
      estimatedDelivery: ship.estimatedDelivery
        ? ship.estimatedDelivery.toISOString().split("T")[0]
        : null,
      paymentMethod: order.paymentMethod,
    };
  });
};

export async function clearAllCartItemsForAllUsers() {
  try {
    // Start a transaction
    await db.transaction(async (tx) => {
      // 1. Fetch all cart items with their variant IDs and quantities
      const allCartItems = await tx
        .select({
          productVariantId: cartItems.productVariantId,
          quantity: cartItems.quantity,
        })
        .from(cartItems);

      if (allCartItems.length === 0) {
        console.log("No cart items found to clear");
        return;
      }

      // 2. Group quantities by variant ID for more efficient updates
      const variantQuantities = new Map<number, number>();
      for (const item of allCartItems) {
        const current =
          variantQuantities.get(item.productVariantId as number) || 0;
        variantQuantities.set(item.productVariantId, current + item.quantity);
      }

      // 3. Update product variants in batch
      for (const [variantId, quantity] of variantQuantities.entries()) {
        await tx
          .update(productVariants)
          .set({
            quantity: sql`${productVariants.quantity} + ${quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(productVariants.id, variantId));
      }

      // 4. Delete all cart items
      await tx.delete(cartItems).where(isNotNull(cartItems.id)); // More explicit than whereTrue()

      console.log(
        `Successfully cleared ${allCartItems.length} cart items and restored stock`
      );
    });
  } catch (error) {
    console.error("Failed to clear cart items:", error);
    throw new Error("Failed to clear cart items. Changes were rolled back.");
  }
}

export const getAllOrders = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  try {
    const offset = (page - 1) * limit;

    // Fetch orders with user details
    const rawOrders = await db
      .select({
        id: orders.orderId, // uuid
        orderNumber: orders.id, // serial ID
        date: orders.createdAt,
        status: orders.status,
        total: orders.finalAmount,
        paymentMethod: orders.paymentMethod,
        addressId: orders.addressId,
        userId: orders.userId,
        userName: user.name,
        userEmail: user.email,
      })
      .from(orders)
      .leftJoin(user, eq(orders.userId, user.id))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    // Total count of orders
    const [{ count }] = await db
      .select({ count: sql<number>`count(${orders.id})` })
      .from(orders);

    return {
      data: rawOrders,
      pagination: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Unable to fetch orders");
  }
};
