import { DiscountType } from "@/types/products";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getActiveDiscount = (
  discounts: DiscountType[],
  quantity: number
): DiscountType | null => {
  // Filter quantity-based discounts that are valid for the current quantity
  const quantityDiscounts = discounts
    .filter(
      (d) =>
        d.type === "quantity" &&
        typeof d.minQuantity === "number" &&
        quantity >= d.minQuantity
    )
    .sort((a, b) => (b.minQuantity ?? 0) - (a.minQuantity ?? 0)); // highest applicable minQuantity first

  // Return the most suitable quantity discount if available
  if (quantityDiscounts.length > 0) return quantityDiscounts[0];

  // Fallback to direct discount if no quantity discounts apply
  return discounts.find((d) => d.type === "direct") ?? null;
};

export const getDiscounts = (
  discounts: DiscountType[],
  price: number,
  quantity: number = 1
): { discountedPrice: number; discountedText: string } => {
  if (!discounts || discounts.length === 0) {
    return { discountedPrice: price, discountedText: "" };
  }

  // Quantity discount with highest minQuantity satisfied by quantity
  const quantityDiscount = discounts
    .filter((d) => d.type === "quantity" && quantity >= (d.minQuantity ?? 0))
    .sort((a, b) => (b.minQuantity ?? 0) - (a.minQuantity ?? 0))[0];

  // Priority: Direct > Quantity
  const discount =
    discounts.find((d) => d.type === "direct") || quantityDiscount;

  if (!discount) {
    return { discountedPrice: price, discountedText: "" };
  }

  let discountedPrice = price;
  let discountedText = "";

  switch (discount.type) {
    case "direct":
      discountedPrice = price * (1 - discount.value / 100);
      discountedText = `${discount.value}% OFF`;
      break;
    case "quantity":
      discountedPrice = price * (1 - discount.value / 100);
      discountedText = `Buy ${discount.minQuantity}+ for ${discount.value}% OFF`;
      break;
  }

  return {
    discountedPrice: Math.max(discountedPrice, 0),
    discountedText,
  };
};
