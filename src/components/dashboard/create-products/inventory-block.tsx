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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { getColors } from "@/server/products";
import { getSizesByOptions } from "@/server/sizes";
import { colorsTypes } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { Info, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export const InventoryManagement = ({
  form,
}: {
  form: UseFormReturn<productCreateType>;
}) => {
  const { watch, setValue } = form;
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const subcategoryId = watch("subcategory");
  const images = watch("images") || [];
  const inventory = watch("inventory") || [];

  const { data: sizesdata = [], isLoading: loadingSizes } = useQuery({
    queryKey: ["sizes", subcategoryId],
    queryFn: () =>
      subcategoryId ? getSizesByOptions(Number(subcategoryId)) : [],
    enabled: !!subcategoryId,
    staleTime: Infinity,
  });

  const { data: colorsdata = [], isLoading: loadingColors } = useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
    staleTime: Infinity,
  });

  const totalQuantity = useMemo(
    () =>
      inventory.reduce(
        (total, item) =>
          total + item.sizes.reduce((sum, s) => sum + s.quantity, 0),
        0
      ),
    [inventory]
  );

  const addColor = useCallback(
    (color: colorsTypes) => {
      if (inventory.some((i) => i.colorId === color.id)) return;

      const selectedSizes = sizesdata.map((s) => ({
        sizeId: s.id,
        name: s.name,
        quantity: 0,
      }));

      setValue(
        "inventory",
        [
          ...inventory,
          {
            colorId: color.id,
            name: color.name,
            colorCode: color.color_code,
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
        "images",
        images.map((img) =>
          img.colorId === colorId ? { ...img, colorId: 0 } : img
        ),
        { shouldValidate: true }
      );
      setValue(
        "inventory",
        inventory.filter((i) => i.colorId !== colorId),
        { shouldValidate: true }
      );
    },
    [inventory, images, setValue]
  );

  const updateQuantity = useCallback(
    (colorId: number, sizeId: number, quantity: number) => {
      setValue(
        "inventory",
        inventory.map((i) =>
          i.colorId === colorId
            ? {
                ...i,
                sizes: i.sizes.map((s) =>
                  s.sizeId === sizeId ? { ...s, quantity } : s
                ),
              }
            : i
        ),
        { shouldValidate: true }
      );
    },
    [inventory, setValue]
  );

  const handleImageSelect = (colorId: number) => {
    setSelectedColorId(colorId);
    const existing = images.findIndex((img) => img.colorId === colorId);
    setSelectedImageIndex(existing >= 0 ? existing : null);
  };

  const handleImageSubmit = () => {
    if (selectedColorId === null) return;

    const updated = images.map((img, idx) => {
      if (idx === selectedImageIndex)
        return { ...img, colorId: selectedColorId };
      if (img.colorId === selectedColorId) return { ...img, colorId: 0 };
      return img;
    });
    setValue("images", updated, { shouldValidate: true });
    setSelectedColorId(null);
    setSelectedImageIndex(null);
  };

  const isLoading = loadingSizes || loadingColors;
  const hasImage = (colorId: number) =>
    images.some((img) => img.colorId === colorId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                        {colorsdata.map((color) => (
                          <CommandItem
                            key={color.id}
                            onSelect={() => addColor(color)}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color.color_code }}
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
                {inventory.map((item) => (
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
                    {hasImage(item.colorId) && (
                      <span className="ml-1 text-green-500">✓</span>
                    )}
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
                inventory.map((colorItem) => (
                  <div
                    key={colorItem.colorId}
                    className="border rounded-md p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-row gap-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: colorItem.colorCode }}
                          />
                          <span className="font-semibold">
                            {colorItem.name}
                          </span>
                        </div>
                        <Button
                          variant={
                            hasImage(colorItem.colorId) ? "outline" : "ghost"
                          }
                          onClick={() => handleImageSelect(colorItem.colorId)}
                        >
                          {hasImage(colorItem.colorId)
                            ? "Change Image"
                            : "Image Link"}
                        </Button>
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
                      {colorItem.sizes.map((size) => (
                        <div key={size.sizeId} className="flex flex-col gap-1">
                          <Label>{size.name}</Label>
                          <Input
                            type="number"
                            min="0"
                            value={size.quantity.toString()}
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
                  {subcategoryId
                    ? "Select a color to add inventory"
                    : "Select a category and type first"}
                </div>
              )}
            </div>
          </div>
        </Form>
      </CardContent>

      <Dialog
        open={selectedColorId !== null}
        onOpenChange={(open) => !open && setSelectedColorId(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Image for Color Variant</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
            {images.map((image, index) => (
              <div
                key={image.url}
                className={`relative aspect-square cursor-pointer rounded-md border-2 ${
                  selectedImageIndex === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image.url}
                  alt="Product image"
                  fill
                  className="object-cover rounded-md"
                />
                {image.colorId && (
                  <div className="absolute bottom-2 left-2">
                    <div
                      className="h-4 w-4 rounded-full border border-white shadow-sm"
                      style={{
                        backgroundColor:
                          colorsdata.find((c) => c.id === image.colorId)
                            ?.color_code || "transparent",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedImageIndex(null);
                handleImageSubmit();
              }}
            >
              Clear Image
            </Button>
            <Button
              type="button"
              onClick={handleImageSubmit}
              disabled={selectedImageIndex === null}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
