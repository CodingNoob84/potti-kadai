"use client";

import { ChooseUsSection } from "@/components/website/home/choose-us-section";
import { HeroSection } from "@/components/website/home/hero-section";
import { TrendingSection } from "@/components/website/home/trending-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrendingSection />
      <ChooseUsSection />
    </>
  );
}
