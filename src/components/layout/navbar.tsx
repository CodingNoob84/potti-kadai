"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import {
  Crown,
  Footprints,
  Menu,
  Search,
  Shirt,
  ShirtIcon as TShirt,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartButton } from "../website/cart/cart-button"; // Assuming this component handles its own animation/count
import { UserDropdown } from "../website/navbar/user-dropdown";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTrendingOpen, setIsTrendingOpen] = useState(false);
  const [isMensOpen, setIsMensOpen] = useState(false);
  const [isWomensOpen, setIsWomensOpen] = useState(false);
  const [isKidsOpen, setIsKidsOpen] = useState(false);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Navbar */}
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative w-16 h-10">
            <Image
              src="/images/logos/potti-kadai-vandi.png"
              alt="Potti Kadai Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="ml-1 text-3xl font-bold text-green-900">
            PottiKadai
          </span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 w-full"
            />
          </div>
        </div> */}
        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Search icon for mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          {/* Cart */}
          <CartButton />
          {/* Account */}
          <UserDropdown />
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="px-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Trending</h3>
                  {categories.trending.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
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
                      onClick={() => setIsMobileMenuOpen(false)}
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
                      onClick={() => setIsMobileMenuOpen(false)}
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
                      onClick={() => setIsMobileMenuOpen(false)}
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
            <div
              className="relative"
              onMouseEnter={() => setIsTrendingOpen(true)}
              onMouseLeave={() => setIsTrendingOpen(false)}
            >
              <Button
                variant="ghost"
                className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <span>Trending</span>
              </Button>
              <AnimatePresence>
                {isTrendingOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 w-48 bg-background border rounded-lg shadow-lg z-50 mt-2"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Men's Collection Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsMensOpen(true)}
              onMouseLeave={() => setIsMensOpen(false)}
            >
              <Button
                variant="ghost"
                className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <span>Men&apos;s Collection</span>
              </Button>
              <AnimatePresence>
                {isMensOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 w-48 bg-background border rounded-lg shadow-lg z-50 mt-2"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Women's Collection Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsWomensOpen(true)}
              onMouseLeave={() => setIsWomensOpen(false)}
            >
              <Button
                variant="ghost"
                className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <span>Women&apos;s Collection</span>
              </Button>
              <AnimatePresence>
                {isWomensOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 w-48 bg-background border rounded-lg shadow-lg z-50 mt-2"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Kids Collection Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsKidsOpen(true)}
              onMouseLeave={() => setIsKidsOpen(false)}
            >
              <Button
                variant="ghost"
                className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <span>Kids Collection</span>
              </Button>
              <AnimatePresence>
                {isKidsOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 w-48 bg-background border rounded-lg shadow-lg z-50 mt-2"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
