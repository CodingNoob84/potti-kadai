"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCartStore } from "@/store/cart-store";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";

export const FreeShippingProgress = () => {
  const { totalPrice } = useCartStore();
  const subtotal = totalPrice();
  console.log("--", subtotal);
  const freeShippingThreshold = 1000;
  const progressToFreeShipping = Math.min(
    (subtotal / freeShippingThreshold) * 100,
    100
  );
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={`shipping-${subtotal}`} // This ensures re-animation when subtotal changes
    >
      <Card
        className={`mt-4 ${
          subtotal >= freeShippingThreshold
            ? "bg-green-50 border-green-200"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{
                  rotate:
                    subtotal >= freeShippingThreshold ? [0, 15, -15, 0] : 0,
                }}
                transition={{ duration: 0.7 }}
              >
                <Truck
                  className={`h-4 w-4 ${
                    subtotal >= freeShippingThreshold
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                />
              </motion.div>
              <motion.span
                key={`message-${subtotal}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold"
              >
                {subtotal >= freeShippingThreshold
                  ? "You get FREE shipping!"
                  : "Free Shipping Progress"}
              </motion.span>
            </div>
            <motion.span
              key={`amount-${subtotal}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-xs font-medium"
            >
              ₹{subtotal} / ₹{freeShippingThreshold}
            </motion.span>
          </div>

          <motion.div
            key={`progress-${subtotal}`}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
          >
            <Progress
              value={progressToFreeShipping}
              className={`h-2 ${
                subtotal >= freeShippingThreshold
                  ? "[&>div]:bg-green-500"
                  : `[&>div]:bg-blue-500 ${
                      progressToFreeShipping > 80 ? "animate-pulse" : ""
                    }`
              }`}
            />
          </motion.div>

          <div className="flex justify-between items-center mt-2">
            <motion.span
              key={`hint-${subtotal}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-muted-foreground"
            >
              {subtotal >= freeShippingThreshold
                ? "You saved ₹99 on shipping!"
                : `Add ₹${amountForFreeShipping} more for free shipping`}
            </motion.span>
            <motion.span
              key={`percent-${progressToFreeShipping}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-xs text-muted-foreground"
            >
              {Math.round(progressToFreeShipping)}% complete
            </motion.span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
