import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Shop Front Header */}
      <section className="text-center mb-12">
        <div className="inline-flex items-center justify-center mb-2">
          <div className="relative w-10 h-10 mr-2">
            <Image
              src="/images/logos/potti-kadai-vandi.png"
              alt="Potti Kadai Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
            Potti Kadai
            <Badge
              variant="outline"
              className="ml-3 bg-primary/10 text-primary text-sm font-medium"
            >
              Since 1985
            </Badge>
          </h1>
        </div>
        <p className="text-lg text-gray-700">
          Your neighborhood shop that&apos;s moved online - still the same warm
          service, just now with doorstep delivery!
        </p>
      </section>

      {/* Founder Spotlight */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl text-primary">
            Meet Our Founder: Karthik Kumar
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <p className="mb-3 text-gray-700">
              A third-generation shopkeeper with a modern vision, Karthik
              transformed our humble street shop into a thriving online
              marketplace while keeping our traditional values intact.
            </p>
            <p className="mb-3 text-gray-700">
              His energetic approach blends old-world charm with digital
              innovation - you&apos;ll often find him brainstorming with
              artisans in the morning and coding new features in the evening!
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Tech Enthusiast
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Tradition Keeper
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Customer Champion
              </Badge>
            </div>
          </div>
          <div className="relative h-40 md:h-full rounded-md overflow-hidden border border-primary/20">
            <Image
              src="/images/founder/karthik.jpg"
              alt="Karthik Kumar, Founder"
              fill
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* The Shop Story */}
      <Card className="mb-12 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl text-primary">
            From Our Street Corner to Your Screen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <p className="mb-4 text-gray-700">
                What began as a 10x10 feet shop in Mylapore where locals could
                find everything from school supplies to festival decorations has
                grown into your one-stop online shop for daily essentials and
                special finds.
              </p>
              <p className="text-gray-700">
                We still operate that little shop (come visit us at 12 Market
                Street!), but now we&apos;re able to serve customers across
                India with the same attention to quality and service.
              </p>
              <Button
                variant="outline"
                className="mt-4 text-primary hover:bg-primary/10"
              >
                See our shop location →
              </Button>
            </div>
            <div className="md:col-span-2">
              <div className="border-2 border-primary/20 p-1 rounded-lg bg-white">
                <div className="relative h-48 rounded-md overflow-hidden">
                  <Image
                    src="/images/hero-section/old-shop.png"
                    alt="Original Potti Kadai shop"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Our original shop in 1985
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What We Offer */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          A Little Shop of (Almost) Everything
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {[
            { name: "Clothing", emoji: "👕" },
            { name: "Footwear", emoji: "👞" },
            { name: "Bags", emoji: "👜" },
            { name: "Watches", emoji: "⌚" },
            { name: "Stationery", emoji: "📝" },
            { name: "Toys", emoji: "🧸" },
            { name: "Home Goods", emoji: "🏠" },
            { name: "Puja Items", emoji: "🪔" },
          ].map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-primary/5 transition-colors border-primary/20"
            >
              <div className="text-2xl mb-2">{item.emoji}</div>
              <h3 className="font-medium">{item.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <Card className="mb-12 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl text-primary">
            Why Customers Keep Coming Back
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {[
            "Same friendly service as our street shop",
            "Carefully curated mix of practical and special items",
            "Prices that still make neighbors smile",
            "Reliable delivery with personal touches",
            "Items tested by our own family before we sell them",
          ].map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-3 text-primary">✓</div>
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Final CTA */}
      <section className="text-center border-t border-primary/20 pt-12">
        <h2 className="text-2xl font-bold mb-4 text-primary">
          Experience the Pottikadai Difference
        </h2>
        <p className="mb-6 text-gray-700 max-w-md mx-auto">
          We may have gone online, but we still treat every order like
          we&apos;re handing it to you across our shop counter.
        </p>
        <Button className="bg-primary hover:bg-primary/90">
          Start Shopping
        </Button>
      </section>
    </div>
  );
}
