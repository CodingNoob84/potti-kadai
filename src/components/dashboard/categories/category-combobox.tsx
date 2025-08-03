"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CategoryType } from "@/types/categories";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export const CategoryCombobox = ({ options }: { options: CategoryType[] }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { setValue, watch } = useFormContext();
  const selected = watch("categories") || [];

  const addCategory = (item: {
    id: number;
    name: string;
    is_active: boolean;
  }) => {
    const alreadyAdded = selected.some(
      (cat: CategoryType) => cat.id === item.id
    );
    if (!alreadyAdded) {
      setValue("categories", [...selected, item]);
    }
    setSearch("");
    setOpen(false);
  };

  const removeCategory = (id: number) => {
    setValue(
      "categories",
      selected.filter((cat: CategoryType) => cat.id !== id)
    );
  };

  const filteredOptions = options.filter(
    (opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.some((sel: CategoryType) => sel.id === opt.id)
  );

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selected.length === 0 ? "Select categories..." : "Select More"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput
              placeholder="Search categories..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>No match found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => addCategory(item)}
                  className="cursor-pointer"
                >
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  <div className="flex-1">{item.name}</div>
                  {item.is_active && (
                    <Badge variant="outline" className="ml-2">
                      Active
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((cat: CategoryType) => (
            <Badge
              key={cat.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {cat.name}
              <button
                type="button"
                onClick={() => removeCategory(cat.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
