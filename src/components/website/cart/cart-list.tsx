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
import { CartItemDetail, deleteCartItem, updateQuantity } from "@/server/cart";
import { moveToWishlist } from "@/server/wishlist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Heart,
  Minus,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export const CartItemsList = ({
  userId,
  cartItems,
}: {
  userId: string;
  cartItems: CartItemDetail[] | undefined;
}) => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  //const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantityMutation = useMutation({
    mutationFn: updateQuantity,
    onMutate: async (newData) => {
      const { productVariantId, newQuantity } = newData;
      queryClient.cancelQueries({ queryKey: ["cartitems", userId] });
      const previousItems = queryClient.getQueryData(["cartitems", userId]);
      queryClient.setQueryData(
        ["cartitems", userId],
        (old: CartItemDetail[] = []) =>
          old.map((item: CartItemDetail) =>
            item.pvId === productVariantId
              ? { ...item, quantity: newQuantity }
              : item
          )
      );
      return { previousItems };
    },

    onError: (err, newData, context) => {
      queryClient.setQueryData(["cartitems", userId], context?.previousItems);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartitems", userId] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onMutate: async (deletedData) => {
      await queryClient.cancelQueries({ queryKey: ["cartitems", userId] });

      const previousItems = queryClient.getQueryData<CartItemDetail[]>([
        "cartitems",
        userId,
      ]);

      queryClient.setQueryData<CartItemDetail[]>(
        ["cartitems", userId],
        (old = []) =>
          old.filter(
            (item) =>
              !(
                item.productId === deletedData.productId &&
                item.pvId === deletedData.productVariantId
              )
          )
      );

      return { previousItems };
    },

    onError: (err, _deletedData, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["cartitems", userId], context.previousItems);
      }
      toast.error("Failed to delete item");
    },

    onSuccess: () => {
      toast.success("Item removed from cart");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartitems", userId] });
    },
  });

  const moveToWishListMutation = useMutation({
    mutationFn: moveToWishlist,

    onMutate: async (movedData) => {
      await queryClient.cancelQueries({ queryKey: ["cartitems", userId] });

      const previousItems = queryClient.getQueryData<CartItemDetail[]>([
        "cartitems",
        userId,
      ]);

      queryClient.setQueryData<CartItemDetail[]>(
        ["cartitems", userId],
        (old = []) =>
          old.filter(
            (item) =>
              !(
                item.productId === movedData.productId &&
                item.pvId === movedData.productVariantId
              )
          )
      );

      return { previousItems };
    },

    onError: (err, _movedData, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["cartitems", userId], context.previousItems);
      }
      toast.error("Failed to move item to wishlist");
    },

    onSuccess: () => {
      toast.success("Item moved to wishlist");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartitems", userId] });
      queryClient.invalidateQueries({ queryKey: ["wishlistitems", userId] }); // optionally refresh wishlist
    },
  });

  const handleQuantity = (
    type: "increament" | "decreament",
    productId: number,
    pvId: number,
    newQuantity: number,
    availableQuantity: number
  ) => {
    console.log(availableQuantity, newQuantity);
    if (newQuantity >= 1) {
      if (type == "decreament") {
        updateQuantityMutation.mutate({
          userId: userId as string,
          productId: productId,
          productVariantId: pvId,
          newQuantity: newQuantity,
        });
      } else {
        if (availableQuantity > 0) {
          updateQuantityMutation.mutate({
            userId: userId as string,
            productId: productId,
            productVariantId: pvId,
            newQuantity: newQuantity,
          });
        } else {
          setOpenModal(true);
        }
      }
    } else {
      toast.error("Cant make quantity zero, instead use delete");
    }
  };

  const handleDelete = (productId: number, productVariantId: number) => {
    deleteItemMutation.mutate({ userId, productId, productVariantId });
  };
  const handleMoveToWishlist = (
    productId: number,
    productVariantId: number
  ) => {
    moveToWishListMutation.mutate({ userId, productId, productVariantId });
    toast.success("Item moved to wishlist");
  };

  const handleAllMoveToWishlist = () => {
    toast.success("Item moved to wishlist");
    setOpenModal(false);
  };

  return (
    <>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 bg-primary rounded-lg">
            <Package className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold">
            Your Items (
            {cartItems?.reduce((sum, item) => sum + item.quantity, 0)})
          </h2>
        </motion.div>

        <AnimatePresence>
          {cartItems?.map((item, index) => {
            const { discountedPrice, discountedText } = getBestDiscountValue(
              item.discounts,
              item.price,
              item.quantity
            );
            const isLowStock =
              item.availableQuantity <= 5 && item.availableQuantity > 0;

            return (
              <motion.div
                key={item.pvId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                layout
              >
                <Card
                  className={`group hover:shadow-lg transition-all duration-300 `}
                >
                  <CardContent className="p-6">
                    {/* Status Badges */}
                    <div className="w-full flex justify-end gap-2 flex-wrap mb-4">
                      {isLowStock && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 text-xs border-orange-300 text-orange-700 bg-orange-50"
                        >
                          <Bell className="h-3 w-3" />
                          Only {item.availableQuantity} left
                        </Badge>
                      )}
                      {item.discounts.length > 0 && (
                        <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-xs">
                          {discountedText}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="relative w-full h-40 sm:w-32 sm:h-32 flex-shrink-0 group">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className={`object-cover rounded-xl transition-all duration-300 `}
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className={`font-semibold text-lg mb-2 `}>
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Size:</span>{" "}
                              {item.sizeName}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Color:</span>{" "}
                              {item.colorName}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`font-bold text-xl `}>
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {item.price > discountedPrice && (
                            <span className="text-gray-500 line-through text-lg">
                              ${item.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-full hover:bg-gray-100"
                              onClick={() =>
                                handleQuantity(
                                  "decreament",
                                  item.productId,
                                  item.pvId,
                                  item.quantity - 1,
                                  item.availableQuantity
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold text-lg">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-full hover:bg-gray-100"
                              onClick={() =>
                                handleQuantity(
                                  "increament",
                                  item.productId,
                                  item.pvId,
                                  item.quantity + 1,
                                  item.availableQuantity
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-full"
                              onClick={() =>
                                handleMoveToWishlist(item.productId, item.pvId)
                              }
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              Wishlist
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDelete(item.productId, item.pvId)
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-full"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <div className="flex flex-col items-center text-center space-y-6 p-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-red-50 p-4 rounded-full"
            >
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </motion.div>

            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Inventory Limit Reached
              </DialogTitle>
            </DialogHeader>

            <div className="text-sm text-gray-600 space-y-3">
              <p>
                The requested quantity exceeds our available stock. We want to
                ensure fair availability for all our customers.
              </p>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">
                  Would you like us to notify you when we restock?
                </p>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
                onClick={() => setOpenModal(false)}
              >
                Continue Shopping
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={handleAllMoveToWishlist}
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
