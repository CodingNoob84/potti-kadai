"use client";

import { getTopProducts } from "@/server/products";
import type { trendingProductType } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { easeOut, motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

export const TrendingSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["top-products"],
    queryFn: () => getTopProducts(),
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const calculateDiscountedPrice = (product: trendingProductType) => {
    const discount = product.discount;
    if (!discount) return product.price;
    if (discount.type === "percentage") {
      const discounted = product.price * (1 - discount.value / 100);
      return Math.max(discounted, 0);
    }
    if (discount.type === "amount") {
      const discounted = product.price - discount.value;
      return Math.max(discounted, 0);
    }
    return product.price;
  };

  const getDiscountText = (product: trendingProductType) => {
    const discount = product.discount;
    if (!discount) return "";
    const buyText =
      discount.minQuantity > 1 ? ` | Buy ${discount.minQuantity}+` : "";
    if (discount.type === "percentage") {
      return `${discount.value}% OFF${buyText}`;
    }
    if (discount.type === "amount") {
      return `Save ₹${discount.value}${buyText}`;
    }
    return "";
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-white via-green-50 to-green-150 relative overflow-hidden">
      {/* subtle overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-green-100/30 via-white/60 to-white/30" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 select-none shadow-sm">
            <TrendingUp className="h-4 w-4" />
            Hot Picks
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 text-green-900 tracking-tight">
            Trending Now
          </h2>
          <p className="text-green-700 max-w-2xl mx-auto text-base sm:text-lg md:text-xl">
            Discover this season’s most popular items loved by thousands of
            customers
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
        >
          {data?.map((product, index) => {
            const discountedPrice = calculateDiscountedPrice(product);
            const isDiscounted = discountedPrice !== product.price;
            const { rating, reviews } = getReviewRating();
            const mainImage =
              product.image ||
              "/placeholder.svg?height=300&width=300&text=Product";
            const discountText = getDiscountText(product);
            const savingsAmount = isDiscounted
              ? product.price - discountedPrice
              : 0;

            return (
              <ProductCard
                key={product.id}
                product={product}
                discountedPrice={discountedPrice}
                isDiscounted={isDiscounted}
                rating={rating}
                reviews={reviews}
                mainImage={mainImage}
                discountText={discountText}
                savingsAmount={savingsAmount}
                index={index}
              />
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center mt-12 sm:mt-16"
        >
          <Button
            asChild
            size="lg"
            className="px-10 py-3 text-base font-semibold bg-green-600 hover:bg-green-700 shadow-md transition-colors duration-300"
          >
            <Link href="/products" aria-label="Explore all products">
              Explore All Products
              <motion.span
                className="ml-2 inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                →
              </motion.span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

const ProductCard = ({
  product,
  discountedPrice,
  isDiscounted,
  rating,
  reviews,
  mainImage,
  discountText,
  savingsAmount,
  index,
}: {
  product: trendingProductType;
  discountedPrice: number;
  isDiscounted: boolean;
  rating: string;
  reviews: number;
  mainImage: string;
  discountText: string;
  savingsAmount: number;
  index: number;
}) => {
  return (
    <motion.div variants={itemVariants} className="rounded-lg overflow-hidden">
      <Link
        href={`/products/${product.id}`}
        className="group block"
        aria-label={`View details for ${product.name}`}
      >
        <Card className="h-full p-0 overflow-hidden border-2 shadow-xl hover:shadow-lg transition-shadow duration-300 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-0 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-primary/30">
              <Image
                src={mainImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                priority={index < 3}
              />

              {/* Discount Badge */}
              {discountText && (
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: -12 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-500 text-white font-semibold px-2 py-1 text-xs shadow-md select-none">
                    {discountText}
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(Number.parseFloat(rating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1 font-medium">
                  {rating} ({reviews})
                </span>
              </div>

              {/* Pricing */}
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg text-green-900">
                    ₹
                    {Math.round(isDiscounted ? discountedPrice : product.price)}
                  </span>
                  {isDiscounted && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.price}
                    </span>
                  )}
                </div>
                {isDiscounted && savingsAmount > 0 && (
                  <p className="text-xs text-green-700 font-semibold select-none">
                    You save ₹{Math.round(savingsAmount)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const LoadingSkeleton = () => (
  <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-white via-green-50 to-green-100 relative overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-green-100/30 via-white/60 to-white/30" />

    <div className="max-w-7xl mx-auto relative z-10">
      {/* Header Skeleton */}
      <div className="text-center mb-12 sm:mb-16">
        <Skeleton className="h-6 w-24 mx-auto mb-4 rounded-full" />
        <Skeleton className="h-10 sm:h-12 w-64 sm:w-80 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="overflow-hidden bg-white/90">
            <CardContent className="p-0">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Skeleton */}
      <div className="text-center mt-12 sm:mt-16">
        <Skeleton className="h-12 w-48 mx-auto rounded-lg" />
      </div>
    </div>
  </section>
);
