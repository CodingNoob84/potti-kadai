import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Clock, PackageCheck, ShieldCheck, Truck } from "lucide-react";

interface ShippingPartner {
  id: string;
  name: string;
  logo: string;
  deliveryAreas: string[];
  deliveryTime: string;
  trackingUrl: string;
  reliability: number;
  features: string[];
}

export default function ShippingInfoPage() {
  const shippingPartners: ShippingPartner[] = [
    {
      id: "delhivery",
      name: "Delhivery",
      logo: "/logos/delhivery.png",
      deliveryAreas: ["All major cities", "Tier 1 & 2 towns"],
      deliveryTime: "2-5 business days",
      trackingUrl: "https://www.delhivery.com/track/",
      reliability: 92,
      features: [
        "Real-time tracking",
        "Cash on Delivery",
        "Contactless delivery",
      ],
    },
    {
      id: "dtdc",
      name: "DTDC",
      logo: "/logos/dtdc.png",
      deliveryAreas: ["Nationwide", "International"],
      deliveryTime: "3-7 business days",
      trackingUrl: "https://www.dtdc.com/tracking/",
      reliability: 88,
      features: [
        "Express delivery options",
        "Secure handling",
        "International shipping",
      ],
    },
    {
      id: "blue-dart",
      name: "Blue Dart",
      logo: "/logos/blue-dart.png",
      deliveryAreas: ["Metro cities", "Priority locations"],
      deliveryTime: "1-3 business days",
      trackingUrl: "https://www.bluedart.com/track/",
      reliability: 95,
      features: [
        "Premium service",
        "Same-day delivery (select cities)",
        "Temperature-controlled shipping",
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <section className="text-center mb-16">
        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary">
          Shipping Information
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Delivery & Shipping Partners
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          We partner with trusted logistics providers to bring your orders
          safely and quickly
        </p>
      </section>

      {/* Shipping Process */}
      <Card className="mb-16">
        <CardHeader>
          <CardTitle className="text-2xl">Our Shipping Process</CardTitle>
          <CardDescription>How your order gets to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <PackageCheck className="w-8 h-8 text-primary" />,
                title: "Order Processed",
                description: "Within 24 hours",
              },
              {
                icon: <Truck className="w-8 h-8 text-primary" />,
                title: "Dispatched",
                description: "1-2 business days",
              },
              {
                icon: <Clock className="w-8 h-8 text-primary" />,
                title: "In Transit",
                description: "Varies by location",
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                title: "Delivered",
                description: "Safely to your door",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">{step.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Partners */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">
          Our Trusted Shipping Partners
        </h2>
        <div className="grid gap-6">
          {shippingPartners.map((partner) => (
            <Card
              key={partner.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div>
                      <CardTitle>{partner.name}</CardTitle>
                      <CardDescription>
                        Delivery in {partner.deliveryTime}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">Reliability:</span>
                      <span className="text-sm font-bold">
                        {partner.reliability}%
                      </span>
                    </div>
                    <Progress value={partner.reliability} className="h-2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Delivery Areas</h4>
                    <ul className="space-y-1">
                      {partner.deliveryAreas.map((area, i) => (
                        <li key={i} className="flex items-center">
                          <span className="text-primary mr-2">✓</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Key Features</h4>
                    <ul className="space-y-1">
                      {partner.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <span className="text-primary mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <a
                    href={partner.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    Track Your Order
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Shipping Policies */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Shipping Policies</h2>
        <Card>
          <CardContent className="p-6 grid gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Domestic Shipping</h3>
              <p className="text-gray-700">
                We offer free standard shipping on all orders over ₹999. For
                orders below this amount, a flat shipping fee of ₹49 applies.
                Express shipping options are available at checkout.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                International Shipping
              </h3>
              <p className="text-gray-700">
                Currently available to select countries. Shipping costs and
                delivery times vary by destination. Customs and import duties
                may apply and are the responsibility of the recipient.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Rural Area Shipping
              </h3>
              <p className="text-gray-700">
                Delivery to remote areas may take additional time. Please allow
                2-3 extra business days for delivery to rural locations. Some
                services may not be available in all areas.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Shipping FAQs</h2>
        <Card>
          <CardContent className="p-6 grid gap-6">
            {[
              {
                question: "How can I track my order?",
                answer:
                  "Once your order is shipped, you'll receive a tracking number via email. You can use this number on our shipping partner's website to track your package in real-time.",
              },
              {
                question:
                  "What if I'm not available when delivery is attempted?",
                answer:
                  "Our partners will typically attempt delivery 2-3 times. After that, the package may be held at a local facility for pickup or returned to us.",
              },
              {
                question: "Do you offer same-day delivery?",
                answer:
                  "Same-day delivery is available in select cities for orders placed before 12 PM. Check availability at checkout.",
              },
              {
                question: "How are fragile items packaged?",
                answer:
                  "All fragile items are specially packaged with extra padding and protective materials. Our partners are trained in careful handling of delicate packages.",
              },
            ].map((faq, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
                {index < 3 && <Separator className="my-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
