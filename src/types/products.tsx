export type DefaultsizeTypes = {
  id: number;
  name: string;
  sizenumber: number | null;
  indiaSize: string | null;
  usSize: string | null;
  euSize: string | null;
  ukSize: string | null;
  typeId: number | null;
};

export type colorsTypes = {
  id: number;
  name: string;
  color_code: string;
  is_active: boolean;
};

export type DiscountType = {
  discountId: number;
  name: string;
  type: string;
  value: number;
  minQuantity: number;
  applyTo: string;
  categoryIds: number[];
  subcategoryIds: number[];
  productIds: number[];
};

export type trendingProductType = {
  id: number;
  name: string;
  price: number;
  images: string[]; // all image URLs
  discount: DiscountType | null; // typically one, but as array
};
