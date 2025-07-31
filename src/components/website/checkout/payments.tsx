"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Banknote, CreditCard, Smartphone } from "lucide-react";
import { useState } from "react";

export const PaymentMethods = ({
  paymentMethod,
  setPaymentMethod,
}: {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}) => {
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-4"
          >
            {/* UPI Payment Option */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="upi" id="upi" className="h-5 w-5" />
                <Label
                  htmlFor="upi"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Smartphone className="h-5 w-5" />
                  <span>UPI Payment</span>
                </Label>
              </div>
              {paymentMethod === "upi" && (
                <div className="mt-3 pl-8 space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your UPI ID to complete payment
                  </p>
                </div>
              )}
            </div>

            {/* Card Payment Option */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="razorpay"
                  id="razorpay"
                  className="h-5 w-5"
                />
                <Label
                  htmlFor="razorpay"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
              {paymentMethod === "razorpay" && (
                <div className="mt-3 pl-8 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          number: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            expiry: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cvv: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* COD Payment Option */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="cod" id="cod" className="h-5 w-5" />
                <Label
                  htmlFor="cod"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Banknote className="h-5 w-5" />
                  <span>Cash on Delivery</span>
                </Label>
              </div>
              {paymentMethod === "cod" && (
                <div className="mt-3 pl-8">
                  <p className="text-sm text-muted-foreground">
                    Pay cash when your order is delivered. An additional ₹50 may
                    be charged for COD orders.
                  </p>
                </div>
              )}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </>
  );
};
