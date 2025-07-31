"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressBlock } from "@/components/website/checkout/address";
import { OrderSummary } from "@/components/website/checkout/order-summary";
import { PaymentMethods } from "@/components/website/checkout/payments";
import { useSession } from "@/lib/auth-client";
import { getCartTotalItems } from "@/server/cart";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { data: session, isPending: isSessionLoading } = useSession();
  const user = session?.user;
  const { data: items, isLoading: isCartLoading } = useQuery({
    queryKey: ["cartitems", user?.id],
    queryFn: () => getCartTotalItems(user?.id as string),
    enabled: !!user?.id,
  });

  if (isSessionLoading || isCartLoading) {
    return (
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!items || items === 0) {
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
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AddressBlock
            userId={user?.id as string}
            addressId={addressId}
            setAddressId={setAddressId}
          />
          <PaymentMethods
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
        <OrderSummary
          userId={user?.id as string}
          addressId={addressId}
          paymentMethod={paymentMethod}
        />
      </div>
    </div>
  );
}
