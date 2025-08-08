"use client";

import { EmptyWishlist } from "@/components/website/wishlist/empty-wishlist";
import { WishlistLoading } from "@/components/website/wishlist/wishlist-loader";
import { useSession } from "@/lib/auth-client";
import { getWishlistItems } from "@/server/wishlist";
import { useQuery } from "@tanstack/react-query";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

// Dummy wishlist data
const dummyWishlistItems = [
  {
    id: 1,
    productId: 5,
    name: "Wireless Bluetooth Earbuds",
    price: 89.99,
    originalPrice: 129.99,
    imageUrl: "/placeholder.svg?height=200&width=200&text=Earbuds",
    sizeName: "One Size",
    colorName: "Pearl White",
    isAvailable: true,
    availableQuantity: 12,
    discounts: [{ type: "percentage", value: 30, minQuantity: 1 }],
    addedDate: "2024-01-15",
    category: "Electronics",
  },
  {
    id: 2,
    productId: 6,
    name: "Vintage Denim Jacket",
    price: 79.99,
    originalPrice: 79.99,
    imageUrl: "/placeholder.svg?height=200&width=200&text=Jacket",
    sizeName: "Medium",
    colorName: "Classic Blue",
    isAvailable: false,
    availableQuantity: 0,
    discounts: [],
    addedDate: "2024-01-10",
    category: "Clothing",
  },
  {
    id: 3,
    productId: 7,
    name: "Minimalist Watch",
    price: 149.99,
    originalPrice: 199.99,
    imageUrl: "/placeholder.svg?height=200&width=200&text=Watch",
    sizeName: "40mm",
    colorName: "Rose Gold",
    isAvailable: true,
    availableQuantity: 3,
    discounts: [{ type: "fixed", value: 50, minQuantity: 1 }],
    addedDate: "2024-01-12",
    category: "Accessories",
  },
  {
    id: 4,
    productId: 8,
    name: "Organic Cotton Hoodie",
    price: 69.99,
    originalPrice: 89.99,
    imageUrl: "/placeholder.svg?height=200&width=200&text=Hoodie",
    sizeName: "Large",
    colorName: "Sage Green",
    isAvailable: true,
    availableQuantity: 8,
    discounts: [{ type: "percentage", value: 22, minQuantity: 1 }],
    addedDate: "2024-01-08",
    category: "Clothing",
  },
  {
    id: 5,
    productId: 9,
    name: "Professional Camera Lens",
    price: 299.99,
    originalPrice: 399.99,
    imageUrl: "/placeholder.svg?height=200&width=200&text=Lens",
    sizeName: "50mm",
    colorName: "Black",
    isAvailable: true,
    availableQuantity: 1,
    discounts: [{ type: "percentage", value: 25, minQuantity: 1 }],
    addedDate: "2024-01-05",
    category: "Electronics",
  },
];

export default function WishlistPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const { data: items, isLoading } = useQuery({
    queryKey: ["wishlistitems", user?.id],
    queryFn: () => getWishlistItems(user?.id as string),
    enabled: !!user?.id,
  });
  console.log("dummy", dummyWishlistItems);
  console.log("data", items);

  if (isLoading && isPending) {
    return <WishlistLoading />;
  }

  if (items?.length === 0) {
    return <EmptyWishlist />;
  }

  const availableCount = 4;
  const unavailableCount = 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="font-medium">
                {items?.length} {items?.length === 1 ? "item" : "items"} saved
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {availableCount} available
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {unavailableCount} out of stock
              </span>
            </div>
          </div>
        </motion.div>

        {/* <WishlistItemsList
          userId={user.id}
          wishlistItems={filteredAndSortedItems}
          setItems={setItems}
          allItems={items}
        /> */}
      </motion.div>
    </div>
  );
}
