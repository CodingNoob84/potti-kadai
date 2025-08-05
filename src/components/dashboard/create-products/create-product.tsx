"use client";
import { productCreateSchema, productCreateType } from "@/form-schemas/product";
import { createOrUpdateProduct } from "@/server/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProductForm } from "./form";

const initialValues: productCreateType = {
  id: 0,
  title: "",
  description: "",
  price: 1,
  gender: [],
  isactive: true,
  category: 0,
  subcategory: 0,
  images: [],
  inventory: [],
};

export const CreateProduct = () => {
  const form = useForm<productCreateType>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: initialValues,
  });

  const createMutation = useMutation({
    mutationFn: createOrUpdateProduct,
    onSuccess: (data) => {
      if (data.productId) {
        toast.success("Product has been successfully created");
        form.reset();
      }
    },
    onError: () => {
      toast.error("Something went wrong while creating the product");
    },
  });

  const onSubmit = (data: productCreateType) => {
    console.log("data", data);
    createMutation.mutate(data);
  };

  return <ProductForm type="Create" form={form} onSubmit={onSubmit} />;
};
