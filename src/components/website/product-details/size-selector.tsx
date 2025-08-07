import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown, Flag } from "lucide-react";
import { useState } from "react";

type SizeSystem = "C" | "IND" | "US" | "UK" | "EU";

interface SizeSystemOption {
  label: string;
  icon?: React.ReactNode;
}

type sizeType = {
  sizeId: number;
  pvId: number;
  quantity: number;
  label: string;
  country: {
    name: string;
    label: string;
  }[];
};

interface SizeSelectorProps {
  sizes: sizeType[];
  selectedSize: sizeType | null;
  setSelectedSize: (size: sizeType | null) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  setSelectedSize,
}) => {
  const [sizeSystem, setSizeSystem] = useState<SizeSystem>("C");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sizeSystems: Record<SizeSystem, SizeSystemOption> = {
    C: { label: "Standard", icon: <span className="text-xs"></span> },
    IND: { label: "India", icon: <Flag className="h-3 w-3" /> },
    US: { label: "USA", icon: <Flag className="h-3 w-3" /> },
    UK: { label: "UK", icon: <Flag className="h-3 w-3" /> },
    EU: { label: "Europe", icon: <Flag className="h-3 w-3" /> },
  };

  const getSizeLabel = (size: (typeof sizes)[0]) => {
    if (sizeSystem === "C") return size.label;
    const country = size.country.find((c) => c.name === sizeSystem);
    return country ? country.label : "";
  };

  const handleSizeSelect = (value: string) => {
    const selected = sizes.find((size) => {
      if (sizeSystem === "C") return size.label === value;
      const country = size.country.find((c) => c.name === sizeSystem);
      return country ? country.label === value : false;
    });

    if (!selected) return;

    setSelectedSize(selected);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Size</Label>

        {/* Creative country/size system selector */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-muted-foreground/20 hover:bg-muted/50 transition-colors"
          >
            <span className="flex items-center gap-1">
              {sizeSystems[sizeSystem].icon}
              <span className="hidden sm:inline">
                {sizeSystems[sizeSystem].label}
              </span>
            </span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 z-10 mt-1 w-32 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-muted-foreground/10 focus:outline-none">
              <div className="p-1 space-y-1">
                {Object.entries(sizeSystems).map(([key, { label, icon }]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSizeSystem(key as SizeSystem);
                      setIsOpen(false);
                      setSelectedSize(null);
                    }}
                    className={`w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-left ${
                      sizeSystem === key
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <RadioGroup
        value={selectedSize?.sizeId.toString()}
        onValueChange={handleSizeSelect}
        className="space-y-2"
      >
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const sizeLabel = getSizeLabel(size);
            const isSelected = selectedSize?.label === sizeLabel;

            if (!sizeLabel) return null;

            return (
              <div key={`${size.sizeId}-${sizeSystem}`}>
                <RadioGroupItem
                  value={sizeLabel}
                  id={`size-${size.sizeId}-${sizeSystem}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`size-${size.sizeId}-${sizeSystem}`}
                  className={`
                    flex items-center justify-center w-12 h-12 text-sm font-medium border rounded-md cursor-pointer transition-all
                    
                    ${
                      isSelected
                        ? "border-2 border-primary bg-primary/10 text-foreground shadow-sm"
                        : "bg-background"
                    }
                  `}
                >
                  <span className="relative">{sizeLabel}</span>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
};
