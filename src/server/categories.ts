"use server";

import { db } from "@/db/drizzle";
import { categories, categorySubcategories, countrySizes, genders, sizes, sizeTypes, subcategories } from "@/db/schema/category";
import { FromCategoryType } from "@/types/categories";
import { and, asc, eq, ilike } from "drizzle-orm";

export async function getAllCategoriesWithSubcategories() {
  const categorySubcatData = await db
    .select({
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryDesc: categories.description,
      categoryIsActive:categories.is_active,
      subcategoryId: subcategories.id,
      subcategoryName: subcategories.name,
      subcatIsActive:subcategories.is_active
    })
    .from(categories)
    .leftJoin(categorySubcategories, eq(categories.id, categorySubcategories.category_id))
    .leftJoin(subcategories, eq(categorySubcategories.subcategory_id, subcategories.id));

  // Group by category
  const result = Object.values(
    categorySubcatData.reduce((acc, row) => {
      const catId = row.categoryId;
      if (!acc[catId]) {
        acc[catId] = {
          id: row.categoryId,
          name: row.categoryName,
          slug: row.categorySlug,
          description: row.categoryDesc,
          is_active:row.categoryIsActive,
          subcategories: [],
        };
      }

      if (row.subcategoryId) {
        acc[catId].subcategories.push({
          id: row.subcategoryId,
          name: row.subcategoryName ?? '',
          is_active:row.subcatIsActive ?? false
        });
      }

      return acc;
    }, {} as Record<number, {
      id: number;
      name: string;
      slug: string;
      description: string;
      is_active:boolean;
      subcategories: { id: number; name: string, is_active:boolean }[];
    }>)
  );

  return result;
}

type CategoryType={
  id: number;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    created_at: Date | null;
    updated_at: Date | null;
}

export const getAllCategorieList = async (): Promise<CategoryType[]> => {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.is_active, true))
    .orderBy(asc(categories.name));

  return result;
};





export const getAllSubCategorieList = async () => {
  const result = await db
    .select()
    .from(subcategories)
    .where(eq(subcategories.is_active, true))
    .orderBy(asc(subcategories.name));

  return result;
};

export const getAllSubCategorieListSearch = async (searchTerm?: string) => {
  const conditions = [eq(subcategories.is_active, true)];

  if (searchTerm) {
    conditions.push(ilike(subcategories.name, `%${searchTerm}%`));
  }

  const result = await db
    .select()
    .from(subcategories)
    .where(and(...conditions))
    .orderBy(asc(subcategories.name));

  return result;
};


export const createOrUpdateCategory = async (input: FromCategoryType) => {
  let categoryId = input.id;

  if (categoryId) {
    // 🟡 UPDATE category
    await db
      .update(categories)
      .set({
        name: input.name,
        slug: input.slug,
        description: input.description ?? "",
        is_active: input.is_active ?? true,
        updated_at: new Date(),
      })
      .where(eq(categories.id, categoryId));

    // 🧹 Clean up old links
    await db
      .delete(categorySubcategories)
      .where(eq(categorySubcategories.category_id, categoryId));
  } else {
    // 🟢 INSERT new category
    const inserted = await db
      .insert(categories)
      .values({
        name: input.name,
        slug: input.slug,
        description: input.description ?? "",
        is_active: input.is_active ?? true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning({ id: categories.id });

    categoryId = inserted[0]?.id;
  }

  // 🔗 Re-link subcategories
  if (input.subcategories?.length && categoryId) {
    await db.insert(categorySubcategories).values(
      input.subcategories.map((sub) => ({
        category_id: categoryId!,
        subcategory_id: sub.id,
      }))
    );
  }

  return { result: "Success", categoryId };
};

export const deleteCategory = async (categoryId: number) => {
  // Clean up subcategory relations
  await db
    .delete(categorySubcategories)
    .where(eq(categorySubcategories.category_id, categoryId));

  // Delete the category
  await db.delete(categories).where(eq(categories.id, categoryId));

  return { result: "Category deleted", categoryId };
};


export const removeSubcategoryFromCategory = async (
  categoryId: number,
  subcategoryId: number
) => {
  await db
    .delete(categorySubcategories)
    .where(
      and(
        eq(categorySubcategories.category_id, categoryId),
        eq(categorySubcategories.subcategory_id, subcategoryId)
      )
    );

  return {
    result: "Subcategory removed from category",
    categoryId,
    subcategoryId,
  };
};



export const getSubCategoriesWithCategory = async () => {
  const rows = await db
    .select({
      subcategoryId: subcategories.id,
      subcategoryName: subcategories.name,
      subcategoryIsActive: subcategories.is_active,
      categoryId: categories.id,
      categoryName: categories.name,
      categoryIsActive: categories.is_active
    })
    .from(subcategories)
    .leftJoin(categorySubcategories, eq(subcategories.id, categorySubcategories.subcategory_id))
    .leftJoin(categories, eq(categorySubcategories.category_id, categories.id));

  // Group by subcategory
  const grouped = Object.values(
    rows.reduce((acc, row) => {
      const sid = row.subcategoryId;
      if (!acc[sid]) {
        acc[sid] = {
          id: sid,
          name: row.subcategoryName,
          is_active:row.subcategoryIsActive ?? false,
          categories: [],
        };
      }
      if (row.categoryId) {
        acc[sid].categories.push({
          id: row.categoryId,
          name: row.categoryName ?? '',
          is_active:row.categoryIsActive ?? false
        });
      }
      return acc;
    }, {} as Record<number, { id: number; name: string; is_active:boolean; categories: { id: number; name: string; is_active:boolean; }[] }>)
  );

  return grouped;
};

export const getSubCategoriesWithOptions = async () => {
  const rows = await db
    .select({
      subcategoryId: subcategories.id,
      subcategoryName: subcategories.name,
      subcategoryIsActive: subcategories.is_active,
      categoryId: categories.id,
      categoryName: categories.name,
      categoryIsActive: categories.is_active,
      sizeTypeId: sizeTypes.id,
      sizeTypeName: sizeTypes.name,
    })
    .from(subcategories)
    .leftJoin(categorySubcategories, eq(subcategories.id, categorySubcategories.subcategory_id))
    .leftJoin(categories, eq(categorySubcategories.category_id, categories.id))
    .leftJoin(sizeTypes, eq(subcategories.size_type_id, sizeTypes.id));

  const grouped = Object.values(
    rows.reduce((acc, row) => {
      const sid = row.subcategoryId;
      if (!acc[sid]) {
        acc[sid] = {
          id: sid,
          name: row.subcategoryName,
          is_active: row.subcategoryIsActive ?? false,
          size_type_id: row.sizeTypeId ?? 0,
          size_type_name: row.sizeTypeName ?? '',
          categories: [],
        };
      }

      if (row.categoryId) {
        acc[sid].categories.push({
          id: row.categoryId,
          name: row.categoryName ?? '',
          is_active: row.categoryIsActive ?? false,
        });
      }

      

      return acc;
    }, {} as Record<
      number,
      {
        id: number;
        name: string;
        is_active: boolean;
        size_type_id: number;
        size_type_name: string;
        categories: { id: number; name: string; is_active: boolean }[];
      }
    >)
  );

  return grouped;
};


export const getSubCategoriesByCategoryId = async (categoryId: number) => {
  const rows = await db
    .select({
      id: subcategories.id,
      name: subcategories.name,
    })
    .from(subcategories)
    .innerJoin(categorySubcategories, eq(subcategories.id, categorySubcategories.subcategory_id))
    .where(eq(categorySubcategories.category_id, categoryId));

  return rows;
};



type SubcategoryInput = {
  id?: number;
  name: string;
  is_active?: boolean;
  size_type_id:number;
  categories?: { id: number }[];
};

export const createOrUpdateSubCategory = async (input: SubcategoryInput) => {
  let subcategoryId = input.id;

  if (subcategoryId) {
    // 🟡 Update
    await db
      .update(subcategories)
      .set({
        name: input.name,
        is_active: input.is_active ?? true,
        size_type_id: input.size_type_id,
        updated_at: new Date(),
      })
      .where(eq(subcategories.id, subcategoryId));

    // 🧹 Remove old links
    await db
      .delete(categorySubcategories)
      .where(eq(categorySubcategories.subcategory_id, subcategoryId));
  } else {
    // 🟢 Insert
    const inserted = await db
      .insert(subcategories)
      .values({
        name: input.name,
        is_active: input.is_active ?? true,
        size_type_id: input.size_type_id,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning({ id: subcategories.id });

    subcategoryId = inserted[0]?.id;
  }

  // 🔗 Re-link to categories
  if (input.categories?.length && subcategoryId) {
    await db.insert(categorySubcategories).values(
      input.categories.map((cat) => ({
        subcategory_id: subcategoryId!,
        category_id: cat.id,
      }))
    );
  }

  return { result: "Success", subcategoryId };
};


export const deleteSubCategory = async (subcategoryId: number) => {
  // Remove links from category_subcategories
  await db
    .delete(categorySubcategories)
    .where(eq(categorySubcategories.subcategory_id, subcategoryId));

  // Delete subcategory
  await db.delete(subcategories).where(eq(subcategories.id, subcategoryId));

  return { result: "Subcategory deleted", subcategoryId };
};



export const getAllSizes = async () => {
  // Step 1: Fetch all sizes with their type
  const sizeData = await db
    .select({
      id: sizes.id,
      name: sizes.name,
      sizeNumber: sizes.size_number,
      sizeTypeId: sizes.size_type_id,
      sizeTypeName: sizeTypes.name,
    })
    .from(sizes)
    .leftJoin(sizeTypes, eq(sizes.size_type_id, sizeTypes.id));

  // Step 2: Fetch all country sizes in one query
  const allCountrySizes = await db
    .select({
      id: countrySizes.id,
      sizeId: countrySizes.size_id,
      countryName: countrySizes.country_name,
      sizeLabel: countrySizes.size_label,
    })
    .from(countrySizes);

  // Step 3: Combine country sizes into each size
  const result = sizeData.map((size) => {
    const countries = allCountrySizes
      .filter((cs) => cs.sizeId === size.id)
      .map((cs) => ({
        id: cs.id,
        country_name: cs.countryName,
        size_label: cs.sizeLabel,
      }));

    return {
      id: size.id,
      name: size.name,
      size_number: size.sizeNumber,
      size_type: {
        id: size.sizeTypeId,
        name: size.sizeTypeName,
      },
      country_sizes: countries,
    };
  });

  return result;
};

type SizeInput = {
  id?: number;
  name: string;
  sizeNumber?: number;
  sizeTypeId?: number;
  countrySizes?: {
    id?: number; // optional, only for updates
    countryName: string;
    sizeLabel: string;
  }[];
};



export const createOrUpdateSize = async (input: SizeInput) => {
  let sizeId = input.id;

  if (sizeId) {
    // 🟡 Update size
    await db
      .update(sizes)
      .set({
        name: input.name,
        size_number: input.sizeNumber ?? null,
        size_type_id: input.sizeTypeId ?? null,
      })
      .where(eq(sizes.id, sizeId));

    // 🧹 Delete existing country size links
    await db
      .delete(countrySizes)
      .where(eq(countrySizes.size_id, sizeId));
  } else {
    // 🟢 Insert new size
    const inserted = await db
      .insert(sizes)
      .values({
        name: input.name,
        size_number: input.sizeNumber ?? null,
        size_type_id: input.sizeTypeId ?? null,
      })
      .returning({ id: sizes.id });

    sizeId = inserted[0]?.id;
  }

  // 🌍 Insert country-specific sizes
  if (input.countrySizes?.length && sizeId) {
    await db.insert(countrySizes).values(
      input.countrySizes.map((cs) => ({
        size_id: sizeId!,
        country_name: cs.countryName,
        size_label: cs.sizeLabel,
      }))
    );
  }

  return {
    result: "Success",
    sizeId,
  };
};

export const getSizeTypes= async()=>{
  const result = await db.select().from(sizeTypes);
  return result
}


export const getAllGenders = async () => {
  const result = await db
    .select({
      id: genders.id,
      name: genders.name,
    })
    .from(genders);

  return result;
};
