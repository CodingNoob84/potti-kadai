"use client";

import { Button } from "@/components/ui/button";
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
    icon: <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
  },
  {
    id: 2,
    image: "/images/hero-section/discounts.png",
    title: "Get Exclusive Discounts",
    subtitle: "Limited Time Offers & Deals",
    description:
      "Enjoy special discounts on premium collections. Sign up for personalized offers.",
    cta: "Shop Deals",
    icon: <Tag className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
  },
  {
    id: 3,
    image: "/images/hero-section/home-delivery.png",
    title: "Fast & Reliable Delivery",
    subtitle: "Free Shipping on All Orders",
    description:
      "Get products delivered to your doorstep with our premium delivery service.",
    cta: "Shop Now",
    icon: <Truck className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
  },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [pauseTimer, setPauseTimer] = useState(false);

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || pauseTimer) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [autoScroll, pauseTimer]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    resetAutoScroll();
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    resetAutoScroll();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetAutoScroll();
  };

  const resetAutoScroll = () => {
    // Temporarily pause auto-scroll when user interacts
    setAutoScroll(false);
    setTimeout(() => {
      setAutoScroll(true);
    }, 10000); // Resume auto-scroll after 10 seconds
  };

  // Pause on hover
  const handleMouseEnter = () => {
    setPauseTimer(true);
  };

  const handleMouseLeave = () => {
    setPauseTimer(false);
  };

  return (
    <section
      className="relative h-[600px] sm:h-[450px] md:h-[600px] bg-gradient-to-b from-primary/5 to-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-full overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 z-10"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="container mx-auto h-full px-4 sm:px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10">
              {/* Text Content */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6 max-w-xl pl-4 sm:pl-8 md:pl-16 z-20 order-2 md:order-1">
                <div className="flex items-center gap-2 md:gap-3">
                  {slide.icon}
                  <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-foreground leading-snug md:leading-tight">
                    {slide.title}
                  </h1>
                </div>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-primary">
                  {slide.subtitle}
                </p>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                  {slide.description}
                </p>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow hover:shadow-md transition-all px-6 py-4 text-base md:text-lg md:px-8 md:py-6"
                >
                  {slide.cta}
                </Button>
              </div>

              {/* Image */}
              <div className="relative w-full h-[180px] sm:h-[220px] md:h-[400px] order-1 md:order-2">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-contain transition-transform duration-500 ease-in-out"
                  priority={index === currentSlide}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Mobile */}
      <div className="md:hidden absolute inset-0 flex items-center justify-between px-2 z-30">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-background/80 text-primary shadow hover:bg-background transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-background/80 text-primary shadow hover:bg-background transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Arrows - Desktop */}
      <div className="hidden md:flex absolute inset-0 items-center justify-between px-4 z-30">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-background/90 text-primary shadow-lg hover:bg-background transition-all hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-background/90 text-primary shadow-lg hover:bg-background transition-all hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-primary w-6" : "bg-primary/30 w-3"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
