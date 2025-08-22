import {
  integer,
  jsonb,
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
  orderId: uuid("order_id").defaultRandom().notNull().unique(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  originalAmount: real("original_amount").notNull(), // Fixed typo: orginal → original
  totalAmount: real("total_amount").notNull(),
  discountAmount: real("discount_amount").default(0.0),
  shippingAmount: real("shipping_amount").default(0.0),
  taxPercentage: real("tax_percentage").default(18),
  taxAmount: real("tax_amount").default(0.0),
  finalAmount: real("final_amount").notNull(),
  status: text("status").default("pending"),
  addressId: integer("address_id")
    .references(() => userAddresses.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Added updated_at field
});

export const orderStatusHistory = pgTable("order_status_history", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" }) // Reference order_id instead of id
    .notNull(),
  status: text("status", {
    enum: [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ],
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reason: text("reason"),
  updatedBy: text("updated_by"), // Track who changed the status
});

export const orderShipments = pgTable("order_shipments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" }) // Reference order_id instead of id
    .notNull(),
  trackingNumber: text("tracking_number").unique(),
  carrier: text("carrier"),
  status: text("status", {
    enum: [
      "pending",
      "shipped",
      "in_transit",
      "out_for_delivery",
      "delivered",
      "returned",
    ],
  })
    .default("pending")
    .notNull(),
  shippedAt: timestamp("shipped_at"),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderPayments = pgTable("order_payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" }) // Reference order_id instead of id
    .notNull(),
  status: text("status", {
    enum: ["pending", "processing", "completed", "failed", "refunded"],
  })
    .default("pending")
    .notNull(),
  amount: real("amount").notNull(), // Payment amount (might differ from order amount for partial payments)
  paymentMethod: text("payment_method").notNull(),
  transactionId: text("transaction_id"),
  paymentGateway: text("payment_gateway"), // Which gateway was used
  gatewayResponse: jsonb("gateway_response"), // Store full gateway response
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id").notNull(),
  productVariantId: integer("product_variant_id").notNull(),
  quantity: integer("quantity").notNull(),
  orginalprice: real("orginal_price").notNull(),
  discount: real("discount").default(0.0),
  finalprice: real("final_price").notNull(),
});

export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  trackingNumber: text("tracking_number"),
  courierName: text("courier_name").default("PK-Couriers"),
  status: text("status").notNull().default("pending"), // pending, shipped, in_transit, delivered, cancelled
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
