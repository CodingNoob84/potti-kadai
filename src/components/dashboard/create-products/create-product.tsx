"use client";
import { productCreateSchema, productCreateType } from "@/form-schemas/product";
import { createProduct } from "@/server/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProductForm } from "./form";

const initialValues: productCreateType = {
  title: "",
  description: "",
  price: 1,
  isactive: true,
  discounts: [],
  promocodes: [],
  category: 0,
  subcategory: 0,
  tags: [],
  images: [],
  colorSelectionType: "single",
  colors: [],
  inventory: [],
};

export const CreateProduct = () => {
  const form = useForm<productCreateType>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: initialValues,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      if (data.productId) {
        toast.success("Product has been created");
        form.reset();
      }
    },
    onError: () => {
      toast.error("Something went wrong while creating the product");
    },
  });

  const onSubmit = (data: productCreateType) => {
    createMutation.mutate(data);
  };

  return <ProductForm type="Create" form={form} onSubmit={onSubmit} />;
};
