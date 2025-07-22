"use client";
import { getTopProducts } from "@/server/products";
import { trendingProductType } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const getReviewRating = () => {
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // Random between 3.5 and 5.0
  const reviews = Math.floor(Math.random() * 91) + 10; // Random between 10 and 100
  return { rating, reviews };
};

export const TrendingSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["top-products"],
    queryFn: getTopProducts,
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="pt-0">
                <CardContent className="p-0">
                  <Skeleton className="aspect-square w-full rounded-t-lg" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-16 ml-1" />
                    </div>
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Skeleton className="h-10 w-40 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  // Calculate discounted price based on discount type
  const calculateDiscountedPrice = (product: trendingProductType) => {
    if (product.discountType === "direct") {
      // Direct discount - subtract percentage from price, round up
      const discounted =
        product.price - (product.price * (product?.discountValue ?? 0)) / 100;
      return Math.ceil(discounted); // round up to nearest integer
    } else if (product.discountType === "quantity") {
      // Quantity discount - return original price
      return Math.ceil(product.price);
    }
    return Math.ceil(product.price);
  };

  // Format discount text based on discount type
  const getDiscountText = (product: trendingProductType) => {
    if (product.discountType === "direct") {
      return `${product.discountValue}% OFF`;
    } else if (product.discountType === "quantity") {
      return `Buy ${product.discountMinQ} for ${product.discountValue}% OFF`;
    }
    return "";
  };

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Now</h2>
          <p className="text-muted-foreground text-lg">
            Discover what&apos;s popular this season
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {data?.map((product) => {
            const discountedPrice = calculateDiscountedPrice(product);
            const isDiscounted = discountedPrice !== product.price;
            const { rating, reviews } = getReviewRating();
            console.log("product", product.id);
            return (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-shadow pt-0">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {(product.discountType === "direct" ||
                        product.discountType === "quantity") && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                          {getDiscountText(product)}
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
                            {rating} ({reviews})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">
                          ₹{isDiscounted ? discountedPrice : product.price}
                        </span>
                        {isDiscounted && product.discountType === "direct" && (
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

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
