"use client";

import { backOut, easeOut, motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

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

const newsletterVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: backOut,
    },
  },
};

export default function Footer() {
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
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
                { href: "/shipping", label: "Shipping Info" },
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
                { href: "/help", label: "Help Center" },
                { href: "/track-order", label: "Track Your Order" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
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

        {/* Newsletter Subscription */}
        <motion.div
          className="mt-12 bg-white/50 p-6 rounded-lg shadow-sm max-w-2xl mx-auto"
          variants={newsletterVariants}
        >
          <h3 className="text-lg font-semibold text-center mb-3 text-primary">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-muted-foreground text-center mb-4">
            Get updates on new arrivals, special offers, and fashion tips.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-2"
            whileHover={{ scale: 1.01 }}
          >
            <motion.input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="border-t border-primary/20 mt-12 pt-8 text-center text-muted-foreground"
          variants={itemVariants}
        >
          <p>
            &copy; {new Date().getFullYear()} PottiKadai. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            {[
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" },
              { href: "/cookies", label: "Cookie Policy" },
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
