"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBestDiscountValue, getDiscounts } from "@/lib/utils";
import { getProductFilters } from "@/server/products";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Eye,
  Frown,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ProductListsTypeProps = {
  viewMode: "grid" | "list";
  genderIds: number[];
  categoryIds: number[];
  subcategoryIds: number[];
  colorIds: number[];
  priceAbove: number;
  priceBelow: number;
};

const ITEMS_PER_PAGE = 12;

const ProductSkeleton = ({ viewMode }: { viewMode: "grid" | "list" }) => {
  if (viewMode === "grid") {
    return (
      <div className="lg:col-span-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-gray-200 rounded-t-lg" />
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

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {startPage > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
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
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    genderIds,
    categoryIds,
    subcategoryIds,
    colorIds,
    priceAbove,
    priceBelow,
  ]);

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
        page: currentPage,
        limit: ITEMS_PER_PAGE,
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
          page: number;
          limit: number;
        }
      ];
      return getProductFilters({
        ...filters,
        pageNumber: filters.page,
        limit: filters.limit,
      });
    },
  });

  console.log("total-products", totalproducts);

  if (isLoading) {
    return <ProductSkeleton viewMode={viewMode} />;
  }

  const products = totalproducts?.products;
  const totalRecords = totalproducts?.totalRecords || 0;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    return (
      <div className="lg:col-span-3">
        <motion.div
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
              <Frown className="h-12 w-12 text-primary/60" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-800">
            No products found
          </h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-md">
            We couldn&apos;t find any products matching your filters. Try
            adjusting your search criteria.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3">
            <Bell className="h-4 w-4 mr-2" />
            Notify me when available
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentProducts = products;

  return (
    <div className="lg:col-span-3">
      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, totalRecords)} of{" "}
          {totalRecords} products
        </p>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product, index) => {
            const { discountedPrice, discountedText } = getBestDiscountValue(
              product.discounts,
              product.price,
              1
            );
            const isDiscounted = discountedPrice !== product.price;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0 relative">
                    <div className="relative aspect-square overflow-hidden">
                      <Link href={`/products/${product.id}`}>
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </Link>

                      {isDiscounted && (
                        <motion.div
                          initial={{ scale: 0, rotate: -12 }}
                          animate={{ scale: 1, rotate: -12 }}
                          transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 500,
                          }}
                        >
                          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-2 py-1 text-xs shadow-lg">
                            {discountedText}
                          </Badge>
                        </motion.div>
                      )}

                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.avgRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-2">
                            {product.avgRating} ({product.reviewCount})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-primary">
                            ₹{Math.round(discountedPrice)}
                          </span>
                          {isDiscounted && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                        {isDiscounted && (
                          <span className="text-xs text-green-600 font-medium">
                            Save ₹{Math.round(product.price - discountedPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {currentProducts.map((product, index) => {
            const { discountedPrice, discountedText } = getDiscounts(
              product.discounts,
              product.price
            );
            const isDiscounted = discountedPrice !== product.price;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex space-x-6">
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <Link href={`/products/${product.id}`}>
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="128px"
                          />
                        </Link>
                        {isDiscounted && (
                          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs">
                            {discountedText}
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-center mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.avgRating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-muted-foreground ml-2">
                                {product.avgRating} ({product.reviewCount}{" "}
                                reviews)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-2xl text-primary">
                              ₹{Math.round(discountedPrice)}
                            </span>
                            {isDiscounted && (
                              <>
                                <span className="text-lg text-muted-foreground line-through">
                                  ₹{product.price}
                                </span>
                                <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                                  Save ₹
                                  {Math.round(product.price - discountedPrice)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
