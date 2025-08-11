"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageGallery } from "@/components/website/product-details/images";
import { PriceCalculation } from "@/components/website/product-details/price-calculation";
import { ProductDetailSkeleton } from "@/components/website/product-details/product-details-skeleton";
import { ProductSelection } from "@/components/website/product-details/product-selection";
import { getBestDiscount, getDiscountValues } from "@/lib/utils";
import { getProductById } from "@/server/products";
import { DiscountType } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params?.id);

  const { data: product, isLoading } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeDiscount, setActiveDiscount] = useState<DiscountType | null>(
    null
  );

  useEffect(() => {
    if (product && product.discounts)
      setActiveDiscount(
        getBestDiscount(product?.discounts, product.price, quantity)
      );
  }, [quantity, product, product?.discounts]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const { discountedText, discountedPrice } = getDiscountValues(
    activeDiscount,
    product.price,
    quantity
  );

  return (
    <div className="container px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/products/${product?.category
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`}
          className="hover:text-foreground"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Product Images - Column 1 */}
        <ImageGallery
          images={product.images}
          discountedText={discountedText}
          selectedColorId={selectedColorId}
          setSelectedColorId={setSelectedColorId}
        />

        {/* Product Details - Column 2 */}
        <ProductSelection
          product={product}
          discountedText={discountedText}
          discountedPrice={discountedPrice}
          quantity={quantity}
          setQuantity={setQuantity}
          selectedColorId={selectedColorId}
          setSelectedColorId={setSelectedColorId}
        />

        {/* Price Calculation - Column 3 */}
        <PriceCalculation
          discounts={product.discounts}
          price={product.price}
          quantity={quantity}
        />
      </div>

      {/* Product Details and Reviews */}
      <div className="mt-12">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Product Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p className="text-muted-foreground text-sm">
                    {product.description}
                  </p>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Subcategory</p>
                    <p className="font-medium">{product.subcategory}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Availability</p>
                    <p className="font-medium">
                      {product.isActive ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <Card
                  key={review.id}
                  className="border shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                          {review.userImage ? (
                            <Image
                              src={review.userImage}
                              alt={review.userName || "User"}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {review.userName || "Anonymous User"}
                          </h4>
                          <div className="flex items-center mt-1 gap-1">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                className={`h-4 w-4 ${
                                  index < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-muted text-muted-foreground"
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-xs text-muted-foreground">
                              {review.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.createdAt?.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground text-sm mt-3">
                        {review.comment}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
