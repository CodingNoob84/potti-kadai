"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBestDiscount, getDiscountValues } from "@/lib/utils";
import { DiscountType } from "@/types/products";
import { motion } from "framer-motion";
import { Calculator, Gift, Sparkles, Tag } from "lucide-react";

export const PriceCalculation = ({
  discounts,
  price,
  quantity,
}: {
  discounts: DiscountType[];
  price: number;
  quantity: number;
}) => {
  const activeDiscount = getBestDiscount(discounts, price, quantity);
  const { discountedText, discountedPrice } = getDiscountValues(
    activeDiscount,
    price,
    quantity
  );

  const totalPrice = price * quantity;
  const totalDiscountedPrice = discountedPrice * quantity;
  const totalSavings = totalPrice - totalDiscountedPrice;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-8 space-y-6"
    >
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-primary rounded-lg">
              <Calculator className="h-4 w-4 text-primary-foreground" />
            </div>
            Price Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Price ({quantity} item{quantity > 1 ? "s" : ""})
              </span>
              <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
            </div>

            {discountedText && (
              <div className="flex justify-between items-center text-green-600">
                <span>Discount ({discountedText})</span>
                <span className="font-semibold">
                  -₹{totalSavings.toFixed(2)}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount</span>
              <span>₹{totalDiscountedPrice.toFixed(2)}</span>
            </div>

            {totalSavings > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 text-green-800">
                  <Tag className="h-4 w-4" />
                  <span className="font-semibold">
                    You will save ₹{totalSavings.toFixed(2)} on this order
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          <Separator />

          {/* Available Offers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-gray-900">
                Available Offers
              </span>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </div>

            <div className="space-y-3">
              {discounts.map((discount, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-gradient-to-r from-orange-50 to-red-50 border-orange-200"
                >
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-orange-500"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="text-white text-xs font-bold bg-orange-500">
                        {discount.type === "percentage"
                          ? `${discount.value}% OFF`
                          : `₹${discount.value} OFF`}
                      </Badge>
                      {discount.minQuantity > 1 && (
                        <span className="text-xs text-orange-600">
                          on {discount.minQuantity}+ items
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-orange-800">
                      {discount.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
