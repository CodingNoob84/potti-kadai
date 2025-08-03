import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  getAllCategorieList,
  getAllGenders,
  getSubCategoriesWithCategory,
} from "@/server/categories";
import { getColorsUsedInVariants } from "@/server/products";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";

type GenderFilterProps = {
  selectedGenders: number[];
  setSelectedGenders: (genderIds: number[]) => void;
};

export const GenderFilter = ({
  selectedGenders,
  setSelectedGenders,
}: GenderFilterProps) => {
  const { data: genders, isLoading } = useQuery({
    queryKey: ["all-genders"],
    queryFn: getAllGenders,
  });

  const handleGenderChange = (genderId: number, checked: boolean) => {
    if (checked) {
      setSelectedGenders([...selectedGenders, genderId]);
    } else {
      setSelectedGenders(selectedGenders.filter((id) => id !== genderId));
    }
  };

  // Skeleton loader
  if (isLoading) {
    return (
      <div>
        <div className="space-y-3 pl-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-5 w-5 border-2 border-gray-300 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3 pl-1">
        {genders?.map((gender) => (
          <div key={gender.id} className="flex items-center space-x-3">
            <Checkbox
              id={gender.id.toString()}
              checked={selectedGenders.includes(gender.id)}
              onCheckedChange={(checked: boolean) =>
                handleGenderChange(gender.id, checked)
              }
              className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:border-primary"
            />
            <Label
              htmlFor={gender.id.toString()}
              className="capitalize text-sm font-medium text-gray-700"
            >
              {gender.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CategoryFilter = ({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: number[];
  setSelectedCategories: (categoryIds: number[]) => void;
}) => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["all-categories"],
    queryFn: getAllCategorieList,
  });

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== categoryId));
    }
  };
  if (isLoading) {
    return (
      <div>
        <div className="space-y-3 pl-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-5 w-5 border-2 border-gray-300 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="space-y-3 pl-1">
        {categories &&
          categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={category.id.toString()}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked: boolean) =>
                  handleCategoryChange(category.id, checked as boolean)
                }
                className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={category.id.toString()}
                className="capitalize text-sm font-medium text-gray-700"
              >
                {category.name.replace(/([A-Z])/g, " $1").trim()}
              </Label>
            </div>
          ))}
      </div>
    </div>
  );
};

export const SubCategoryFilter = ({
  selectedCategories,
  selectedSubCategories,
  setSelectedSubCategories,
}: {
  selectedCategories: number[];
  selectedSubCategories: number[];
  setSelectedSubCategories: (subcategoryIds: number[]) => void;
}) => {
  const { data: subcategories, isLoading } = useQuery({
    queryKey: ["all-subcategories"],
    queryFn: getSubCategoriesWithCategory,
  });

  const handleSubCategoryChange = (subcategoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedSubCategories([...selectedSubCategories, subcategoryId]);
    } else {
      setSelectedSubCategories(
        selectedSubCategories.filter((id) => id !== subcategoryId)
      );
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="space-y-3 pl-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-5 w-5 border-2 border-gray-300 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filter subcategories based on selected category IDs
  const filteredSubcategories = (subcategories ?? []).filter(
    (subcategory) =>
      selectedCategories.length === 0 ||
      subcategory.categories.some((cat) => selectedCategories.includes(cat.id))
  );

  return (
    <div>
      <div className="space-y-3 pl-1">
        {filteredSubcategories.map((subcategory) => (
          <div key={subcategory.id} className="flex items-center space-x-3">
            <Checkbox
              id={subcategory.id.toString()}
              checked={selectedSubCategories.includes(subcategory.id)}
              onCheckedChange={(checked: boolean) =>
                handleSubCategoryChange(subcategory.id, checked as boolean)
              }
              className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:border-primary"
            />
            <Label
              htmlFor={subcategory.id.toString()}
              className="capitalize text-sm font-medium text-gray-700"
            >
              {subcategory.name.replace(/([A-Z])/g, " $1").trim()}
            </Label>
          </div>
        ))}
        {filteredSubcategories.length === 0 && (
          <p className="text-sm text-gray-500">No subcategories available.</p>
        )}
      </div>
    </div>
  );
};

export const ColorsFilter = ({
  selectedColors,
  setSelectedColors,
}: {
  selectedColors: number[];
  setSelectedColors: (colorIds: number[]) => void;
}) => {
  const { data: colors, isLoading } = useQuery({
    queryKey: ["all-colors"],
    queryFn: getColorsUsedInVariants,
  });

  const handleColorChange = (colorId: number, checked: boolean) => {
    if (checked) {
      setSelectedColors([...selectedColors, colorId]);
    } else {
      setSelectedColors(selectedColors.filter((c) => c !== colorId));
    }
  };
  if (isLoading) {
    return (
      <div>
        <div className="space-y-3 pl-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-5 w-5 border-2 border-gray-300 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="space-y-3 pl-1">
        {colors &&
          colors.map((color) => (
            <div key={color.id} className="flex items-center space-x-3">
              <Checkbox
                id={color.id.toString()}
                checked={selectedColors.includes(color.id)}
                onCheckedChange={(checked: boolean) =>
                  handleColorChange(color.id, checked as boolean)
                }
                className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={color.id.toString()}
                className="capitalize text-sm font-medium text-gray-700"
              >
                {color.name}
              </Label>
            </div>
          ))}
      </div>
    </div>
  );
};

type PriceRange = [number, number];

export const PriceFilter = ({
  priceRange,
  setPriceRange,
}: {
  priceRange: PriceRange;
  setPriceRange: (prices: PriceRange) => void;
}) => {
  const DEFAULT_RANGE: PriceRange = [0, 5000];

  const PRICE_FILTER_OPTIONS = [
    { label: "Under ₹100", value: [0, 100] as PriceRange },
    { label: "₹100-₹300", value: [100, 300] as PriceRange },
    { label: "₹300-₹500", value: [300, 500] as PriceRange },
    { label: "Above ₹500", value: [500, 5000] as PriceRange },
  ];

  const isOptionSelected = (optionRange: PriceRange) => {
    return priceRange[0] === optionRange[0] && priceRange[1] === optionRange[1];
  };

  const isFilterActive = !(
    priceRange[0] === DEFAULT_RANGE[0] && priceRange[1] === DEFAULT_RANGE[1]
  );

  return (
    <div className="grid grid-cols-1 gap-2">
      {PRICE_FILTER_OPTIONS.map((option) => (
        <Button
          key={option.label}
          variant={isOptionSelected(option.value) ? "default" : "outline"}
          size="sm"
          className="h-9 text-xs sm:text-sm justify-start"
          onClick={() => setPriceRange(option.value)}
        >
          {option.label}
        </Button>
      ))}

      {isFilterActive && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs sm:text-sm justify-start text-red-500"
          onClick={() => setPriceRange(DEFAULT_RANGE)}
        >
          Remove Filter
        </Button>
      )}
    </div>
  );
};

export const RatingsFilter = ({
  selectedRatings,
  setSelectedRatings,
}: {
  selectedRatings: number[];
  setSelectedRatings: (ratings: number[]) => void;
}) => {
  const RATING_OPTIONS = [4, 3, 2, 1] as const;

  const handleChange = (rating: number, checked: boolean) => {
    if (checked) {
      // Select this rating and all above
      const newRatings = RATING_OPTIONS.filter((r) => r >= rating);
      setSelectedRatings(newRatings);
    } else {
      // Uncheck this rating and all below
      const newRatings = selectedRatings.filter((r) => r > rating);
      setSelectedRatings(newRatings);
    }
  };

  return (
    <div className="space-y-3">
      {RATING_OPTIONS.map((rating) => (
        <div key={rating} className="flex items-center space-x-2">
          <Checkbox
            id={`rating-${rating}`}
            checked={selectedRatings.includes(rating)}
            onCheckedChange={(checked) =>
              handleChange(rating, checked as boolean)
            }
            className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:border-primary"
          />
          <Label
            htmlFor={`rating-${rating}`}
            className="flex items-center text-sm font-medium text-gray-700 cursor-pointer"
          >
            {[...Array(rating)].map((_, i) => (
              <Star key={`filled-${i}`} className="w-4 h-4 text-yellow-400" />
            ))}
            {[...Array(5 - rating)].map((_, i) => (
              <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
            ))}
            <span className="ml-1">& up</span>
          </Label>
        </div>
      ))}
    </div>
  );
};
