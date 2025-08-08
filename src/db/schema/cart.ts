import {
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { products, productVariants } from "./products";
import { userAddresses } from "./user";

export const cartItems = pgTable(
  "cart_items",
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
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    unique("unique_cart_item").on(
      table.userId,
      table.productId,
      table.productVariantId
    ),
  ]
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: uuid("order_id").defaultRandom().notNull(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  orginalAmount: real("orginal_amount").notNull(),
  totalAmount: real("total_amount").notNull(),
  discountAmount: real("discount_amount").default(0.0),
  shippingAmount: real("shipping_amount").default(0.0),
  taxPercentage: real("tax_percentage").default(18),
  taxAmount: real("tax_amount").default(0.0),
  finalAmount: real("final_amount").notNull(),
  status: text("status").default("pending").notNull(), // pending, paid, shipped, delivered, cancelled
  paymentMethod: text("payment_method").notNull(), // cod, card, razorpay etc.
  address: integer("address_id")
    .references(() => userAddresses.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id").notNull(),
  productVariantId: integer("product_variant_id").notNull(),
  quantity: integer("quantity").notNull(),
  orginalprice: integer("orginal_price").notNull(),
  discount: integer("discount").default(0.0),
  finalprice: integer("final_price").notNull(),
});
