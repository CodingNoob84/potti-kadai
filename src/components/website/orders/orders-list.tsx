"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { OrderResponse } from "@/server/cart";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Hash,
  MapPin,
  Package,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export function OrdersList({
  orders,
}: {
  orders: OrderResponse[] | undefined;
}) {
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );

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
    <div className="space-y-6">
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
              <Card className="hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-gray-500" />
                          <span className="font-bold text-lg">
                            #{order.orderNumber}
                          </span>
                        </div>
                        <Badge
                          className={`${getStatusColor(
                            order.status
                          )} flex items-center gap-1`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Ordered on {formatDate(order.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          <span>
                            {getPaymentMethodDisplay(order.paymentMethod)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {order.items.slice(0, 2).map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + itemIndex * 0.1 }}
                        className="flex gap-4 p-3 bg-primary/5 rounded-lg"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.sizeName} • {item.colorName}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-primary">
                              ${item.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {order.items.length > 2 && (
                      <div className="text-center py-2 text-sm text-gray-600 bg-secondary/10 rounded-lg">
                        +{order.items.length - 2} more{" "}
                        {order.items.length - 2 === 1 ? "item" : "items"}
                      </div>
                    )}
                  </div>

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div className="mb-6 p-4 bg-secondary/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-4 w-4 text-secondary" />
                        <span className="font-medium text-secondary">
                          Tracking Information
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          Tracking Number:{" "}
                          <span className="font-mono font-bold">
                            {order.trackingNumber}
                          </span>
                        </div>
                        {order.estimatedDelivery && (
                          <div>
                            Estimated Delivery:{" "}
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
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <X className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-red-800">
                          Cancellation Reason
                        </span>
                      </div>
                      {/* <p className="text-sm text-red-700">{order.cancelReason}</p> */}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 bg-primary/5 border-primary/20 hover:bg-primary/10"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order #{selectedOrder?.orderNumber}
                          </DialogTitle>
                        </DialogHeader>

                        {selectedOrder && (
                          <div className="space-y-6 mt-4">
                            {/* Order Status */}
                            <div className="flex items-center justify-between">
                              <Badge
                                className={`${getStatusColor(
                                  selectedOrder.status
                                )} flex items-center gap-1 text-sm px-3 py-1`}
                              >
                                {getStatusIcon(selectedOrder.status)}
                                {selectedOrder.status.charAt(0).toUpperCase() +
                                  selectedOrder.status.slice(1)}
                              </Badge>
                              <div className="text-right">
                                <div className="text-xl font-bold">
                                  ${selectedOrder.total.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {formatDate(selectedOrder.date)}
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Items */}
                            <div>
                              <h3 className="font-semibold mb-3">
                                Order Items
                              </h3>
                              <div className="space-y-3">
                                {selectedOrder.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                                  >
                                    <Image
                                      src={item.imageUrl || "/placeholder.svg"}
                                      alt={item.name}
                                      width={60}
                                      height={60}
                                      className="object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-medium">
                                        {item.name}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {item.sizeName} • {item.colorName}
                                      </p>
                                      <div className="flex justify-between items-center mt-2">
                                        <span className="font-bold">
                                          ${item.price.toFixed(2)}
                                        </span>
                                        <span className="text-sm">
                                          Qty: {item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Shipping Address */}
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Shipping Address
                              </h3>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium">
                                  {selectedOrder.shippingAddress.name}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {selectedOrder.shippingAddress.address}
                                  <br />
                                  {selectedOrder.shippingAddress.city},{" "}
                                  {selectedOrder.shippingAddress.state} -{" "}
                                  {selectedOrder.shippingAddress.pincode}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {order.status === "confirmed" && (
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel Order
                      </Button>
                    )}

                    {order.status === "shipped" && (
                      <Button className="flex-1 bg-secondary hover:bg-secondary/90">
                        <Truck className="h-4 w-4 mr-2" />
                        Track Order
                      </Button>
                    )}
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
          className="text-center py-12"
        >
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more orders.
          </p>
        </motion.div>
      )}
    </div>
  );
}
