"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBestDiscountValue } from "@/lib/utils";
import { addToCart, CartItemDetail } from "@/server/cart";
import { deleteWishlistitem, WishlistItemDetail } from "@/server/wishlist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Heart,
  Package,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type WishlistItemsListProps = {
  userId: string;
  wishlistItems: WishlistItemDetail[] | undefined;
};

export const WishlistItemsList = ({
  userId,
  wishlistItems,
}: WishlistItemsListProps) => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItemDetail | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  console.log("wishlistItems", wishlistItems);

  const deleteWishlistItem = useMutation({
    mutationFn: deleteWishlistitem, // your API function

    onMutate: async (wishlistItemId: number) => {
      await queryClient.cancelQueries({
        queryKey: ["wishlistitems", userId],
      });

      const previousWishlist = queryClient.getQueryData([
        "wishlistitems",
        userId,
      ]);

      queryClient.setQueryData(
        ["wishlistitems", userId],
        (old: WishlistItemDetail[] = []) =>
          old.filter((item) => item.wishlistItemId !== wishlistItemId)
      );

      return { previousWishlist };
    },

    onError: (err, input, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(
          ["wishlistitems", userId],
          context.previousWishlist
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlistitems", userId],
      });
    },
  });

  const handleRemoveFromWishlist = async (wishlistItemId: number) => {
    console.log("wishlistItemId", wishlistItemId);
    try {
      setIsProcessing(true);
      deleteWishlistItem.mutate(wishlistItemId);
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to remove item from wishlist");
    } finally {
      setIsProcessing(false);
    }
  };

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cartitems", userId] });

      const previousCart = queryClient.getQueryData<CartItemDetail[]>([
        "cartitems",
        userId,
      ]);

      const alreadyInCart = previousCart?.find(
        (item) => item.pvId === newItem.productVariantId
      );

      let updatedCart;
      const newCartItem = {
        cartItemId: -1,
        productId: newItem.productId,
        name: selectedItem?.name,
        price: selectedItem?.price,
        imageUrl: selectedItem?.imageUrl,
        quantity: newItem.quantity,
        pvId: newItem.productVariantId,
        colorId: selectedItem?.colorId,
        colorName: selectedItem?.colorName,
        sizeId: selectedItem?.sizeId,
        sizeName: selectedItem?.sizeName,
        discountedPercentage: 0,
        discountedPrice: 0,
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

      queryClient.setQueryData(["cartitems", userId], updatedCart);

      return { previousCart };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(["cartitems", userId], context?.previousCart);
      toast.error("Failed to add to cart.");
    },

    // ✅ Re-fetch after mutation to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartitems", userId] });
    },
  });

  const handleAddToCart = async (item: WishlistItemDetail) => {
    if (item.availableQuantity <= 0) {
      setSelectedItem(item);
      setOpenModal(true);
      return;
    }

    try {
      setIsProcessing(true);
      const newItem = {
        userId: userId,
        productId: item.productId,
        productVariantId: item.pvId,
        quantity: 1,
      };
      addToCartMutation.mutate(newItem);
      toast.success(`${item.name} added to cart`);
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to add item to cart");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNotifyWhenAvailable = async () => {
    if (!selectedItem) return;

    try {
      setIsProcessing(true);
      //await onNotifyWhenAvailable(selectedItem);
      toast.success("We'll notify you when this item is back in stock");
      setOpenModal(false);
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to set up notification");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-"; // or "Date not available"

    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {wishlistItems &&
            wishlistItems.map((item, index) => {
              const { discountedPrice, discountedText } = getBestDiscountValue(
                item.discounts,
                item.price,
                1
              );
              const isLowStock =
                item.availableQuantity <= 5 && item.availableQuantity > 0;
              const isAvailable = item.availableQuantity > 0;
              const savings = item.price - discountedPrice;

              return (
                <motion.div
                  key={`${item.productId}-${item.pvId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  layout
                >
                  <Card
                    className={`p-0 group hover:shadow-xl transition-all duration-300 overflow-hidden ${
                      isAvailable
                        ? " border-secondary"
                        : " hover:shadow-2xl border-secondary"
                    }`}
                  >
                    <CardContent className="p-0">
                      {/* Image Section */}
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className={`object-cover transition-all duration-300 ${
                            !isAvailable
                              ? "opacity-60 grayscale"
                              : "group-hover:scale-110"
                          }`}
                        />

                        {/* Status Overlay */}
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                              Out of Stock
                            </div>
                          </div>
                        )}

                        {/* Discount Badge */}
                        {item.discounts.length > 0 && isAvailable && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-red-400 text-primary-foreground font-bold">
                              {discountedText}
                            </Badge>
                          </div>
                        )}

                        {/* Availability Status */}
                        <div className="absolute top-3 right-3">
                          {isAvailable ? (
                            <div className="bg-green-500 text-white p-1.5 rounded-full">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="bg-destructive text-destructive-foreground p-1.5 rounded-full">
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                          )}
                        </div>

                        {/* Remove from Wishlist */}
                        <button
                          onClick={() =>
                            handleRemoveFromWishlist(item.wishlistItemId)
                          }
                          disabled={isProcessing}
                          className="absolute bottom-3 right-3 bg-background/90 hover:bg-background text-destructive p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                          aria-label={`Remove ${item.name} from wishlist`}
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3
                            className={`font-semibold text-lg mb-1 line-clamp-2 ${
                              !isAvailable
                                ? "text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {item.name}
                          </h3>
                          <div className="flex items-center flex-wrap gap-2 text-sm">
                            {item.sizeName && (
                              <div className="flex items-center gap-1.5 bg-secondary/80 px-2.5 py-1 rounded-full">
                                <span className="font-semibold text-foreground">
                                  Size:
                                </span>
                                <span className="font-medium text-muted-foreground">
                                  {item.sizeName}
                                </span>
                              </div>
                            )}
                            {item.colorName && (
                              <div className="flex items-center gap-1.5 bg-secondary/80 px-2.5 py-1 rounded-full">
                                <span className="font-semibold text-foreground">
                                  Color:
                                </span>
                                <span className="font-medium text-muted-foreground">
                                  {item.colorName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price Section */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold text-lg ${
                                !isAvailable
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              ${discountedPrice.toFixed(2)}
                            </span>
                            {savings > 0 && (
                              <span className="text-muted-foreground line-through text-sm">
                                ${item.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {savings > 0 && (
                            <p className="text-green-600 text-sm font-medium">
                              Save ${savings.toFixed(2)}
                            </p>
                          )}
                        </div>

                        {/* Stock Status */}
                        {isAvailable ? (
                          <div className="flex items-center gap-2">
                            {isLowStock ? (
                              <>
                                <Clock className="h-4 w-4 text-yellow-500" />
                                <span className="text-yellow-600 text-sm font-medium">
                                  Only {item.availableQuantity} left
                                </span>
                              </>
                            ) : (
                              <>
                                <Package className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 text-sm font-medium">
                                  In Stock
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="text-destructive text-sm font-medium">
                              Out of Stock
                            </span>
                          </div>
                        )}

                        {/* Added Date */}
                        {item.createdAt && (
                          <p className="text-xs text-muted-foreground">
                            Added {formatDate(item.createdAt)}
                          </p>
                        )}

                        {/* Action Button */}
                        <Button
                          onClick={() => handleAddToCart(item)}
                          //disabled={!isAvailable || isProcessing}
                          className={`w-full cursor-pointer ${
                            isAvailable ? "bg-primary hover:bg-primary/90" : ""
                          }`}
                          aria-label={
                            isAvailable
                              ? "Add to cart"
                              : "Notify when available"
                          }
                        >
                          {isAvailable ? (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {isProcessing ? "Adding..." : "Add to Cart"}
                            </>
                          ) : (
                            <>
                              <Bell className="h-4 w-4 mr-2" />
                              Notify When Available
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full hover:bg-destructive/30 cursor-pointer"
                          onClick={() =>
                            handleRemoveFromWishlist(item.wishlistItemId)
                          }
                        >
                          <Heart className="h-4 w-4 mr-2 fill-red-500 text-red-500" />
                          Remove from Wishlist
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Out of Stock Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <div className="flex flex-col items-center text-center space-y-6 p-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-secondary p-4 rounded-full"
            >
              <AlertTriangle className="h-8 w-8 text-primary" />
            </motion.div>

            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Item Currently Unavailable
              </DialogTitle>
            </DialogHeader>

            <div className="text-sm text-muted-foreground space-y-3">
              <p>
                <strong>{selectedItem?.name}</strong> is currently out of stock.
              </p>
              <div className="p-3 bg-secondary rounded-lg">
                <p className="font-medium text-foreground">
                  Would you like us to notify you when it&apos;s back in stock?
                </p>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-muted-foreground hover:bg-secondary"
                onClick={() => setOpenModal(false)}
                disabled={isProcessing}
              >
                Maybe Later
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleNotifyWhenAvailable}
                disabled={isProcessing}
              >
                <Bell className="w-4 h-4 mr-2" />
                {isProcessing ? "Processing..." : "Notify Me"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
