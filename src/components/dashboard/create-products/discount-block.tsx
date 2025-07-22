"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productCreateType } from "@/form-schemas/product";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

type Discount = {
  type: "direct" | "quantity";
  value: number;
  quantity?: number;
};

type PromoCode = {
  type: "percentage" | "fixed";
  promocode: string;
  value: number;
};

type Props = {
  form: UseFormReturn<productCreateType>;
};

export const DiscountBlock = ({ form }: Props) => {
  const discounts = form.watch("discounts") || [];
  const promoCodes = form.watch("promocodes") || [];

  const addDiscount = (discount: Discount) => {
    const current = form.getValues("discounts") || [];
    form.setValue("discounts", [...current, discount], { shouldDirty: true });
  };

  const removeDiscount = (index: number) => {
    const current = form.getValues("discounts") || [];
    form.setValue(
      "discounts",
      current.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  };

  const addPromo = (promo: PromoCode) => {
    const current = form.getValues("promocodes") || [];
    form.setValue("promocodes", [...current, promo], { shouldDirty: true });
  };

  const removePromo = (index: number) => {
    const current = form.getValues("promocodes") || [];
    form.setValue(
      "promocodes",
      current.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  };

  const [tempDiscount, setTempDiscount] = useState<{
    type: "none" | "direct" | "quantity";
    value: number;
    quantity: number;
  }>({
    type: "none",
    value: 0,
    quantity: 1,
  });

  const [tempPromo, setTempPromo] = useState<{
    type: "none" | "percentage" | "fixed";
    promocode: string;
    value: number;
  }>({
    type: "none",
    promocode: "",
    value: 0,
  });

  const showDiscountAddButton =
    tempDiscount.type !== "none" && tempDiscount.value > 0;
  const showPromoAddButton =
    tempPromo.type !== "none" &&
    tempPromo.promocode !== "" &&
    tempPromo.value > 0;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Discount & Promo Code Settings</CardTitle>
      </CardHeader>
      <CardContent className=" space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* === Discount Form === */}
          <div className=" flex flex-col space-y-2">
            <div className=" flex flex-col space-y-2">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={tempDiscount.type}
                  onValueChange={(val: "none" | "direct" | "quantity") =>
                    setTempDiscount((d) => ({ ...d, type: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discount</SelectItem>
                    <SelectItem value="direct">Direct Discount</SelectItem>
                    <SelectItem value="quantity">Quantity Based</SelectItem>
                  </SelectContent>
                </Select>

                {tempDiscount.type !== "none" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Discount Value (%)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={tempDiscount.value}
                          onChange={(e) =>
                            setTempDiscount((d) => ({
                              ...d,
                              value: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                      {tempDiscount.type === "quantity" && (
                        <div>
                          <Label>Min Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={tempDiscount.quantity}
                            onChange={(e) =>
                              setTempDiscount((d) => ({
                                ...d,
                                quantity: parseInt(e.target.value) || 1,
                              }))
                            }
                          />
                        </div>
                      )}
                    </div>
                    {showDiscountAddButton && (
                      <Button
                        className="mt-2"
                        size="sm"
                        onClick={() => {
                          addDiscount(tempDiscount as Discount);
                          setTempDiscount({
                            type: "none",
                            value: 0,
                            quantity: 1,
                          });
                        }}
                      >
                        Add Discount
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {discounts.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Active Discounts</Label>
                {discounts.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      {d.type === "direct"
                        ? `Direct Discount - ${d.value}%`
                        : `Quantity Discount - ${d.value}% (Min: ${d.quantity})`}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeDiscount(i)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* === Promo Code Form === */}
          <div className=" flex flex-col space-y-2">
            <div className=" flex flex-col space-y-2">
              <div className="space-y-2">
                <Label>Promo Code Type</Label>
                <Select
                  value={tempPromo.type}
                  onValueChange={(val: "none" | "percentage" | "fixed") =>
                    setTempPromo((p) => ({ ...p, type: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Promo</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>

                {tempPromo.type !== "none" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Code</Label>
                        <Input
                          value={tempPromo.promocode}
                          onChange={(e) =>
                            setTempPromo((p) => ({
                              ...p,
                              promocode: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>
                          {tempPromo.type === "percentage"
                            ? "Percentage"
                            : "Fixed Value"}
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          value={tempPromo.value}
                          onChange={(e) =>
                            setTempPromo((p) => ({
                              ...p,
                              value: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                    </div>
                    {showPromoAddButton && (
                      <Button
                        className="mt-2"
                        size="sm"
                        onClick={() => {
                          addPromo(tempPromo as PromoCode);
                          setTempPromo({
                            type: "none",
                            promocode: "",
                            value: 0,
                          });
                        }}
                      >
                        Add Promo Code
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            {promoCodes.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Active Promo Codes</Label>
                {promoCodes.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      {p.promocode} - {p.value}
                      {p.type === "percentage" ? "%" : "$"}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removePromo(i)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
