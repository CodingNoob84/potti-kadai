import { addCronJobLog } from "@/server/cronjobs";
import { updateOrderStatus } from "@/server/seeding";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let type = searchParams.get("type");
  if (!type) {
    type = "auto";
  }

  const startTime = Date.now();

  try {
    const result = await updateOrderStatus();
    console.log("result", result);

    const durationMs = Date.now() - startTime;

    await addCronJobLog({
      jobId: 3,
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
      jobId: 3,
      status: "error",
      responseText: error instanceof Error ? error.message : "Unknown error",
      durationMs,
      type,
    });

    return NextResponse.json(
      { success: false, message: "Failed to update orders" },
      { status: 500 }
    );
  }
}
