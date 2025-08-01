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

export type SizeType = "clothing" | "footwear";

export interface Size {
  id: number;
  name: string;
  sizenumber: number | null;
  indiaSize: string | null;
  usSize: string | null;
  euSize: string | null;
  ukSize: string | null;
  // type: string | null;
  // categoryId: number | null;
  // categoryName: string;
}

export interface AddSizeInput {
  name: string;
  type: SizeType;
  ukSize?: string;
  usSize?: string;
  euSize?: string;
  indiaSize?: string;
}

export interface UpdateSizeInput extends AddSizeInput {
  id: number;
}
