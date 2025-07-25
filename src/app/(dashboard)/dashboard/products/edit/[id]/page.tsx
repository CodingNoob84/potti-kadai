"use client";

import { EditProduct } from "@/components/dashboard/create-products/edit-product";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductDetailsByIdEdit } from "@/server/products";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const productIdString = params?.id;

  // Convert string to number safely
  const productId = productIdString ? Number(productIdString) : undefined;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductDetailsByIdEdit(productId!),
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Error Loading Product</h1>
          <p className="text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Failed to load product details"}
          </p>
        </div>
      </div>
    );
  }

  if (!data || productId === undefined) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Product Not Found</h1>
          <p className="text-muted-foreground">
            The product you&apos;re trying to edit doesn&apos;t exist
          </p>
        </div>
      </div>
    );
  }

  const productDetail = {
    ...data,
    tags: [""],
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">
          Update product in your inventory
        </p>
      </div>
      {productDetail && <EditProduct initialValues={productDetail} />}
    </div>
  );
}
