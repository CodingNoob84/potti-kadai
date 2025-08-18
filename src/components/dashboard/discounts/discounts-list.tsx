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
import { Skeleton } from "@/components/ui/skeleton";
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
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { NewDiscountModal } from "./discount-modal";

type Category = {
  id: number;
  name: string;
};

type Subcategory = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
};

type DiscountsType = {
  id: number;
  name: string;
  type: string;
  value: number;
  minQuantity: number;
  appliedTo: string;
  categories?: Category[];
  subcategories?: Subcategory[];
  products?: Product[];
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
      toast.success("Discount deleted successfully");
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

  const getBadgeVariant = (type: string) => {
    return type === "percentage" ? "default" : "secondary";
  };

  const TableSkeleton = () => (
    <div className="w-full">
      <div className="flex border-b">
        {[...Array(6)].map((_, i) => (
          <div key={`header-${i}`} className="flex-1 py-3 px-4">
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
      {[...Array(5)].map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex border-b py-4">
          {[...Array(6)].map((_, cellIndex) => (
            <div key={`cell-${cellIndex}`} className="flex-1 px-4">
              {cellIndex === 1 ? (
                <Skeleton className="h-6 w-16 rounded-full" />
              ) : cellIndex === 4 ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ) : cellIndex === 5 ? (
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
              ) : (
                <Skeleton className="h-4 w-full" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Discounts</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Manage your discounts and promotional offers
              </CardDescription>
            </div>
            <Button
              onClick={handleCreate}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              New Discount
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[100px]">Value</TableHead>
                  <TableHead className="w-[100px]">Min Qty</TableHead>
                  <TableHead className="min-w-[200px]">Applied To</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts && discounts.length > 0 ? (
                  discounts.map((discount) => (
                    <TableRow key={discount.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {discount.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getBadgeVariant(discount.type)}
                          className="capitalize"
                        >
                          {discount.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {discount.type === "percentage"
                          ? `${discount.value}%`
                          : `₹${discount.value}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{discount.minQuantity}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          {discount.appliedTo === "all" && (
                            <Link
                              href="/products"
                              className="flex items-center gap-1 hover:underline"
                            >
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span>All Products</span>
                            </Link>
                          )}
                          {discount.appliedTo === "categories" && (
                            <>
                              <ListTree className="h-4 w-4 text-muted-foreground" />
                              {discount.categories?.map((category) => (
                                <Link
                                  key={category.id}
                                  href={`/products?category=${category.id}`}
                                  className="hover:underline"
                                >
                                  {category.name}
                                </Link>
                              ))}
                            </>
                          )}
                          {discount.appliedTo === "subcategories" && (
                            <>
                              <ListTree className="h-4 w-4 text-muted-foreground" />
                              {discount.subcategories?.map((subcategory) => (
                                <Link
                                  key={subcategory.id}
                                  href={`/products?subcategory=${subcategory.id}`}
                                  className="hover:underline"
                                >
                                  {subcategory.name}
                                </Link>
                              ))}
                            </>
                          )}
                          {discount.appliedTo === "products" && (
                            <>
                              <Box className="h-4 w-4 text-muted-foreground" />
                              {discount.products?.map((product) => (
                                <Link
                                  key={product.id}
                                  href={`/products/${product.id}`}
                                  className="hover:underline"
                                >
                                  {product.name}
                                </Link>
                              ))}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-muted"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => handleEdit(discount)}
                              className="cursor-pointer"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
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
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No discounts found. Create your first discount.
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
