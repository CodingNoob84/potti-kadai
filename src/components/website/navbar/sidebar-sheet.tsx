"use client";

import { SecondNavMenus } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const SidebarSheet = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
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
            <h3 className="font-semibold">Men&apos;s Collection</h3>
            {SecondNavMenus.mens.map((item) => (
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
            {SecondNavMenus.womens.map((item) => (
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
            {SecondNavMenus.kids.map((item) => (
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
  );
};
