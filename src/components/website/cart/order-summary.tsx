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
import {
  CURRENCY_SYMBOL,
  FREE_SHIPPING_LIMIT,
  SHIPPING_CHARGES,
  TAX_PERCENTAGE,
} from "@/lib/contants";
import { getBestDiscountValue } from "@/lib/utils";
import { CartItemDetail } from "@/server/cart";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Heart,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const OrderSummary = ({
  cartItems,
}: {
  cartItems: CartItemDetail[] | undefined;
}) => {
  //const queryClient = useQueryClient();
  console.log("cartItems", cartItems);
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0);

  let subtotal = 0;
  let originalTotal = 0;

  if (cartItems) {
    for (const item of cartItems) {
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
  const totaltax = round2((TAX_PERCENTAGE * totalWithShipping) / 100);
  const total = round2(totalWithShipping + totaltax);

  const handleProceedCheckOut = () => {
    toast.success("Proceeding to checkout...");
    router.push("/checkout");
  };

  const handleRemoveAllOutOfStock = () => {
    toast.success("Out of stock items removed");
    setOpenModal(false);
  };

  const handleMoveAllToWishlist = async () => {
    try {
      toast.success("Items moved to wishlist successfully");
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to move items to wishlist");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="sticky top-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Breakdown */}
            <div className="space-y-4">
              {totalSavings > 0 && (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Original Price ({totalItems}{" "}
                      {totalItems === 1 ? "item" : "items"})
                    </span>
                    <span>
                      {CURRENCY_SYMBOL}
                      {originalTotal.toFixed(2)}
                    </span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between text-green-600 bg-green-50 p-3 rounded-lg"
                  >
                    <span className="font-medium">Total Savings</span>
                    <span className="font-bold">
                      -{CURRENCY_SYMBOL}
                      {totalSavings.toFixed(2)}
                    </span>
                  </motion.div>
                </>
              )}

              <div className="flex justify-between text-lg">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">
                  {CURRENCY_SYMBOL}
                  {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span
                  className={
                    shipping === 0 ? "text-green-600 font-semibold" : ""
                  }
                >
                  {shipping === 0
                    ? "FREE"
                    : `${CURRENCY_SYMBOL}${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax ({TAX_PERCENTAGE}%)</span>
                <span>
                  {CURRENCY_SYMBOL}
                  {totaltax.toFixed(2)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Grand Total */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="space-y-3 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl"
            >
              <div className="flex justify-between text-xl font-bold">
                <span>Order Total</span>
                <span className="text-2xl">${total.toFixed(2)}</span>
              </div>
              {totalSavings > 0 && (
                <p className="text-sm text-green-600 text-center font-medium">
                  🎉 You saved {CURRENCY_SYMBOL}
                  {totalSavings.toFixed(2)} on this order!
                </p>
              )}
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                size="lg"
                className="w-full text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleProceedCheckOut}
              >
                <ShieldCheck className="h-5 w-5 mr-2" />
                Secure Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-2 hover:bg-gray-50 py-3 rounded-xl font-medium"
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure SSL encrypted checkout</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <div className="flex flex-col items-center text-center space-y-6 p-2">
            <div className="bg-red-50 p-4 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Out-of-Stock Items Detected
              </DialogTitle>
            </DialogHeader>

            <div className="text-sm text-gray-600 space-y-3">
              <p>
                Your cart contains items that are currently out of stock and
                cannot be purchased.
              </p>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">
                  Please remove these items or move them to your wishlist to
                  continue.
                </p>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
                onClick={handleRemoveAllOutOfStock}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove All
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={handleMoveAllToWishlist}
              >
                <Heart className="w-4 h-4 mr-2" />
                Move to Wishlist
              </Button>
            </div>

            <Button
              variant="link"
              className="text-gray-500 hover:text-gray-700 text-sm"
              onClick={() => setOpenModal(false)}
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
