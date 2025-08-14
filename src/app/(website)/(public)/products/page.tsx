import { ProductsClientPage } from "@/components/website/products/product-client-page";
import { ProductsClientPageSkeleton } from "@/components/website/products/products-page-loading";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<ProductsClientPageSkeleton />}>
      <ProductsClientPage />
    </Suspense>
  );
}
