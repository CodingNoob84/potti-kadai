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

type ImageType = {
  url: string;
  colorId: number | null;
};

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
  const inventory: InventoryType[] = watch("inventory") || [];

  const {
    data: sizesdata = [],
    isLoading: isLoadingSizes,
    isFetching: isFetchingSizes,
  } = useQuery({
    queryKey: ["sizes", subcategoryId],
    queryFn: ({ queryKey }) => {
      const [, subcategoryId] = queryKey;
      if (!subcategoryId) return [];
      return getSizesByOptions(Number(subcategoryId));
    },
    enabled: !!subcategoryId,
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
        sizesdata?.map((s) => ({
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
      // Clear colorId from any images associated with this color
      const updatedImages = images.map((img) =>
        img.colorId === colorId ? { ...img, colorId: 0 } : img
      );

      setValue("images", updatedImages, { shouldValidate: true });

      // Remove the color from inventory
      setValue(
        "inventory",
        inventory.filter((i: InventoryType) => i.colorId !== colorId),
        { shouldValidate: true }
      );
    },
    [inventory, images, setValue]
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

  const handleImageSelect = (colorId: number) => {
    setSelectedColorId(colorId);
    // Find if there's already an image assigned to this color
    const existingImageIndex = images.findIndex(
      (img) => img.colorId === colorId
    );
    setSelectedImageIndex(existingImageIndex >= 0 ? existingImageIndex : null);
  };

  const handleImageSubmit = () => {
    if (selectedColorId === null) return;

    // If an image is selected, update its colorId
    if (selectedImageIndex !== null) {
      const updatedImages = images.map((img, index) =>
        index === selectedImageIndex
          ? { ...img, colorId: selectedColorId }
          : img.colorId === selectedColorId
          ? { ...img, colorId: 0 } // Clear other images for this color
          : img
      );
      setValue("images", updatedImages, { shouldValidate: true });
    }
    // If no image selected but we're clearing (null case)
    else {
      const updatedImages = images.map((img) =>
        img.colorId === selectedColorId ? { ...img, colorId: 0 } : img
      );
      setValue("images", updatedImages, { shouldValidate: true });
    }

    setSelectedColorId(null);
    setSelectedImageIndex(null);
  };

  const isLoading = isLoadingSizes || isFetchingSizes || isLoadingColors;

  // Check if a color has an associated image
  const hasImageForColor = (colorId: number) => {
    return images.some((img) => img.colorId === colorId);
  };

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
                    {hasImageForColor(item.colorId) && (
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
                          type="button"
                          variant={
                            hasImageForColor(colorItem.colorId)
                              ? "outline"
                              : "ghost"
                          }
                          onClick={() => handleImageSelect(colorItem.colorId)}
                        >
                          {hasImageForColor(colorItem.colorId)
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
                  {subcategoryId
                    ? "Select a color to add inventory"
                    : "Select a category and type first"}
                </div>
              )}
            </div>
          </div>
        </Form>
      </CardContent>

      {/* Image Selection Dialog */}
      <Dialog
        open={selectedColorId !== null}
        onOpenChange={(open) => !open && setSelectedColorId(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Image for Color Variant</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
            {images?.map((image: ImageType, index: number) => (
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
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedImageIndex(null);
                handleImageSubmit(); // Clear the image association
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
