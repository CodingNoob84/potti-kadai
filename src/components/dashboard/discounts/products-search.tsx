// src/components/products-search-box.tsx
"use client";

import { getAllProductsBySearch } from "@/server/products"; // ✅ Replace with your actual import path
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { SearchBox } from "./search-box";

type ProductType = {
  id: number;
  name: string;
  price: number;
  category: string | null;
  subcategory: string | null;
};

type ProductsSearchBoxProps = {
  field: ControllerRenderProps<FieldValues["productIds"], string>;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export const ProductsSearchBox = ({
  field,
  disabled,
  className,
  placeholder = "Search products...",
}: ProductsSearchBoxProps) => {
  const [query, setQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", query],
    queryFn: () => getAllProductsBySearch(query),
  });

  // Load initial selected products based on form values
  useEffect(() => {
    if (field.value && field.value.length > 0) {
      const fetchInitialProducts = async () => {
        const all = await getAllProductsBySearch();
        const matched = all.filter((p) => field.value.includes(p.id));
        setSelectedProducts(matched);
      };
      fetchInitialProducts();
    }
  }, [field.value]);

  const handleSelect = (product: ProductType) => {
    const newSelected = [...selectedProducts, product];
    setSelectedProducts(newSelected);
    field.onChange(newSelected.map((p) => p.id));
    setQuery("");
  };

  const handleRemove = (id: number) => {
    const newSelected = selectedProducts.filter((p) => p.id !== id);
    setSelectedProducts(newSelected);
    field.onChange(newSelected.map((p) => p.id));
  };

  return (
    <div className="space-y-2">
      <SearchBox<ProductType>
        options={products}
        placeholder={placeholder}
        onSearch={setQuery}
        onSelect={handleSelect}
        isLoading={isLoading}
        disabled={disabled}
        className={className}
        renderOption={(product) => (
          <div className="w-full flex justify-between items-center">
            <span className="font-medium">{product.name}</span>
            <span className="text-sm text-gray-500">₹{product.price}</span>
          </div>
        )}
      />

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {product.name}
              <button
                type="button"
                onClick={() => handleRemove(product.id)}
                className="text-gray-500 hover:text-red-500"
                disabled={disabled}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
