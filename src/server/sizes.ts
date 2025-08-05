"use server";

import { db } from "@/db/drizzle";
import {
  countrySizes,
  sizes,
  sizeTypes,
  subcategories,
} from "@/db/schema/category";
import { eq } from "drizzle-orm";

// Country-level size label
type CountrySize = {
  countryName: string;
  sizeLabel: string;
};

// Size entry with country variants
type Size = {
  sizeId: number;
  label: string;
  sizeNumber: number;
  countries: CountrySize[];
};

// Grouped by size type
type SizeTypeWithSizes = {
  sizeTypeId: number;
  sizeTypeName: string;
  sizes: Size[];
};

export const getAllSizeTypesList = async (): Promise<SizeTypeWithSizes[]> => {
  // Fetch size types and sizes, ordered
  const sizeData = await db
    .select({
      sizeTypeId: sizeTypes.id,
      sizeTypeName: sizeTypes.name,
      sizeId: sizes.id,
      label: sizes.name,
      sizeNumber: sizes.size_number,
    })
    .from(sizeTypes)
    .leftJoin(sizes, eq(sizes.size_type_id, sizeTypes.id))
    .orderBy(sizeTypes.id, sizes.id);

  // Fetch country-level sizes
  const allCountrySizes = await db
    .select({
      id: countrySizes.id,
      sizeId: countrySizes.size_id,
      countryName: countrySizes.country_name,
      sizeLabel: countrySizes.size_label,
    })
    .from(countrySizes);

  // Organize by sizeType
  const groupedMap = new Map<number, SizeTypeWithSizes>();

  for (const item of sizeData) {
    if (!groupedMap.has(item.sizeTypeId)) {
      groupedMap.set(item.sizeTypeId, {
        sizeTypeId: item.sizeTypeId,
        sizeTypeName: item.sizeTypeName,
        sizes: [],
      });
    }

    if (item.sizeId) {
      const countries = allCountrySizes
        .filter((cs) => cs.sizeId === item.sizeId)
        .map((cs) => ({
          countryName: cs.countryName,
          sizeLabel: cs.sizeLabel,
        }));

      groupedMap.get(item.sizeTypeId)?.sizes.push({
        sizeId: item.sizeId,
        label: item.label ?? "",
        sizeNumber: item.sizeNumber ?? 0,
        countries,
      });
    }
  }

  // Return array ordered by sizeTypeId and sizeId
  return Array.from(groupedMap.values()).map((group) => ({
    ...group,
    sizes: group.sizes.sort((a, b) => a.sizeId - b.sizeId),
  }));
};

export async function getSizesByOptions(subcategoryId: number) {
  // Step 1: Get size_type_id from subcategories
  const subcategory = await db
    .select({ sizeTypeId: subcategories.size_type_id })
    .from(subcategories)
    .where(eq(subcategories.id, subcategoryId))
    .limit(1);

  if (subcategory.length === 0 || subcategory[0].sizeTypeId === null) {
    return []; // Either subcategory not found or no size_type_id
  }

  const sizeTypeId = subcategory[0].sizeTypeId;

  // Step 2: Fetch sizes with the matching size_type_id
  const result = await db
    .select()
    .from(sizes)
    .where(eq(sizes.size_type_id, sizeTypeId))
    .orderBy(sizes.id);

  return result;
}
