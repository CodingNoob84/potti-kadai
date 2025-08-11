"use client";

import { CartItemsList } from "@/components/website/cart/cart-list";
import { CartLoading } from "@/components/website/cart/cart-loading";
import { EmptyCart } from "@/components/website/cart/empty-cart";
import { FreeShippingProgress } from "@/components/website/cart/free-shipping";
import { OrderSummary } from "@/components/website/cart/order-summary";
import { useSession } from "@/lib/auth-client";
import { getCartItems } from "@/server/cart";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { CartAutoDeleteTimer } from "./cart-auto-delete-timer";

export const CartClientPage = () => {
  //const router = useRouter();

  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;

  const { data: items, isLoading } = useQuery({
    queryKey: ["cartitems", user?.id],
    queryFn: () => getCartItems(user!.id),
    enabled: !!user?.id,
  });

  if (sessionLoading || isLoading) {
    return <CartLoading />;
  }

  if (!items || items.length === 0) {
    return <EmptyCart />;
  }

  const wishlistCount = 3; // TODO: Fetch dynamically later

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container max-w-7xl mx-auto px-4 py-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-xl">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </motion.div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
            <Link
              href="/wishlist"
              className="flex items-center gap-2 px-4 py-2 bg-primary/60 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Heart className="h-4 w-4" />
              <span className="font-medium">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-white text-pink-600 text-xs font-bold px-2 py-1 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </motion.div>

        {/* Auto-Delete Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <CartAutoDeleteTimer />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <FreeShippingProgress cartItems={items} />
            <CartItemsList userId={user!.id} cartItems={items} />
          </div>

          <OrderSummary cartItems={items} />
        </div>
      </motion.div>
    </div>
  );
};
