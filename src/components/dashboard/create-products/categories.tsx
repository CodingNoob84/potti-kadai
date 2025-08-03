"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { productCreateType } from "@/form-schemas/product";
import { getAllCategoriesWithSubcategories } from "@/server/categories";

import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  subcategories: {
    id: number;
    name: string;
    is_active: boolean;
  }[];
};

type AddCategoriesBlockProps = {
  form: UseFormReturn<productCreateType>;
};

export const AddCategoriesBlock = ({ form }: AddCategoriesBlockProps) => {
  const { data: allCategories = [], isLoading } = useQuery({
    queryFn: getAllCategoriesWithSubcategories,
    queryKey: ["allcategories"],
  });

  const { control, watch, setValue } = form;

  const category = watch("category");

  const handleCategoryChange = (value: number) => {
    setValue("category", value, { shouldValidate: true });
    setValue("subcategory", 0, { shouldValidate: true });
  };

  const selectedCategory = allCategories.find(
    (cat: Category) => cat.id === category
  );

  const hasSubcategories = (selectedCategory?.subcategories?.length ?? 0) > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          {/* Category Select with Skeleton */}
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    onValueChange={(value) => {
                      const numericValue = parseInt(value);
                      field.onChange(numericValue);
                      handleCategoryChange(numericValue);
                    }}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="text-muted-foreground">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"0"}>Select category</SelectItem>
                      {allCategories.map((category: Category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subcategory Select with Skeleton */}
          <FormField
            control={control}
            name="subcategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={!category || !hasSubcategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"0"}>
                        {hasSubcategories
                          ? "Select subcategory"
                          : "No subcategories available"}
                      </SelectItem>
                      {hasSubcategories &&
                        selectedCategory?.subcategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id.toString()}>
                            {sub.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Type Select for clothing-related categories */}
        {/* {selectedCategory?.name.toLowerCase().includes("clothing") && (
          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-muted-foreground">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="upper">Upper</SelectItem>
                    <SelectItem value="lower">Lower</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )} */}

        {/* Tags Section */}
        {/* <FormField
          control={control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                </>
              )}
            </FormItem>
          )}
        /> */}
      </CardContent>
    </Card>
  );
};
