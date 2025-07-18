"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteSubCategory,
  getSubCategoriesWithCategory,
} from "@/server/categories";
import { FromSubCategoryType } from "@/types/categories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AddEditSubCategory } from "./add-edit-subcategories";

export const SubCategoriesBlock = () => {
  const queryClient = useQueryClient();
  const { data: AllSubCategories, isLoading } = useQuery({
    queryKey: ["all-subcategories"],
    queryFn: getSubCategoriesWithCategory,
  });
  console.log("data", AllSubCategories);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Alphabet filters
  const alphabetFilters = useMemo(() => {
    const letters = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
    return [
      { name: "A-F", letters: letters.slice(0, 6) },
      { name: "G-M", letters: letters.slice(6, 13) },
      { name: "N-R", letters: letters.slice(13, 18) },
      { name: "S-Z", letters: letters.slice(18, 26) },
    ];
  }, []);

  // Filter subcategories
  const filteredSubcategories = useMemo(() => {
    if (!activeFilter) return AllSubCategories;

    const filterGroup = alphabetFilters.find((f) => f.name === activeFilter);
    if (!filterGroup) return AllSubCategories;

    return AllSubCategories?.filter((subcat) =>
      filterGroup.letters.includes(subcat.name.charAt(0).toUpperCase())
    );
  }, [AllSubCategories, activeFilter, alphabetFilters]);

  // Group by first letter
  const groupedSubcategories = useMemo(() => {
    return filteredSubcategories?.reduce(
      (acc: Record<string, FromSubCategoryType[]>, subcat) => {
        const firstLetter = subcat.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(subcat);
        return acc;
      },
      {}
    );
  }, [filteredSubcategories]);

  const deleteSubCategoryMutation = useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-subcategories"] });
    },
  });

  const handleDeleteSubcategory = (id: number) => {
    deleteSubCategoryMutation.mutate(id);
  };
  if (isLoading) {
    return <SubCategoriesBlockSkeleton />;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Product Subcategories
            </h2>
            <p className="text-sm text-muted-foreground">
              {AllSubCategories?.length} subcategories across all categories
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!activeFilter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(null)}
              >
                All
              </Button>
              {alphabetFilters.map((filter) => (
                <Button
                  key={filter.name}
                  variant={activeFilter === filter.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.name)}
                >
                  {filter.name}
                </Button>
              ))}
            </div>

            {/* Add Subcategory Dialog */}
            <AddEditSubCategory type="Add" />
          </div>
        </div>

        {filteredSubcategories?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <div className="bg-muted p-4 rounded-full">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No subcategories found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {activeFilter
                ? `No subcategories starting with ${activeFilter}`
                : "No subcategories available. Create one to get started."}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedSubcategories &&
              Object.entries(groupedSubcategories)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([letter, subcats]) => (
                  <div key={letter} className="space-y-4">
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary">
                          {letter}
                        </span>
                        <div className="h-px bg-border flex-1" />
                        <span className="text-sm text-muted-foreground">
                          {subcats.length}{" "}
                          {subcats.length === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {subcats.map((subcat) => (
                        <div
                          key={subcat.id}
                          className="group relative border rounded-lg p-4 hover:border-primary/30 transition-colors bg-card shadow-sm hover:shadow-md"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="space-y-2 flex-1">
                              <h3 className="font-semibold text-lg flex items-center gap-2 truncate">
                                <span className="w-6 h-6 flex items-center justify-center bg-primary/10 text-primary rounded-full text-sm shrink-0">
                                  {subcat.name.charAt(0)}
                                </span>
                                <span className="truncate">{subcat.name}</span>
                              </h3>

                              <div className="flex flex-wrap gap-1">
                                {subcat.categories?.map((category) => (
                                  <span
                                    key={category.id}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                                  >
                                    {category.name}
                                  </span>
                                ))}
                                {(!subcat.categories ||
                                  subcat.categories.length === 0) && (
                                  <span className="text-xs text-muted-foreground italic">
                                    No categories assigned
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-sm">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    subcat.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {subcat.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                              <AddEditSubCategory
                                type="Edit"
                                initialSubCategory={subcat || []}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                onClick={() =>
                                  handleDeleteSubcategory(subcat.id)
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const SubCategoriesBlockSkeleton = () => {
  // Mock alphabet groups for skeleton
  const alphabetGroups = ["A-F", "G-M", "N-R", "S-Z"];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Filter buttons skeleton */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-12 rounded-md" />
            {alphabetGroups.map((group) => (
              <Skeleton key={group} className="h-9 w-12 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-8">
        {alphabetGroups.map((group) => (
          <div key={group} className="space-y-4">
            {/* Letter header skeleton */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div className="h-px bg-border flex-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            {/* Subcategory cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-card shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Skeleton className="h-4 w-16 rounded-full" />
                        <Skeleton className="h-4 w-12 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-12 rounded-full" />
                    </div>
                    <div className="flex space-x-1">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
