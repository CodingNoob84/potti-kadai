"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FreeShippingProgress } from "@/components/website/cart/free-shipping";
import { useSession } from "@/lib/auth-client";
import {
  FREE_SHIPPING_LIMIT,
  SHIPPING_CHARGES,
  TAX_PERCENTAGE,
} from "@/lib/contants";
import { getBestDiscountValue } from "@/lib/utils";
import {
  CartItemDetail,
  deleteCartItem,
  getCartItems,
  updateQuantity,
} from "@/server/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
  const queryClient = useQueryClient();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const {
    data: items,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["cartitems", user?.id],
    queryFn: () => getCartItems(user?.id as string),
    enabled: !!user?.id,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: updateQuantity,
    onMutate: async (newData) => {
      const { productVariantId, newQuantity } = newData;
      queryClient.cancelQueries({ queryKey: ["cartitems", user?.id] });
      const previousItems = queryClient.getQueryData(["cartitems", user?.id]);
      queryClient.setQueryData(
        ["cartitems", user?.id],
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
      queryClient.setQueryData(["cartitems", user?.id], context?.previousItems);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartitems", user?.id] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onMutate: async (deletedData) => {
      await queryClient.cancelQueries({ queryKey: ["cartitems", user?.id] });

      const previousItems = queryClient.getQueryData<CartItemDetail[]>([
        "cartitems",
        user?.id,
      ]);

      queryClient.setQueryData<CartItemDetail[]>(
        ["cartitems", user?.id],
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
        queryClient.setQueryData(
          ["cartitems", user?.id],
          context.previousItems
        );
      }
      toast.error("Failed to delete item");
    },

    onSuccess: () => {
      toast.success("Item removed from cart");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartitems", user?.id] });
    },
  });

  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0);
  let subtotal = 0;
  let originalTotal = 0;

  if (items) {
    for (const item of items) {
      const { discountedPrice } = getBestDiscountValue(
        item.discounts,
        item.price,
        item.quantity
      );
      subtotal += discountedPrice * item.quantity;
      originalTotal += item.price * item.quantity;
    }
  }

  const round2 = (value: number) => parseFloat(value.toFixed(2));

  const totalSavings = round2(originalTotal - subtotal);
  const shipping = subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_CHARGES;
  const totalWithShipping = round2(subtotal + shipping);
  const totaltax = (TAX_PERCENTAGE * totalWithShipping) / 100;
  const total = round2(totalWithShipping + totaltax);

  const handleQuantity = (
    productId: number,
    pvId: number,
    newQuantity: number
  ) => {
    if (newQuantity >= 1) {
      updateQuantityMutation.mutate({
        userId: user?.id as string,
        productId: productId,
        productVariantId: pvId,
        newQuantity: newQuantity,
      });
    } else {
      toast.error("Cant make quantity zero, instead use delete");
    }
  };

  if ((isLoading || isFetching || isPending) && !items) {
    return (
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-6 w-full mb-4" />

            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3 mb-4" />

              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Skeleton className="w-24 h-24 rounded-lg" />

                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-5 w-1/4" />

                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                          </div>
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary Skeleton */}
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>

                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-5 w-1/4" />
                </div>

                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (items && items?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container px-4 py-16"
      >
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Free Shipping Progress */}
          <FreeShippingProgress totalAmount={subtotal} />

          {/* Cart Items List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Items ({totalItems})</h2>
            <AnimatePresence>
              {items?.map((item) => {
                const { discountedPrice, discountedText } =
                  getBestDiscountValue(
                    item.discounts,
                    item.price,
                    item.quantity
                  );
                return (
                  <motion.div
                    key={item.pvId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Size: {item.sizeName} | Color: {item.colorName}
                            </p>

                            <div className="flex items-center space-x-2 mb-4">
                              <span className="font-bold text-lg">
                                ₹{discountedPrice}
                              </span>
                              {item.price > discountedPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{item.price}
                                </span>
                              )}
                              <Badge className="bg-red-500">
                                {discountedText}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    handleQuantity(
                                      item.productId,
                                      item.pvId,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-semibold">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    handleQuantity(
                                      item.productId,
                                      item.pvId,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  deleteItemMutation.mutate({
                                    userId: user?.id as string,
                                    productId: item.productId,
                                    productVariantId: item.pvId,
                                  })
                                }
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
        </div>

        {/* Order Summary */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="sticky top-28">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-3">
                  {totalSavings > 0 && (
                    <>
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          Original Price ({totalItems}{" "}
                          {totalItems === 1 ? "item" : "items"})
                        </span>
                        <span>₹{originalTotal}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Total Discount</span>
                        <span className="font-semibold">-₹{totalSavings}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span
                      className={
                        shipping === 0 ? "text-green-600 font-semibold" : ""
                      }
                    >
                      {shipping === 0 ? "FREE Delivery" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({TAX_PERCENTAGE}%)</span>
                    <span>{totaltax}</span>
                  </div>
                </div>

                <Separator />

                {/* Grand Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Order Total</span>
                    <span>₹{total}</span>
                  </div>

                  {totalSavings > 0 && (
                    <p className="text-sm text-green-600 text-right">
                      You saved ₹{totalSavings} on this order
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/checkout">Proceed to Secure Checkout</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full bg-transparent"
                  >
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
