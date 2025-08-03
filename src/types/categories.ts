export type SubCategoryType = {
    id: number;
    name: string;
    is_active: boolean;

};

export type CategoryType = {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
};

export type FromCategoryType = CategoryType & {
  subcategories: SubCategoryType[];
};

export type FromSubCategoryType = SubCategoryType & {
  categories: Partial<CategoryType>[];
};

//id-1, name=Topwear, id-2, name=Bottomwear
export type SizeType = {
    id: number | null;
    name: string | null;
};

// id-1, country_name=IND, sizelabel=32
// id-2, country_name=EU, sizelable=36
// id-3, country_name=US, sizelabel=32
// id-4, country_name=UK, sizelabel=34
export type CountrySize={
    id: number;
    country_name: string;
    size_label: string;
}

//id-1, name=XS, size_number=86
export type Size ={
    id: number;
    name: string;
    size_number: number | null;
    size_type: SizeType;
    country_sizes: CountrySize[]
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
