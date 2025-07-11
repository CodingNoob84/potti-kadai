"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Plus, Trash2, Palette, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandList,
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
import { HexColorPicker } from "react-colorful";

const sizes = ["S", "M", "L", "XL", "XXL"];
const categories = ["mens", "womens", "kids"];
const subcategories = {
  mens: ["tshirts", "shirts", "pants", "jeans", "jackets", "shoes"],
  womens: ["tshirts", "shirts", "dresses", "pants", "skirts", "shoes"],
  kids: ["tshirts", "shirts", "dresses", "pants", "shoes"],
};

const availableColors = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Pink",
  "Orange",
  "Brown",
  "Gray",
  "Navy",
  "Maroon",
  "Olive",
  "Teal",
];

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    tags: [] as string[],
    isActive: true,
  });

  const [inventory, setInventory] = useState<
    Array<{
      size: string;
      colors: Array<{
        name: string;
        quantity: number;
      }>;
    }>
  >([]);

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [colorSearch, setColorSearch] = useState("");
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState("#ffffff");
  const [newTag, setNewTag] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [discount, setDiscount] = useState({
    type: "none",
    value: 0,
    minQuantity: 1,
  });

  const handleSizeChange = (size: string, isChecked: boolean) => {
    if (isChecked) {
      setInventory((prev) => [
        ...prev,
        {
          size,
          colors: selectedColors.map((color) => ({
            name: color,
            quantity: 0,
          })),
        },
      ]);
    } else {
      setInventory((prev) => prev.filter((item) => item.size !== size));
    }
  };

  const handleColorQuantityChange = (
    size: string,
    color: string,
    quantity: number
  ) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.size === size
          ? {
              ...item,
              colors: item.colors.map((c) =>
                c.name === color ? { ...c, quantity } : c
              ),
            }
          : item
      )
    );
  };

  const addColor = (color: string) => {
    if (!selectedColors.includes(color)) {
      setSelectedColors((prev) => [...prev, color]);
      setInventory((prev) =>
        prev.map((item) => ({
          ...item,
          colors: [...item.colors, { name: color, quantity: 0 }],
        }))
      );
    }
    setColorPopoverOpen(false);
  };

  const removeColor = (color: string) => {
    setSelectedColors((prev) => prev.filter((c) => c !== color));
    setInventory((prev) =>
      prev.map((item) => ({
        ...item,
        colors: item.colors.filter((c) => c.name !== color),
      }))
    );
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      inventory,
      images,
      discount,
    };
    console.log("Product data:", productData);
  };

  const filteredColors = availableColors.filter((color) =>
    color.toLowerCase().includes(colorSearch.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your inventory
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Row - Basic Info + Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter product description"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="0"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked: boolean) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                  <Label htmlFor="active">Active for sale</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        category: value,
                        subcategory: "",
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subcategory</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, subcategory: value }))
                    }
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.category &&
                        subcategories[
                          formData.category as keyof typeof subcategories
                        ]?.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub.charAt(0).toUpperCase() + sub.slice(1)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - Inventory Management */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="flex flex-col justify-between">
                <div className="space-y-2">
                  <Label>Product Colors</Label>
                  <div className="flex gap-2">
                    <Popover
                      open={colorPopoverOpen}
                      onOpenChange={setColorPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start bg-transparent"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Search Colors
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <Command>
                          <CommandInput
                            placeholder="Search or enter hex color..."
                            value={colorSearch}
                            onValueChange={setColorSearch}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {colorSearch.startsWith("#") &&
                              colorSearch.length >= 4 ? (
                                <button
                                  className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded"
                                  onClick={() => {
                                    addColor(colorSearch);
                                    setColorPopoverOpen(false);
                                  }}
                                >
                                  Add custom color: {colorSearch}
                                </button>
                              ) : (
                                "No colors found. Use #hex format to add custom color"
                              )}
                            </CommandEmpty>
                            <CommandGroup>
                              {filteredColors.map((color) => (
                                <CommandItem
                                  key={color}
                                  onSelect={() => addColor(color)}
                                >
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="w-4 h-4 rounded-full border"
                                      style={{
                                        backgroundColor: color.toLowerCase(),
                                      }}
                                    />
                                    <span>{color}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <div className="relative">
                      <Popover
                        open={showColorPicker}
                        onOpenChange={setShowColorPicker}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="px-3 bg-transparent"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Color
                            <Palette className="h-4 w-4 ml-2" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" align="start">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium leading-none">
                                Custom Color
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setShowColorPicker(false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <HexColorPicker
                              color={customColor}
                              onChange={setCustomColor}
                              className="!w-full !h-32"
                            />
                            <div className="flex gap-2">
                              <div className="flex-1 relative">
                                <Input
                                  value={customColor}
                                  onChange={(e) =>
                                    setCustomColor(e.target.value)
                                  }
                                  className="pl-8"
                                />
                                <div
                                  className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: customColor }}
                                />
                              </div>
                              <Button
                                onClick={() => {
                                  if (customColor) {
                                    addColor(customColor);
                                    setShowColorPicker(false);
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {selectedColors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedColors.map((color) => (
                        <Badge
                          key={color}
                          variant="outline"
                          className="flex items-center gap-1 pr-1.5"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                          <span className="max-w-[80px] truncate">{color}</span>
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeColor(color)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="inline-flex items-center px-4 py-2 border rounded-lg bg-gray-50">
                    <span className="font-medium mr-2">Total Quantity:</span>
                    <span className="text-xl font-bold text-primary">400</span>
                    <Info className="h-4 w-4 ml-2 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Size and Quantity Management */}
              <div className="space-y-2 col-span-2">
                <Label>Select Sizes and Set Quantities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {sizes.map((size) => (
                    <div key={size} className="space-y-2">
                      <div className="flex items-center space-x-2 pl-10">
                        <input
                          type="checkbox"
                          id={`size-${size}`}
                          checked={inventory.some((item) => item.size === size)}
                          onChange={(e) =>
                            handleSizeChange(size, e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <Label htmlFor={`size-${size}`}>{size}</Label>
                      </div>

                      {inventory.some((item) => item.size === size) &&
                        selectedColors.length > 0 && (
                          <div className="space-y-2 pl-6">
                            {selectedColors.map((color) => {
                              const sizeItem = inventory.find(
                                (item) => item.size === size
                              );
                              const colorItem = sizeItem?.colors.find(
                                (c) => c.name === color
                              );
                              return (
                                <div
                                  key={`${size}-${color}`}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full border"
                                    style={{
                                      backgroundColor: color.toLowerCase(),
                                    }}
                                  />
                                  <Input
                                    type="number"
                                    min="0"
                                    value={
                                      colorItem?.quantity?.toString() || ""
                                    }
                                    onChange={(e) => {
                                      const rawValue = e.target.value;
                                      const numericValue = rawValue.replace(
                                        /^0+(?!$)/,
                                        ""
                                      ); // removes leading zeros
                                      handleColorQuantityChange(
                                        size,
                                        color,
                                        parseInt(numericValue || "0", 10)
                                      );
                                    }}
                                    className="h-8 w-20 border border-transparent hover:border-input focus:border-input focus:outline-none px-1 text-xs"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third Row - Discount + Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Discount */}
          <Card>
            <CardHeader>
              <CardTitle>Discount Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={discount.type}
                  onValueChange={(value) =>
                    setDiscount((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discount</SelectItem>
                    <SelectItem value="direct">Direct Discount</SelectItem>
                    <SelectItem value="quantity">Quantity Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {discount.type !== "none" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Discount Value (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={discount.value}
                      onChange={(e) =>
                        setDiscount((prev) => ({
                          ...prev,
                          value: Number.parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  {discount.type === "quantity" && (
                    <div className="space-y-2">
                      <Label>Minimum Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={discount.minQuantity}
                        onChange={(e) =>
                          setDiscount((prev) => ({
                            ...prev,
                            minQuantity: Number.parseInt(e.target.value) || 1,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="images">Upload Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative overflow-hidden rounded-lg border">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Create Product</Button>
        </div>
      </form>
    </div>
  );
}
