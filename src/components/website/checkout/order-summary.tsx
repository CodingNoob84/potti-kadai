"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getCheckOutItems, placeOrder } from "@/server/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  Lock,
  Smartphone,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { OrderItemsDetails } from "./order-items";
import { PromoCodeSection } from "./promocode";

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
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ["cartitems-checkout", userId],
    queryFn: () => getCheckOutItems(userId as string),
    enabled: !!userId,
  });

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showAddressAlert, setShowAddressAlert] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [newOrderId, setNewOrderId] = useState("");
  //const [promocodeAmt, setPromocodeAmt] = useState(0);
  const [orderStatus, setOrderStatus] = useState<{
    success: boolean;
    type?: string;
  } | null>(null);

  const placeOrderMutation = useMutation({
    mutationFn: (data: PlaceOrderParams) => placeOrder(data),
    onSuccess: (data) => {
      console.log("Order placed successfully:", data);
      if (data.success) {
        setNewOrderId(data.orderId?.toString() as string);
        setOrderStatus({ success: true });
        queryClient.invalidateQueries({ queryKey: ["cartitems", userId] });
        queryClient.invalidateQueries({
          queryKey: ["cartitems-count", userId],
        });
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
          <OrderItemsDetails
            isLoading={isLoading}
            OrderItems={items?.cartItems}
          />

          <Separator />

          <div className="space-y-4">
            {/* Order Summary Items */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({items?.totalItems} items)
                </span>
                <span className="font-medium">₹{items?.subtotal}</span>
              </div>

              {(items?.savings ?? 0) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>You Save</span>
                  <span className="font-medium">-₹{items?.savings}</span>
                </div>
              )}

              {/* Promo Code Section */}
              <PromoCodeSection />

              <Separator />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span
                  className={
                    items?.shipping === 0 ? "text-green-600 font-semibold" : ""
                  }
                >
                  {items?.shipping === 0 ? "FREE" : `₹${items?.shipping}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">₹{items?.tax}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-xl">
                    ₹{items?.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 h-12"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || orderStatus?.success}
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Place Order Securely
                </>
              )}
            </Button>

            {/* Secure Checkout Notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Guaranteed safe & secure checkout</span>
            </div>
          </div>
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
              Your order #{newOrderId} has been confirmed. We&apos;ve sent a
              confirmation email with all the details.
            </p>
            <div className="flex gap-3 w-full">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href={`/payment-receipt?orderid=${newOrderId}`}>
                  View Order
                </Link>
              </Button>
            </div>
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
              Some items in your cart are currently out of stock. We&apos;ve
              updated your cart with available items.
            </p>
            <Button asChild variant="outline" className="w-full">
              <a href="/cart">Update Cart</a>
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
              There was an unexpected error processing your order. Please try
              again or contact support if the problem persists.
            </p>
            <div className="flex gap-3 w-full">
              <Button onClick={resetOrderStatus} className="flex-1">
                Try Again
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <a href="/contact">Contact Support</a>
              </Button>
            </div>
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
          <div className="flex justify-center gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowComingSoon(false)}>
              Continue Shopping
            </Button>
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
          <div className="flex justify-center gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddressAlert(false)}
            >
              Back to Checkout
            </Button>
            <Button asChild>
              <a href="/account/addresses">Add Address</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
