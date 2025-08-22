import { clearAllCartItemsForAllUsers } from "@/server/cart";
import { addCronJobLog } from "@/server/cronjobs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let type = searchParams.get("type");
  if (!type) {
    type = "auto";
  }

  const startTime = Date.now();

  try {
    const result = await clearAllCartItemsForAllUsers();

    const durationMs = Date.now() - startTime;

    await addCronJobLog({
      jobId: 1, // set the appropriate job ID for clearing cart items
      status: "success",
      responseText: JSON.stringify(result),
      durationMs,
      type,
    });

    return NextResponse.json(result);
  } catch (error) {
    const durationMs = Date.now() - startTime;
    console.error(error);

    await addCronJobLog({
      jobId: 1, // same job ID as above
      status: "error",
      responseText: error instanceof Error ? error.message : "Unknown error",
      durationMs,
      type,
    });

    return NextResponse.json(
      { success: false, message: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
