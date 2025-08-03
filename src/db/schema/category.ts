import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { products } from "./products";

// 📦 Categories (e.g., Clothing, Footwear)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 👕 Subcategories (e.g., Shirts, Pants)
export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  size_type_id: integer("size_type_id")
    .references(() => sizeTypes.id, { onDelete: "set null" }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 🔗 Junction Table: Category <-> Subcategory
export const categorySubcategories = pgTable(
  "category_subcategories",
  {
    category_id: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    subcategory_id: integer("subcategory_id")
      .notNull()
      .references(() => subcategories.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.category_id, table.subcategory_id] }),
  })
);

// 📏 Size Types (e.g., Topwear, Bottomwear, Freesize, Footwear)
export const sizeTypes = pgTable("size_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

// 📐 Sizes (e.g., S, M, L, XL)
export const sizes = pgTable("sizes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  size_number: integer("size_number"), // Optional numerical size (in cm)
  size_type_id: integer("size_type_id")
    .references(() => sizeTypes.id, { onDelete: "set null" }),
  created_at: timestamp("created_at").defaultNow(),
});

// 🌍 Country-specific Sizes
export const countrySizes = pgTable("country_sizes", {
  id: serial("id").primaryKey(),
  country_name: text("country_name").notNull(),
  size_label: text("size_label").notNull(),
  size_id: integer("size_id").notNull().references(() => sizes.id, { onDelete: "cascade" }),
});


// 🔗 Subcategory <-> Size Type mapping
export const subcategorySizeTypes = pgTable("subcategory_size_types", {
  id: serial("id").primaryKey(),
  subcategory_id: integer("subcategory_id")
    .notNull()
    .references(() => subcategories.id, { onDelete: "cascade" }),
  size_type_id: integer("size_type_id")
    .notNull()
    .references(() => sizeTypes.id, { onDelete: "cascade" }),
});

export const colors = pgTable("available_colors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),          // e.g., "Red", "Navy Blue"
  color_code: text("color_code").notNull().unique(), // e.g., "#FF0000"
  is_active: boolean("is_active").default(true).notNull(),
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



// Optional Indexes for Performance
// export const indexes = {
//   category_slug_idx: index("category_slug_idx").on(categories.slug),
//   subcategory_name_idx: index("subcategory_name_idx").on(subcategories.name),
//   size_type_idx: index("size_type_idx").on(sizes.size_type_id),
// };


