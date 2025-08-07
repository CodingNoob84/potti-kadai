import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2, X } from "lucide-react";
import { useState } from "react";

type PromoStatus = {
  applied: boolean;
  code: string;
  discount: number;
  reusable: boolean;
};

export const PromoCodeSection = () => {
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<PromoStatus | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    setPromoError("");

    try {
      // Replace with your actual API call
      // const response = await applyPromoCode(userId, promoCode);
      const response = {
        success: true,
        discountAmount: 100,
        message: "",
        reusable: false,
      };

      if (response.success) {
        setPromoStatus({
          applied: true,
          code: promoCode,
          discount: response.discountAmount,
          reusable: response.reusable,
        });
        setPromoCode("");
      } else {
        setPromoError(response.message || "Invalid promo code");
      }
    } catch (error) {
      console.log(error);
      setPromoError("Failed to apply promo code");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const removePromoCode = () => {
    setPromoStatus(null);
    setPromoError("");
  };

  return (
    <div className="pt-2">
      {!promoStatus ? (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter promo code"
            className="flex-1"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={handleApplyPromo}
            disabled={!promoCode.trim() || isApplyingPromo}
          >
            {isApplyingPromo ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Apply"
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-green-600">
            <span>PromocodeOffer</span>
            <span className="font-medium">-₹{promoStatus.discount}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                Promo code <span className="font-bold">{promoStatus.code}</span>{" "}
                applied
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600 font-medium">
                -₹{promoStatus.discount}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-red-500"
                onClick={removePromoCode}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {promoError && <p className="text-sm text-red-500 mt-1">{promoError}</p>}
      {promoStatus && !promoStatus.reusable && (
        <p className="text-xs text-muted-foreground mt-1">
          This promo code can only be used once per customer.
        </p>
      )}
    </div>
  );
};
