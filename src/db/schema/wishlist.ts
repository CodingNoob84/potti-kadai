import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { products, productVariants } from "./products";

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: serial("id").primaryKey(),

    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),

    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),

    productVariantId: integer("productvariant_id")
      .references(() => productVariants.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    unique("unique_wishlist_item").on(
      table.userId,
      table.productId,
      table.productVariantId
    ),
  ]
);
