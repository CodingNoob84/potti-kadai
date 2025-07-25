"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createUpdateCategory,
  getAllSubCategorieList,
} from "@/server/categories";
import { FromCategoryType } from "@/types/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { SubcategoryCombobox } from "./subcategory-combobox";

// Define type for subcategory object
export type Subcategory = {
  id: number;
  name: string;
  isActive: boolean | null;
};

// Define schema including subcategory objects
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string(),
  isActive: z.boolean().default(true),
  subcategories: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      isActive: z.boolean().default(true),
    })
  ),
});

export type CategoryFormValues = z.infer<typeof CategorySchema>;

type Props = {
  type: "Add" | "Edit";
  initialCategory?: FromCategoryType;
};

export const AddEditCategory = ({ type, initialCategory }: Props) => {
  const queryClient = useQueryClient();
  const { data: subcategorieoptions } = useQuery({
    queryKey: ["subcategorieoptions"],
    queryFn: getAllSubCategorieList,
  });
  const [isOpen, setIsOpen] = useState(false);
  const formMethods = useForm({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialCategory ?? {
      id: 0,
      name: "",
      slug: "",
      description: "",
      isActive: true,
      subcategories: [],
    },
  });

  const mutation = useMutation({
    mutationFn: createUpdateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allcategories"] });
      closeModal();
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });

  const openModal = () => {
    formMethods.reset(
      initialCategory ?? {
        id: 0,
        name: "",
        slug: "",
        description: "",
        isActive: true,
        subcategories: [],
      }
    );
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      await mutation.mutateAsync(data); // this keeps isSubmitting = true during submission
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  useEffect(() => {
    formMethods.setFocus("name");
  }, [formMethods]);

  return (
    <>
      {type === "Add" ? (
        <Button onClick={openModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={openModal}>
          <Edit className="h-4 w-4" />
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {type === "Add" ? "Add New Category" : "Edit Category"}
            </DialogTitle>
          </DialogHeader>

          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input id="name" {...formMethods.register("name")} />
                    {formMethods.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {formMethods.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" {...formMethods.register("slug")} />
                    {formMethods.formState.errors.slug && (
                      <p className="text-sm text-red-500">
                        {formMethods.formState.errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    {...formMethods.register("description")}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formMethods.watch("isActive")}
                    onCheckedChange={(val) =>
                      formMethods.setValue("isActive", val)
                    }
                  />
                  <Label htmlFor="status">Active</Label>
                </div>

                <div className="space-y-2">
                  <Label>Subcategories</Label>
                  <SubcategoryCombobox options={subcategorieoptions || []} />
                  {formMethods.formState.errors.subcategories && (
                    <p className="text-sm text-red-500">
                      {
                        formMethods.formState.errors.subcategories
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>

                {formMethods.formState.isSubmitting ? (
                  <Button disabled>Loading...</Button>
                ) : (
                  <Button type="submit">
                    {type === "Edit" ? "Save Changes" : "Add Category"}
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};
