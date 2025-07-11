"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, Grid, List, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const products = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    price: 599,
    originalPrice: 799,
    image: "/images/products/p_img4.png",
    rating: 4.5,
    reviews: 128,
    category: "mens",
    subcategory: "tshirts",
    gender: "men",
  },
  {
    id: 2,
    name: "Denim Casual Shirt",
    price: 1299,
    originalPrice: 1599,
    image: "/images/products/p_img5.png",
    rating: 4.3,
    reviews: 89,
    category: "mens",
    subcategory: "shirts",
    gender: "men",
  },
  {
    id: 3,
    name: "Formal Trousers",
    price: 1899,
    originalPrice: 2299,
    image: "/images/products/p_img6.png",
    rating: 4.7,
    reviews: 156,
    category: "mens",
    subcategory: "pants",
    gender: "men",
  },
  {
    id: 4,
    name: "Summer Dress",
    price: 1499,
    originalPrice: 1899,
    image: "/images/products/p_img7.png",
    rating: 4.6,
    reviews: 203,
    category: "womens",
    subcategory: "dresses",
    gender: "women",
  },
  {
    id: 5,
    name: "Floral Blouse",
    price: 899,
    originalPrice: 1199,
    image: "/images/products/p_img8.png",
    rating: 4.2,
    reviews: 145,
    category: "womens",
    subcategory: "shirts",
    gender: "women",
  },
  {
    id: 6,
    name: "Kids Polo Shirt",
    price: 699,
    originalPrice: 899,
    image: "/images/products/p_img9.png",
    rating: 4.4,
    reviews: 67,
    category: "kids",
    subcategory: "tshirts",
    gender: "kids",
  },
  {
    id: 7,
    name: "Women's Jeans",
    price: 1799,
    originalPrice: 2199,
    image: "/images/products/p_img10.png",
    rating: 4.5,
    reviews: 234,
    category: "womens",
    subcategory: "pants",
    gender: "women",
  },
  {
    id: 8,
    name: "Men's Hoodie",
    price: 1999,
    originalPrice: 2499,
    image: "/images/products/p_img11.png",
    rating: 4.8,
    reviews: 189,
    category: "mens",
    subcategory: "hoodies",
    gender: "men",
  },
];

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleGenderChange = (gender: string, checked: boolean) => {
    if (checked) {
      setSelectedGenders([...selectedGenders, gender]);
    } else {
      setSelectedGenders(selectedGenders.filter((g) => g !== gender));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const filteredProducts = products.filter((product) => {
    const genderMatch =
      selectedGenders.length === 0 || selectedGenders.includes(product.gender);
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.subcategory);
    const priceMatch =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return genderMatch && categoryMatch && priceMatch;
  });

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Gender Filter */}
      <div>
        <h3 className="font-semibold mb-3">Gender</h3>
        <div className="space-y-2">
          {["men", "women", "kids"].map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <Checkbox
                id={gender}
                checked={selectedGenders.includes(gender)}
                onCheckedChange={(checked: boolean) =>
                  handleGenderChange(gender, checked as boolean)
                }
              />
              <Label htmlFor={gender} className="capitalize">
                {gender}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {["tshirts", "shirts", "pants", "dresses", "hoodies"].map(
            (category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked: boolean) =>
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <Label htmlFor={category} className="capitalize">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </Label>
              </div>
            )
          )}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000}
            min={0}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Quick Price Filters */}
      <div>
        <h3 className="font-semibold mb-3">Quick Filters</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={() => setPriceRange([0, 500])}
          >
            Under ₹500
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={() => setPriceRange([500, 1000])}
          >
            ₹500 - ₹1000
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={() => setPriceRange([1000, 2000])}
          >
            ₹1000 - ₹2000
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={() => setPriceRange([2000, 5000])}
          >
            Above ₹2000
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden bg-transparent"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Desktop Filters */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="px-6 py-1">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              <hr className="border-t border-primary my-4" />
              <FilterContent />
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-shadow pt-0">
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.originalPrice > product.price && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            {Math.round(
                              ((product.originalPrice - product.price) /
                                product.originalPrice) *
                                100
                            )}
                            % OFF
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-muted-foreground ml-1">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg">
                            ₹{product.price}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center mb-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-muted-foreground ml-1">
                              {product.rating} ({product.reviews} reviews)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xl">
                              ₹{product.price}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
