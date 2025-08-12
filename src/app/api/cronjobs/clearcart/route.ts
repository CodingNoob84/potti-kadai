import { clearAllCartItemsForAllUsers } from "@/server/cart";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const myKey = searchParams.get("key");
  console.log("key", myKey);
  try {
    const result = await clearAllCartItemsForAllUsers();
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
