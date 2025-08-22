"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllCronJobsWithLogs } from "@/server/cronjobs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Play,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface CronJobsLogs {
  id: number;
  jobId: number;
  status: "success" | "error";
  responseText: string | null;
  durationMs: number | null;
  type: string | null;
  createdAt: Date;
}

interface CronJob {
  id: number;
  jobName: string;
  jobUrl: string;
  description: string | null;
  scheduleText: string | null;
  logs: CronJobsLogs[];
}

const CronJobCard = ({ job }: { job: CronJob }) => {
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const triggerJob = async () => {
    try {
      setIsTriggering(true);
      const url = `${process.env.NEXT_PUBLIC_VERCEL_URL}${job.jobUrl}?type=manual`;
      console.log(`Triggering job: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("API Response:", data);

      // Optional: Refetch jobs to update the logs
      queryClient.invalidateQueries({ queryKey: ["cronjobs-list"] });
    } catch (error) {
      console.error("Failed to trigger job:", error);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{job.jobName}</CardTitle>
            <CardDescription>{job.description}</CardDescription>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              Schedule: {job.scheduleText}
            </div>
          </div>
          <Button
            onClick={triggerJob}
            size="sm"
            className="flex items-center gap-1"
            disabled={isTriggering}
          >
            {isTriggering ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Triggering...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Trigger
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant="ghost"
          onClick={toggleExpand}
          className="w-full flex justify-between items-center p-0 h-8"
        >
          <span className="text-sm font-medium">Execution History</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {isExpanded && (
          <div className="mt-4 border rounded-lg divide-y">
            <div className="flex flex-col gap-4">
              {job.logs.length > 0 ? (
                job.logs.map((log) => (
                  <div key={log.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {log.status === "success" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge
                          variant={
                            log.status === "success" ? "outline" : "destructive"
                          }
                          className="text-xs"
                        >
                          {log.status}
                        </Badge>
                        {log.durationMs && (
                          <span className="text-xs text-muted-foreground">
                            {log.durationMs}ms
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>

                    {log.responseText && (
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Response
                          </span>
                          {log.type && (
                            <Badge variant="secondary" className="text-xs">
                              {log.type}
                            </Badge>
                          )}
                        </div>

                        {log.responseText.startsWith("{") ||
                        log.responseText.startsWith("[") ? (
                          // JSON response - format it nicely
                          <pre className="text-xs overflow-auto max-h-40 p-2 bg-background rounded border">
                            {JSON.stringify(
                              JSON.parse(log.responseText),
                              null,
                              2
                            )}
                          </pre>
                        ) : (
                          // Plain text response
                          <div className="text-sm whitespace-pre-wrap break-words">
                            {log.responseText}
                          </div>
                        )}
                      </div>
                    )}

                    {!log.responseText && log.status === "success" && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        No response data available
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-8 w-8 opacity-50" />
                    <span>No execution history available</span>
                    <span className="text-xs">
                      Trigger the job to see execution logs
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Skeleton component for loading state
const CronJobCardSkeleton = () => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex items-center mt-2">
              <Skeleton className="h-4 w-4 mr-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-9 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
};

export default function CronJobsPage() {
  const {
    data: cronJobs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cronjobs-list"],
    queryFn: getAllCronJobsWithLogs,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Calendar className="h-8 w-8" />
            Cron Jobs Manager
          </h1>
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <CronJobCardSkeleton key={index} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">
          Error loading cron jobs: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Calendar className="h-8 w-8" />
          Cron Jobs Manager
        </h1>
        <p className="text-muted-foreground">
          Manage and monitor your scheduled tasks
        </p>
      </div>

      <div className="grid gap-4">
        {cronJobs && cronJobs.length > 0 ? (
          cronJobs.map((job) => <CronJobCard key={job.id} job={job} />)
        ) : (
          <div className="text-center text-muted-foreground">
            No cron jobs configured
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Showing {cronJobs?.length || 0} scheduled jobs</p>
      </div>
    </div>
  );
}
