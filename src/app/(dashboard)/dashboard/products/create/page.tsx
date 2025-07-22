import { CreateProduct } from "@/components/dashboard/create-products/create-product";

export default function CreateProductPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your inventory
        </p>
      </div>
      <CreateProduct />
    </div>
  );
}
