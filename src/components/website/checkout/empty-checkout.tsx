import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const EmptyCheckOut = () => {
  return (
    <div className="container px-4 py-12 flex flex-col items-center justify-center">
      <div className="max-w-md text-center flex flex-col items-center">
        <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Discover exciting discounts and offers! Continue shopping to find
          items you love.
        </p>
        <Button asChild>
          <Link href="/products" className="gap-2">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
