"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Package, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";

export function EmptyOrders() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-md mx-auto px-4"
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="relative mx-auto w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-primary rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-2 bg-primary rounded-full flex items-center justify-center">
                  <Package className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                No orders yet
              </h2>
              <p className="text-gray-600">
                You haven&apos;t placed any orders yet. Start shopping to see
                your order history here!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 space-y-3"
            >
              <Button
                asChild
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Link href="/products" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full bg-transparent"
              >
                <Link href="/wishlist">View Wishlist</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500"
            >
              <Sparkles className="h-4 w-4" />
              <span>Free shipping on orders over $50</span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
