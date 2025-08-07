"use server";
// server/cart.ts
import { db } from "@/db/drizzle";
import { user } from "@/db/schema/auth";
import { cartItems, orderItems, orders } from "@/db/schema/cart";
import { categories, colors, sizes, subcategories } from "@/db/schema/category";
import {
  discountCategories,
  discountProducts,
  discounts,
  discountSubcategories,
} from "@/db/schema/offers";

import { productImages, products, productVariants } from "@/db/schema/products";
import { userAddresses } from "@/db/schema/user";
import {
  FREE_SHIPPING_LIMIT,
  SHIPPING_CHARGES,
  TAX_PERCENTAGE,
} from "@/lib/contants";
import { getBestDiscount, getBestDiscountValue } from "@/lib/utils";
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
  discounts: DiscountType[];
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
      colorCode: colors.color_code,
      sizeId: sizes.id,
      sizeName: sizes.name,
      categoryId: products.categoryId,
      subcategoryId: products.subcategoryId,
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(
      productVariants,
      eq(cartItems.productVariantId, productVariants.id)
    )
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
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

  // 6. Fetch all discounts
  const discountResults = await db
    .select({
      discountId: discounts.id,
      name: discounts.name,
      type: discounts.type,
      value: discounts.value,
      minQuantity: discounts.minQuantity,
      applyTo: discounts.appliedTo,
      categoryId: discountCategories.categoryId,
      subcategoryId: discountSubcategories.subcategoryId,
      productId: discountProducts.productId,
    })
    .from(discounts)
    .leftJoin(
      discountCategories,
      eq(discounts.id, discountCategories.discountId)
    )
    .leftJoin(
      discountSubcategories,
      eq(discounts.id, discountSubcategories.discountId)
    )
    .leftJoin(discountProducts, eq(discounts.id, discountProducts.discountId));

  interface DiscountResult {
    discountId: number;
    name: string;
    type: string;
    value: number;
    minQuantity: number;
    applyTo: string;
    categoryId?: number;
    subcategoryId?: number;
    productId?: number;
  }

  interface DiscountMapValue {
    discountId: number;
    name: string;
    type: string;
    value: number;
    minQuantity: number;
    applyTo: string;
    categoryIds: Set<number>;
    subcategoryIds: Set<number>;
    productIds: Set<number>;
  }

  const discountMap = new Map<number, DiscountMapValue>();

  for (const row of discountResults as DiscountResult[]) {
    const {
      discountId,
      name,
      type,
      value,
      minQuantity,
      applyTo,
      categoryId,
      subcategoryId,
      productId,
    } = row;

    if (!discountMap.has(discountId)) {
      discountMap.set(discountId, {
        discountId,
        name,
        type,
        value,
        minQuantity,
        applyTo,
        categoryIds: new Set<number>(),
        subcategoryIds: new Set<number>(),
        productIds: new Set<number>(),
      });
    }

    const d = discountMap.get(discountId)!; // Non-null assertion since we just set it

    if (categoryId) d.categoryIds.add(categoryId);
    if (subcategoryId) d.subcategoryIds.add(subcategoryId);
    if (productId) d.productIds.add(productId);
  }

  const allDiscounts = Array.from(discountMap.values()).map((d) => ({
    ...d,
    categoryIds: Array.from(d.categoryIds),
    subcategoryIds: Array.from(d.subcategoryIds),
    productIds: Array.from(d.productIds),
  }));

  // 7. Match discount for this product

  // Final mapped cart items
  return filtered.map((r) => {
    const matchedDiscounts = allDiscounts.filter((d) => {
      const matchesProduct = d.productIds?.includes(r.productId ?? 0);
      const matchesSubcategory =
        r.subcategoryId && d.subcategoryIds?.includes(r.subcategoryId);
      const matchesCategory =
        r.categoryId && d.categoryIds?.includes(r.categoryId);
      const appliesToAll = d.applyTo === "all";

      return (
        matchesProduct || matchesSubcategory || matchesCategory || appliesToAll
      );
    });

    // Match image by productId and colorId
    const images = imageMap.get(r?.productId || 0) || [];
    const matchedImage =
      images.find((img) => img.imageColorId === r.colorId) ?? images[0];

    return {
      cartItemId: r.cartItemId,
      productId: r.productId ?? -1,
      name: r.productName ?? "",
      price: r.productPrice ?? 0,
      imageUrl: matchedImage?.url || "",
      quantity: r.quantity,
      pvId: r.variantId ?? 0,
      colorId: r.colorId ?? 0,
      colorName: r.colorName ?? "",
      sizeId: r.sizeId ?? 0,
      sizeName: r.sizeName ?? "",
      discounts: matchedDiscounts,
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

type OrderItemsDetails = {
  productId: number | null;
  name: string;
  price: number;
  discountedPrice: number;
  discountedText: string;
  imageUrl: string;
  quantity: number;
  colorName: string;
  sizeName: string;
};

export const getCheckOutItems = async (
  userId: string
): Promise<{
  cartItems: OrderItemsDetails[];
  totalItems: number;
  savings: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}> => {
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
      colorCode: colors.color_code,
      sizeId: sizes.id,
      sizeName: sizes.name,
      categoryId: products.categoryId,
      subcategoryId: products.subcategoryId,
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(
      productVariants,
      eq(cartItems.productVariantId, productVariants.id)
    )
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
    .leftJoin(colors, eq(productVariants.colorId, colors.id))
    .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
    .where(eq(cartItems.userId, userId));

  const seen = new Set<number>();
  const filtered = rows.filter((r) => {
    if (seen.has(r.cartItemId)) return false;
    seen.add(r.cartItemId);
    return true;
  });

  const productIds = filtered.map((r) => r.productId);
  const uniqueProductIds = Array.from(new Set(productIds));

  const productImagesDB = await db
    .select({
      url: productImages.url,
      productId: productImages.productId,
      imageColorId: productImages.colorId,
    })
    .from(productImages)
    .where(inArray(productImages.productId, uniqueProductIds as number[]));

  const imageMap = new Map<
    number,
    { url: string; imageColorId: number | null }[]
  >();
  for (const img of productImagesDB) {
    if (!imageMap.has(img.productId)) imageMap.set(img.productId, []);
    imageMap.get(img.productId)!.push(img);
  }

  const discountResults = await db
    .select({
      discountId: discounts.id,
      name: discounts.name,
      type: discounts.type,
      value: discounts.value,
      minQuantity: discounts.minQuantity,
      applyTo: discounts.appliedTo,
      categoryId: discountCategories.categoryId,
      subcategoryId: discountSubcategories.subcategoryId,
      productId: discountProducts.productId,
    })
    .from(discounts)
    .leftJoin(
      discountCategories,
      eq(discounts.id, discountCategories.discountId)
    )
    .leftJoin(
      discountSubcategories,
      eq(discounts.id, discountSubcategories.discountId)
    )
    .leftJoin(discountProducts, eq(discounts.id, discountProducts.discountId));

  interface DiscountResult {
    discountId: number;
    name: string;
    type: string;
    value: number;
    minQuantity: number;
    applyTo: string;
    categoryId?: number;
    subcategoryId?: number;
    productId?: number;
  }

  interface DiscountMapValue {
    discountId: number;
    name: string;
    type: string;
    value: number;
    minQuantity: number;
    applyTo: string;
    categoryIds: Set<number>;
    subcategoryIds: Set<number>;
    productIds: Set<number>;
  }

  const discountMap = new Map<number, DiscountMapValue>();

  for (const row of discountResults as DiscountResult[]) {
    const {
      discountId,
      name,
      type,
      value,
      minQuantity,
      applyTo,
      categoryId,
      subcategoryId,
      productId,
    } = row;

    if (!discountMap.has(discountId)) {
      discountMap.set(discountId, {
        discountId,
        name,
        type,
        value,
        minQuantity,
        applyTo,
        categoryIds: new Set<number>(),
        subcategoryIds: new Set<number>(),
        productIds: new Set<number>(),
      });
    }

    const d = discountMap.get(discountId)!; // Non-null assertion since we just set it

    if (categoryId) d.categoryIds.add(categoryId);
    if (subcategoryId) d.subcategoryIds.add(subcategoryId);
    if (productId) d.productIds.add(productId);
  }

  const allDiscounts = Array.from(discountMap.values()).map((d) => ({
    ...d,
    categoryIds: Array.from(d.categoryIds),
    subcategoryIds: Array.from(d.subcategoryIds),
    productIds: Array.from(d.productIds),
  }));

  // Prepare final cart items
  const cartItemsList = filtered.map((r) => {
    const matchedDiscounts = allDiscounts.filter((d) => {
      const matchesProduct = d.productIds?.includes(r.productId || 0);
      const matchesSubcategory =
        r.subcategoryId && d.subcategoryIds?.includes(r.subcategoryId);
      const matchesCategory =
        r.categoryId && d.categoryIds?.includes(r.categoryId);
      const appliesToAll = d.applyTo === "all";

      return (
        matchesProduct || matchesSubcategory || matchesCategory || appliesToAll
      );
    });

    const bestDiscount = getBestDiscount(
      matchedDiscounts,
      r.productPrice ?? 0,
      r.quantity
    );
    const discountedPricePerItem = bestDiscount
      ? bestDiscount.type === "percentage"
        ? Number(
            ((r.productPrice ?? 0) * (1 - bestDiscount.value / 100)).toFixed(2)
          )
        : Number(
            (
              ((r.productPrice ?? 0) * r.quantity - bestDiscount.value) /
              r.quantity
            ).toFixed(2)
          )
      : r.productPrice ?? 0;

    const discountedText = bestDiscount
      ? bestDiscount.type === "percentage"
        ? `${bestDiscount.value}% OFF`
        : `₹${bestDiscount.value} OFF`
      : "";

    const images = imageMap.get(r.productId ?? 0) || [];
    const matchedImage =
      images.find((img) => img.imageColorId === r.colorId) ?? images[0];

    return {
      productId: r.productId,
      name: r.productName ?? "",
      price: Number((r.productPrice ?? 0).toFixed(2)),

      discountedPrice: Number(discountedPricePerItem?.toFixed(2) ?? 0),
      discountedText: discountedText,
      imageUrl: matchedImage?.url || "",
      quantity: r.quantity,
      colorName: r.colorName ?? "",
      sizeName: r.sizeName ?? "",
    };
  });

  // Calculate totals
  const subtotalOriginalPrice = cartItemsList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const subtotal = cartItemsList.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );
  const totalItems = cartItemsList.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const savings = subtotalOriginalPrice - subtotal;
  const shipping = subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_CHARGES;
  const tax = (subtotal + shipping) * (TAX_PERCENTAGE / 100);
  const total = subtotal + shipping + tax;

  return {
    cartItems: cartItemsList,
    totalItems: totalItems,
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
  const cartrows = await db
    .select({
      cartItemId: cartItems.id,
      productId: cartItems.productId,
      productVariantId: cartItems.productVariantId,
      orderedQuantity: cartItems.quantity,
      price: products.price,
      availableQuantity: productVariants.quantity,
      categoryId: products.categoryId,
      subcategoryId: products.subcategoryId,
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(
      productVariants,
      eq(cartItems.productVariantId, productVariants.id)
    )
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
    .where(eq(cartItems.userId, userId));

  // Remove duplicates
  const seen = new Set<number>();
  const filteredCart = cartrows.filter((r) => {
    if (seen.has(r.cartItemId)) return false;
    seen.add(r.cartItemId);
    return true;
  });

  if (!filteredCart.length) {
    return {
      success: false,
      orderId: null,
      type: "cartempty",
      message: "Cart is empty.",
    };
  }

  // Check stock
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

  // 2. Fetch discounts
  const discountResults = await db
    .select({
      discountId: discounts.id,
      name: discounts.name,
      type: discounts.type,
      value: discounts.value,
      minQuantity: discounts.minQuantity,
      applyTo: discounts.appliedTo,
      categoryId: discountCategories.categoryId,
      subcategoryId: discountSubcategories.subcategoryId,
      productId: discountProducts.productId,
    })
    .from(discounts)
    .leftJoin(
      discountCategories,
      eq(discounts.id, discountCategories.discountId)
    )
    .leftJoin(
      discountSubcategories,
      eq(discounts.id, discountSubcategories.discountId)
    )
    .leftJoin(discountProducts, eq(discounts.id, discountProducts.discountId));

  interface DiscountResult {
    discountId: number;
    name: string;
    type: string;
    value: number;
    minQuantity: number;
    applyTo: string;
    categoryId?: number;
    subcategoryId?: number;
    productId?: number;
  }

  interface DiscountMapValue {
    discountId: number;
    name: string;
    type: string;
    value: number;
    minQuantity: number;
    applyTo: string;
    categoryIds: Set<number>;
    subcategoryIds: Set<number>;
    productIds: Set<number>;
  }

  // Group discounts
  const discountMap = new Map<number, DiscountMapValue>();

  for (const row of discountResults as DiscountResult[]) {
    const {
      discountId,
      name,
      type,
      value,
      minQuantity,
      applyTo,
      categoryId,
      subcategoryId,
      productId,
    } = row;

    if (!discountMap.has(discountId)) {
      discountMap.set(discountId, {
        discountId,
        name,
        type,
        value,
        minQuantity,
        applyTo,
        categoryIds: new Set<number>(),
        subcategoryIds: new Set<number>(),
        productIds: new Set<number>(),
      });
    }

    const d = discountMap.get(discountId)!; // Non-null assertion since we just set it

    if (categoryId) d.categoryIds.add(categoryId);
    if (subcategoryId) d.subcategoryIds.add(subcategoryId);
    if (productId) d.productIds.add(productId);
  }

  const allDiscounts = Array.from(discountMap.values()).map((d) => ({
    ...d,
    categoryIds: Array.from(d.categoryIds),
    subcategoryIds: Array.from(d.subcategoryIds),
    productIds: Array.from(d.productIds),
  }));

  // 3. Calculate totals
  let originalAmount = 0;
  let totalAmount = 0;
  let discountAmount = 0;

  type OrderItemValue = {
    orderId?: number; // will set after order is created
    productId: number;
    productVariantId: number;
    quantity: number;
    price: number;
    discountedPrice: number;
    total: number;
  };
  const orderItemValues: OrderItemValue[] = [];

  for (const r of filteredCart) {
    const basePrice = r.price ?? 0;
    const quantity = r.orderedQuantity;

    const matchedDiscounts = allDiscounts.filter((d) => {
      const matchesProduct = d.productIds?.includes(r.productId);
      const matchesSubcategory =
        r.subcategoryId && d.subcategoryIds?.includes(r.subcategoryId);
      const matchesCategory =
        r.categoryId && d.categoryIds?.includes(r.categoryId);
      const appliesToAll = d.applyTo === "all";

      return (
        matchesProduct || matchesSubcategory || matchesCategory || appliesToAll
      );
    });

    const bestDiscount = getBestDiscountValue(
      matchedDiscounts,
      basePrice,
      quantity
    );
    const finalPrice = bestDiscount.discountedPrice;
    const itemOriginal = basePrice * quantity;
    const itemTotal = finalPrice * quantity;

    originalAmount += itemOriginal;
    totalAmount += itemTotal;
    discountAmount += itemOriginal - itemTotal;

    orderItemValues.push({
      productId: r.productId,
      productVariantId: r.productVariantId,
      quantity,
      price: basePrice,
      discountedPrice: finalPrice,
      total: itemTotal,
    });
  }

  originalAmount = parseFloat(originalAmount.toFixed(2));
  totalAmount = parseFloat(totalAmount.toFixed(2));
  discountAmount = parseFloat(discountAmount.toFixed(2));

  let shippingAmount = SHIPPING_CHARGES;
  if (totalAmount >= FREE_SHIPPING_LIMIT) {
    shippingAmount = 0;
  }

  shippingAmount = parseFloat(shippingAmount.toFixed(2));
  const taxPercentage = TAX_PERCENTAGE;
  const taxAmount = parseFloat(
    ((totalAmount + shippingAmount) * taxPercentage).toFixed(2)
  );
  const finalAmount = parseFloat(
    (totalAmount + shippingAmount + taxAmount).toFixed(2)
  );

  // 4. Insert order
  const [newOrder] = await db
    .insert(orders)
    .values({
      userId,
      orginalAmount: originalAmount,
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

  // 5. Insert order items
  const finalOrderItems = orderItemValues.map((item) => ({
    orderId: newOrder.id,
    productId: item.productId,
    productVariantId: item.productVariantId,
    quantity: item.quantity,
    orginalprice: item.price,
    discount: item.discountedPrice,
    finalprice: item.total,
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
