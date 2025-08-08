import { db } from "@/db/drizzle";
import {
  discountCategories,
  discountProducts,
  discounts,
  discountSubcategories,
} from "@/db/schema/offers";
import { eq } from "drizzle-orm";

export type DiscountMapValue = {
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

export async function fetchAllDiscounts(): Promise<DiscountMapValue[]> {
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

  const discountMap = new Map<number, DiscountMapValue>();

  for (const {
    discountId,
    name,
    type,
    value,
    minQuantity,
    applyTo,
    categoryId,
    subcategoryId,
    productId,
  } of discountResults) {
    if (!discountMap.has(discountId)) {
      discountMap.set(discountId, {
        discountId,
        name,
        type,
        value,
        minQuantity,
        applyTo,
        categoryIds: [],
        subcategoryIds: [],
        productIds: [],
      });
    }

    const d = discountMap.get(discountId)!;
    if (categoryId) d.categoryIds.push(categoryId);
    if (subcategoryId) d.subcategoryIds.push(subcategoryId);
    if (productId) d.productIds.push(productId);
  }

  return Array.from(discountMap.values());
}

export function getApplicableDiscounts(
  productId: number,
  categoryId: number | undefined,
  subcategoryId: number | undefined,
  discounts: DiscountMapValue[]
) {
  return discounts.filter(
    (d) =>
      d.applyTo === "all" ||
      d.productIds.includes(productId) ||
      (subcategoryId && d.subcategoryIds.includes(subcategoryId)) ||
      (categoryId && d.categoryIds.includes(categoryId))
  );
}

export function getBestDiscount(
  discounts: DiscountMapValue[],
  price: number,
  quantity: number
): DiscountMapValue | null {
  const eligible = discounts.filter((d) => quantity >= d.minQuantity);
  if (!eligible.length) return null;

  return eligible.reduce((best, current) => {
    const bestValue =
      best.type === "percentage" ? (price * best.value) / 100 : best.value;

    const currentValue =
      current.type === "percentage"
        ? (price * current.value) / 100
        : current.value;

    return currentValue > bestValue ? current : best;
  });
}

export function getDiscountedPricePerItem(
  price: number,
  quantity: number,
  discount: DiscountMapValue | null
): number {
  if (!discount) return price;
  if (discount.type === "percentage") {
    return Number((price * (1 - discount.value / 100)).toFixed(2));
  }
  return Number(((price * quantity - discount.value) / quantity).toFixed(2));
}

export function getDiscountLabel(discount: DiscountMapValue | null): string {
  if (!discount) return "";
  return discount.type === "percentage"
    ? `${discount.value}% OFF`
    : `₹${discount.value} OFF`;
}

export function calculateDiscountedPrice(
  price: number,
  discount: DiscountMapValue | null,
  quantity: number
): number {
  if (!discount) return price;

  if (discount.type === "percentage") {
    return parseFloat((price * (1 - discount.value / 100)).toFixed(2));
  } else {
    const totalDiscount = discount.value;
    return parseFloat(
      ((price * quantity - totalDiscount) / quantity).toFixed(2)
    );
  }
}
