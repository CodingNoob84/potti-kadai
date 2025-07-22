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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { productCreateType } from "@/form-schemas/product";
import { getColors, getSizes } from "@/server/products";
import {
  colorsTypes,
  DefaultsizeTypes,
  inventoryType,
  sizeTypes,
} from "@/types/products";

import { useQuery } from "@tanstack/react-query";
import { Info, Search, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export const InventoryManagement = ({
  form,
}: {
  form: UseFormReturn<productCreateType>;
}) => {
  const { data: sizesdata } = useQuery({
    queryKey: ["sizes"],
    queryFn: getSizes,
  });
  const { data: colorsdata = [] } = useQuery({
    queryKey: ["colors"],
    queryFn: getColors,
  });

  const { control, watch, setValue } = form;
  const colorSelectionType = watch("colorSelectionType");

  const inventory = watch("inventory") || [];

  const addColor = (color: { id: number; name: string; colorCode: string }) => {
    if (colorSelectionType === "single" && inventory.length >= 1) {
      // toast({
      //   title: "Only one color allowed",
      //   description: "Switch to 'multiple' to add more colors.",
      //   variant: "destructive",
      // });
      alert("Only one color allowed");
      return;
    }

    if (inventory.some((i: inventoryType) => i.colorId === color.id)) return;

    const updatedInventory = [
      ...inventory,
      {
        colorId: color.id,
        name: color.name,
        colorCode: color.colorCode,
        sizes: sizesdata
          ? sizesdata?.map((size: DefaultsizeTypes) => ({
              sizeId: size.id,
              name: size.shortform,
              quantity: 0,
            }))
          : [],
      },
    ];

    setValue("inventory", updatedInventory, { shouldValidate: true });

    // ✅ Close the popover after adding one color in single mode
    if (colorSelectionType === "single") {
      const el = document.activeElement as HTMLElement;
      el?.blur(); // closes popover by losing focus
    }
  };

  const removeColor = (colorId: number) => {
    console.log("-->", colorId);
    const updatedInventory = inventory.filter(
      (i: inventoryType) => i.colorId !== colorId
    );
    setValue("inventory", updatedInventory, { shouldValidate: true });
  };

  const updateQuantity = (
    colorId: number,
    sizeId: number,
    quantity: number
  ) => {
    const updatedInventory = inventory.map((i: inventoryType) => {
      if (i.colorId === colorId) {
        return {
          ...i,
          sizes: i.sizes.map((s: sizeTypes) =>
            s.sizeId === sizeId ? { ...s, quantity } : s
          ),
        };
      }
      return i;
    });
    setValue("inventory", updatedInventory, { shouldValidate: true });
  };

  const totalQuantity = inventory.reduce(
    (total: number, item: inventoryType) => {
      return (
        total +
        item.sizes.reduce((sum: number, s: sizeTypes) => sum + s.quantity, 0)
      );
    },
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <FormField
                control={control}
                name="colorSelectionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Selection</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single">Single</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="multiple" id="multiple" />
                          <Label htmlFor="multiple">Multiple</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-transparent">
                    <Search className="h-4 w-4 mr-2" /> Search Colors
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
                            disabled={
                              colorSelectionType === "single" &&
                              inventory.length >= 1
                            }
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
                {inventory.map((item: inventoryType) => (
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

            <div className="col-span-2 space-y-4">
              {inventory.map((colorItem: inventoryType) => (
                <div key={colorItem.colorId} className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="flex flex-row items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: colorItem.colorCode }}
                        />
                        <span className="font-semibold">{colorItem.name}</span>
                      </div>
                      <div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className=""
                          onClick={() => removeColor(colorItem.colorId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {colorItem.sizes.map((size: sizeTypes) => (
                      <div key={size.sizeId} className="flex flex-col gap-1">
                        <Label>{size.name}</Label>
                        <Input
                          type="number"
                          min="0"
                          value={size.quantity?.toString() || ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value || "0", 10);
                            updateQuantity(
                              colorItem.colorId,
                              size.sizeId,
                              value
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};
