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
import {
  createUpdateSubCategory,
  getAllCategorieList,
} from "@/server/categories";
import { FromSubCategoryType } from "@/types/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { CategoryCombobox } from "./category-combobox";

// Define schema including category objects
export const SubCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Subcategory name is required"),

  isActive: z.boolean().default(true),
  categories: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
        description: z.string(),
        isActive: z.boolean(),
      })
    )
    .min(1, "At least one category is required"),
});

export type SubCategoryFormValues = z.infer<typeof SubCategorySchema>;

type Props = {
  type: "Add" | "Edit";
  initialSubCategory?: FromSubCategoryType;
};

export const AddEditSubCategory = ({ type, initialSubCategory }: Props) => {
  const queryClient = useQueryClient();
  const { data: CategoryOptions } = useQuery({
    queryKey: ["category-options"],
    queryFn: getAllCategorieList,
  });
  const [isOpen, setIsOpen] = useState(false);
  const formMethods = useForm({
    resolver: zodResolver(SubCategorySchema),
    defaultValues: initialSubCategory ?? {
      id: 0,
      name: "",
      isActive: true,
      categories: [],
    },
  });

  const openModal = () => {
    formMethods.reset(
      initialSubCategory ?? {
        id: 0,
        name: "",
        isActive: true,
        categories: [],
      }
    );
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const mutation = useMutation({
    mutationFn: createUpdateSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-subcategories"] });
      closeModal();
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });

  const onSubmit = async (data: SubCategoryFormValues) => {
    console.log("Form submitted:", data);
    try {
      await mutation.mutateAsync(data); // this keeps isSubmitting = true during submission
    } catch (error) {
      console.error("Submission failed:", error);
    }
    closeModal();
  };

  useEffect(() => {
    formMethods.setFocus("name");
  }, [formMethods]);

  return (
    <>
      {type === "Add" ? (
        <Button onClick={openModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subcategory
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
              {type === "Add" ? "Add New Subcategory" : "Edit Subcategory"}
            </DialogTitle>
          </DialogHeader>

          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Subcategory Name</Label>
                  <Input id="name" {...formMethods.register("name")} />
                  {formMethods.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {formMethods.formState.errors.name.message}
                    </p>
                  )}
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
                  <Label>Categories</Label>
                  <CategoryCombobox options={CategoryOptions || []} />
                  {formMethods.formState.errors.categories && (
                    <p className="text-sm text-red-500">
                      {formMethods.formState.errors.categories.message}
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
                    {type === "Edit" ? "Save Changes" : "Add Subcategory"}
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
