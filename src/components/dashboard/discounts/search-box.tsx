// src/components/search-box.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
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
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

export type OptionType = {
  id: number | string;
  name: string;
};

interface SearchBoxProps<T extends OptionType> {
  value?: T | null;
  options: T[];
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelect: (option: T) => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  renderOption?: (option: T) => React.ReactNode;
}

export function SearchBox<T extends OptionType>({
  value,
  options,
  placeholder = "Search...",
  onSearch,
  onSelect,
  disabled,
  className,
  isLoading,
  renderOption,
}: SearchBoxProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch?.(query);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, onSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-between", className)}
          disabled={disabled || isLoading}
        >
          {isLoading
            ? "Loading..."
            : value
            ? renderOption
              ? renderOption(value)
              : value.name
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={query}
            onValueChange={setQuery}
          />
          {isLoading ? (
            <CommandEmpty>Loading...</CommandEmpty>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          <CommandList>
            {options.map((opt) => (
              <CommandItem
                key={opt.id}
                onSelect={() => {
                  onSelect(opt);
                  setOpen(false);
                  setQuery("");
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value?.id === opt.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {renderOption ? renderOption(opt) : opt.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
