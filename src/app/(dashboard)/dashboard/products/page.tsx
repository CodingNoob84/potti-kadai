"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ProductType = {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  stock: number;
  category: string;
  subcategory: string;
  isActive: boolean;
  image: string;
  colors: string[];
  sizes: string[];
};

const products = [
  {
    id: 1,
    title: "Classic Cotton T-Shirt",
    price: 599,
    originalPrice: 799,
    stock: 150,
    category: "mens",
    subcategory: "tshirts",
    isActive: true,
    image: "/placeholder.svg?height=80&width=80",
    colors: ["Black", "White", "Navy"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    title: "Denim Casual Shirt",
    price: 1299,
    originalPrice: 1599,
    stock: 89,
    category: "mens",
    subcategory: "shirts",
    isActive: true,
    image: "/placeholder.svg?height=80&width=80",
    colors: ["Blue", "Black"],
    sizes: ["M", "L", "XL"],
  },
  {
    id: 3,
    title: "Summer Dress",
    price: 1499,
    originalPrice: 1899,
    stock: 67,
    category: "womens",
    subcategory: "dresses",
    isActive: false,
    image: "/placeholder.svg?height=80&width=80",
    colors: ["Floral", "Red", "Blue"],
    sizes: ["S", "M", "L"],
  },
  {
    id: 4,
    title: "Kids Polo Shirt",
    price: 699,
    originalPrice: 899,
    stock: 234,
    category: "kids",
    subcategory: "tshirts",
    isActive: true,
    image: "/placeholder.svg?height=80&width=80",
    colors: ["Red", "Blue", "Green"],
    sizes: ["S", "M", "L"],
  },
];

export default function ProductsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.isActive) ||
      (statusFilter === "inactive" && !product.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      console.log("Deleting product:", id);
      // Handle delete logic
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="mens">Men&apos;s</SelectItem>
                <SelectItem value="womens">Women&apos;s</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.colors.length} colors, {product.sizes.length}{" "}
                          sizes
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="capitalize">{product.category}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {product.subcategory}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">₹{product.price}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.stock > 50
                          ? "default"
                          : product.stock > 10
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {product.stock} units
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Product Details</DialogTitle>
                          </DialogHeader>
                          {selectedProduct && (
                            <div className="space-y-4">
                              <div className="flex space-x-4">
                                <div className="relative w-24 h-24">
                                  <Image
                                    src={
                                      selectedProduct.image ||
                                      "/placeholder.svg"
                                    }
                                    alt={selectedProduct.title}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">
                                    {selectedProduct.title}
                                  </h3>
                                  <p className="text-muted-foreground capitalize">
                                    {selectedProduct.category} -{" "}
                                    {selectedProduct.subcategory}
                                  </p>
                                  <p className="font-medium">
                                    ₹{selectedProduct.price}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium">
                                    Available Colors:
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedProduct.colors.map(
                                      (color: string) => (
                                        <Badge key={color} variant="outline">
                                          {color}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium">
                                    Available Sizes:
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedProduct.sizes.map(
                                      (size: string) => (
                                        <Badge key={size} variant="outline">
                                          {size}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/products/edit/${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
