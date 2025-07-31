"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FREE_SHIPPING_LIMIT, SHIPPING_CHARGES } from "@/lib/contants";
import { getCartItems, placeOrder } from "@/server/cart";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  Smartphone,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type PlaceOrderParams = {
  userId: string;
  addressId: number;
  paymentMethod: string;
};

export const OrderSummary = ({
  userId,
  addressId,
  paymentMethod,
}: {
  userId: string;
  addressId: string;
  paymentMethod: string;
}) => {
  const { data: items, isLoading } = useQuery({
    queryKey: ["cartitems", userId],
    queryFn: () => getCartItems(userId as string),
    enabled: !!userId,
  });

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showAddressAlert, setShowAddressAlert] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [newOrderId, setNewOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState<{
    success: boolean;
    type?: string;
  } | null>(null);

  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const subtotal =
    items?.reduce(
      (sum, item) => sum + item.discountedPrice * item.quantity,
      0
    ) ?? 0;
  const originalTotal =
    items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

  const totalSavings = originalTotal - subtotal;
  const shipping = subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_CHARGES;
  const total = subtotal + shipping;

  const placeOrderMutation = useMutation({
    mutationFn: (data: PlaceOrderParams) => placeOrder(data),
    onSuccess: (data) => {
      console.log("Order placed successfully:", data);
      if (data.success) {
        setNewOrderId(data.orderId?.toString() as string);
        setOrderStatus({ success: true });
      } else {
        setOrderStatus({
          success: false,
          type: data.type,
        });
      }
    },
    onError: (error) => {
      console.error("Order placement failed:", error);
      setOrderStatus({
        success: false,
        type: "unknown",
      });
    },
    onSettled: () => {
      setIsPlacingOrder(false);
    },
  });

  const handlePlaceOrder = async () => {
    if (!addressId) {
      setShowAddressAlert(true);
      return;
    }

    if (paymentMethod === "upi" || paymentMethod === "razorpay") {
      setShowComingSoon(true);
      return;
    }

    if (addressId && paymentMethod === "cod") {
      setIsPlacingOrder(true);
      const data = {
        userId: userId,
        addressId: parseInt(addressId),
        paymentMethod: paymentMethod,
      };
      placeOrderMutation.mutate(data);
    }
  };

  const resetOrderStatus = () => {
    setOrderStatus(null);
  };

  return (
    <div>
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Items */}
          <div className="space-y-3">
            {isLoading
              ? Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex space-x-3">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                      </div>
                    </div>
                  ))
              : items?.map((item) => (
                  <div key={item.pvId} className="flex space-x-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.sizeName} | {item.colorName} | Qty:{" "}
                        {item.quantity}
                      </p>
                      <div className="flex flex-row items-center gap-4">
                        <p className="font-semibold">
                          ₹{item.discountedPrice * item.quantity}
                        </p>
                        {item.price > item.discountedPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.price * item.quantity}
                          </span>
                        )}
                        {item.discountedPercentage > 0 && (
                          <Badge className="bg-red-500">
                            {item.discountedPercentage}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{subtotal}</span>
            </div>

            {totalSavings > 0 && (
              <div className="flex justify-between text-green-600">
                <span>You Save</span>
                <span>₹{totalSavings}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span
                className={shipping === 0 ? "text-green-600 font-semibold" : ""}
              >
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || orderStatus?.success}
          >
            {isPlacingOrder ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : orderStatus?.success ? (
              "Order Placed!"
            ) : (
              "Place Order"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Order Success Dialog */}
      <Dialog
        open={orderStatus?.success ?? false}
        onOpenChange={(open) => !open && resetOrderStatus()}
      >
        <DialogContent className="max-w-md text-center">
          <DialogTitle></DialogTitle>
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Order Placed Successfully!
            </h3>
            <p className="text-muted-foreground mb-6">
              Your order has been confirmed. We&apos;ll send you a confirmation
              email shortly.
            </p>
            <Button asChild className="w-full">
              <a href={`/payment-receipt?orderid=${newOrderId}`}>
                View Order Details
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Out of Stock Dialog */}
      <Dialog
        open={
          orderStatus?.success === false && orderStatus.type === "outofstock"
        }
        onOpenChange={(open) => !open && resetOrderStatus()}
      >
        <DialogContent className="max-w-md text-center">
          <DialogTitle></DialogTitle>
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Items Out of Stock</h3>
            <p className="text-muted-foreground mb-6">
              Some items in your cart are currently out of stock. We&apos;ll
              notify you when they become available.
            </p>
            <Button asChild variant="outline" className="w-full">
              <a href="/cart">Back to Cart</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Error Dialog */}
      <Dialog
        open={orderStatus?.success === false && orderStatus.type === "unknown"}
        onOpenChange={(open) => !open && resetOrderStatus()}
      >
        <DialogContent className="max-w-md text-center">
          <DialogTitle></DialogTitle>
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Error Placing Order</h3>
            <p className="text-muted-foreground mb-6">
              There was an error processing your order. Please try again.
            </p>
            <Button onClick={resetOrderStatus} className="w-full">
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Coming Soon Dialog */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                {paymentMethod === "upi" ? (
                  <Smartphone className="h-12 w-12 text-blue-500" />
                ) : (
                  <CreditCard className="h-12 w-12 text-blue-500" />
                )}
                <span>Coming Soon!</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-lg">
              {paymentMethod === "upi"
                ? "UPI Payments will be available soon!"
                : "Card Payments will be available soon!"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please select Cash on Delivery for now.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Address Alert Dialog */}
      <Dialog open={showAddressAlert} onOpenChange={setShowAddressAlert}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              <div className="flex flex-col items-center gap-4">
                <XCircle className="h-12 w-12 text-red-500" />
                <span>Address Required</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-lg">
              Please select a delivery address to continue
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              You need to choose an address before placing your order.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
