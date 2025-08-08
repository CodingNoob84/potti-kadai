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
  // Filter by type and valid minQuantity
  const validDiscounts = discounts.filter(
    (d) => d.type === d.type && (d.minQuantity ?? 1) <= quantity
  );

  if (validDiscounts.length === 0) return null;

  // Return the highest value discount
  return validDiscounts.reduce((best, current) => {
    return (current.value ?? 0) > (best.value ?? 0) ? current : best;
  });
};

export const getBestDiscount = (
  discounts: DiscountType[],
  price: number,
  quantity: number
): DiscountType | null => {
  if (!discounts || discounts.length === 0) return null;

  // Filter valid discounts based on quantity
  const validDiscounts = discounts.filter(
    (d) => (d.minQuantity ?? 1) <= quantity
  );

  if (validDiscounts.length === 0) return null;

  // Find the discount that gives the lowest discounted price
  let bestDiscount: DiscountType | null = null;
  let lowestPrice = price;

  for (const discount of validDiscounts) {
    let discountedPrice = price;

    if (discount.type === "percentage") {
      discountedPrice = price - (price * discount.value) / 100;
    } else if (discount.type === "amount") {
      discountedPrice = price - discount.value;
    }

    if (discountedPrice < lowestPrice) {
      lowestPrice = discountedPrice;
      bestDiscount = discount;
    }
  }

  return bestDiscount;
};

export const getDiscountValues = (
  discount: DiscountType | null,
  price: number,
  quantity: number
) => {
  if (!discount || quantity < discount.minQuantity) {
    return {
      discountedText: "",
      discountedPrice: price,
    };
  }

  let discountedPrice = price;
  let text = "";

  if (discount.type === "percentage") {
    const discountAmount = (price * discount.value) / 100;
    discountedPrice = price - discountAmount;
    text = `${discount.value}% off - Buy ${discount.minQuantity}+`;
  } else if (discount.type === "amount") {
    discountedPrice = (price * quantity - discount.value) / quantity;
    text = `₹${discount.value} off - Buy ${discount.minQuantity}+`;
  }

  //discountedPrice = Math.round(discountedPrice * 100) / 100;

  return {
    discountedText: text,
    discountedPrice,
  };
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

export const getBestDiscountValue = (
  discounts: DiscountType[],
  price: number,
  quantity: number
): {
  bestDiscount: DiscountType | null;
  discountedPrice: number;
  discountedText: string;
} => {
  if (!discounts || discounts.length === 0) {
    return {
      bestDiscount: null,
      discountedPrice: price,
      discountedText: "",
    };
  }

  let bestDiscount: DiscountType | null = null;
  let lowestPrice = price;
  let bestText = "";

  for (const discount of discounts) {
    if ((discount.minQuantity ?? 1) > quantity) continue;

    let discountedPrice = price;
    let text = "";

    if (discount.type === "percentage") {
      const discountAmount = (price * discount.value) / 100;
      discountedPrice = price - discountAmount;
      text = `${discount.value}% off - Buy ${discount.minQuantity}+`;
    } else if (discount.type === "amount") {
      discountedPrice = (price * quantity - discount.value) / quantity;
      text = `₹${discount.value} off - Buy ${discount.minQuantity}+`;
    }

    if (discountedPrice < lowestPrice) {
      lowestPrice = discountedPrice;
      bestDiscount = discount;
      bestText = text;
    }
  }

  return {
    bestDiscount,
    discountedPrice: Math.max(Math.round(lowestPrice * 100) / 100, 0),
    discountedText: bestText,
  };
};

export const roundToTwoDecimals = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};
