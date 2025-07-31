"use client";
import { getTopProducts } from "@/server/products";
import { trendingProductType } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

const getReviewRating = () => {
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
  const reviews = Math.floor(Math.random() * 91) + 10;
  return { rating, reviews };
};

export const TrendingSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["top-products"],
    queryFn: () => getTopProducts(),
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Function to get the best discount (prioritizing direct discounts)
  const getBestDiscount = (discounts: trendingProductType["discount"]) => {
    if (!discounts || discounts.length === 0) return null;

    // Find the best direct discount
    const directDiscount = discounts.find((d) => d.type === "direct");
    if (directDiscount) return directDiscount;

    // Otherwise return the first discount (could add more logic for quantity discounts)
    return discounts[0];
  };

  const calculateDiscountedPrice = (product: trendingProductType) => {
    const discount = getBestDiscount(product.discount);
    if (!discount) return product.price;

    if (discount.type === "direct") {
      return product.price * (1 - discount.value / 100);
    } else if (discount.type === "fixed") {
      return product.price - discount.value;
    }
    return product.price;
  };

  const getDiscountText = (product: trendingProductType) => {
    const discount = getBestDiscount(product.discount);
    if (!discount) return "";

    switch (discount.type) {
      case "direct":
        return `${discount.value}% OFF`;
      case "quantity":
        return `Buy ${discount.minQuantity}+ for ${discount.value}% OFF`;
      default:
        return "";
    }
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
            Trending Now
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Discover what&apos;s popular this season
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {data?.map((product) => {
            const discountedPrice = calculateDiscountedPrice(product);
            const isDiscounted = discountedPrice !== product.price;
            const { rating, reviews } = getReviewRating();
            const mainImage = product.images[0] || "/placeholder.svg";
            const discountText = getDiscountText(product);

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <Card className="h-full p-0 flex flex-col hover:shadow-md transition-shadow">
                  <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      />
                      {discountText && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-xs sm:text-sm">
                          {discountText}
                        </Badge>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <h3 className="font-medium text-sm sm:text-base mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2 mt-auto">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                          {rating} ({reviews})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 mt-1">
                        <span className="font-bold text-base sm:text-lg">
                          ₹
                          {Math.round(
                            isDiscounted ? discountedPrice : product.price
                          )}
                        </span>
                        {isDiscounted && (
                          <span className="text-xs sm:text-sm text-muted-foreground line-through">
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

        <div className="text-center mt-8 sm:mt-12">
          <Button asChild size="sm" className="sm:size-lg">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const LoadingSkeleton = () => (
  <section className="py-12 sm:py-16 px-4 sm:px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mx-auto mb-3 sm:mb-4" />
        <Skeleton className="h-5 sm:h-6 w-56 sm:w-80 mx-auto" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="pt-0">
            <CardContent className="p-0">
              <Skeleton className="aspect-square w-full rounded-t-lg" />
              <div className="p-3 sm:p-4 space-y-2">
                <Skeleton className="h-4 sm:h-5 w-3/4" />
                <div className="flex items-center">
                  <Skeleton className="h-3 sm:h-4 w-3 sm:w-4 rounded-full" />
                  <Skeleton className="h-3 sm:h-4 w-10 sm:w-16 ml-1" />
                </div>
                <Skeleton className="h-5 sm:h-6 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8 sm:mt-12">
        <Skeleton className="h-10 w-32 sm:w-40 mx-auto" />
      </div>
    </div>
  </section>
);
