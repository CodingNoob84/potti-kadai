"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Crown,
  Footprints,
  Menu,
  Search,
  Shirt,
  ShirtIcon as TShirt,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CartSheet } from "../website/cart/cart-sheet";

const categories = {
  trending: [
    {
      name: "New Arrivals",
      href: "/products?category=new-arrivals",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      name: "Best Sellers",
      href: "/products?category=best-sellers",
      icon: <Crown className="h-4 w-4" />,
    },
    {
      name: "Sale Items",
      href: "/products?category=sale",
      icon: <Zap className="h-4 w-4" />,
    },
  ],
  mens: [
    {
      name: "T-Shirts",
      href: "/products?category=mens-tshirts",
      icon: <TShirt className="h-4 w-4" />,
    },
    {
      name: "Shirts",
      href: "/products?category=mens-shirts",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Pants",
      href: "/products?category=mens-pants",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Jeans",
      href: "/products?category=mens-jeans",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Jackets",
      href: "/products?category=mens-jackets",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Shoes",
      href: "/products?category=mens-shoes",
      icon: <Footprints className="h-4 w-4" />,
    },
  ],
  womens: [
    {
      name: "T-Shirts",
      href: "/products?category=womens-tshirts",
      icon: <TShirt className="h-4 w-4" />,
    },
    {
      name: "Shirts",
      href: "/products?category=womens-shirts",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Dresses",
      href: "/products?category=womens-dresses",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Pants",
      href: "/products?category=womens-pants",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Skirts",
      href: "/products?category=womens-skirts",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Shoes",
      href: "/products?category=womens-shoes",
      icon: <Footprints className="h-4 w-4" />,
    },
  ],
  kids: [
    {
      name: "Boys T-Shirts",
      href: "/products?category=boys-tshirts",
      icon: <TShirt className="h-4 w-4" />,
    },
    {
      name: "Girls T-Shirts",
      href: "/products?category=girls-tshirts",
      icon: <TShirt className="h-4 w-4" />,
    },
    {
      name: "Boys Shirts",
      href: "/products?category=boys-shirts",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Girls Dresses",
      href: "/products?category=girls-dresses",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Kids Pants",
      href: "/products?category=kids-pants",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Kids Shoes",
      href: "/products?category=kids-shoes",
      icon: <Footprints className="h-4 w-4" />,
    },
  ],
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Navbar */}
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="font-bold text-2xl text-primary">PottiKadai</div>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Search icon for mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <CartSheet />

          {/* Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/signup">Sign Up</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account">My Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders">My Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Admin Dashboard</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Trending</h3>
                  {categories.trending.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Men&apos;s Collection</h3>
                  {categories.mens.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Women&apos;s Collection</h3>
                  {categories.womens.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Kids Collection</h3>
                  {categories.kids.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Secondary Navigation - Hidden on mobile */}
      <div className="hidden md:block border-t">
        <div className="container px-4">
          <div className="hidden md:flex items-center space-x-8">
            {/* Trending Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-primary transition-colors">
                <span>Trending</span>
              </button>
              <div className="absolute top-full left-0 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {categories.trending.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Men's Collection Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-primary transition-colors">
                <span>Men&apos;s Collection</span>
              </button>
              <div className="absolute top-full left-0 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {categories.mens.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Women's Collection Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-primary transition-colors">
                <span>Women&apos;s Collection</span>
              </button>
              <div className="absolute top-full left-0 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {categories.womens.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Kids Collection Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-primary transition-colors">
                <span>Kids Collection</span>
              </button>
              <div className="absolute top-full left-0 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {categories.kids.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
