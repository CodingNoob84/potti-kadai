"use client";

import { AddressBlock } from "@/components/website/checkout/address";
import { CheckoutLoading } from "@/components/website/checkout/checkout-loading";
import { EmptyCheckOut } from "@/components/website/checkout/empty-checkout";
import { OrderSummary } from "@/components/website/checkout/order-summary";
import { PaymentMethods } from "@/components/website/checkout/payments";
import { useSession } from "@/lib/auth-client";
import { getCartTotalItems } from "@/server/cart";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const CheckOutClientPage = () => {
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
    return <CheckoutLoading />;
  }

  if (!items || items === 0) {
    return <EmptyCheckOut />;
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
};
