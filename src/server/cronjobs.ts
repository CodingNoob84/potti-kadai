"use server";
import { db } from "@/db/drizzle";
import { cronJobLogs, cronJobs } from "@/db/schema/cronjobs";
import { desc, eq } from "drizzle-orm";

interface AddCronJobLogParams {
  jobId: number;
  status: "success" | "error";
  responseText?: string;
  durationMs?: number;
  type?: string;
}

export async function addCronJobLog({
  jobId,
  status,
  responseText,
  durationMs,
  type,
}: AddCronJobLogParams) {
  try {
    const [log] = await db
      .insert(cronJobLogs)
      .values({
        jobId,
        status,
        responseText,
        durationMs,
        type,
      })
      .returning();

    return log;
  } catch (error) {
    console.error("Failed to add cron job log:", error);
    throw error;
  }
}

export async function getAllCronJobs() {
  try {
    const jobs = await db.select().from(cronJobs).orderBy(cronJobs.id);
    return jobs;
  } catch (error) {
    console.error("Failed to fetch cron jobs:", error);
    throw error;
  }
}

export async function getAllCronJobsWithLogs() {
  try {
    const jobs = await db.select().from(cronJobs).orderBy(cronJobs.id);

    const jobsWithLogs = await Promise.all(
      jobs.map(async (job) => {
        const logs = await db
          .select()
          .from(cronJobLogs)
          .where(eq(cronJobLogs.jobId, job.id))
          .orderBy(desc(cronJobLogs.createdAt));
        return { ...job, logs };
      })
    );

    return jobsWithLogs;
  } catch (error) {
    console.error("Failed to fetch cron jobs with logs:", error);
    throw error;
  }
}
