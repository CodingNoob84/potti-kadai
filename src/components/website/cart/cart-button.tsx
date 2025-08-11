import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { getCartItems } from "@/server/cart";
import { useQuery } from "@tanstack/react-query";
import { motion, useAnimationControls } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CartButton = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [prevTotalItems, setPrevTotalItems] = useState(0);
  const [itemChangeType, setItemChangeType] = useState<
    "increase" | "decrease" | null
  >(null);
  const controls = useAnimationControls();

  const { data: items } = useQuery({
    queryKey: ["cartitems", user?.id],
    queryFn: () => getCartItems(user?.id as string),
    enabled: !!user?.id,
  });

  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const handleCartClicked = () => {
    if (session) {
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (totalItems !== prevTotalItems) {
      if (totalItems > prevTotalItems) {
        setItemChangeType("increase");
        // Animation for item added
        controls.start({
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.5 },
        });
      } else if (totalItems < prevTotalItems && prevTotalItems > 0) {
        setItemChangeType("decrease");
        // Animation for item removed
        controls.start({
          scale: [1, 0.9, 1],
          transition: { duration: 0.3 },
        });
      }
      setPrevTotalItems(totalItems);

      // Reset the change type after animation completes
      const timer = setTimeout(() => setItemChangeType(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [totalItems, prevTotalItems, controls]);

  return (
    <motion.div className="relative" onClick={() => handleCartClicked()}>
      <Button variant="ghost" size="icon" className="relative">
        <motion.div animate={controls}>
          <ShoppingCart className="h-5 w-5" />
        </motion.div>
        {totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
            }}
            transition={{ duration: 0.5 }}
            className={`
                absolute -top-2 -right-2 text-primary-foreground text-xs rounded-full 
                h-5 w-5 flex items-center justify-center
                ${itemChangeType === "increase" ? "bg-primary" : ""}
                ${itemChangeType === "decrease" ? "bg-destructive" : ""}
                ${!itemChangeType ? "bg-primary" : ""}
              `}
          >
            {totalItems}
          </motion.span>
        )}
      </Button>
    </motion.div>
  );
};
