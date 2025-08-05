// src/components/category-search.tsx
"use client";

import { getAllCategorieList } from "@/server/categories";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { SearchBox } from "./search-box";

type CategoryType = {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
};

type CategorySearchProps = {
  field: ControllerRenderProps<FieldValues["categoryIds"], string>;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export const CategorySearch = ({
  field,
  disabled,
  className,
  placeholder = "Search categories...",
}: CategorySearchProps) => {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
    []
  );

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", query],
    queryFn: () => getAllCategorieList(),
  });

  useEffect(() => {
    if (field.value && field.value.length > 0) {
      const fetchInitialCategories = async () => {
        const initialCategories = await getAllCategorieList();
        const matchedCategories = initialCategories.filter((cat) =>
          field.value?.includes(cat.id)
        );
        setSelectedCategories(matchedCategories);
      };
      fetchInitialCategories();
    }
  }, [field.value]);

  const handleSelect = (category: CategoryType) => {
    const newSelected = [...selectedCategories, category];
    setSelectedCategories(newSelected);
    field.onChange(newSelected.map((c) => c.id));
    setQuery("");
  };

  const handleRemove = (id: number) => {
    const newSelected = selectedCategories.filter((c) => c.id !== id);
    setSelectedCategories(newSelected);
    field.onChange(newSelected.map((c) => c.id));
  };

  return (
    <div className="space-y-2">
      <SearchBox<CategoryType>
        options={categories.filter(
          (c) => !selectedCategories.some((sc) => sc.id === c.id)
        )}
        placeholder={placeholder}
        onSearch={setQuery}
        onSelect={handleSelect}
        isLoading={isLoading}
        disabled={disabled}
        className={className}
        renderOption={(category) => (
          <div className="flex flex-col">
            <span>{category.name}</span>
            {category.description && (
              <span className="text-xs text-muted-foreground">
                {category.description}
              </span>
            )}
          </div>
        )}
      />

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {category.name}
              <button
                type="button"
                onClick={() => handleRemove(category.id)}
                className="text-gray-500 hover:text-red-500"
                disabled={disabled}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
