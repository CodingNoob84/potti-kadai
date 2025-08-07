import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSession } from "@/lib/auth-client";
import { addToCart, CartItemDetail } from "@/server/cart";
import { ProductDetail, sizesType } from "@/server/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SizeSelector } from "./size-selector";

type ProductSelectionProps = {
  product: ProductDetail;
  discountedText: string;
  discountedPrice: number;
  quantity: number;
  setQuantity: (quantity: number) => void;
  selectedColorId: number | null;
  setSelectedColorId: (selectedColorId: number) => void;
};

type ImageArrType = {
  url: string;
  alt?: string;
  colorId: number | null;
};

type WishlistState = {
  productId: number;
  variantId: number;
  isWishlisted: boolean;
};
export const getImage = (images: ImageArrType[], colorId: number) => {
  const filtered = images.filter((i) => i.colorId === colorId);
  return filtered.length > 0 ? filtered : images.slice(0, 1); // fallback to first image
};

export const ProductSelection = ({
  product,
  discountedText,
  discountedPrice,
  quantity,
  setQuantity,
  selectedColorId,
  setSelectedColorId,
}: ProductSelectionProps) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const user = session?.user;

  const [selectedSize, setSelectedSize] = useState<sizesType | null>(null);

  const [wishlistState, setWishlistState] = useState<WishlistState[]>([]);

  const [availableSizes, setAvailableSizes] = useState<sizesType[]>([]);

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cartitems", user?.id] });

      const previousCart = queryClient.getQueryData<CartItemDetail[]>([
        "cartitems",
        user?.id,
      ]);

      const alreadyInCart = previousCart?.find(
        (item) => item.pvId === newItem.productVariantId
      );
      const selectedColor = product.inventory.find(
        (c) => c.colorId === selectedColorId
      );

      let updatedCart;
      const newCartItem = {
        cartItemId: -1,
        productId: newItem.productId,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0].url,
        quantity: newItem.quantity,
        pvId: newItem.productVariantId,
        colorId: selectedColorId,
        colorName: selectedColor?.name,
        sizeId: selectedSize?.sizeId,
        sizeName: selectedSize?.label,
        discountedPercentage: 0,
        discountedPrice: discountedPrice,
      };
      if (alreadyInCart) {
        updatedCart = previousCart?.map((item) =>
          item.pvId === newItem.productVariantId
            ? { ...item, quantity: item.quantity + (newItem.quantity ?? 0) }
            : item
        );
      } else {
        updatedCart = [...(previousCart ?? []), newCartItem];
      }

      queryClient.setQueryData(["cartitems", user?.id], updatedCart);

      return { previousCart };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(["cartitems", user?.id], context?.previousCart);
      toast.error("Failed to add to cart.");
    },

    // ✅ Re-fetch after mutation to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartitems", user?.id] });
    },
  });

  const handleAddToCart = () => {
    if (!selectedColorId) {
      toast.error("Please select any color");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select any size");
      return;
    }

    toast.success("Added to cart");
    const newItem = {
      userId: user?.id ?? "",
      productId: product.id,
      productVariantId: selectedSize?.pvId ?? 0,
      quantity,
    };
    addToCartMutation.mutate(newItem);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColorId) {
      toast.error("Please select size and color");
      return;
    }

    const newItem = {
      userId: user?.id ?? "",
      productId: product.id,
      productVariantId: selectedSize?.pvId ?? 0,
      quantity,
    };
    addToCartMutation.mutate(newItem);
  };

  const isWishlisted = (variantId: number) => {
    return wishlistState.some(
      (item) => item.variantId === variantId && item.isWishlisted
    );
  };
  const handleWishlistToggle = (variantId: number) => {
    setWishlistState((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.variantId === variantId
      );

      if (existingIndex >= 0) {
        return prev.map((item, index) =>
          index === existingIndex
            ? { ...item, isWishlisted: !item.isWishlisted }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          variantId,
          isWishlisted: true,
        },
      ];
    });
  };
  useEffect(() => {
    if (product.inventory?.length > 0) {
      const firstColor = product.inventory[0];
      setSelectedColorId(firstColor.colorId);
      setAvailableSizes(firstColor.sizes);
    }
  }, [product.inventory, setSelectedColorId, setAvailableSizes]);

  useEffect(() => {
    if (selectedColorId) {
      const colorInventory = product.inventory.find(
        (color) => color.colorId === selectedColorId
      );
      if (colorInventory) {
        setAvailableSizes(colorInventory.sizes);
        setSelectedSize(null);
      }
    }
  }, [selectedColorId, product]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < product.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-muted text-muted-foreground"
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-muted-foreground">
              {product.rating} ({product.reviews.length} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          {discountedPrice > 0 ? (
            <>
              <span className="text-2xl font-bold">
                ₹{discountedPrice.toFixed(2)}
              </span>
              <span className="text-lg text-muted-foreground line-through">
                ₹{product.price}
              </span>
              {discountedText != "" && (
                <Badge className="bg-red-500">{discountedText}</Badge>
              )}
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
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
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
        {/* Add to Cart Button */}
        {!selectedSize ? (
          <Button size="sm" className="flex-1 py-2" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        ) : selectedSize.quantity > 0 ? (
          <Button size="sm" className="flex-1 py-2" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        ) : (
          <Button
            size="sm"
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white"
            disabled
          >
            <Ban className="h-4 w-4 mr-2" />
            Out of Stock
          </Button>
        )}

        {/* Right-side Buttons */}
        {!selectedSize || selectedSize.quantity > 0 ? (
          <>
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
              onClick={() =>
                selectedSize && handleWishlistToggle(selectedSize.pvId)
              }
              className={
                isWishlisted(selectedSize?.pvId ?? 0)
                  ? "text-green-600 border-green-500 bg-green-50" // Green when wishlisted
                  : ""
              }
              disabled={!selectedSize}
            >
              <Heart
                className={`h-4 w-4 ${
                  isWishlisted(selectedSize?.pvId ?? 0)
                    ? "fill-current text-green-600"
                    : ""
                }`}
              />
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              selectedSize && handleWishlistToggle(selectedSize.pvId)
            }
            className={`flex-1 py-1 ${
              isWishlisted(selectedSize.pvId)
                ? "text-green-600 border-green-500 bg-green-50" // Green when wishlisted
                : "animate-pulse border-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.3)] hover:shadow-[0_0_8px_3px_rgba(239,68,68,0.4)]"
            }`}
            title="Out of stock - Add to wishlist"
          >
            {isWishlisted(selectedSize.pvId) ? (
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 fill-current text-green-600" />
                Added to Wishlist
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Add to Wishlist
              </span>
            )}
          </Button>
        )}
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
  );
};
