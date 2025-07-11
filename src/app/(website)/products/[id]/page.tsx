"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useState } from "react";

const product = {
  id: 1,
  name: "Classic Cotton T-Shirt",
  price: 599,
  originalPrice: 799,
  rating: 4.5,
  reviews: 128,
  description:
    "A comfortable and stylish cotton t-shirt perfect for everyday wear. Made from 100% premium cotton with a soft feel and durable construction.",
  images: [
    "/images/products/p_img2_1.png",
    "/images/products/p_img2_2.png",
    "/images/products/p_img2_3.png",
    "/images/products/p_img2_4.png",
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["Black", "White", "Navy", "Gray"],
  inStock: true,
  features: [
    "100% Premium Cotton",
    "Pre-shrunk fabric",
    "Comfortable fit",
    "Machine washable",
    "Durable construction",
  ],
};

const reviews = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rating: 5,
    date: "2024-01-15",
    comment:
      "Excellent quality t-shirt. Very comfortable and fits perfectly. Highly recommended!",
  },
  {
    id: 2,
    name: "Priya Sharma",
    rating: 4,
    date: "2024-01-10",
    comment:
      "Good quality fabric and nice fit. The color is exactly as shown in the picture.",
  },
  {
    id: 3,
    name: "Amit Singh",
    rating: 5,
    date: "2024-01-05",
    comment:
      "Great value for money. The t-shirt is soft and comfortable. Will definitely buy again.",
  },
];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }
    // Add to cart logic here
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
    // Buy now logic here
    console.log("Buy now:", { product, selectedSize, selectedColor, quantity });
  };

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
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Product Images - Compact Version */}
        <div className="space-y-3 col-span-2">
          {/* Main Image - Smaller */}
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-4"
              priority
            />
            {product.originalPrice > product.price && (
              <Badge className="absolute top-3 left-3 bg-red-500">
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                % OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Images - Compact */}
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
                  src={image || "/placeholder.svg"}
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
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl font-bold">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground text-sm">{product.description}</p>

          {/* Size Selection */}
          <div className="pt-2">
            <Label className="text-sm font-medium mb-2 block">Size</Label>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
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

          {/* Color Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Color</Label>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div key={color}>
                    <RadioGroupItem
                      value={color}
                      id={`color-${color}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`color-${color}`}
                      className="flex items-center justify-center px-3 py-1.5 text-sm border rounded-md cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 hover:border-primary/50"
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

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
            <TabsTrigger value="reviews">
              Reviews ({product.reviews})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Product Features</h3>
                <ul className="space-y-2 text-sm">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{review.name}</h4>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-muted text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {review.comment}
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
