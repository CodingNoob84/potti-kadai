"use client";

import { ReviewsList } from "@/components/dashboard/reviews/reviews-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProductRatings } from "@/server/products";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Star, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ReviewsBlockPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  // Mock query - replace with your actual query
  const { data: productReviews, isLoading } = useQuery({
    queryKey: ["productReviews"],
    queryFn: getProductRatings,
  });
  console.log("data", productReviews);

  const toggleRow = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Reviews</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Total Reviews</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px]" />
                      </TableCell>

                      <TableCell>
                        <Skeleton className="h-4 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[60px] rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : productReviews?.map((product) => (
                    <React.Fragment key={product.id}>
                      <TableRow
                        className={
                          expanded === product.id ? "bg-muted/30" : undefined
                        }
                      >
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleRow(product.id)}
                          >
                            {expanded === product.id ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{product.productName}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{product.averageRating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{product.totalReviews}</TableCell>

                        <TableCell>
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() =>
                                toast.info("Action not implemented")
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {expanded === product.id && (
                        <TableRow className="bg-muted/10 hover:bg-muted/20">
                          <TableCell />
                          <TableCell colSpan={6}>
                            <ReviewsList productId={product.id} />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
