"use server";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema/auth";
import { productReviews } from "@/db/schema/products";
import { userAddresses } from "@/db/schema/user";
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

type InputData = {
  id: number;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  userId: string;
};

export const createUpdateAddress = async (inputData: InputData) => {
  const commonData = {
    userId: inputData.userId,
    name: `${inputData.firstName} ${inputData.lastName}`,
    address: inputData.address2
      ? `${inputData.address1}, ${inputData.address2}`
      : inputData.address1,
    city: inputData.city,
    state: inputData.state,
    country: inputData.country,
    pincode: inputData.pincode,
    phone: inputData.phone,
    isDefault: false,
  };

  try {
    if (inputData.id === 0) {
      // Insert new address
      await db.insert(userAddresses).values(commonData);
    } else {
      // Update existing address
      await db
        .update(userAddresses)
        .set(commonData)
        .where(eq(userAddresses.id, inputData.id));
    }
  } catch (error) {
    console.error("Failed to create/update address:", error);
    throw new Error("Create/Update address failed");
  }
};

export const getAllUserAddresses = async ({ userId }: { userId: string }) => {
  try {
    const addresses = await db
      .select()
      .from(userAddresses)
      .where(eq(userAddresses.userId, userId));

    return addresses;
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw new Error("Unable to fetch user addresses");
  }
};
