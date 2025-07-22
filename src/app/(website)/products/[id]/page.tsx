"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductById } from "@/server/products";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Helper function to generate random rating between 3.5 and 5
const getReviewRating = () => {
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
  const reviews = Math.floor(Math.random() * 91) + 10;
  return { rating, reviews };
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params?.id);

  const { data: product, isLoading } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (isLoading) {
    return (
      <div className="container px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Image loading skeleton */}
          <div className="space-y-3 col-span-2">
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50 animate-pulse" />
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-gray-100 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Details loading skeleton */}
          <div className="space-y-5 col-span-3">
            <div className="space-y-3">
              <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const { rating, reviews } = getReviewRating();
  const discountPercentage =
    product.discount?.type === "direct" ? product.discount.value : 0;
  const discountedPrice =
    product.price - (product.price * discountPercentage) / 100;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }
    console.log("Added to cart:", {
      product,
      selectedSize,
      selectedColor,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }
    console.log("Buy now:", { product, selectedSize, selectedColor, quantity });
  };

  // Get all unique sizes from inventory
  const allSizes = product.inventory.flatMap((color) =>
    color.sizes.map((size) => size.name)
  );
  const uniqueSizes = [...new Set(allSizes)];

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

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Product Images */}
        <div className="space-y-3 col-span-2">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
            <Image
              src={product.images[selectedImage]?.url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
            />
            {discountPercentage > 0 && (
              <Badge className="absolute top-3 left-3 bg-red-500">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-16 h-16 flex-shrink-0 rounded-md border overflow-hidden ${
                  selectedImage === index ? "border-primary" : "border-muted"
                }`}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-5 col-span-3">
          <div>
            <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(Number(rating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-muted-foreground">
                  {rating} ({reviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              {discountPercentage > 0 ? (
                <>
                  <span className="text-2xl font-bold">
                    ₹{discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{product.price}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">₹{product.price}</span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground text-sm">{product.description}</p>

          {/* Color Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Color</Label>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
              <div className="flex flex-wrap gap-2">
                {product.inventory.map((color) => (
                  <div key={color.colorId}>
                    <RadioGroupItem
                      value={color.name}
                      id={`color-${color.colorId}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`color-${color.colorId}`}
                      className="flex items-center justify-center px-3 py-1.5 text-sm border rounded-md cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 hover:border-primary/50"
                    >
                      {color.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Size Selection */}
          {uniqueSizes.length > 0 && (
            <div className="pt-2">
              <Label className="text-sm font-medium mb-2 block">Size</Label>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                <div className="flex flex-wrap gap-2">
                  {uniqueSizes.map((size) => (
                    <div key={size}>
                      <RadioGroupItem
                        value={size}
                        id={`size-${size}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`size-${size}`}
                        className="flex items-center justify-center w-10 h-10 text-sm border rounded-md cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 hover:border-primary/50"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Quantity */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Quantity</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button size="sm" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={isWishlisted ? "text-red-500 border-red-500" : ""}
            >
              <Heart
                className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
              />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="flex flex-col items-center text-center">
              <Truck className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs">Easy Returns</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details and Reviews */}
      <div className="mt-12">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Product Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
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
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">Customer {i + 1}</h4>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className={`h-3 w-3 ${
                                j < Math.floor(Math.random() * 2 + 3)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-muted text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      This is a sample review for demonstration purposes.
                    </p>
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
