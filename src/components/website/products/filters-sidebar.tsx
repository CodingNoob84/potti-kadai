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
import { motion } from "framer-motion";
import { Palette, Star, Tag, Tags, Users } from "lucide-react";

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
    <div className="space-y-3">
      {genders?.map((gender, index) => (
        <motion.div
          key={gender.id}
          className="flex items-center space-x-3 group"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Checkbox
            id={gender.id.toString()}
            checked={selectedGenders.includes(gender.id)}
            onCheckedChange={(checked: boolean) =>
              handleGenderChange(gender.id, checked)
            }
            className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary transition-all duration-200"
          />
          <Label
            htmlFor={gender.id.toString()}
            className="capitalize text-sm font-medium text-gray-700 group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
          >
            <Users className="h-4 w-4 opacity-60" />
            {gender.name}
          </Label>
        </motion.div>
      ))}
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
    <div className="space-y-3">
      {categories?.map((category, index) => (
        <motion.div
          key={category.id}
          className="flex items-center space-x-3 group"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Checkbox
            id={category.id.toString()}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={(checked: boolean) =>
              handleCategoryChange(category.id, checked as boolean)
            }
            className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary transition-all duration-200"
          />
          <Label
            htmlFor={category.id.toString()}
            className="capitalize text-sm font-medium text-gray-700 group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
          >
            <Tags className="h-4 w-4 opacity-60" />
            {category.name.replace(/([A-Z])/g, " $1").trim()}
          </Label>
        </motion.div>
      ))}
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
    <div className="space-y-3">
      {filteredSubcategories.map((subcategory, index) => (
        <motion.div
          key={subcategory.id}
          className="flex items-center space-x-3 group"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Checkbox
            id={subcategory.id.toString()}
            checked={selectedSubCategories.includes(subcategory.id)}
            onCheckedChange={(checked: boolean) =>
              handleSubCategoryChange(subcategory.id, checked as boolean)
            }
            className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary transition-all duration-200"
          />
          <Label
            htmlFor={subcategory.id.toString()}
            className="capitalize text-sm font-medium text-gray-700 group-hover:text-primary transition-colors cursor-pointer"
          >
            <Tag className="h-4 w-4 opacity-60" />
            {subcategory.name.replace(/([A-Z])/g, " $1").trim()}
          </Label>
        </motion.div>
      ))}
      {filteredSubcategories.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No subcategories available.
        </p>
      )}
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
    <div className="space-y-3">
      {colors?.map((color, index) => (
        <motion.div
          key={color.id}
          className="flex items-center space-x-3 group"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Checkbox
            id={color.id.toString()}
            checked={selectedColors.includes(color.id)}
            onCheckedChange={(checked: boolean) =>
              handleColorChange(color.id, checked as boolean)
            }
            className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary transition-all duration-200"
          />
          <Label
            htmlFor={color.id.toString()}
            className="capitalize text-sm font-medium text-gray-700 group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
          >
            <Palette className="h-4 w-4 opacity-60" />
            {color.name}
          </Label>
        </motion.div>
      ))}
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
    <div className="space-y-3">
      {PRICE_FILTER_OPTIONS.map((option, index) => (
        <motion.div
          key={option.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Button
            variant={isOptionSelected(option.value) ? "default" : "outline"}
            size="sm"
            className={`w-full h-10 text-sm justify-start transition-all duration-200 ${
              isOptionSelected(option.value)
                ? "bg-primary text-white shadow-md"
                : "hover:bg-primary/5 hover:border-primary/50"
            }`}
            onClick={() => setPriceRange(option.value)}
          >
            {option.label}
          </Button>
        </motion.div>
      ))}
      {isFilterActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full h-10 text-sm justify-start text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
            onClick={() => setPriceRange(DEFAULT_RANGE)}
          >
            Remove Filter
          </Button>
        </motion.div>
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
      {RATING_OPTIONS.map((rating, index) => (
        <motion.div
          key={rating}
          className="flex items-center space-x-3 group"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Checkbox
            id={`rating-${rating}`}
            checked={selectedRatings.includes(rating)}
            onCheckedChange={(checked) =>
              handleChange(rating, checked as boolean)
            }
            className="h-5 w-5 border-2 border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary transition-all duration-200"
          />
          <Label
            htmlFor={`rating-${rating}`}
            className="flex items-center text-sm font-medium text-gray-700 cursor-pointer group-hover:text-primary transition-colors"
          >
            <div className="flex items-center mr-2">
              {[...Array(rating)].map((_, i) => (
                <Star
                  key={`filled-${i}`}
                  className="w-4 h-4 text-yellow-400 fill-yellow-400"
                />
              ))}
              {[...Array(5 - rating)].map((_, i) => (
                <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
              ))}
            </div>
            <span className="text-gray-600">& up</span>
          </Label>
        </motion.div>
      ))}
    </div>
  );
};
