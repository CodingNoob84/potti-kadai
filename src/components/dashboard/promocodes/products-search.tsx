import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  category?: string;
}

interface ProductSearchComboBoxProps {
  products: Product[];
  selectedProducts: Product[];
  onSelect: (product: Product) => void;
  onRemove: (productId: string) => void;
  className?: string;
}

export function ProductSearchComboBox({
  products,
  selectedProducts,
  onSelect,
  onRemove,
  className,
}: ProductSearchComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku &&
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Selected products display */}
      <div className="flex flex-wrap gap-2">
        {selectedProducts.map((product) => (
          <Badge
            key={product.id}
            variant="secondary"
            className="px-3 py-1 text-sm flex items-center gap-2"
          >
            <span className="font-medium">{product.name}</span>
            <span className="text-muted-foreground">
              ${product.price.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove(product.id);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">Remove</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </Badge>
        ))}
      </div>

      {/* Combo box */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedProducts.length > 0
                ? `${selectedProducts.length} product(s) selected`
                : "Search products..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search products..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
            </div>
            <CommandList>
              <CommandEmpty>No products found.</CommandEmpty>
              <CommandGroup>
                {filteredProducts.map((product) => {
                  const isSelected = selectedProducts.some(
                    (p) => p.id === product.id
                  );
                  return (
                    <CommandItem
                      key={product.id}
                      value={product.id}
                      onSelect={() => {
                        onSelect(product);
                        setSearchTerm("");
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <Check
                            className={cn(
                              "h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {product.sku && (
                                <span>SKU: {product.sku} • </span>
                              )}
                              ${product.price.toFixed(2)}
                              {product.category && (
                                <span> • {product.category}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <Badge variant="outline" className="text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
