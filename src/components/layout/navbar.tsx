"use client";

import { Footprints, Shirt, ShirtIcon as TShirt } from "lucide-react";
import { CartButton } from "../website/cart/cart-button"; // Assuming this component handles its own animation/count
import { LogoSection } from "../website/navbar/logo";
import { SecondRowNavBar } from "../website/navbar/second-row";
import { SidebarSheet } from "../website/navbar/sidebar-sheet";
import { UserDropdown } from "../website/navbar/user-dropdown";

export const SecondNavMenus = {
  mens: [
    {
      name: "T-Shirts",
      href: "/products?gender=1&category=1&subcategory=1",
      icon: <TShirt className="h-4 w-4" />,
    },
    {
      name: "Shirts",
      href: "/products?gender=1&category=1&subcategory=3",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Pants",
      href: "/products?gender=1&category=1&subcategory=5",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Jeans",
      href: "/products?gender=1&category=1&subcategory=2",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Jackets",
      href: "/products?gender=1&category=1&subcategory=8",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Shoes",
      href: "/products?gender=1&category=2",
      icon: <Footprints className="h-4 w-4" />,
    },
  ],
  womens: [
    {
      name: "T-Shirts",
      href: "/products?gender=2&category=1&subcategory=1",
      icon: <TShirt className="h-4 w-4" />,
    },
    {
      name: "Shirts",
      href: "/products?gender=2&category=1&subcategory=3",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Dresses",
      href: "/products?gender=2&category=1",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Pants",
      href: "/products?gender=2&category=1&subcategory=5",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Skirts",
      href: "/products?gender=2&category=1",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Shoes",
      href: "/products?gender=2&category=2",
      icon: <Footprints className="h-4 w-4" />,
    },
  ],
  kids: [
    {
      name: "Boys T-Shirts",
      href: "/products?gender=3&category=1&subcategory=1",
      icon: <TShirt className="h-4 w-4" />,
    },
    {
      name: "Girls T-Shirts",
      href: "/products?gender=4&category=1&subcategory=1",
      icon: <TShirt className="h-4 w-4" />,
    },
    {
      name: "Boys Shirts",
      href: "/products?gender=3&category=1&subcategory=3",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Girls Dresses",
      href: "/products?gender=4&category=1",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Kids Pants",
      href: "/products?gender=3%2C4&category=1&subcategory=5",
      icon: <Shirt className="h-4 w-4" />,
    },
    {
      name: "Kids Shoes",
      href: "/products?gender=3%2C4&category=2",
      icon: <Footprints className="h-4 w-4" />,
    },
  ],
};

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <LogoSection />
        <div className="flex items-center space-x-4">
          <CartButton />
          <UserDropdown />
          <SidebarSheet />
        </div>
      </div>
      <SecondRowNavBar />
    </header>
  );
}
