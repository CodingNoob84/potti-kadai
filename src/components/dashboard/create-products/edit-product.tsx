"use client";
import { productCreateSchema, productCreateType } from "@/form-schemas/product";
import { createOrUpdateProduct } from "@/server/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProductForm } from "./form";

export const EditProduct = ({
  initialValues,
}: {
  initialValues: productCreateType;
}) => {
  const form = useForm<productCreateType>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: initialValues,
  });

  const createMutation = useMutation({
    mutationFn: createOrUpdateProduct,
    onSuccess: (data) => {
      if (data.productId) {
        toast.success("Product has been successfully updated");
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

  return <ProductForm type="Edit" form={form} onSubmit={onSubmit} />;
};
