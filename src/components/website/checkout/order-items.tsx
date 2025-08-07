import Image from "next/image";

type OrderItemsDetails = {
  productId: number | null;
  name: string;
  price: number;
  discountedPrice: number;
  discountedText: string;
  imageUrl: string;
  quantity: number;
  colorName: string;
  sizeName: string;
};

export const OrderItemsDetails = ({
  isLoading,
  OrderItems,
}: {
  isLoading: boolean;
  OrderItems: OrderItemsDetails[] | undefined;
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array(2)
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
          ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {OrderItems?.map((item, i) => {
        const originalTotal = item.price * item.quantity;
        const discountedTotal = item.discountedPrice * item.quantity;
        const savings = originalTotal - discountedTotal;

        return (
          <div key={i} className="flex space-x-3">
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
                {item.sizeName} | {item.colorName} | Qty: {item.quantity}
              </p>

              {/* Detailed Price Breakdown */}
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Price:</span>
                  <div className="flex gap-1">
                    <span>₹{item.price}</span>
                    <span>×</span>
                    <span>{item.quantity}</span>
                    <span>=</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>

                {item.price > item.discountedPrice && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Discount Applied:
                      </span>
                      <span className="text-green-600">
                        -₹{savings.toFixed(2)}
                      </span>
                    </div>
                    {item.discountedText && (
                      <div className="text-xs text-green-600">
                        ({item.discountedText})
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                  <span>Final Price:</span>
                  <span>₹{discountedTotal}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
