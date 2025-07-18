import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";

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
