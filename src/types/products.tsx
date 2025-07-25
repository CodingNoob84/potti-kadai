export type DefaultsizeTypes = {
  id: number;
  name: string;
  sizenumber: number | null;
  indiaSize: string | null;
  usSize: string | null;
  euSize: string | null;
  ukSize: string | null;
  type: string | null;
  categoryId: number | null;
};

export type colorsTypes = {
  id: number;
  name: string;
  colorCode: string;
  isActive: boolean;
};

export type sizeTypes = {
  quantity: number;
  name: string;
  sizeId: number;
};

export type inventoryType = {
  colorId: number;
  name: string;
  colorCode: string;
  sizes: sizeTypes[];
};

export type DiscountType = {
  type: string;
  value: number;
  minQuantity: number | null;
};

export type trendingProductType = {
  id: number;
  name: string;
  price: number;
  images: string[]; // all image URLs
  discount: DiscountType[]; // typically one, but as array
};
