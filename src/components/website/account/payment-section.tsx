"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CreditCard, Edit, Plus, Trash2 } from "lucide-react";

const dummyPaymentMethods = [
  {
    id: 1,
    type: "card",
    cardNumber: "**** **** **** 1234",
    cardType: "Visa",
    expiryDate: "12/25",
    isDefault: true,
  },
  {
    id: 2,
    type: "card",
    cardNumber: "**** **** **** 5678",
    cardType: "Mastercard",
    expiryDate: "08/26",
    isDefault: false,
  },
];

export const PaymentSection = () => {
  const paymentMethods = dummyPaymentMethods;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <CreditCard className="h-5 w-5 text-primary-foreground" />
              </div>
              Payment Methods ({paymentMethods.length})
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                method.isDefault
                  ? "border-primary bg-primary/10"
                  : "border-muted bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{method.cardType}</span>
                      {method.isDefault && (
                        <Badge className="bg-primary text-primary-foreground">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.cardNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:bg-primary/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};
