"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    image: "/images/hero-section/shopping.png",
    title: "Shop Fashion for All",
    subtitle: "Branded Styles for Men, Women & Kids",
    description:
      "Browse the latest collections from top brands. Perfect fits for every age and every season—all in one place.",
    cta: "Browse Collection",
  },
  {
    id: 2,
    image: "/images/hero-section/discounts.png",
    title: "Get Rewards & Save More",
    subtitle: "Discounts, Deals & Cashback",
    description:
      "Review your purchases and unlock exclusive savings. The more you shop and share, the more you earn.",
    cta: "Unlock Offers",
  },
  {
    id: 3,
    image: "/images/hero-section/home-delivery.png",
    title: "Fast Delivery. Easy Returns.",
    subtitle: "Free Cancellation Within 24 Hours",
    description:
      "Enjoy doorstep delivery and hassle-free cancellations—no questions asked within the first 24 hours.",
    cta: "Shop Risk-Free",
  },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  return (
    <section className="relative h-[520px] md:h-[600px] bg-gradient-to-b from-purple-50 to-white">
      <div className="relative h-full overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentSlide
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="container mx-auto h-full px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
              {/* Text */}
              <div className="space-y-5 max-w-xl pl-12 md:pl-16 z-20">
                <h1 className="text-3xl md:text-5xl font-extrabold text-primary leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl font-medium text-primary/80">
                  {slide.subtitle}
                </p>
                <p className="text-primary/80 text-base md:text-lg">
                  {slide.description}
                </p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary text-white shadow-sm hover:shadow-md transition-all w-fit"
                >
                  {slide.cta}
                </Button>
              </div>

              {/* Image */}
              <div className="relative w-full h-[250px] md:h-[400px]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-contain"
                  priority={index === currentSlide}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/80 text-purple-900 shadow hover:bg-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/80 text-purple-900 shadow hover:bg-white"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-purple-600 w-6" : "bg-purple-300 w-3"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
