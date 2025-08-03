"use server"

import { integer, pgTable, real, serial, text } from "drizzle-orm/pg-core";
import { categories, subcategories } from "./category";
import { products } from "./products";

export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'percentage' or 'amount'
  value: real("value").notNull(),
  minQuantity: integer("min_quantity"),
  applyTo: text("apply_to").notNull(), // 'all', 'categories', 'subcategories', 'products'
});

export const discountCategories = pgTable("discount_categories", {
  discountId: integer("discount_id").references(() => discounts.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "cascade" }),
});

export const discountSubcategories = pgTable("discount_subcategories", {
  discountId: integer("discount_id").references(() => discounts.id, { onDelete: "cascade" }),
  subcategoryId: integer("subcategory_id").references(() => subcategories.id, { onDelete: "cascade" }),
});

export const discountProducts = pgTable("discount_products", {
  discountId: integer("discount_id").references(() => discounts.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }),
});


export const promocodes = pgTable("promocodes", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  promocode: text("promocode").notNull(),
  value: real("value").notNull(),
  type: text("type").notNull(),
});