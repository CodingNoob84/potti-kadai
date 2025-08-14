"use client";

import { SecondNavMenus } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export const SecondRowNavBar = () => {
  const [isMensOpen, setIsMensOpen] = useState(false);
  const [isWomensOpen, setIsWomensOpen] = useState(false);
  const [isKidsOpen, setIsKidsOpen] = useState(false);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };
  return (
    <div className="hidden md:block border-t">
      <div className="container px-4">
        <div className="hidden md:flex items-center space-x-8">
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
                    {SecondNavMenus.mens.map((item) => (
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
                    {SecondNavMenus.womens.map((item) => (
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
                    {SecondNavMenus.kids.map((item) => (
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
  );
};
