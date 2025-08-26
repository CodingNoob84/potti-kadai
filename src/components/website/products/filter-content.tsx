"use client";

import {
  CategoryFilter,
  ColorsFilter,
  GenderFilter,
  PriceFilter,
  RatingsFilter,
  SubCategoryFilter,
} from "@/components/website/products/filters-sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { ExpandedSections } from "./product-client-page";

interface FilterContentProps {
  expandedSections: ExpandedSections;
  toggleSection: (section: keyof ExpandedSections) => void;

  selectedGenders: number[];
  setSelectedGenders: React.Dispatch<React.SetStateAction<number[]>>;

  selectedCategories: number[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>;

  selectedSubCategories: number[];
  setSelectedSubCategories: React.Dispatch<React.SetStateAction<number[]>>;

  selectedColors: number[];
  setSelectedColors: React.Dispatch<React.SetStateAction<number[]>>;

  selectedRatings: number[];
  setSelectedRatings: React.Dispatch<React.SetStateAction<number[]>>;

  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
}

function FilterContentComponent({
  expandedSections,
  toggleSection,
  selectedGenders,
  setSelectedGenders,
  selectedCategories,
  setSelectedCategories,
  selectedSubCategories,
  setSelectedSubCategories,
  selectedColors,
  setSelectedColors,
  selectedRatings,
  setSelectedRatings,
  priceRange,
  setPriceRange,
}: FilterContentProps) {
  return (
    <div className="px-4">
      {/* Gender */}
      <div className="border-b border-gray-100 pb-1">
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

      {/* Category */}
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

      {/* SubCategory */}
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

      {/* Colors */}
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

      {/* Price */}
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

      {/* Ratings */}
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
}

export const FilterContent = React.memo(FilterContentComponent);
