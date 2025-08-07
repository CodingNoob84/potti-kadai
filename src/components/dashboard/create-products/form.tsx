import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { productCreateType } from "@/form-schemas/product";
import { UseFormReturn } from "react-hook-form";
import { ProductBasicInfo } from "./basic-info";
import { ImagesBlock } from "./images-block";
import { InventoryManagement } from "./inventory-block";

type ProductFormTypes = {
  type: string;
  form: UseFormReturn<productCreateType>;
  onSubmit: (data: productCreateType) => void;
};

export const ProductForm = ({ type, form, onSubmit }: ProductFormTypes) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductBasicInfo form={form} />
          <ImagesBlock form={form} />
        </div>
        <InventoryManagement form={form} />
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            {type == "Create" ? "Create Product" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
