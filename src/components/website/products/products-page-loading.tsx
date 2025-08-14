"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid, List } from "lucide-react";

export const ProductsClientPageSkeleton = () => {
  return (
    <div className="container px-4 py-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* Sort By Skeleton */}
          <Skeleton className="h-10 w-48" />

          {/* View Mode Skeleton */}
          <div className="flex border rounded-md">
            <Skeleton className="h-10 w-10">
              <Grid className="h-4 w-4 opacity-0" />
            </Skeleton>
            <Skeleton className="h-10 w-10">
              <List className="h-4 w-4 opacity-0" />
            </Skeleton>
          </div>

          {/* Mobile Filter Skeleton */}
          <Skeleton className="h-10 w-20 md:hidden" />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Desktop Filters Skeleton */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="px-6 py-1">
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-px w-full my-4" />

              {/* Filter sections */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mb-6">
                  <Skeleton className="h-5 w-32 mb-3" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Products Grid Skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-full">
                <CardContent className="p-4">
                  <Skeleton className="aspect-square w-full rounded-lg mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-5 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
