"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const initialCartItems = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    price: 599,
    originalPrice: 799,
    image: "/images/products/p_img4.png",
    size: "M",
    color: "Black",
    quantity: 2,
  },
  {
    id: 2,
    name: "Denim Casual Shirt",
    price: 1299,
    originalPrice: 1599,
    image: "/images/products/p_img5.png",
    size: "L",
    color: "Blue",
    quantity: 1,
  },
  {
    id: 3,
    name: "Summer Dress",
    price: 1499,
    originalPrice: 1899,
    image: "/images/products/p_img6.png",
    size: "M",
    color: "Floral",
    quantity: 1,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 1000 ? 0 : 99;
  const total = subtotal + shipping;
  const freeShippingThreshold = 1000;
  const progressToFreeShipping = Math.min(
    (subtotal / freeShippingThreshold) * 100,
    100
  );
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (cartItems.length === 0) {
    return (
      <div className="container px-4 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Free Shipping Progress - Move this above cart items */}
          <Card
            className={`${
              subtotal >= freeShippingThreshold
                ? "bg-green-50 border-green-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Truck
                    className={`h-5 w-5 ${
                      subtotal >= freeShippingThreshold
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  />
                  <span className="font-semibold">
                    {subtotal >= freeShippingThreshold
                      ? "Congratulations! You get FREE shipping!"
                      : "Free Shipping Progress"}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  ₹{subtotal} / ₹{freeShippingThreshold}
                </span>
              </div>

              <Progress
                value={progressToFreeShipping}
                className={`h-3 ${
                  subtotal >= freeShippingThreshold
                    ? "[&>div]:bg-green-500"
                    : "[&>div]:bg-blue-500"
                }`}
              />

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-muted-foreground">
                  {subtotal >= freeShippingThreshold
                    ? "You saved ₹99 on shipping!"
                    : `Add ₹${amountForFreeShipping} more for free shipping`}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(progressToFreeShipping)}% complete
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Your Items (
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Size: {item.size} | Color: {item.color}
                      </p>

                      <div className="flex items-center space-x-2 mb-4">
                        <span className="font-bold text-lg">₹{item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-28">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>
                  Subtotal (
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items)
                </span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span
                  className={
                    shipping === 0 ? "text-green-600 font-semibold" : ""
                  }
                >
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full bg-transparent"
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
