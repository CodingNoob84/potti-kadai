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
import {
  CategoryFilter,
  ColorsFilter,
  GenderFilter,
  PriceFilter,
  RatingsFilter,
  SubCategoryFilter,
} from "@/components/website/products/filters-sidebar";
import { ProductLists } from "@/components/website/products/product-lists";
import { ChevronDown, ChevronUp, Filter, Grid, List } from "lucide-react";
import { useState } from "react";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedGenders, setSelectedGenders] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>(
    []
  );
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const [expandedSections, setExpandedSections] = useState({
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

  const FilterContent = () => {
    return (
      <div className="px-4  space-y-8">
        {/* Gender Filter */}
        <div className="border-b border-gray-100 pb-2">
          <button
            className="flex items-center justify-between w-full font-semibold text-base py-2"
            onClick={() => toggleSection("gender")}
          >
            <div className="flex items-center">
              Gender
              {selectedGenders.length > 0 && (
                <span className="ml-2 text-xs bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {selectedGenders.length}
                </span>
              )}
            </div>
            {expandedSections.gender ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {expandedSections.gender && (
            <div className="pl-1 pt-2">
              <GenderFilter
                selectedGenders={selectedGenders}
                setSelectedGenders={setSelectedGenders}
              />
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="border-b border-gray-100 pb-2">
          <button
            className="flex items-center justify-between w-full font-semibold text-base py-2"
            onClick={() => toggleSection("category")}
          >
            <div className="flex items-center">
              Category
              {selectedCategories.length > 0 && (
                <span className="ml-2 text-xs bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {selectedCategories.length}
                </span>
              )}
            </div>
            {expandedSections.category ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {expandedSections.category && (
            <div className="pl-1 pt-2">
              <CategoryFilter
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            </div>
          )}
        </div>

        {/* SubCategory Filter */}
        {selectedCategories.length > 0 && (
          <div className="border-b border-gray-100 pb-2">
            <button
              className="flex items-center justify-between w-full font-semibold text-base py-2"
              onClick={() => toggleSection("subCategory")}
            >
              <div className="flex items-center">
                Subcategory
                {selectedSubCategories.length > 0 && (
                  <span className="ml-2 text-xs bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center">
                    {selectedSubCategories.length}
                  </span>
                )}
              </div>
              {expandedSections.subCategory ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {expandedSections.subCategory && (
              <div className="pl-1 pt-2">
                <SubCategoryFilter
                  selectedCategories={selectedCategories}
                  selectedSubCategories={selectedSubCategories}
                  setSelectedSubCategories={setSelectedSubCategories}
                />
              </div>
            )}
          </div>
        )}

        <div className="border-b border-gray-100 pb-2">
          <button
            className="flex items-center justify-between w-full font-semibold text-base py-2"
            onClick={() => toggleSection("colors")}
          >
            <div className="flex items-center">
              Colors
              {selectedColors.length > 0 && (
                <span className="ml-2 text-xs bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {selectedColors.length}
                </span>
              )}
            </div>
            {expandedSections.colors ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {expandedSections.colors && (
            <div className="pl-1 pt-2">
              <ColorsFilter
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
              />
            </div>
          )}
        </div>
        {/* Quick Price Filters */}
        <div className="border-b border-gray-100 pb-2">
          <button
            className="flex items-center justify-between w-full font-semibold text-base py-2"
            onClick={() => toggleSection("priceFilters")}
          >
            <div>Price Filters</div>
            {expandedSections.priceFilters ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {expandedSections.priceFilters && (
            <div className="pl-1 pt-2">
              <PriceFilter
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
          )}
        </div>

        <div className="border-b border-gray-100 pb-2">
          <button
            className="flex items-center justify-between w-full font-semibold text-base py-2"
            onClick={() => toggleSection("ratings")}
          >
            <div className="flex items-center">
              Ratings
              {selectedRatings.length > 0 && (
                <span className="ml-2 text-xs bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {selectedRatings.length}
                </span>
              )}
            </div>
            {expandedSections.ratings ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {expandedSections.ratings && (
            <div className="pl-1 pt-2 space-y-3">
              <RatingsFilter
                selectedRatings={selectedRatings}
                setSelectedRatings={setSelectedRatings}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          {/* <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p> */}
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
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="">
                <FilterContent />
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
              <FilterContent />
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
}
