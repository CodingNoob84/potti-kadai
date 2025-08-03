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
  createOrUpdateSubCategory,
  getAllCategorieList,
  getSizeTypes,
} from "@/server/categories";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { CategoryCombobox } from "./category-combobox";

// Define schema including category objects
export const SubCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Subcategory name is required"),
  is_active: z.boolean().default(true),
  size_type_id: z.number().min(1, "Size type is required"),
  categories: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        is_active: z.boolean(),
      })
    )
    .min(1, "At least one category is required"),
});

export type SubCategoryFormValues = z.input<typeof SubCategorySchema>;

type FromSubCategoryType = {
  id: number;
  name: string;
  is_active: boolean;
  size_type_id: number;
  size_type_name: string;
  categories: {
    id: number;
    name: string;
    is_active: boolean;
  }[];
};

type Props = {
  type: "Add" | "Edit";
  initialSubCategory?: FromSubCategoryType;
};

const SizeTypeSelect = () => {
  const { data: SizeTypes } = useQuery({
    queryKey: ["size-types"],
    queryFn: getSizeTypes,
  });
  const { setValue, watch, formState } =
    useFormContext<SubCategoryFormValues>();

  const currentValue = watch("size_type_id");

  return (
    <div className="space-y-2 w-full">
      <Label>Size Type</Label>
      <Select
        value={currentValue === 0 ? "" : currentValue.toString()}
        onValueChange={(val) =>
          setValue("size_type_id", val ? parseInt(val) : 0)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a size type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {SizeTypes?.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {formState.errors.size_type_id && (
        <p className="text-sm text-red-500">
          {formState.errors.size_type_id.message}
        </p>
      )}
    </div>
  );
};

export const AddEditSubCategory = ({ type, initialSubCategory }: Props) => {
  const queryClient = useQueryClient();
  const { data: CategoryOptions } = useQuery({
    queryKey: ["category-options"],
    queryFn: getAllCategorieList,
  });

  const [isOpen, setIsOpen] = useState(false);
  const formMethods = useForm<SubCategoryFormValues>({
    resolver: zodResolver(SubCategorySchema),
    defaultValues: initialSubCategory ?? {
      id: 0,
      name: "",
      is_active: true,
      size_type_id: 0,
      categories: [],
    },
  });

  const openModal = () => {
    formMethods.reset(
      initialSubCategory ?? {
        id: 0,
        name: "",
        is_active: true,
        size_type_id: 0,
        categories: [],
      }
    );
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const mutation = useMutation({
    mutationFn: createOrUpdateSubCategory,
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
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

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
                    checked={formMethods.watch("is_active")}
                    onCheckedChange={(val) =>
                      formMethods.setValue("is_active", val)
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

                <SizeTypeSelect />
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
