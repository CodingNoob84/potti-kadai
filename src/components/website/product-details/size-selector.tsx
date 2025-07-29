import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { sizeTypes } from "@/types/products";
import { FlagIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // or your preferred toast library

type SizeSystem = "name" | "indiaSize" | "usSize" | "ukSize" | "euSize";

interface SizeSystemOption {
  label: string;
  icon?: React.ReactNode;
}

interface SizeSelectorProps {
  sizes: sizeTypes[];
  onSizeSelect?: (sizeId: number) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  onSizeSelect,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeSystem, setSizeSystem] = useState<SizeSystem>("name");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sizeSystems: Record<SizeSystem, SizeSystemOption> = {
    name: { label: "C", icon: <FlagIcon className="h-4 w-4" /> },
    indiaSize: { label: "IND", icon: <FlagIcon className="h-4 w-4" /> },
    usSize: { label: "US", icon: <FlagIcon className="h-4 w-4" /> },
    ukSize: { label: "UK", icon: <FlagIcon className="h-4 w-4" /> },
    euSize: { label: "EU", icon: <FlagIcon className="h-4 w-4" /> },
  };

  const handleSizeSelect = (value: string) => {
    const selected = sizes.find((size) => size[sizeSystem] === value);

    if (!selected) return;

    if (selected.quantity <= 0) {
      toast.error("This size is out of stock", {
        description: "Please select another available size",
      });
      return;
    }

    setSelectedSize(value);
    if (onSizeSelect) {
      onSizeSelect(selected.sizeId);
    }
  };

  return (
    <div className="pt-1">
      <div className="flex justify-between items-center mb-1">
        <Label className="text-sm font-medium">Size</Label>
      </div>
      <div className="flex flex-row justify-between">
        <RadioGroup
          value={selectedSize}
          onValueChange={handleSizeSelect}
          className="space-y-2"
        >
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size[sizeSystem];
              const isOutOfStock = size.quantity <= 0;

              return (
                <div key={size.sizeId}>
                  <RadioGroupItem
                    value={size[sizeSystem]}
                    id={`size-${size.sizeId}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`size-${size.sizeId}`}
                    className={`
                    flex flex-col items-center justify-center w-8 h-8 text-sm border rounded-md cursor-pointer transition-colors relative
                    ${
                      isOutOfStock
                        ? "opacity-70 cursor-not-allowed bg-gray-100 border-gray-200"
                        : "hover:border-primary hover:bg-primary/5 border-muted"
                    }
                    ${
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground font-medium"
                        : "bg-background"
                    }
                  `}
                  >
                    <span>{size[sizeSystem]}</span>
                    {isOutOfStock && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full border-t border-red-500 rotate-12 transform"></div>
                        </div>
                        <span className="sr-only">Out of stock</span>
                      </>
                    )}
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
        <div className="relative">
          {/* Size system selector button */}
          <div
            className="flex items-center justify-center w-8 h-8 text-sm border border-blue-500 rounded-md cursor-pointer hover:border-primary/50 bg-primary/50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {sizeSystems[sizeSystem].label}
          </div>

          {/* Size system dropdown */}
          <div
            className={`absolute right-0 z-10 bottom-full mb-1 flex flex-col-reverse items-center gap-1 transition-all duration-300 ease-in-out ${
              isOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            {(
              Object.entries(sizeSystems) as [SizeSystem, SizeSystemOption][]
            ).map(([key, { label }]) => (
              <div
                key={key}
                className={`flex items-center justify-center w-10 h-10 text-sm border rounded-md cursor-pointer bg-background ${
                  sizeSystem === key
                    ? "border-primary bg-primary/10"
                    : "hover:border-primary/50 hover:bg-primary/10"
                }`}
                onClick={() => {
                  setSizeSystem(key);
                  setIsOpen(false);
                  setSelectedSize("");
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
