"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterContent } from "@/components/website/products/filter-content";
import { ProductLists } from "@/components/website/products/product-lists";
import { Filter, Grid, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export type ExpandedSections = {
  gender: boolean;
  category: boolean;
  subCategory: boolean;
  colors: boolean;
  priceFilters: boolean;
  ratings: boolean;
};

export const ProductsClientPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (searchParams.get("viewMode") as "grid" | "list") || "grid"
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "featured"
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("priceMin") || 0),
    Number(searchParams.get("priceMax") || 5000),
  ]);
  const [selectedGenders, setSelectedGenders] = useState<number[]>(
    searchParams.get("gender")?.split(",").map(Number) || []
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    searchParams.get("category")?.split(",").map(Number) || []
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>(
    searchParams.get("subcategory")?.split(",").map(Number) || []
  );
  const [selectedColors, setSelectedColors] = useState<number[]>(
    searchParams.get("colors")?.split(",").map(Number) || []
  );
  const [selectedRatings, setSelectedRatings] = useState<number[]>(
    searchParams.get("ratings")?.split(",").map(Number) || []
  );
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    gender: true,
    category: true,
    subCategory: true,
    colors: true,
    priceFilters: true,
    ratings: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const params = new URLSearchParams();

    if (viewMode !== "grid") params.set("viewMode", viewMode);
    if (sortBy !== "featured") params.set("sortBy", sortBy);

    if (priceRange[0] !== 0) params.set("priceMin", String(priceRange[0]));
    if (priceRange[1] !== 5000) params.set("priceMax", String(priceRange[1]));

    if (selectedGenders.length) params.set("gender", selectedGenders.join(","));
    if (selectedCategories.length)
      params.set("category", selectedCategories.join(","));
    if (selectedSubCategories.length)
      params.set("subcategory", selectedSubCategories.join(","));
    if (selectedColors.length) params.set("colors", selectedColors.join(","));
    if (selectedRatings.length)
      params.set("ratings", selectedRatings.join(","));

    router.replace(`?${params.toString()}`);
  }, [
    viewMode,
    sortBy,
    priceRange,
    selectedGenders,
    selectedCategories,
    selectedSubCategories,
    selectedColors,
    selectedRatings,
    router,
  ]);

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden bg-transparent"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader className="p-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto h-[calc(100vh-4rem)] p-4">
                <FilterContent
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  selectedGenders={selectedGenders}
                  setSelectedGenders={setSelectedGenders}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedSubCategories={selectedSubCategories}
                  setSelectedSubCategories={setSelectedSubCategories}
                  selectedColors={selectedColors}
                  setSelectedColors={setSelectedColors}
                  selectedRatings={selectedRatings}
                  setSelectedRatings={setSelectedRatings}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Desktop Filters */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="px-6 py-1">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              <hr className="border-t border-primary my-4" />
              <FilterContent
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                selectedGenders={selectedGenders}
                setSelectedGenders={setSelectedGenders}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedSubCategories={selectedSubCategories}
                setSelectedSubCategories={setSelectedSubCategories}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                selectedRatings={selectedRatings}
                setSelectedRatings={setSelectedRatings}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <ProductLists
          viewMode={viewMode}
          genderIds={selectedGenders}
          categoryIds={selectedCategories}
          subcategoryIds={selectedSubCategories}
          colorIds={selectedColors}
          priceAbove={priceRange[0]}
          priceBelow={priceRange[1]}
        />
      </div>
    </div>
  );
};
