"use client";

import { Badge } from "@/components/ui/badge";
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
import {
  getAllCategories,
  removeSubcategoryFromCategory,
} from "@/server/categories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Folder, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { AddEditCategory } from "./add-edit-category";

export const CategoriesBlock = () => {
  const queryClient = useQueryClient();
  const { data: AllCategories, isLoading } = useQuery({
    queryFn: getAllCategories,
    queryKey: ["allcategories"],
  });

  console.log("data", AllCategories);

  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  // const deleteCategoryMutation = useMutation({
  //   mutationFn: deleteCategory,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["allcategories"] });
  //   },
  // });

  const removeSubcategoryMutation = useMutation({
    mutationFn: ({
      categoryId,
      subcategoryId,
    }: {
      categoryId: number;
      subcategoryId: number;
    }) => removeSubcategoryFromCategory(categoryId, subcategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allcategories"] });
    },
  });

  const handleDeleteCategory = (categoryId: number) => {
    console.log("-->", categoryId);
    toast.info("Only Super Admin Can Delete!!!");
    //deleteCategoryMutation.mutate(categoryId);
  };

  const handleRemoveSubCategory = (
    categoryId: number,
    subCategoryId: number
  ) => {
    removeSubcategoryMutation.mutate({
      categoryId,
      subcategoryId: subCategoryId,
    });
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Categories</h1>
        <AddEditCategory type="Add" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[120px]" />
                            <Skeleton className="h-3 w-[80px]" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[60px] rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : AllCategories?.map((category) => (
                    <React.Fragment key={category.id}>
                      <TableRow
                        className={
                          expanded === category.id ? "bg-muted/30" : undefined
                        }
                      >
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleRow(category.id)}
                          >
                            {expanded === category.id ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Folder className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {category.slug}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {category.description}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              category.isActive ? "default" : "secondary"
                            }
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <AddEditCategory
                              type="Edit"
                              initialCategory={category}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {expanded === category.id && (
                        <TableRow className="bg-muted/10 hover:bg-muted/20">
                          <TableCell />
                          <TableCell colSpan={5}>
                            <div className="py-3 px-4">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold">Subcategories</h3>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {category.subcategories?.length > 0 ? (
                                  category.subcategories.map((sub) => (
                                    <Badge
                                      key={sub.id}
                                      variant="secondary"
                                      className="text-xs py-1 px-2 flex items-center justify-between gap-1 w-fit"
                                    >
                                      <span>{sub.name}</span>
                                      <button
                                        onClick={() =>
                                          handleRemoveSubCategory(
                                            category.id,
                                            sub.id
                                          )
                                        }
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    No subcategories yet
                                  </p>
                                )}
                              </div>
                            </div>
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
};
