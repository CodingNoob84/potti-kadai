import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { getCartItems } from "@/server/cart";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export const CartButton = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const { data: items } = useQuery({
    queryKey: ["cartitems", user?.id],
    queryFn: () => getCartItems(user?.id as string),
    enabled: !!user?.id,
  });
  console.log("data", items);
  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <Link href="/cart">
      <motion.div
        initial={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {totalItems ?? 0}
          </motion.span>
        </Button>
      </motion.div>
    </Link>
  );
};
