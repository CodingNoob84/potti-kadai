"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const LogoSection = () => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1); // Triggers re-render with new animation
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/" className="flex items-center overflow-hidden">
      {/* Image slides from right */}
      <motion.div
        key={`logo-${animationKey}`}
        className="relative w-5 h-5 sm:w-10 sm:h-10"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Image
          src="/images/logos/potti-kadai-vandi.png"
          alt="Potti Kadai Logo"
          fill
          className="object-contain"
          sizes="(max-width: 640px) 32px, 40px"
        />
      </motion.div>

      {/* Text appears after image animation */}
      <motion.span
        key={`text-${animationKey}`}
        className="ml-1 text-2xl sm:text-3xl font-bold text-green-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
      >
        Potti Kadai
      </motion.span>
    </Link>
  );
};
