"use server";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema/auth";
import { productReviews } from "@/db/schema/products";
import { and, desc, eq, isNull } from "drizzle-orm";

export const getUserBots = async () => {
  const users = await db
    .select()
    .from(user)
    .where(eq(user.role, "userbots"))
    .orderBy(desc(user.createdAt));

  return users;
};

export const getNonReviewerUserBot = async (productId: number) => {
  const result = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    })
    .from(user)
    .leftJoin(
      productReviews,
      and(
        eq(productReviews.productId, productId),
        eq(user.id, productReviews.userId)
      )
    )
    .where(and(eq(user.role, "userbot"), isNull(productReviews.id)));

  return result;
};
