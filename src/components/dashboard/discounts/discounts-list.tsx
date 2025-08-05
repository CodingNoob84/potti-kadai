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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton"; // Import skeleton component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteDiscount, getDiscountsList } from "@/server/offers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, ListTree, MoreHorizontal, Package, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NewDiscountModal } from "./discount-modal";

type DiscountsType = {
  categoryIds?: number[];
  subcategoryIds?: number[];
  productIds?: number[];
  id: number;
  name: string;
  type: string;
  value: number;
  minQuantity: number;
  appliedTo: string;
};

export function DiscountsList() {
  const queryClient = useQueryClient();
  const { data: discounts, isLoading } = useQuery({
    queryKey: ["all-discounts"],
    queryFn: getDiscountsList,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState<DiscountsType | null>(
    null
  );

  const deleteDiscountMutation = useMutation({
    mutationFn: deleteDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-discounts"] });
      toast.success("Discount has been successfully deleted!");
    },
    onError: () => {
      toast.error("Failed to delete discount");
    },
  });

  const handleEdit = (discount: DiscountsType) => {
    setCurrentDiscount(discount);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentDiscount(null);
    setIsModalOpen(true);
  };

  const handleDelete = (discountId: number) => {
    deleteDiscountMutation.mutate(discountId);
  };

  // Skeleton loading component
  const TableSkeleton = () => (
    <div className="w-full">
      {/* Table Header Skeleton */}
      <div className="flex border-b">
        {[...Array(6)].map((_, i) => (
          <div key={`header-${i}`} className="flex-1 py-3 px-4">
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>

      {/* Table Rows Skeleton */}
      {[...Array(5)].map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex border-b py-4">
          {/* Name */}
          <div className="flex-1 px-4">
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Type */}
          <div className="flex-1 px-4">
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Value */}
          <div className="flex-1 px-4">
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Min Qty */}
          <div className="flex-1 px-4">
            <Skeleton className="h-4 w-8" />
          </div>

          {/* Applied To */}
          <div className="flex-1 px-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex-1 px-4 text-right">
            <Skeleton className="h-8 w-8 rounded-md ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Discounts</CardTitle>
              <CardDescription>
                Manage your discounts and promotions
              </CardDescription>
            </div>
            <div>
              <Button onClick={handleCreate} disabled={isLoading}>
                <PlusIcon className="mr-2 h-4 w-4" />
                New Discount
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Min Qty</TableHead>
                  <TableHead>Applied To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts && discounts.length > 0 ? (
                  discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell className="font-medium">
                        {discount.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={"secondary"}>{discount.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {discount.type === "percentage"
                          ? `${discount.value}%`
                          : `${discount.value}₹`}
                      </TableCell>
                      <TableCell>{discount.minQuantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {discount.appliedTo === "all" && (
                            <>
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span>All Products</span>
                            </>
                          )}
                          {discount.appliedTo === "category" && (
                            <>
                              <ListTree className="h-4 w-4 text-muted-foreground" />
                              <span>Electronics</span>
                            </>
                          )}
                          {discount.appliedTo === "product" && (
                            <>
                              <Box className="h-4 w-4 text-muted-foreground" />
                              <span>Specific Product</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(discount)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(discount.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No discounts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <NewDiscountModal
        type={currentDiscount ? "Edit" : "Create"}
        discountValues={currentDiscount || undefined}
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCurrentDiscount(null);
          }
          setIsModalOpen(open);
        }}
      />
    </>
  );
}
