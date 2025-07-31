"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getDiscounts } from "@/lib/utils";
import { getProductFilters } from "@/server/products";
import { useQuery } from "@tanstack/react-query";
import { Bell, Frown, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProductListsTypeProps = {
  viewMode: "grid" | "list";
  genderIds: number[];
  categoryIds: number[];
  subcategoryIds: number[];
  colorIds: number[];
  priceAbove: number;
  priceBelow: number;
};

const ProductSkeleton = ({ viewMode }: { viewMode: "grid" | "list" }) => {
  if (viewMode === "grid") {
    return (
      <div className="lg:col-span-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="relative  aspect-square bg-gray-200 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-4">
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <div className="relative w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ProductLists = ({
  viewMode = "grid",
  genderIds,
  categoryIds,
  subcategoryIds,
  colorIds,
  priceAbove,
  priceBelow,
}: ProductListsTypeProps) => {
  const {
    data: totalproducts,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "products",
      {
        genderIds: genderIds,
        categoryIds: categoryIds,
        subcategoryIds: subcategoryIds,
        colorIds: colorIds,
        priceAbove: priceAbove,
        priceBelow: priceBelow,
      },
    ],
    queryFn: ({ queryKey }) => {
      const [, filters] = queryKey as [
        string,
        {
          genderIds: number[];
          categoryIds: number[];
          subcategoryIds: number[];
          colorIds: number[];
          priceAbove: number;
          priceBelow: number;
        }
      ];
      return getProductFilters(filters);
    },
  });

  //const isLoading = true;
  if (isLoading) {
    return <ProductSkeleton viewMode={viewMode} />;
  }

  //const totalRecords = totalproducts?.totalRecords;
  const products = totalproducts?.products;
  console.log("data", totalproducts);

  if (error) {
    return (
      <div className="lg:col-span-3">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Frown className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to load products</h3>
          <p className="text-muted-foreground text-sm">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  if (!products || products?.length === 0) {
    console.log("datalength", products?.length);
    return (
      <div className="lg:col-span-3">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Frown className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No products available under this category
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            We couldn&apos;t find any products matching your filters
          </p>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Bell className="h-4 w-4 mr-2" />
            Notify me when available
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => {
            const { discountedPrice, discountedText } = getDiscounts(
              product.discounts,
              product.price
            );
            return (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-shadow pt-0 border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      {product.price > discountedPrice && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                          {discountedText}
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground ml-1">
                            {product.avgRating} ({product.reviewCount})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">
                          ₹{discountedPrice.toFixed(2)}
                        </span>
                        {product.price > discountedPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => {
            const { discountedPrice, discountedText } = getDiscounts(
              product.discounts,
              product.price
            );
            return (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-shadow shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground ml-1">
                            {product.avgRating} ({product.reviewCount} reviews)
                          </span>
                          {product.price > discountedPrice && (
                            <Badge className="ml-3 bg-red-500 hover:bg-red-600">
                              {discountedText}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xl">
                            ₹{discountedPrice.toFixed(2)}
                          </span>
                          {product.price > discountedPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
