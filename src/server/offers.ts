"use server";
import { db } from "@/db/drizzle";
import { categories, subcategories } from "@/db/schema/category";
import {
  discountCategories,
  discountProducts,
  discounts,
  discountSubcategories,
  promoCodeCategories,
  promoCodeProducts,
  promoCodes,
  promoCodeSubcategories,
} from "@/db/schema/offers";
import { products } from "@/db/schema/products";

import { eq, inArray } from "drizzle-orm";

type DiscountInput = {
  id?: number;
  name: string;
  type: string;
  value: number;
  minQuantity?: number;
  appliedTo: string;
  categoryIds?: number[];
  subcategoryIds?: number[];
  productIds?: number[];
};

export async function createOrUpdateDiscount(input: DiscountInput) {
  let discountId = input.id;

  // 1. Insert or update the discount base record
  if (discountId) {
    await db
      .update(discounts)
      .set({
        name: input.name,
        type: input.type,
        value: input.value,
        minQuantity: input.minQuantity,
        appliedTo: input.appliedTo,
      })
      .where(eq(discounts.id, discountId));

    // Clear old associations
    await db
      .delete(discountCategories)
      .where(eq(discountCategories.discountId, discountId));
    await db
      .delete(discountSubcategories)
      .where(eq(discountSubcategories.discountId, discountId));
    await db
      .delete(discountProducts)
      .where(eq(discountProducts.discountId, discountId));
  } else {
    const inserted = await db
      .insert(discounts)
      .values({
        name: input.name,
        type: input.type,
        value: input.value,
        minQuantity: input.minQuantity,
        appliedTo: input.appliedTo,
      })
      .returning({ id: discounts.id });

    discountId = inserted[0].id;
  }

  // 2. Insert related items based on applyTo
  if (
    input.appliedTo === "categories" &&
    Array.isArray(input.categoryIds) &&
    input.categoryIds.length > 0
  ) {
    await db.insert(discountCategories).values(
      input.categoryIds.map((categoryId) => ({
        discountId,
        categoryId,
      }))
    );
  }

  if (
    input.appliedTo === "subcategories" &&
    Array.isArray(input.subcategoryIds) &&
    input.subcategoryIds.length > 0
  ) {
    await db.insert(discountSubcategories).values(
      input.subcategoryIds.map((subcategoryId) => ({
        discountId,
        subcategoryId,
      }))
    );
  }

  if (
    input.appliedTo === "products" &&
    Array.isArray(input.productIds) &&
    input.productIds.length > 0
  ) {
    await db.insert(discountProducts).values(
      input.productIds.map((productId) => ({
        discountId,
        productId,
      }))
    );
  }

  return { success: true, discountId };
}

export async function getDiscountsList() {
  const discountList = await db.select().from(discounts);

  const categoryIds = discountList
    .filter((d) => d.appliedTo === "categories")
    .map((d) => d.id);
  const subcategoryIds = discountList
    .filter((d) => d.appliedTo === "subcategories")
    .map((d) => d.id);
  const productIds = discountList
    .filter((d) => d.appliedTo === "products")
    .map((d) => d.id);

  const [categoryMappings, subcategoryMappings, productMappings] =
    await Promise.all([
      categoryIds.length
        ? db
            .select({
              discountId: discountCategories.discountId,
              id: categories.id,
              name: categories.name,
            })
            .from(discountCategories)
            .innerJoin(
              categories,
              eq(discountCategories.categoryId, categories.id)
            )
            .where(inArray(discountCategories.discountId, categoryIds))
        : [],
      subcategoryIds.length
        ? db
            .select({
              discountId: discountSubcategories.discountId,
              id: subcategories.id,
              name: subcategories.name,
            })
            .from(discountSubcategories)
            .innerJoin(
              subcategories,
              eq(discountSubcategories.subcategoryId, subcategories.id)
            )
            .where(inArray(discountSubcategories.discountId, subcategoryIds))
        : [],
      productIds.length
        ? db
            .select({
              discountId: discountProducts.discountId,
              id: products.id,
              name: products.name,
            })
            .from(discountProducts)
            .innerJoin(products, eq(discountProducts.productId, products.id))
            .where(inArray(discountProducts.discountId, productIds))
        : [],
    ]);

  const groupBy = <T>(arr: T[], key: keyof T) =>
    arr.reduce((acc: Record<number, T[]>, item) => {
      const id = item[key] as unknown as number;
      if (!acc[id]) acc[id] = [];
      acc[id].push(item);
      return acc;
    }, {});

  const categoryMap = groupBy(categoryMappings, "discountId");
  const subcategoryMap = groupBy(subcategoryMappings, "discountId");
  const productMap = groupBy(productMappings, "discountId");

  const enrichedDiscounts = discountList.map((discount) => {
    let categoryIds: number[] = [];
    let categories: { id: number; name: string }[] = [];
    let subcategoryIds: number[] = [];
    let subcategories: { id: number; name: string }[] = [];
    let productIds: number[] = [];
    let products: { id: number; name: string }[] = [];

    if (discount.appliedTo === "categories") {
      const items = categoryMap[discount.id] || [];
      categoryIds = items.map((i) => i.id);
      categories = items.map((i) => ({ id: i.id, name: i.name }));
    } else if (discount.appliedTo === "subcategories") {
      const items = subcategoryMap[discount.id] || [];
      subcategoryIds = items.map((i) => i.id);
      subcategories = items.map((i) => ({ id: i.id, name: i.name }));
    } else if (discount.appliedTo === "products") {
      const items = productMap[discount.id] || [];
      productIds = items.map((i) => i.id);
      products = items.map((i) => ({ id: i.id, name: i.name }));
    }

    return {
      ...discount,
      categoryIds,
      categories,
      subcategoryIds,
      subcategories,
      productIds,
      products,
    };
  });

  return enrichedDiscounts;
}

export async function deleteDiscount(discountId: number) {
  await db.delete(discounts).where(eq(discounts.id, discountId));
}

interface PromoCodeInput {
  id?: number;
  code: string;
  type: string;
  value: number;
  minQuantity: number;
  validFrom: Date;
  validTo: Date;
  maxUses: number;
  usesPerUser: number;
  appliedTo: string;
  categoryIds?: number[] | undefined;
  subcategoryIds?: number[] | undefined;
  productIds?: number[] | undefined;
}

export async function createOrUpdatePromoCode(input: PromoCodeInput) {
  // Check if promo code already exists
  const existing = await db
    .select({ id: promoCodes.id })
    .from(promoCodes)
    .where(eq(promoCodes.code, input.code))
    .limit(1);

  let promoCodeId: number;

  if (existing.length > 0) {
    // Update existing promo code
    promoCodeId = existing[0].id;

    await db
      .update(promoCodes)
      .set({
        type: input.type,
        value: input.value,
        minQuantity: input.minQuantity,
        validFrom: input.validFrom,
        validTo: input.validTo,
        maxUses: input.maxUses,
        usesPerUser: input.usesPerUser,
        appliedTo: input.appliedTo,
      })
      .where(eq(promoCodes.id, promoCodeId));

    // Clear previous associations
    await Promise.all([
      db
        .delete(promoCodeCategories)
        .where(eq(promoCodeCategories.promoCodeId, promoCodeId)),
      db
        .delete(promoCodeSubcategories)
        .where(eq(promoCodeSubcategories.promoCodeId, promoCodeId)),
      db
        .delete(promoCodeProducts)
        .where(eq(promoCodeProducts.promoCodeId, promoCodeId)),
    ]);
  } else {
    // Insert new promo code
    const inserted = await db
      .insert(promoCodes)
      .values({
        code: input.code,
        type: input.type,
        value: input.value,
        minQuantity: input.minQuantity,
        validFrom: input.validFrom,
        validTo: input.validTo,
        maxUses: input.maxUses,
        usesPerUser: input.usesPerUser,
        appliedTo: input.appliedTo,
      })
      .returning({ id: promoCodes.id });

    promoCodeId = inserted[0].id;
  }

  // Add mappings based on appliedTo
  if (input.appliedTo === "categories" && input.categoryIds?.length) {
    await db.insert(promoCodeCategories).values(
      input.categoryIds.map((categoryId) => ({
        promoCodeId,
        categoryId,
      }))
    );
  }

  if (input.appliedTo === "subcategories" && input.subcategoryIds?.length) {
    await db.insert(promoCodeSubcategories).values(
      input.subcategoryIds.map((subcategoryId) => ({
        promoCodeId,
        subcategoryId,
      }))
    );
  }

  if (input.appliedTo === "products" && input.productIds?.length) {
    await db.insert(promoCodeProducts).values(
      input.productIds.map((productId) => ({
        promoCodeId,
        productId,
      }))
    );
  }

  return { id: promoCodeId };
}

export async function getPromocodesList() {
  const codes = await db.select().from(promoCodes);

  const categoryIds = codes
    .filter((c) => c.appliedTo === "categories")
    .map((c) => c.id);
  const subcategoryIds = codes
    .filter((c) => c.appliedTo === "subcategories")
    .map((c) => c.id);
  const productIds = codes
    .filter((c) => c.appliedTo === "products")
    .map((c) => c.id);

  const [categoryMappings, subcategoryMappings, productMappings] =
    await Promise.all([
      categoryIds.length
        ? db
            .select({
              promoCodeId: promoCodeCategories.promoCodeId,
              id: categories.id,
              name: categories.name,
            })
            .from(promoCodeCategories)
            .innerJoin(
              categories,
              eq(promoCodeCategories.categoryId, categories.id)
            )
            .where(inArray(promoCodeCategories.promoCodeId, categoryIds))
        : [],
      subcategoryIds.length
        ? db
            .select({
              promoCodeId: promoCodeSubcategories.promoCodeId,
              id: subcategories.id,
              name: subcategories.name,
            })
            .from(promoCodeSubcategories)
            .innerJoin(
              subcategories,
              eq(promoCodeSubcategories.subcategoryId, subcategories.id)
            )
            .where(inArray(promoCodeSubcategories.promoCodeId, subcategoryIds))
        : [],
      productIds.length
        ? db
            .select({
              promoCodeId: promoCodeProducts.promoCodeId,
              id: products.id,
              name: products.name,
            })
            .from(promoCodeProducts)
            .innerJoin(products, eq(promoCodeProducts.productId, products.id))
            .where(inArray(promoCodeProducts.promoCodeId, productIds))
        : [],
    ]);

  const groupBy = <T>(arr: T[], key: keyof T) =>
    arr.reduce((acc: Record<number, T[]>, item) => {
      const id = item[key] as unknown as number;
      if (!acc[id]) acc[id] = [];
      acc[id].push(item);
      return acc;
    }, {});

  const categoryMap = groupBy(categoryMappings, "promoCodeId");
  const subcategoryMap = groupBy(subcategoryMappings, "promoCodeId");
  const productMap = groupBy(productMappings, "promoCodeId");

  const promoCodesList = codes.map((code) => {
    let categoryIds: number[] = [];
    let categories: { id: number; name: string }[] = [];
    let subcategoryIds: number[] = [];
    let subcategories: { id: number; name: string }[] = [];
    let productIds: number[] = [];
    let products: { id: number; name: string }[] = [];

    if (code.appliedTo === "categories") {
      const items = categoryMap[code.id] || [];
      categoryIds = items.map((i) => i.id);
      categories = items.map((i) => ({ id: i.id, name: i.name }));
    } else if (code.appliedTo === "subcategories") {
      const items = subcategoryMap[code.id] || [];
      subcategoryIds = items.map((i) => i.id);
      subcategories = items.map((i) => ({ id: i.id, name: i.name }));
    } else if (code.appliedTo === "products") {
      const items = productMap[code.id] || [];
      productIds = items.map((i) => i.id);
      products = items.map((i) => ({ id: i.id, name: i.name }));
    }

    return {
      ...code,
      categoryIds,
      categories,
      subcategoryIds,
      subcategories,
      productIds,
      products,
    };
  });

  return promoCodesList;
}

export async function deletePromoCode(id: number) {
  await db.delete(promoCodes).where(eq(promoCodes.id, id));
}
