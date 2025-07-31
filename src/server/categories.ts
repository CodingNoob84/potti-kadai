"use server";
import { db } from "@/db/drizzle";
import {
  categories,
  categorySubcategories,
  genders,
  sizes,
  subcategories,
} from "@/db/schema/products";
import {
  CategoryType,
  FromCategoryType,
  FromSubCategoryType,
} from "@/types/categories";
import { and, eq } from "drizzle-orm";

export const getAllCategories = async () => {
  const data = await db.query.categories.findMany({
    with: {
      categorySubcategories: {
        with: {
          subcategory: true,
        },
      },
    },
    orderBy: (fields, { asc }) => [asc(fields.name)],
  });

  return data.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    isActive: category.isActive,
    subcategories: category.categorySubcategories.map((cs) => cs.subcategory),
  }));
};

export const createUpdateCategory = async (input: FromCategoryType) => {
  let categoryId = input.id;

  if (input.id) {
    // UPDATE category
    await db
      .update(categories)
      .set({
        name: input.name,
        slug: input.slug,
        description: input.description ?? "",
        isActive: input.isActive ?? true,
      })
      .where(eq(categories.id, input.id));

    // DELETE existing subcategory links
    await db
      .delete(categorySubcategories)
      .where(eq(categorySubcategories.categoryId, input.id));
  } else {
    // INSERT new category
    const result = await db
      .insert(categories)
      .values({
        name: input.name,
        slug: input.slug,
        description: input.description ?? "",
        isActive: input.isActive ?? true,
      })
      .returning({ id: categories.id });

    categoryId = result[0]?.id;
  }

  // INSERT new subcategory links
  if (input.subcategories.length && categoryId) {
    await db.insert(categorySubcategories).values(
      input.subcategories.map((sub) => ({
        categoryId,
        subcategoryId: sub.id,
      }))
    );
  }

  return { result: "Success", categoryId };
};

export const deleteCategory = async (categoryId: number) => {
  // Delete subcategory links first
  await db
    .delete(categorySubcategories)
    .where(eq(categorySubcategories.categoryId, categoryId));

  // Then delete the category itself
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
        eq(categorySubcategories.categoryId, categoryId),
        eq(categorySubcategories.subcategoryId, subcategoryId)
      )
    );

  return { result: "Subcategory removed", categoryId, subcategoryId };
};

export const getAllCategorieList = async (): Promise<CategoryType[]> => {
  const result = await db.query.categories.findMany({
    where: (fields, { eq }) => eq(fields.isActive, true),
    orderBy: (fields, { asc }) => [asc(fields.name)],
  });

  return result as CategoryType[];
};

export const getAllSubCategorieList = async () => {
  return await db.query.subcategories.findMany({
    where: (fields, { eq }) => eq(fields.isActive, true),
    orderBy: (fields, { asc }) => [asc(fields.name)],
  });
};

export const getSubCategoriesWithCategory = async () => {
  const data = await db.query.subcategories.findMany({
    with: {
      categorySubcategories: {
        with: {
          category: true,
        },
      },
    },
    orderBy: (fields, { asc }) => [asc(fields.name)],
  });

  // Flatten and map subcategory with its parent category info
  return data.map((sub) => ({
    id: sub.id,
    name: sub.name,
    isActive: sub.isActive,
    categories: sub.categorySubcategories.map((cs) => ({
      id: cs.category.id,
      name: cs.category.name,
      slug: cs.category.slug,
      isActive: cs.category.isActive,
      description: cs.category.description,
    })),
  }));
};

export const createUpdateSubCategory = async (input: FromSubCategoryType) => {
  const isActive = input.isActive ?? true;

  if (input.id) {
    // Update subcategory
    await db
      .update(subcategories)
      .set({
        name: input.name,
        isActive,
      })
      .where(eq(subcategories.id, input.id));

    // Clear existing category relations
    await db
      .delete(categorySubcategories)
      .where(eq(categorySubcategories.subcategoryId, input.id));

    // Re-insert category relations
    if (input.categories && input.categories.length > 0) {
      const categoryLinks = input.categories.map((cat) => ({
        categoryId: cat.id,
        subcategoryId: input.id!,
      }));
      await db.insert(categorySubcategories).values(categoryLinks);
    }

    return { result: "updated", subcategoryId: input.id };
  } else {
    // Insert new subcategory
    const inserted = await db
      .insert(subcategories)
      .values({
        name: input.name,
        isActive,
      })
      .returning({ id: subcategories.id });

    const newId = inserted[0]?.id;

    // Insert category relations
    if (input.categories && input.categories.length > 0 && newId) {
      const categoryLinks = input.categories.map((cat) => ({
        categoryId: cat.id,
        subcategoryId: newId,
      }));
      await db.insert(categorySubcategories).values(categoryLinks);
    }

    return { result: "created", subcategoryId: newId };
  }
};

export const deleteSubCategory = async (subcategoryId: number) => {
  // Delete all category relations first
  await db
    .delete(categorySubcategories)
    .where(eq(categorySubcategories.subcategoryId, subcategoryId));

  // Delete the subcategory
  await db.delete(subcategories).where(eq(subcategories.id, subcategoryId));

  return { result: "deleted", subcategoryId };
};

export const getAllSizesWithCategory = async () => {
  return await db
    .select({
      id: sizes.id,
      name: sizes.name,
      sizenumber: sizes.sizenumber,
      indiaSize: sizes.indiaSize,
      usSize: sizes.usSize,
      euSize: sizes.euSize,
      ukSize: sizes.ukSize,
      type: sizes.type,
      categoryId: sizes.categoryId,
      categoryName: categories.name,
    })
    .from(sizes)
    .innerJoin(categories, eq(sizes.categoryId, categories.id));
};

type NewSizeInput = {
  name: string;
  ukSize?: string;
  usSize?: string;
  euSize?: string;
  indiaSize?: string;
  categoryId: number;
  type: string;
};

export async function addSize(input: NewSizeInput) {
  await db.insert(sizes).values({
    name: input.name,
    ukSize: input.ukSize ?? null,
    usSize: input.usSize ?? null,
    euSize: input.euSize ?? null,
    indiaSize: input.indiaSize ?? null,
    categoryId: input.categoryId,
    type: input.type,
  });
}

type UpdateSizeInput = {
  id: number;
  name: string;
  ukSize?: string;
  usSize?: string;
  euSize?: string;
  indiaSize?: string;
  categoryId: number;
  type: string;
};

export async function updateSize(input: UpdateSizeInput) {
  await db
    .update(sizes)
    .set({
      name: input.name,
      ukSize: input.ukSize ?? null,
      usSize: input.usSize ?? null,
      euSize: input.euSize ?? null,
      indiaSize: input.indiaSize ?? null,
      categoryId: input.categoryId,
      type: input.type,
    })
    .where(eq(sizes.id, input.id));
}

export async function getAllGenderList() {
  return await db.select().from(genders);
}
