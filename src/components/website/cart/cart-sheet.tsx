"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart-store";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FreeShippingProgress } from "./free-shipping";

export function CartSheet() {
  const { items, totalItems, totalPrice } = useCartStore();
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const [isOpen, setIsOpen] = useState(false);
  const [newItemAdded, setNewItemAdded] = useState(false);

  useEffect(() => {
    if (newItemAdded) {
      const timer = setTimeout(() => setNewItemAdded(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [newItemAdded]);

  const subtotal = totalPrice();
  const shipping = subtotal >= 1000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.div
          initial={{ scale: 1 }}
          animate={{
            scale: newItemAdded ? [1, 1.2, 1] : 1,
            rotate: newItemAdded ? [0, 10, -10, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalItems() > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {totalItems()}
              </motion.span>
            )}
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col px-4">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Shopping Cart ({totalItems()})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Free Shipping Progress */}

            <FreeShippingProgress />

            {/* Cart Items List */}
            <div className="space-y-4 mt-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.pvId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    layout // This enables smooth layout animations
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex space-x-3">
                          <motion.div
                            className="relative w-16 h-16 flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </motion.div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">
                              {item.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-1">
                              Size: {item.size} | Color: {item.color}
                            </p>

                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-bold">₹{item.price}</span>
                              {item.price > item.price && (
                                <span className="text-xs text-muted-foreground line-through">
                                  ₹{item.price}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <motion.div whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    updateQuantity(item.pvId, item.quantity - 1)
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                              </motion.div>
                              <motion.span
                                key={`quantity-${item.id}`}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="w-8 text-center text-sm font-semibold"
                              >
                                {item.quantity}
                              </motion.span>
                              <motion.div whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    updateQuantity(item.pvId, item.quantity + 1)
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </motion.div>
                            </div>

                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant={"secondary"}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeFromCart(item.pvId)}
                              >
                                <Trash2 className="h-3 w-3" /> Delete
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Order Summary - Sticky at bottom */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t pt-4 mt-auto"
          >
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-sm">
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

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <motion.span
                  key={`total-${total}`}
                  initial={{ scale: 1.1, color: "#10b981" }}
                  animate={{ scale: 1, color: "#000" }}
                  transition={{ duration: 0.5 }}
                >
                  ₹{total}
                </motion.span>
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
}
