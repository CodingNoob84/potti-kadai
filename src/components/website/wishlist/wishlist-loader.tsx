"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function WishlistLoading() {
  // Array for skeleton items (can be adjusted as needed)
  const skeletonItems = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Skeleton className="h-10 w-10 rounded-xl" />
            </motion.div>
            <Skeleton className="h-8 w-48 rounded-md" />
          </div>

          {/* Subheader Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Skeleton className="h-5 w-40 rounded-md" />
            <div className="flex gap-3">
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </div>

          {/* Grid of Skeleton Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {skeletonItems.map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    {/* Image Placeholder */}
                    <div className="relative aspect-square">
                      <Skeleton className="h-full w-full rounded-none" />
                    </div>

                    {/* Content Placeholder */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-4/5 rounded-md" />
                        <Skeleton className="h-4 w-3/5 rounded-md" />
                      </div>

                      <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-16 rounded-md" />
                        <Skeleton className="h-4 w-12 rounded-md" />
                      </div>

                      <Skeleton className="h-10 w-full rounded-lg mt-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
