"use client";

import { ImageGallery } from "@/components/product-details/images";
import { ProductDetailSkeleton } from "@/components/product-details/product-details-skeleton";
import { Size, SizeSelector } from "@/components/product-details/size-selector";
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
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);

  // Set first color as default when product loads
  useEffect(() => {
    if (product?.inventory && product?.inventory?.length > 0) {
      const firstColor = product.inventory[0];
      setSelectedColorId(firstColor.colorId);
      setAvailableSizes(firstColor.sizes);
    }
  }, [product]);

  // Update available sizes when color changes
  useEffect(() => {
    if (product && selectedColorId) {
      const colorInventory = product.inventory.find(
        (color) => color.colorId === selectedColorId
      );
      if (colorInventory) {
        setAvailableSizes(colorInventory.sizes);
        setSelectedSizeId(null); // Reset size selection when color changes
      }
    }
  }, [selectedColorId, product]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const { rating, reviews } = getReviewRating();
  const discountPercentage =
    product.discount?.type === "direct" ? product.discount.value : 0;
  const discountedPrice =
    product.price - (product.price * discountPercentage) / 100;
  const totalPrice = product.price * quantity;
  const totalDiscountedPrice = discountedPrice * quantity;
  const savings = totalPrice - totalDiscountedPrice;

  const handleAddToCart = () => {
    if (!selectedSizeId || !selectedColorId) {
      toast.error("Please select size and color");
      return;
    }

    const selectedColor = product.inventory.find(
      (c) => c.colorId === selectedColorId
    );
    const selectedSize = availableSizes.find(
      (s) => s.sizeId === selectedSizeId
    );

    toast.success("Added to cart");
    console.log("Added to cart:", {
      productId: product.id,
      colorId: selectedColorId,
      colorName: selectedColor?.name,
      sizeId: selectedSizeId,
      sizeName: selectedSize?.name,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (!selectedSizeId || !selectedColorId) {
      toast.error("Please select size and color");
      return;
    }

    const selectedColor = product.inventory.find(
      (c) => c.colorId === selectedColorId
    );
    const selectedSize = availableSizes.find(
      (s) => s.sizeId === selectedSizeId
    );

    console.log("Buy now:", {
      productId: product.id,
      colorId: selectedColorId,
      colorName: selectedColor?.name,
      sizeId: selectedSizeId,
      sizeName: selectedSize?.name,
      quantity,
    });
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
          discountPercentage={15}
          colorId={selectedColorId}
        />

        {/* Product Details - Column 2 */}
        <div className="space-y-5">
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
                  <Badge className="bg-red-500">
                    {discountPercentage}% OFF
                  </Badge>
                </>
              ) : (
                <span className="text-2xl font-bold">₹{product.price}</span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Color</Label>
            <RadioGroup
              value={selectedColorId?.toString() || ""}
              onValueChange={(value) => setSelectedColorId(Number(value))}
              className="flex flex-wrap gap-2"
            >
              {product.inventory.map((color) => (
                <div key={color.colorId}>
                  <RadioGroupItem
                    value={color.colorId.toString()}
                    id={`color-${color.colorId}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`color-${color.colorId}`}
                    className={`flex items-center justify-center px-3 py-1.5 text-sm border rounded-md cursor-pointer ${
                      selectedColorId === color.colorId
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/50"
                    }`}
                  >
                    {color.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <SizeSelector
              sizes={availableSizes}
              onSizeSelect={(sizeId) => setSelectedSizeId(sizeId)}
            />
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
            <Button size="sm" className="flex-1 py-2" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 py-1"
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

        {/* Price Calculation - Column 3 */}
        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardContent className=" px-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Price Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Price ({quantity} item{quantity > 1 ? "s" : ""})
                  </span>
                  <span className="font-medium">
                    ₹{(product.price * quantity).toFixed(2)}
                  </span>
                </div>

                {discountPercentage > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Discount{" "}
                        <Badge className="bg-red-500">
                          {discountPercentage}% OFF
                        </Badge>
                      </span>
                      <span className="text-green-600 font-medium">
                        -₹{savings.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">You Save</span>
                      <span className="text-green-600 font-medium">
                        ({discountPercentage}% off)
                      </span>
                    </div>
                  </>
                )}

                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-semibold">
                      Total Amount
                    </span>
                    <span className="text-gray-900 font-semibold text-lg">
                      ₹
                      {discountPercentage > 0
                        ? totalDiscountedPrice.toFixed(2)
                        : totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Offers */}
          <Card className="border shadow-sm">
            <CardContent className="px-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Available Offers
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 text-green-800 rounded-full p-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      10% Special Discount
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Get extra 10% off on orders above ₹1000
                    </p>
                    <p className="text-xs text-blue-600 mt-1 font-medium">
                      T&C Apply
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
