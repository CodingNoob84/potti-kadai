import { ChooseUsSection } from "@/components/website/home/choose-us-section";
import { FAQSection } from "@/components/website/home/faq-section";
import { HeroSection } from "@/components/website/home/hero-section";
import { TestimonialsSection } from "@/components/website/home/review-section";
import { TrendingSection } from "@/components/website/home/trending-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrendingSection />
      <ChooseUsSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}
