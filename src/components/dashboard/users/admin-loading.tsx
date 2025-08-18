import { Skeleton } from "@/components/ui/skeleton";

export function AdminUsersTableSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-9 w-[120px]" />
          <Skeleton className="h-9 w-[130px]" />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-5 gap-4 p-4 border-b">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px] ml-auto" />
        </div>

        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[200px]" />
            </div>
            <div>
              <Skeleton className="h-6 w-[60px] rounded-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
