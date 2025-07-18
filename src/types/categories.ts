export type SubCategoryType = {
  id: number;
  name: string;
  isActive: boolean;
};

export type CategoryType = {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
};

export type FromCategoryType = CategoryType & {
  subcategories: SubCategoryType[];
};

export type FromSubCategoryType = SubCategoryType & {
  categories: CategoryType[];
};
