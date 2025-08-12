"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderResponse } from "@/server/cart";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Hash,
  Package,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export function OrdersList({
  orders,
}: {
  orders: OrderResponse[] | undefined;
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500 text-white";
      case "processing":
        return "bg-yellow-500 text-white";
      case "shipped":
        return "bg-purple-500 text-white";
      case "delivered":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCancelOrder = (orderId: string) => {
    console.log("orderId", orderId);
    toast.success("Order cancelled successfully");
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery";
      case "upi":
        return "UPI Payment";
      case "razorpay":
        return "Card Payment";
      default:
        return method;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 sm:px-0">
      <AnimatePresence>
        {orders &&
          orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
            >
              <Card className="hover:shadow-md transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  {/* Order Header */}
                  <div className="flex flex-col gap-3 mb-4 md:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900 text-sm md:text-base">
                          #{order.orderNumber}
                        </span>
                      </div>
                      <Badge
                        className={`${getStatusColor(
                          order.status
                        )} flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs md:text-sm`}
                      >
                        {getStatusIcon(order.status)}
                        <span>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Ordered {formatDate(order.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>
                            {getPaymentMethodDisplay(order.paymentMethod)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base md:text-lg font-semibold text-gray-900">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4 md:mb-6">
                    {order.items.slice(0, 2).map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + itemIndex * 0.1 }}
                        className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm md:text-base line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {item.sizeName} • {item.colorName}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-semibold text-primary text-sm md:text-base">
                              ${item.price.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {order.items.length > 2 && (
                      <div className="text-center py-2 text-xs text-gray-500 bg-gray-50 rounded-lg">
                        +{order.items.length - 2} more{" "}
                        {order.items.length - 2 === 1 ? "item" : "items"}
                      </div>
                    )}
                  </div>

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div className="mb-4 md:mb-6 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Truck className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-700 text-sm">
                          Tracking Information
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          Tracking #:{" "}
                          <span className="font-mono font-medium">
                            {order.trackingNumber}
                          </span>
                        </div>
                        {order.estimatedDelivery && (
                          <div>
                            Est. Delivery:{" "}
                            <span className="font-medium">
                              {formatDate(order.estimatedDelivery)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cancel Reason */}
                  {order.status === "cancelled" && (
                    <div className="mb-4 md:mb-6 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-1.5">
                        <X className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-red-700 text-sm">
                          Cancellation Reason
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex items-center gap-2 text-white px-0"
                      asChild
                    >
                      <Link
                        href={{
                          pathname: "/payment-receipt",
                          query: { orderid: order.id },
                        }}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm">View Receipt</span>
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      {order.status === "confirmed" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="text-sm">Cancel</span>
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 gap-2"
                        >
                          <Truck className="h-4 w-4" />
                          <span className="text-sm">Track</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </AnimatePresence>

      {orders?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 px-4"
        >
          <Package className="h-14 w-14 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            You haven&apos;t placed any orders yet. Start shopping to see your
            orders here.
          </p>
        </motion.div>
      )}
    </div>
  );
}
