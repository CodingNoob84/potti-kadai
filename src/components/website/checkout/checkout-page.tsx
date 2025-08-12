"use client";

import { AddressBlock } from "@/components/website/checkout/address";
import { CheckoutLoading } from "@/components/website/checkout/checkout-loading";
import { OrderSummary } from "@/components/website/checkout/order-summary";
import { PaymentMethods } from "@/components/website/checkout/payments";
import { useSession } from "@/lib/auth-client";
import { getCartTotalItems } from "@/server/cart";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CheckOutClientPage = () => {
  const router = useRouter();
  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { data: session, isPending: isSessionLoading } = useSession();
  const userId = session?.user?.id;

  const {
    data: items,
    isLoading: isCartLoading,
    isFetched: isCartFetched,
  } = useQuery({
    queryKey: ["cartitems-count", userId],
    queryFn: () => getCartTotalItems(userId as string),
    enabled: !!userId,
  });

  // Show loading until we've verified cart has items
  const isLoading = isSessionLoading || isCartLoading || !isCartFetched;
  const isEmptyCart = isCartFetched && (!items || items === 0);

  // Redirect if cart is empty after data loaded
  useEffect(() => {
    if (isEmptyCart) {
      router.push("/");
    }
  }, [isEmptyCart, router]);

  if (isLoading) {
    return <CheckoutLoading />;
  }

  if (!userId) {
    // Optionally handle missing user session here, e.g. redirect to login
    return null;
  }

  if (isEmptyCart) {
    // While redirecting, show loading
    return <CheckoutLoading />;
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AddressBlock
            userId={userId}
            addressId={addressId}
            setAddressId={setAddressId}
          />
          <PaymentMethods
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
        <OrderSummary
          userId={userId}
          addressId={addressId}
          paymentMethod={paymentMethod}
        />
      </div>
    </div>
  );
};
