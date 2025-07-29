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
