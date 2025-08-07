import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBestDiscount, getDiscountValues } from "@/lib/utils";
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
  const activeDiscount = getBestDiscount(discounts, price, quantity);
  const { discountedText, discountedPrice } = getDiscountValues(
    activeDiscount,
    price,
    quantity
  );

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

            {discountedText != "" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Discount{" "}
                    <Badge className="bg-red-500">{discountedText}</Badge>
                  </span>
                  <span className="text-green-600 font-medium">
                    -₹{savings.toFixed(2)}
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
                  {discountedPrice > 0
                    ? totalDiscountedPrice.toFixed(2)
                    : totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Offers */}
      <Card className="border shadow-sm rounded-lg">
        <CardContent className="px-3 py-3">
          <div className="flex items-center gap-2 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-800">
              Available Offers
            </h3>
          </div>

          <div className="space-y-2">
            {discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md"
              >
                <div
                  className={`flex-shrink-0 ${
                    discount.minQuantity > 1
                      ? "text-purple-500"
                      : "text-green-500"
                  }`}
                >
                  {discount.minQuantity > 1 ? (
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

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-medium text-gray-800">
                      {discount.type === "percentage"
                        ? `${discount.value}% OFF`
                        : `₹${discount.value} OFF`}
                    </span>
                    {discount.minQuantity > 1 && (
                      <span className="text-xs text-gray-500">
                        on {discount.minQuantity}+ items
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {discount.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
