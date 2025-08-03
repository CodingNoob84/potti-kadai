// src/components/subcategory-search-box.tsx
"use client";

import { getAllSubCategorieListSearch } from "@/server/categories";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { SearchBox } from "./search-box";

type SubcategoryType = {
  id: number;
  name: string;
  is_active: boolean;
  size_type_id: number | null;
  created_at: Date | null;
  updated_at: Date | null;
};

type SubcategorySearchBoxProps = {
  field: ControllerRenderProps<FieldValues["subcategoryIds"], string>;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  categoryId?: number; // Optional filter by category
};

export const SubcategorySearchBox = ({
  field,
  disabled,
  className,
  placeholder = "Search subcategories...",
  categoryId,
}: SubcategorySearchBoxProps) => {
  const [query, setQuery] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<
    SubcategoryType[]
  >([]);

  const { data: subcategories = [], isLoading } = useQuery({
    queryKey: ["subcategories", query, categoryId],
    queryFn: () => getAllSubCategorieListSearch(query),
  });

  // Initialize selected subcategories from form values
  useEffect(() => {
    if (field.value && field.value.length > 0) {
      const fetchInitialSubcategories = async () => {
        const initialSubcategories = await getAllSubCategorieListSearch();
        const matchedSubcategories = initialSubcategories.filter((sub) =>
          field.value.includes(sub.id)
        );
        setSelectedSubcategories(matchedSubcategories);
      };
      fetchInitialSubcategories();
    }
  }, [field.value]);

  const handleSelect = (subcategory: SubcategoryType) => {
    const newSelected = [...selectedSubcategories, subcategory];
    setSelectedSubcategories(newSelected);
    field.onChange(newSelected.map((s) => s.id));
    setQuery("");
  };

  const handleRemove = (id: number) => {
    const newSelected = selectedSubcategories.filter((s) => s.id !== id);
    setSelectedSubcategories(newSelected);
    field.onChange(newSelected.map((s) => s.id));
  };

  return (
    <div className="space-y-2">
      <SearchBox<SubcategoryType>
        options={subcategories}
        placeholder={placeholder}
        onSearch={setQuery}
        onSelect={handleSelect}
        isLoading={isLoading}
        disabled={disabled}
        className={className}
        renderOption={(subcategory) => (
          <div className="flex flex-col">
            <span className="font-medium">{subcategory.name}</span>
          </div>
        )}
      />

      {/* Selected subcategories chips */}
      {selectedSubcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSubcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {subcategory.name}
              <button
                type="button"
                onClick={() => handleRemove(subcategory.id)}
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
