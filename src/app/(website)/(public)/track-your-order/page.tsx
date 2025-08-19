import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, Clock, MapPin, Truck } from "lucide-react";

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface OrderDetails {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  shippingMethod: string;
  carrier: string;
  trackingNumber: string;
  recipient: string;
  deliveryAddress: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    image: string;
  }[];
  status:
    | "processing"
    | "shipped"
    | "in-transit"
    | "out-for-delivery"
    | "delivered"
    | "returned";
  trackingEvents: TrackingEvent[];
}

export default function TrackOrderPage() {
  // Mock data - replace with actual API calls
  const orderDetails: OrderDetails = {
    orderId: "PK-2023-8765",
    orderDate: "October 15, 2023",
    estimatedDelivery: "October 20, 2023",
    shippingMethod: "Standard Shipping",
    carrier: "Delhivery",
    trackingNumber: "DEL123456789",
    recipient: "Karthik Kumar",
    deliveryAddress: "12 Market Street, Mylapore, Chennai, Tamil Nadu 600004",
    items: [
      {
        id: "item-1",
        name: "Traditional Cotton Kurta",
        quantity: 1,
        image: "/products/kurta.jpg",
      },
      {
        id: "item-2",
        name: "Handcrafted Leather Jutti",
        quantity: 2,
        image: "/products/jutti.jpg",
      },
    ],
    status: "in-transit",
    trackingEvents: [
      {
        id: "event-1",
        status: "Order Placed",
        location: "Chennai",
        timestamp: "Oct 15, 2023 • 10:30 AM",
        description: "Your order has been received",
        completed: true,
        current: false,
      },
      {
        id: "event-2",
        status: "Processing",
        location: "Chennai",
        timestamp: "Oct 15, 2023 • 2:45 PM",
        description: "We're preparing your order",
        completed: true,
        current: false,
      },
      {
        id: "event-3",
        status: "Shipped",
        location: "Chennai",
        timestamp: "Oct 16, 2023 • 11:20 AM",
        description: "Your package is on its way",
        completed: true,
        current: false,
      },
      {
        id: "event-4",
        status: "In Transit",
        location: "Bangalore",
        timestamp: "Oct 17, 2023 • 3:15 PM",
        description: "Package has reached nearest hub",
        completed: false,
        current: true,
      },
      {
        id: "event-5",
        status: "Out for Delivery",
        location: "",
        timestamp: "",
        description: "",
        completed: false,
        current: false,
      },
      {
        id: "event-6",
        status: "Delivered",
        location: "",
        timestamp: "",
        description: "",
        completed: false,
        current: false,
      },
    ],
  };

  const getStatusBadge = (status: OrderDetails["status"]) => {
    switch (status) {
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>;
      case "in-transit":
        return (
          <Badge className="bg-purple-100 text-purple-800">In Transit</Badge>
        );
      case "out-for-delivery":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            Out for Delivery
          </Badge>
        );
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case "returned":
        return <Badge className="bg-red-100 text-red-800">Returned</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <section className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Track Your Order
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Enter your order details to check the current status and estimated
          delivery date
        </p>
      </section>

      {/* Tracking Form */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="order-id" className="text-sm font-medium">
                Order Number
              </label>
              <Input id="order-id" placeholder="PK-2023-XXXX" />
            </div>
            <div className="space-y-1">
              <label htmlFor="tracking-number" className="text-sm font-medium">
                Tracking Number
              </label>
              <Input id="tracking-number" placeholder="DELXXXXXXX" />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email or Phone
              </label>
              <Input id="email" placeholder="Registered email or phone" />
            </div>
          </div>
          <Button className="mt-6 w-full md:w-auto">Track Order</Button>
        </CardContent>
      </Card>

      {/* Order Status */}
      {orderDetails && (
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {orderDetails.orderDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span>{getStatusBadge(orderDetails.status)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Method:</span>
                    <span className="font-medium">
                      {orderDetails.shippingMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carrier:</span>
                    <span className="font-medium">{orderDetails.carrier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking Number:</span>
                    <span className="font-medium">
                      {orderDetails.trackingNumber}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-medium">
                      {orderDetails.estimatedDelivery}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-gray-500" />
                  <div>
                    <p className="font-medium">{orderDetails.recipient}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {orderDetails.deliveryAddress}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracking Timeline */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order Tracking</CardTitle>
                  <Button variant="outline" size="sm">
                    <Truck className="w-4 h-4 mr-2" />
                    View Carrier Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Progress Bar */}
                  <div className="px-4">
                    <Progress
                      value={
                        (orderDetails.trackingEvents.filter((e) => e.completed)
                          .length /
                          orderDetails.trackingEvents.length) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  {/* Tracking Events */}
                  <div className="relative">
                    <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200" />
                    {orderDetails.trackingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="relative pl-12 pb-8 last:pb-0"
                      >
                        <div
                          className={`absolute left-8 top-0 h-8 w-0.5 ${
                            event.current
                              ? "bg-primary"
                              : event.completed
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                          style={{ height: "100%" }}
                        />
                        <div
                          className={`absolute left-5 top-0.5 flex items-center justify-center w-6 h-6 rounded-full ${
                            event.current
                              ? "bg-primary"
                              : event.completed
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        >
                          {event.completed ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : event.current ? (
                            <Clock className="w-4 h-4 text-white" />
                          ) : (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div
                          className={`p-4 rounded-lg ${
                            event.current
                              ? "bg-primary/10 border border-primary/20"
                              : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{event.status}</h3>
                            <span className="text-sm text-gray-500">
                              {event.timestamp}
                            </span>
                          </div>
                          {event.location && (
                            <p className="text-sm text-gray-600 mt-1 flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1.5" />
                              {event.location}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-sm mt-2">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Product
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Support Card */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-destructive/10 p-3 rounded-full">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                Need help with your order?
              </h3>
              <p className="text-gray-700">
                If you&apos;re experiencing issues with your delivery or have
                any questions, our support team is available to help.
              </p>
            </div>
            <Button variant="destructive">Contact Support</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
