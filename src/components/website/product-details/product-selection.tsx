"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { addToCart, CartItemDetail } from "@/server/cart";
import { ProductDetail, sizesType } from "@/server/products";
import { getWishListByProductId, toggleWishlist } from "@/server/wishlist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Flag,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SizeSystem = "C" | "IND" | "US" | "UK" | "EU";

type ProductSelectionProps = {
  product: ProductDetail;
  discountedText: string;
  discountedPrice: number;
  quantity: number;
  setQuantity: (quantity: number) => void;
  selectedColorId: number | null;
  setSelectedColorId: (selectedColorId: number) => void;
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
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const { data: Wishlist } = useQuery({
    queryKey: ["wishlistitems", product.id, user?.id],
    queryFn: () => getWishListByProductId(user?.id as string, product.id),
    enabled: !!product.id && !!user?.id,
  });
  const [selectedSize, setSelectedSize] = useState<sizesType | null>(null);
  const [availableSizes, setAvailableSizes] = useState<sizesType[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<SizeSystem>("C");
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const isWishlisted = selectedSize
    ? Wishlist?.includes(selectedSize.pvId)
    : false;
  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onMutate: async (newItem) => {
      // Cancel relevant queries to avoid overwriting optimistic updates
      await queryClient.cancelQueries({ queryKey: ["products", product.id] });
      await queryClient.cancelQueries({ queryKey: ["cartitems", user?.id] });

      // Store previous cache state for rollback
      const previousCart = queryClient.getQueryData<CartItemDetail[]>([
        "cartitems",
        user?.id,
      ]);
      const previousProduct = queryClient.getQueryData<ProductDetail>([
        "products",
        product.id,
      ]);

      // ---- CART OPTIMISTIC UPDATE ----
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

      // ---- PRODUCT INVENTORY OPTIMISTIC UPDATE ----
      if (previousProduct) {
        const updatedProduct = {
          ...previousProduct,
          inventory: previousProduct.inventory.map((color) =>
            color.colorId === selectedColorId
              ? {
                  ...color,
                  sizes: color.sizes.map((size) =>
                    size.sizeId === selectedSize?.sizeId
                      ? {
                          ...size,
                          quantity: Math.max(
                            0,
                            size.quantity - (newItem.quantity ?? 0)
                          ),
                        }
                      : size
                  ),
                }
              : color
          ),
        };

        queryClient.setQueryData(["products", product.id], updatedProduct);
      }

      return { previousCart, previousProduct };
    },
    onError: (err, newItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cartitems", user?.id], context.previousCart);
      }
      if (context?.previousProduct) {
        queryClient.setQueryData(
          ["products", product.id],
          context.previousProduct
        );
      }
      toast.error("Failed to add to cart.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products", product.id] });
      queryClient.invalidateQueries({ queryKey: ["cartitems", user?.id] });
    },
  });

  const toggleWishList = useMutation({
    mutationFn: toggleWishlist,
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: ["wishlistitems", product.id, user?.id],
      });

      const previousWishlist = queryClient.getQueryData<
        Array<{ productVariantId: number }>
      >(["wishlistitems", product.id, user?.id]);

      queryClient.setQueryData(
        ["wishlistitems", product.id, user?.id],
        (old: number[] = []) => {
          // Check if item exists in old wishlist
          const exists = old.some((item) => item === input.productVariantId);

          if (exists) {
            // Remove item optimistically
            return old.filter((item) => item !== input.productVariantId);
          } else {
            // Add item optimistically
            return [...old, input.productVariantId];
          }
        }
      );

      return { previousWishlist };
    },

    // Rollback on error
    onError: (err, input, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(
          ["wishlistitems", product.id, user?.id],
          context.previousWishlist
        );
      }
    },

    // After mutation either success or failure, refetch wishlist to sync with server
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlistitems", product.id, user?.id],
      });
    },
  });

  useEffect(() => {
    if (product.inventory?.length > 0) {
      const firstColor = product.inventory[0];
      if (!selectedColorId) {
        setSelectedColorId(firstColor.colorId);
        setAvailableSizes(firstColor.sizes);
      }
    }
  }, [product.inventory, selectedColorId, setSelectedColorId]);

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

  const handleWishlistToggle = (variantId: number) => {
    if (!selectedColorId) {
      toast.error("Please select any color");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select any size");
      return;
    }
    if (session) {
      console.log("wish");
      toggleWishList.mutate({
        userId: user?.id as string,
        productId: product.id,
        productVariantId: variantId,
      });
      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist"
      );
    } else {
      router.push("/login");
    }
  };

  const handleAddToCart = () => {
    if (!selectedColorId) {
      toast.error("Please select any color");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select any size");
      return;
    }
    if (session) {
      toast.success("Added to cart successfully!");
      const newItem = {
        userId: user?.id ?? "",
        productId: product.id,
        productVariantId: selectedSize?.pvId ?? 0,
        quantity,
      };
      addToCartMutation.mutate(newItem);
    } else {
      router.push("/login");
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColorId) {
      toast.error("Please select size and color");
      return;
    }

    toast.success("Redirecting to checkout...");
    const newItem = {
      userId: user?.id ?? "",
      productId: product.id,
      productVariantId: selectedSize?.pvId ?? 0,
      quantity,
    };
    addToCartMutation.mutate(newItem);
  };

  const sizeSystems: Record<
    SizeSystem,
    { label: string; icon: React.ReactNode }
  > = {
    C: { label: "Standard", icon: <span className="text-xs">S</span> },
    IND: { label: "India", icon: <Flag className="h-3 w-3" /> },
    US: { label: "USA", icon: <Flag className="h-3 w-3" /> },
    UK: { label: "UK", icon: <Flag className="h-3 w-3" /> },
    EU: { label: "Europe", icon: <Flag className="h-3 w-3" /> },
  };

  const getSizeLabel = (size: sizesType) => {
    if (selectedCountry === "C") return size.label;
    const country = size.country.find((c) => c.name === selectedCountry);
    return country ? country.label : size.label;
  };

  const isOutOfStock = selectedSize !== null && selectedSize.quantity === 0;
  const isInStock = selectedSize === null || selectedSize.quantity > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Product Title & Brand */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {product.category && (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20"
            >
              {product.category}
            </Badge>
          )}
          {isInStock ? (
            <Badge className="bg-green-500 text-white">In Stock</Badge>
          ) : (
            <Badge className="bg-red-500 text-white">Out of Stock</Badge>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="font-semibold text-gray-900 ml-2">
              {product.rating}
            </span>
          </div>
          <span className="text-gray-600">
            ({product.reviews.length} reviews)
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-3">
        {discountedPrice > 0 ? (
          <>
            <span className="text-2xl font-bold">
              ₹{discountedPrice.toFixed(2)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              ₹{product.price}
            </span>
            {discountedText && (
              <Badge className="bg-red-500">{discountedText}</Badge>
            )}
          </>
        ) : (
          <span className="text-2xl font-bold">₹{product.price}</span>
        )}
      </div>

      {/* Color Selection */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Color</h3>
        <div className="flex gap-3 flex-wrap">
          {product.inventory.map((color) => (
            <motion.button
              key={color.colorId}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedColorId(color.colorId)}
              className={`relative w-12 h-12 rounded-full border-4 transition-all ${
                selectedColorId === color.colorId
                  ? "border-primary shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              } cursor-pointer`}
              style={{ backgroundColor: color.colorCode || "#ccc" }}
            >
              {selectedColorId === color.colorId && (
                <Check className="absolute inset-0 m-auto h-5 w-5 text-white" />
              )}
              {color.sizes.every((size) => size.quantity <= 0) && (
                <div className="absolute inset-0 bg-gray-500/50 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">×</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Size</h3>
          <div className="relative">
            <button
              onClick={() => setShowSizeDropdown(!showSizeDropdown)}
              className="flex items-center gap-1 px-2 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-1">
                {sizeSystems[selectedCountry].icon}
                <span>{sizeSystems[selectedCountry].label}</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showSizeDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSizeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 z-10 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200"
              >
                <div className="p-1 space-y-1">
                  {Object.entries(sizeSystems).map(([key, { label, icon }]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedCountry(key as SizeSystem);
                        setShowSizeDropdown(false);
                        setSelectedSize(null);
                      }}
                      className={`w-full flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-left ${
                        selectedCountry === key
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {icon}
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {availableSizes.map((size) => {
            const sizeLabel = getSizeLabel(size);
            const isAvailable = size.quantity > 0;
            const isSelected = selectedSize?.sizeId === size.sizeId;

            return (
              <motion.button
                key={`${size.sizeId}-${selectedCountry}`}
                whileHover={{ scale: isAvailable ? 1.05 : 1 }}
                whileTap={{ scale: isAvailable ? 0.95 : 1 }}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : isAvailable
                    ? "border-gray-200 hover:border-gray-300 bg-white"
                    : "border-gray-200 bg-gray-100 text-gray-400 "
                }`}
              >
                {sizeLabel}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quantity Selection - Only show if in stock */}
      {isInStock && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Quantity</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 font-semibold min-w-[60px] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= (selectedSize?.quantity || 0)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-gray-600">
              {selectedSize?.quantity} available
            </span>
          </div>
        </div>
      )}

      {/* Out of Stock Message */}
      {isOutOfStock && (
        <div className="flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded-md text-sm">
          <AlertCircle className="text-lg" />
          <span>This color and size combination is currently unavailable.</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        {isInStock && (
          <>
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>

            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="w-full border-2 border-primary text-secondary-foreground hover:bg-secondary  py-6 text-lg font-semibold"
              size="lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              Buy Now
            </Button>
          </>
        )}

        <Button
          onClick={() =>
            selectedSize && handleWishlistToggle(selectedSize.pvId)
          }
          variant="outline"
          size="lg"
          className={`w-full py-6 ${
            isWishlisted
              ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Heart
            className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-current" : ""}`}
          />
          {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
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
    </motion.div>
  );
};
