"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Tag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    id: 1,
    image: "/images/hero-section/shopping.png",
    title: "Shop Fashion for All",
    subtitle: "Branded Styles for Men, Women & Kids",
    description:
      "Browse the latest collections from top brands. Perfect fits for every age and every season.",
    cta: "Browse Collection",
    icon: <ShoppingBag className="w-6 h-6 md:w-8 md:h-8" />,
    accentColor: "text-blue-600",
  },
  {
    id: 2,
    image: "/images/hero-section/discounts.png",
    title: "Get Exclusive Discounts",
    subtitle: "Limited Time Offers & Deals",
    description:
      "Enjoy special discounts on premium collections. Sign up for personalized offers.",
    cta: "Shop Deals",
    icon: <Tag className="w-6 h-6 md:w-8 md:h-8" />,
    accentColor: "text-orange-600",
  },
  {
    id: 3,
    image: "/images/hero-section/home-delivery.png",
    title: "Fast & Reliable Delivery",
    subtitle: "Free Shipping on All Orders",
    description:
      "Get products delivered to your doorstep with our premium delivery service.",
    cta: "Shop Now",
    icon: <Truck className="w-6 h-6 md:w-8 md:h-8" />,
    accentColor: "text-green-600",
  },
];

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0",
    opacity: 1,
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
  }),
};

const contentVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [pauseTimer, setPauseTimer] = useState(false);
  const [direction, setDirection] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-scroll functionality with progress (3 seconds)
  useEffect(() => {
    if (!autoScroll || pauseTimer) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((current) => {
        setDirection(1);
        return (current + 1) % heroSlides.length;
      });
      setProgress(0);
    }, 5000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / 30;
        return next > 100 ? 100 : next;
      });
    }, 100);

    return () => {
      clearInterval(slideInterval);
      clearInterval(progressInterval);
    };
  }, [autoScroll, pauseTimer]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setProgress(0);
    resetAutoScroll();
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setProgress(0);
    resetAutoScroll();
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setProgress(0);
    resetAutoScroll();
  };

  const resetAutoScroll = () => {
    setAutoScroll(false);
    setTimeout(() => {
      setAutoScroll(true);
    }, 10000);
  };

  const handleMouseEnter = () => {
    setPauseTimer(true);
  };

  const handleMouseLeave = () => {
    setPauseTimer(false);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section
      className="relative h-[600px] sm:h-[500px] md:h-[700px] bg-gradient-to-b from-primary/5 to-white overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* Main Content */}
      <div className="relative h-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <div className="container mx-auto h-full px-4 sm:px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10">
              {/* Text Content */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 sm:space-y-6 md:space-y-8 max-w-xl pl-4 sm:pl-8 md:pl-16 z-20 order-2 md:order-1"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 md:gap-4"
                >
                  <div
                    className={`p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm ${currentSlideData.accentColor}`}
                  >
                    {currentSlideData.icon}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-current to-transparent opacity-30" />
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                >
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {currentSlideData.title}
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className={`text-lg sm:text-xl md:text-2xl font-semibold ${currentSlideData.accentColor}`}
                >
                  {currentSlideData.subtitle}
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
                >
                  {currentSlideData.description}
                </motion.p>

                <motion.div variants={itemVariants} className="pt-2">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-base md:text-lg rounded-full"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {currentSlideData.cta}
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 1.5,
                        }}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full h-[200px] sm:h-[250px] md:h-[450px] order-1 md:order-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
                <Image
                  src={currentSlideData.image || "/placeholder.svg"}
                  alt={currentSlideData.title}
                  fill
                  className="object-contain transition-transform duration-700 ease-out hover:scale-105"
                  priority={true}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw"
                />
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4 }}
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/20 rounded-full blur-sm"
                />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 z-30 pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="pointer-events-auto p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-sm text-foreground shadow-lg hover:bg-white/20 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="pointer-events-auto p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-sm text-foreground shadow-lg hover:bg-white/20 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </motion.button>
      </div>

      {/* Enhanced Pagination */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-3 p-3 rounded-full bg-white/10 backdrop-blur-sm">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className="relative group"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary w-8"
                    : "bg-white/30 w-2 group-hover:bg-white/50"
                }`}
              />
              {index === currentSlide && (
                <div
                  className="absolute top-0 left-0 h-2 bg-primary/60 rounded-full transition-all duration-100"
                  style={{ width: `${(progress / 100) * 32}px` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 right-6 z-20 text-sm text-foreground/70 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
        {currentSlide + 1} / {heroSlides.length}
      </div>
    </section>
  );
};
