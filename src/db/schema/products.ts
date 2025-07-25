import { relations } from "drizzle-orm";

import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

// -----------------------
// Categories Table
// -----------------------

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  isActive: boolean("isactive").default(true).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  categorySubcategories: many(categorySubcategories),
}));

// -----------------------
// Subcategories Table
// -----------------------

export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isActive: boolean("isactive").default(true).notNull(),
});

export const subcategoriesRelations = relations(subcategories, ({ many }) => ({
  categorySubcategories: many(categorySubcategories),
}));

// -----------------------
// Category_Subcategory (Many-to-Many) Table
// -----------------------

export const categorySubcategories = pgTable(
  "category_subcategories",
  {
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
    subcategoryId: integer("subcategory_id")
      .notNull()
      .references(() => subcategories.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.categoryId, table.subcategoryId] }),
  })
);

export const categorySubcategoriesRelations = relations(
  categorySubcategories,
  ({ one }) => ({
    category: one(categories, {
      fields: [categorySubcategories.categoryId],
      references: [categories.id],
    }),
    subcategory: one(subcategories, {
      fields: [categorySubcategories.subcategoryId],
      references: [subcategories.id],
    }),
  })
);

export const sizes = pgTable("availablesizes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sizenumber: integer("sizenumber"), // in cm
  indiaSize: text("india_size"),
  usSize: text("us_size"),
  euSize: text("eu_size"),
  ukSize: text("uk_size"),
  type: text("type"), // upper or lower
  categoryId: integer("category_id").references(() => categories.id),
});

export const colors = pgTable("availablecolors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  colorCode: text("colorcode").notNull().unique(),
  isActive: boolean("isactive").default(true).notNull(),
});

export const productTags = pgTable("product_tags", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  tag: text("tag").notNull(),
});

export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  type: text("type").notNull(),
  value: real("value").notNull(),
  minQuantity: integer("min_quantity"),
});

export const promocodes = pgTable("promocodes", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  promocode: text("promocode").notNull(),
  value: real("value").notNull(),
  type: text("type").notNull(),
});

export const genders = pgTable("gender", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const productGenders = pgTable("product_genders", {
  id: serial("id").primaryKey(),

  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),

  genderId: integer("gender_id")
    .references(() => genders.id, { onDelete: "cascade" })
    .notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  isActive: boolean("isactive").default(true).notNull(),

  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),

  subcategoryId: integer("subcategory_id")
    .references(() => subcategories.id)
    .notNull(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  url: text("url").notNull(),
  colorId: integer("color_id").references(() => colors.id),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),

  sizeId: integer("size_id")
    .references(() => sizes.id)
    .notNull(),

  colorId: integer("color_id")
    .references(() => colors.id)
    .notNull(),

  quantity: integer("quantity").notNull(),
});

export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  images: many(productImages),
  variants: many(productVariants),
}));

export const productVariantRelations = relations(
  productVariants,
  ({ one }) => ({
    size: one(sizes, {
      fields: [productVariants.sizeId],
      references: [sizes.id],
    }),
    color: one(colors, {
      fields: [productVariants.colorId],
      references: [colors.id],
    }),
  })
);

export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),

  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),

  userId: integer("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  rating: integer("rating").notNull(),

  comment: text("comment"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
