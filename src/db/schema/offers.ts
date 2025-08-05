import {
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { categories, subcategories } from "./category";
import { products } from "./products";

export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'percentage' or 'amount'
  value: real("value").notNull(),
  minQuantity: integer("min_quantity").default(1).notNull(),
  appliedTo: text("apply_to").notNull(), // 'all', 'categories', 'subcategories', 'products'
});

export const discountCategories = pgTable("discount_categories", {
  discountId: integer("discount_id").references(() => discounts.id, {
    onDelete: "cascade",
  }),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),
});

export const discountSubcategories = pgTable("discount_subcategories", {
  discountId: integer("discount_id").references(() => discounts.id, {
    onDelete: "cascade",
  }),
  subcategoryId: integer("subcategory_id").references(() => subcategories.id, {
    onDelete: "cascade",
  }),
});

export const discountProducts = pgTable("discount_products", {
  discountId: integer("discount_id").references(() => discounts.id, {
    onDelete: "cascade",
  }),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
});

export const promoCodes = pgTable("promo_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // 'percentage' or 'amount'
  value: real("value").notNull(),
  minQuantity: integer("min_quantity").notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to").notNull(),
  maxUses: integer("max_uses").notNull(),
  usesPerUser: integer("uses_per_user").notNull(),
  appliedTo: text("apply_to").notNull(), // 'all', 'categories', 'subcategories', 'products'
});

export const promoCodeCategories = pgTable("promo_code_categories", {
  promoCodeId: integer("promo_code_id").references(() => promoCodes.id, {
    onDelete: "cascade",
  }),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),
});

export const promoCodeSubcategories = pgTable("promo_code_subcategories", {
  promoCodeId: integer("promo_code_id").references(() => promoCodes.id, {
    onDelete: "cascade",
  }),
  subcategoryId: integer("subcategory_id").references(() => subcategories.id, {
    onDelete: "cascade",
  }),
});

export const promoCodeProducts = pgTable("promo_code_products", {
  promoCodeId: integer("promo_code_id").references(() => promoCodes.id, {
    onDelete: "cascade",
  }),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
});
