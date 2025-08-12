"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReceiptBlock } from "@/components/website/payment-reciept/reciept-block";
import { getOrderDetails } from "@/server/cart";

import { useQuery } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function PaymentReceipt() {
  const searchParams = useSearchParams();
  const rawOrderId = searchParams.get("orderid");
  const orderId = rawOrderId ? parseInt(rawOrderId) : null;

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails({ orderId: orderId as number }),
    enabled: !!orderId,
  });

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: `
      @page { size: auto; margin: 0; }
      @media print { 
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `,
    onAfterPrint: () => {
      // Scroll back to top after printing
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payment Receipt</h1>
          <Button disabled className="gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>

        <Card className="border shadow-none">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-gray-500">Loading receipt details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payment Receipt</h1>
          <Button disabled variant="outline">
            No Order Found
          </Button>
        </div>

        <Card className="border shadow-none">
          <CardContent className="p-6 text-center py-12">
            <p className="text-gray-500">No order details available</p>
            <p className="text-sm text-gray-400 mt-2">
              Please check your order ID and try again
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6 no-print">
        <h1 className="text-2xl font-bold text-gray-800">Payment Receipt</h1>
        <Button onClick={handlePrint} className="gap-2">
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
      </div>

      <div ref={contentRef}>
        <ReceiptBlock {...data} />
      </div>

      <div className="mt-6 text-center no-print">
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
      </div>
    </div>
  );
}
