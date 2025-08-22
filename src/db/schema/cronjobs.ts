import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Enum for status
export const jobStatusEnum = pgEnum("job_status", ["success", "error"]);

export const cronJobs = pgTable("cron_jobs", {
  id: serial("id").primaryKey(),
  jobName: text("job_name").notNull(),
  jobUrl: text("job_url").notNull(),
  description: text("description"),
  scheduleText: text("schedule"),
});

export const cronJobLogs = pgTable("cron_job_logs", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .notNull()
    .references(() => cronJobs.id, { onDelete: "cascade" }),
  status: jobStatusEnum("status").notNull(),
  responseText: text("response_text"),
  durationMs: integer("duration_ms"),
  type: text("type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
