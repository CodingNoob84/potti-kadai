import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DiscountType } from "@/types/products";

export const PriceCalculation = ({
  discounts,
  price,
  quantity,
}: {
  discounts: DiscountType[];
  price: number;
  quantity: number;
}) => {
  // Find direct and quantity discounts
  const directDiscount = discounts.find((d) => d.type === "direct");
  const quantityDiscount = discounts.find(
    (d) =>
      d.type === "quantity" &&
      typeof d.minQuantity === "number" &&
      quantity >= d.minQuantity
  );
  console.log("quantityDiscount", quantityDiscount);

  // Use quantity discount if applicable, else direct
  const activeDiscount = quantityDiscount ?? directDiscount;

  const discountPercentage = activeDiscount?.value || 0;
  const discountedPrice = price - (price * discountPercentage) / 100;
  const totalPrice = price * quantity;
  const totalDiscountedPrice = discountedPrice * quantity;
  const savings = totalPrice - totalDiscountedPrice;

  return (
    <div className="space-y-4">
      {/* Price Details Card */}
      <Card className="border shadow-sm">
        <CardContent className=" px-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Price Details</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Price ({quantity} item{quantity > 1 ? "s" : ""})
              </span>
              <span className="font-medium">
                ₹{(price * quantity).toFixed(2)}
              </span>
            </div>

            {discountPercentage > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Discount{" "}
                    <Badge className="bg-red-500">
                      {discountPercentage}% OFF
                    </Badge>
                  </span>
                  <span className="text-green-600 font-medium">
                    -₹{savings.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">You Save</span>
                  <span className="text-green-600 font-medium">
                    ({discountPercentage}% off)
                  </span>
                </div>
              </>
            )}

            <div className="border-t border-gray-200 pt-3 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">
                  Total Amount
                </span>
                <span className="text-gray-900 font-semibold text-lg">
                  ₹
                  {discountPercentage > 0
                    ? totalDiscountedPrice.toFixed(2)
                    : totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Offers */}
      <Card className="border shadow-sm">
        <CardContent className="px-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Available Offers
          </h3>

          <div className="space-y-4">
            {discounts.map((discount, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`${
                    discount.type === "quantity"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  } rounded-full p-1.5`}
                >
                  {discount.type === "quantity" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {discount.type === "quantity"
                      ? `Bulk Discount: ${discount.value}% Off`
                      : `${discount.value}% Instant Discount`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {discount.type === "quantity"
                      ? `Buy ${discount.minQuantity}+ items and get ${discount.value}% off`
                      : `Get ${discount.value}% off on your order`}
                  </p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-blue-600 font-medium mr-2">
                      T&C Apply
                    </p>
                    {discount.type === "quantity" && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        Bulk Deal
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
