import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { categories, colors, genders, sizes, subcategories } from "./category";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  isActive: boolean("isactive").default(true).notNull(),
  categoryId: integer("category_id")
    .references(() => categories.id, { onDelete: "set null" })
    .notNull(),

  subcategoryId: integer("subcategory_id")
    .references(() => subcategories.id, { onDelete: "set null" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  colorId: integer("color_id").references(() => colors.id),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  sizeId: integer("size_id")
    .references(() => sizes.id, { onDelete: "set null" })
    .notNull(),
  colorId: integer("color_id")
    .references(() => colors.id, { onDelete: "set null" })
    .notNull(),
  quantity: integer("quantity").notNull(),
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

export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
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
  genders: many(productGenders),
  reviews: many(productReviews),
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

export const productGenderRelations = relations(productGenders, ({ one }) => ({
  product: one(products, {
    fields: [productGenders.productId],
    references: [products.id],
  }),
  gender: one(genders, {
    fields: [productGenders.genderId],
    references: [genders.id],
  }),
}));
