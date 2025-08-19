"use client";

import { easeOut, motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);
  return (
    <motion.footer
      className="bg-primary/10 border-t border-primary/20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-xl font-bold text-primary">PottiKadai</h3>
            <p className="text-muted-foreground">
              Your one-stop destination for trendy fashion. Quality clothing for
              men, women, and kids.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map((social) => (
                <motion.div
                  key={social.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/about-us", label: "About Us" },
                { href: "/contact-us", label: "Contact Us" },
                { href: "/shipping-info", label: "Shipping Info" },
                { href: "/returns", label: "Returns & Exchanges" },
                { href: "/size-guide", label: "Size Guide" },
              ].map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-start group"
                  >
                    <motion.span
                      className="inline-block w-1 h-1 rounded-full bg-primary mr-2 mt-2.5"
                      whileHover={{ scale: 1.5 }}
                    />
                    <motion.span whileHover={{ x: 5 }}>
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Categories
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/products?category=mens", label: "Men's Fashion" },
                { href: "/products?category=womens", label: "Women's Fashion" },
                { href: "/products?category=kids", label: "Kids Fashion" },
                {
                  href: "/products?category=accessories",
                  label: "Accessories",
                },
                { href: "/products?category=shoes", label: "Footwear" },
              ].map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-start group"
                  >
                    <motion.span
                      className="inline-block w-1 h-1 rounded-full bg-primary mr-2 mt-2.5"
                      whileHover={{ scale: 1.5 }}
                    />
                    <motion.span whileHover={{ x: 5 }}>
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/help-center", label: "Help Center" },
                { href: "/track-your-order", label: "Track Your Order" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-and-conditions", label: "Terms of Service" },
              ].map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-start group"
                  >
                    <motion.span
                      className="inline-block w-1 h-1 rounded-full bg-primary mr-2 mt-2.5"
                      whileHover={{ scale: 1.5 }}
                    />
                    <motion.span whileHover={{ x: 5 }}>
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
              <motion.li
                className="flex items-start text-muted-foreground"
                variants={itemVariants}
              >
                <span className="inline-block w-1 h-1 rounded-full bg-primary mr-2 mt-2.5"></span>
                <div>
                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 3 }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    <span>+91 9876543210</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center mt-1"
                    whileHover={{ x: 3 }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    <span>support@pottikadai.com</span>
                  </motion.div>
                </div>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="border-t border-primary/20 mt-12 pt-8 text-center text-muted-foreground"
          variants={itemVariants}
        >
          <p>&copy; {year} PottiKadai. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            {[
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" },
            ].map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
