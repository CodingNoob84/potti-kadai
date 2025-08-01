"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { productCreateType } from "@/form-schemas/product";
import { getColors, getSizesByOptions } from "@/server/products";
import { colorsTypes, DefaultsizeTypes } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { Info, Search, Trash2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

type sizeType = {
  quantity: number;
  name: string;
  sizeId: number;
};

type InventoryType = {
  name: string;
  sizes: sizeType[];
  colorCode: string;
  colorId: number;
};

export const InventoryManagement = ({
  form,
}: {
  form: UseFormReturn<productCreateType>;
}) => {
  const { watch, setValue } = form;

  const categoryId = watch("category");
  //const type = watch("type");
  const inventory: InventoryType[] = watch("inventory") || [];

  const {
    data: sizesdata = [],
    isLoading: isLoadingSizes,
    isFetching: isFetchingSizes,
  } = useQuery({
    queryKey: ["sizes", categoryId],
    queryFn: ({ queryKey }) => {
      const [, categoryId, type] = queryKey;
      if (!categoryId || !type) return [];
      return getSizesByOptions(Number(categoryId));
    },
    enabled: !!categoryId,
    staleTime: Infinity,
  });

  const { data: colorsdata = [], isLoading: isLoadingColors } = useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
    staleTime: Infinity,
  });

  const totalQuantity = useMemo(
    () =>
      inventory.reduce(
        (total: number, item: InventoryType) =>
          total + item.sizes.reduce((sum, s) => sum + s.quantity, 0),
        0
      ),
    [inventory]
  );

  const addColor = useCallback(
    (color: colorsTypes) => {
      if (inventory.some((i: InventoryType) => i.colorId === color.id)) return;

      const selectedSizes =
        sizesdata?.map((s: DefaultsizeTypes) => ({
          sizeId: s.id,
          name: s.name,
          quantity: 0,
        })) || [];

      setValue(
        "inventory",
        [
          ...inventory,
          {
            colorId: color.id,
            name: color.name,
            colorCode: color.colorCode,
            sizes: selectedSizes,
          },
        ],
        { shouldValidate: true }
      );
    },
    [inventory, setValue, sizesdata]
  );

  const removeColor = useCallback(
    (colorId: number) => {
      setValue(
        "inventory",
        inventory.filter((i: InventoryType) => i.colorId !== colorId),
        { shouldValidate: true }
      );
    },
    [inventory, setValue]
  );

  const updateQuantity = useCallback(
    (colorId: number, sizeId: number, quantity: number) => {
      const updatedInventory = inventory.map((i: InventoryType) =>
        i.colorId === colorId
          ? {
              ...i,
              sizes: i.sizes.map((s: sizeType) =>
                s.sizeId === sizeId ? { ...s, quantity } : s
              ),
            }
          : i
      );
      setValue("inventory", updatedInventory, { shouldValidate: true });
    },
    [inventory, setValue]
  );

  const isLoading = isLoadingSizes || isFetchingSizes || isLoadingColors;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" disabled={isLoading}>
                    <Search className="h-4 w-4 mr-2" />
                    {isLoading ? "Loading..." : "Search Colors"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <Command>
                    <CommandInput placeholder="Search colors..." />
                    <CommandList>
                      <CommandEmpty>No colors found.</CommandEmpty>
                      <CommandGroup>
                        {colorsdata.map((color: colorsTypes) => (
                          <CommandItem
                            key={color.id}
                            onSelect={() => addColor(color)}
                            disabled={isLoading}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color.colorCode }}
                              />
                              <span>{color.name}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex flex-wrap gap-2">
                {inventory.map((item: InventoryType) => (
                  <Badge
                    key={item.colorId}
                    variant="outline"
                    className="flex items-center gap-1 pr-1.5"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.colorCode }}
                    />
                    <span>{item.name}</span>
                  </Badge>
                ))}
              </div>

              <div className="inline-flex items-center px-4 py-2 border rounded-lg bg-gray-50">
                <span className="font-medium mr-2">Total Quantity:</span>
                <span className="text-xl font-bold text-primary">
                  {totalQuantity}
                </span>
                <Info className="h-4 w-4 ml-2 text-gray-500" />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-3 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-md p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((j) => (
                          <div key={j} className="space-y-1">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-9 w-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : inventory.length > 0 ? (
                inventory.map((colorItem: InventoryType) => (
                  <div
                    key={colorItem.colorId}
                    className="border rounded-md p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: colorItem.colorCode }}
                        />
                        <span className="font-semibold">{colorItem.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeColor(colorItem.colorId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {colorItem.sizes.map((size: sizeType) => (
                        <div key={size.sizeId} className="flex flex-col gap-1">
                          <Label>{size.name}</Label>
                          <Input
                            type="number"
                            min="0"
                            value={size.quantity?.toString() || ""}
                            onChange={(e) =>
                              updateQuantity(
                                colorItem.colorId,
                                size.sizeId,
                                parseInt(e.target.value || "0", 10)
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  {categoryId
                    ? "Select a color to add inventory"
                    : "Select a category and type first"}
                </div>
              )}
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};
