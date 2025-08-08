"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FREE_SHIPPING_LIMIT, SHIPPING_CHARGES } from "@/lib/contants";
import { getBestDiscountValue, roundToTwoDecimals } from "@/lib/utils";
import { CartItemDetail } from "@/server/cart";
import { motion } from "framer-motion";
import { Check, Gift, Truck, Zap } from "lucide-react";

export const FreeShippingProgress = ({
  cartItems,
}: {
  cartItems: CartItemDetail[] | undefined;
}) => {
  let subtotal = 0;

  if (cartItems) {
    for (const item of cartItems) {
      const { discountedPrice } = getBestDiscountValue(
        item.discounts,
        item.price,
        item.quantity
      );
      subtotal += discountedPrice * item.quantity;
    }
  }
  const progressToFreeShipping = Math.min(
    (subtotal / FREE_SHIPPING_LIMIT) * 100,
    100
  );
  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_LIMIT - subtotal);

  const isEligible = subtotal >= FREE_SHIPPING_LIMIT;
  const isClose = !isEligible && progressToFreeShipping > 70;

  const getProgressMessage = (progress: number): string => {
    if (progress < 25) return "You're just getting started!";
    if (progress < 50) return "Keep it going!";
    if (progress < 75) return "You're over halfway there!";
    if (progress < 100) return "Almost there!";
    return "You're there!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`relative overflow-hidden rounded-lg ${
          isEligible
            ? "bg-green-50 border-green-200"
            : isClose
            ? "bg-amber-50 border-amber-200"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <CardContent className="p-4">
          {/* Top Row - Icon and Main Message */}
          <div className="flex items-start gap-3 mb-3">
            <motion.div
              animate={{
                rotate: isEligible ? [0, 15, -15, 0] : 0,
                scale: isEligible ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.7 }}
              className={`p-2 rounded-full mt-0.5 ${
                isEligible
                  ? "bg-green-100 text-green-600"
                  : isClose
                  ? "bg-amber-100 text-amber-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {isEligible ? (
                <Gift className="h-4 w-4" />
              ) : isClose ? (
                <Zap className="h-4 w-4" />
              ) : (
                <Truck className="h-4 w-4" />
              )}
            </motion.div>

            <div className="flex-1">
              <h3
                className={`font-semibold text-sm ${
                  isEligible
                    ? "text-green-800"
                    : isClose
                    ? "text-amber-800"
                    : "text-blue-800"
                }`}
              >
                {isEligible
                  ? "🎉 Free shipping unlocked!"
                  : isClose
                  ? "You're almost there!"
                  : "Free shipping progress"}
              </h3>

              {/* Amount Needed/Saved - Mobile Optimized */}
              <div className="flex flex-wrap items-baseline gap-1 mt-1">
                {isEligible ? (
                  <span className="text-xs text-green-700 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    You saved ₹{SHIPPING_CHARGES}
                  </span>
                ) : (
                  <>
                    <span className="text-xs font-medium">
                      Add ₹{amountForFreeShipping.toFixed(2)} more
                    </span>
                    <span className="text-xs text-gray-600">
                      for free shipping
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Amount Display - Right-aligned */}
            <div className="text-right">
              <div className="text-base font-bold">
                ₹{roundToTwoDecimals(subtotal)}
              </div>
              <div className="text-xs text-gray-500">
                / ₹{FREE_SHIPPING_LIMIT}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <Progress
              value={progressToFreeShipping}
              className={`h-2 ${
                isEligible
                  ? "bg-green-200 [&>div]:bg-green-500"
                  : isClose
                  ? "bg-amber-200 [&>div]:bg-amber-500"
                  : "bg-blue-200 [&>div]:bg-blue-500"
              }`}
            />
          </div>

          {/* Progress Percentage */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">
              {isEligible
                ? "Order qualifies for free delivery"
                : getProgressMessage(progressToFreeShipping)}
            </span>
            {!isEligible && (
              <span className="text-xs font-medium">
                {roundToTwoDecimals(progressToFreeShipping)}%
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
