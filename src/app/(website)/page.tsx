"use client";

import { ChooseUsSection } from "@/components/home/choose-us-section";
import { HeroSection } from "@/components/home/hero-section";
import { TrendingSection } from "@/components/home/trending-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrendingSection />
      <ChooseUsSection />
    </>
  );
}
