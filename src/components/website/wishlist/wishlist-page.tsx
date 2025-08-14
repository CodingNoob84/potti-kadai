"use client";

import { EmptyWishlist } from "@/components/website/wishlist/empty-wishlist";
import { WishlistLoading } from "@/components/website/wishlist/wishlist-loader";
import { useSession } from "@/lib/auth-client";
import { getWishlistItems } from "@/server/wishlist";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { WishlistItemsList } from "./wishlist-list";

export const WishlistClientPage = () => {
  const { data: session, isPending: isSessionPending } = useSession();
  const user = session?.user;

  const { data: items, isLoading: isWishlistLoading } = useQuery({
    queryKey: ["wishlistitems", user?.id],
    queryFn: () => getWishlistItems(user?.id as string),
    enabled: !!user?.id,
  });

  // Show loading state if either session is loading or wishlist is loading
  if (isSessionPending || isWishlistLoading) {
    return <WishlistLoading />;
  }

  // Show empty state if no items (after loading is complete)
  if (items?.length === 0) {
    return <EmptyWishlist />;
  }

  // Calculate available/unavailable counts
  const { availableCount, unavailableCount } = (items ?? []).reduce(
    (acc, item) => {
      if (item.availableQuantity > 0) {
        acc.availableCount += 1;
      } else {
        acc.unavailableCount += 1;
      }
      return acc;
    },
    { availableCount: 0, unavailableCount: 0 }
  );

  return (
    <div className="">
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
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-5 w-5 text-pink-500" />
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm">
              {/* Items count - emphasized on mobile */}
              <span className="font-medium text-base sm:text-sm text-gray-800 sm:text-gray-600">
                {items?.length} {items?.length === 1 ? "item" : "items"} saved
              </span>

              {/* Status indicators - now in a row on mobile, better spacing */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {/* Available count */}
                <span className="flex items-center gap-2 text-gray-700 sm:text-gray-600">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>
                    <span className="">Available: </span>
                    {availableCount}
                  </span>
                </span>

                {/* Out of stock count */}
                <span className="flex items-center gap-2 text-gray-700 sm:text-gray-600">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span>
                    <span className="">Out of stock: </span>
                    {unavailableCount}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <WishlistItemsList userId={user?.id as string} wishlistItems={items} />
      </motion.div>
    </div>
  );
};
