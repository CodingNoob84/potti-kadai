"use server";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema/auth";
import { orders } from "@/db/schema/cart";
import { productReviews } from "@/db/schema/products";
import { userAddresses } from "@/db/schema/user";
import { and, desc, eq, isNull, ne, sql } from "drizzle-orm";

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
  isDefault: boolean;
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
    isDefault: inputData.isDefault ?? false,
  };

  try {
    // If the new/updated address is default, make all other addresses non-default
    if (inputData.isDefault) {
      await db
        .update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, inputData.userId));
    }

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

export const setAddressDefault = async ({
  userId,
  userAddressId,
}: {
  userId: string;
  userAddressId: number;
}) => {
  try {
    // Step 1: Reset all addresses for this user
    await db
      .update(userAddresses)
      .set({ isDefault: false })
      .where(eq(userAddresses.userId, userId));

    // Step 2: Set the selected address as default
    await db
      .update(userAddresses)
      .set({ isDefault: true })
      .where(
        and(
          eq(userAddresses.id, userAddressId),
          eq(userAddresses.userId, userId) // ensures address belongs to user
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Failed to set default address:", error);
    throw new Error("Failed to set default address");
  }
};

export const deleteUserAddress = async ({
  userId,
  userAddressId,
}: {
  userId: string;
  userAddressId: number;
}) => {
  try {
    // Check if address exists and belongs to user
    const [address] = await db
      .select()
      .from(userAddresses)
      .where(
        and(
          eq(userAddresses.id, userAddressId),
          eq(userAddresses.userId, userId)
        )
      );

    if (!address) {
      throw new Error("Address not found or does not belong to user");
    }

    // Delete the address
    await db
      .delete(userAddresses)
      .where(
        and(
          eq(userAddresses.id, userAddressId),
          eq(userAddresses.userId, userId)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Failed to delete address:", error);
    throw new Error("Failed to delete address");
  }
};

export const getAllUserAddresses = async ({ userId }: { userId: string }) => {
  try {
    const addresses = await db
      .select()
      .from(userAddresses)
      .where(eq(userAddresses.userId, userId))
      .orderBy(desc(userAddresses.id));

    return addresses;
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw new Error("Unable to fetch user addresses");
  }
};

type UpdateUserParams = {
  id: string;
  name: string;
  phone: string | null;
};

export const updateUser = async ({ id, name, phone }: UpdateUserParams) => {
  try {
    const [updatedUser] = await db
      .update(user)
      .set({
        name,
        phone,
        updatedAt: new Date(), // Always update the timestamp
      })
      .where(eq(user.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found or update failed");
    }

    return updatedUser;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error; // Re-throw to let the caller handle it
  }
};

export const getAllUsers = async ({
  page = 1,
  limit = 10,
}: {
  page: number;
  limit: number;
}) => {
  const offset = (page - 1) * limit;

  const usersWithOrders = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      orderCount: sql<number>`COUNT(${orders.id})`.as("order_count"),
      totalSpent: sql<number>`COALESCE(SUM(${orders.finalAmount}), 0)`.as(
        "total_spent"
      ),
    })
    .from(user)
    .leftJoin(orders, sql`${user.id} = ${orders.userId}`)
    .where(ne(user.role, "admin")) // 👈 exclude admins
    .groupBy(user.id)
    .orderBy(desc(user.createdAt))
    .limit(limit)
    .offset(offset);

  // optional: total count of users (for pagination UI)
  const [{ total }] = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(user);

  return {
    data: usersWithOrders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAllAdmins = async () => {
  const admins = await db
    .select()
    .from(user)
    .where(eq(user.role, "admin"))
    .orderBy(desc(user.createdAt));

  return admins;
};
