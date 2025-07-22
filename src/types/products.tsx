export type DefaultsizeTypes = {
  id: number;
  name: string;
  shortform: string;
  isActive: boolean;
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

export type trendingProductType = {
  id: number;
  name: string;
  price: number;
  image: string | null;
  discountType: string | null;
  discountValue: number | null;
  discountMinQ: number | null;
};
