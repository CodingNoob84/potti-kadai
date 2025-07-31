import { boolean, pgTable, serial, text } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const userAddresses = pgTable("user_addresses", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  name: text("firstname").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  pincode: text("pincode").notNull(),
  phone: text("phone").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});
