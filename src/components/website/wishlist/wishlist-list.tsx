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
import { DiscountType } from "@/types/products";
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

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  sizeName: string;
  colorName: string;
  isAvailable: boolean;
  availableQuantity: number;
  discounts: DiscountType[];
  addedDate: string;
  category: string;
}

export const WishlistItemsList = ({
  userId,
  wishlistItems,
  setItems,
  allItems,
}: {
  userId: string;
  wishlistItems: WishlistItem[];
  setItems: (items: WishlistItem[]) => void;
  allItems: WishlistItem[];
}) => {
  console.log("userId", userId);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);

  const handleRemoveFromWishlist = (itemId: number) => {
    const updatedItems = allItems.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    toast.success("Item removed from wishlist");
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (!item.isAvailable) {
      setSelectedItem(item);
      setOpenModal(true);
      return;
    }

    toast.success(`${item.name} added to cart`);
    // Here you would typically add the item to cart
  };

  const handleNotifyWhenAvailable = () => {
    toast.success("We'll notify you when this item is back in stock");
    setOpenModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {wishlistItems.map((item, index) => {
            const { discountedPrice, discountedText } = getBestDiscountValue(
              item.discounts,
              item.price,
              1
            );
            const isLowStock =
              item.availableQuantity <= 5 && item.availableQuantity > 0;
            const savings = item.originalPrice - discountedPrice;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                layout
              >
                <Card
                  className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    !item.isAvailable
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white hover:shadow-2xl border-gray-200"
                  }`}
                >
                  <CardContent className="p-0">
                    {/* Image Section */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className={`object-cover transition-all duration-300 ${
                          !item.isAvailable
                            ? "opacity-60 grayscale"
                            : "group-hover:scale-110"
                        }`}
                      />

                      {/* Status Overlay */}
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </div>
                        </div>
                      )}

                      {/* Discount Badge */}
                      {item.discounts.length > 0 && item.isAvailable && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold">
                            {discountedText}
                          </Badge>
                        </div>
                      )}

                      {/* Availability Status */}
                      <div className="absolute top-3 right-3">
                        {item.isAvailable ? (
                          <div className="bg-green-500 text-white p-1.5 rounded-full">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="bg-red-500 text-white p-1.5 rounded-full">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      {/* Remove from Wishlist */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-red-500 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3
                          className={`font-semibold text-lg mb-1 line-clamp-2 ${
                            !item.isAvailable
                              ? "text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{item.sizeName}</span>
                          <span>•</span>
                          <span>{item.colorName}</span>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-lg ${
                              !item.isAvailable
                                ? "text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {savings > 0 && (
                            <span className="text-gray-500 line-through text-sm">
                              ${item.originalPrice.toFixed(2)}
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
                      {item.isAvailable && (
                        <div className="flex items-center gap-2">
                          {isLowStock ? (
                            <>
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span className="text-orange-600 text-sm font-medium">
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
                      )}

                      {/* Added Date */}
                      <p className="text-xs text-gray-500">
                        Added {formatDate(item.addedDate)}
                      </p>

                      {/* Action Button */}
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className={`w-full ${
                          item.isAvailable
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            : "bg-gray-400 hover:bg-gray-500"
                        }`}
                        disabled={!item.isAvailable}
                      >
                        {item.isAvailable ? (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4 mr-2" />
                            Notify When Available
                          </>
                        )}
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
              className="bg-orange-50 p-4 rounded-full"
            >
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </motion.div>

            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Item Currently Unavailable
              </DialogTitle>
            </DialogHeader>

            <div className="text-sm text-gray-600 space-y-3">
              <p>
                <strong>{selectedItem?.name}</strong> is currently out of stock.
              </p>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">
                  Would you like us to notify you when it&apos;s back in stock?
                </p>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
                onClick={() => setOpenModal(false)}
              >
                Maybe Later
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={handleNotifyWhenAvailable}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notify Me
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
