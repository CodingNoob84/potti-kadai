import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRightIcon,
  BoxIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
} from "lucide-react";

interface IconProps {
  className?: string;
}

export default function ReturnsExchangePage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Returns & Exchanges
        </h1>
        <p className="text-muted-foreground">
          Hassle-free process within 14 days of delivery
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="border-primary hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start space-y-0 space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <RefreshCwIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Easy Returns</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Change your mind? No problem!
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="border-primary text-primary mt-2"
            >
              Start Return <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start space-y-0 space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <BoxIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Quick Exchanges</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Need a different size?
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="border-primary text-primary mt-2"
            >
              Request Exchange <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-secondary">
        <CardContent className="p-6 space-y-6">
          <section>
            <div className="flex items-start gap-4">
              <ShieldAlertIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-primary mb-2">
                  Key Points to Remember
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>14-day return window from delivery date</li>
                  <li>Original tags and packaging must be intact</li>
                  <li>Free return shipping for defective items</li>
                  <li>Exchanges subject to product availability</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator className="bg-secondary" />

          <section>
            <h2 className="text-lg font-semibold text-primary mb-3">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  step: "1",
                  title: "Initiate Request",
                  desc: "Contact us or use our self-service portal",
                },
                {
                  step: "2",
                  title: "Package Items",
                  desc: "Include all original tags and packaging",
                },
                {
                  step: "3",
                  title: "Ship Back",
                  desc: "Use provided label or instructions",
                },
              ].map((item) => (
                <Card
                  key={item.step}
                  className="bg-secondary/10 border-secondary"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        {item.step}
                      </div>
                      <CardTitle className="text-md">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm">
                    {item.desc}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary mb-3">
              Exchange Options
            </h2>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Size exchanges:</strong> Available for most apparel
                  items
                </li>
                <li>
                  <strong>Color exchanges:</strong> Subject to availability
                </li>
                <li>
                  <strong>Product exchanges:</strong> Case-by-case basis
                </li>
              </ul>
            </div>
          </section>

          <Separator className="bg-secondary" />

          <section>
            <h2 className="text-lg font-semibold text-primary mb-3">
              Need Immediate Help?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-primary hover:bg-primary/90">
                <MailIcon className="mr-2 h-4 w-4" /> Email Support
              </Button>
              <Button variant="outline" className="border-primary text-primary">
                <PhoneIcon className="mr-2 h-4 w-4" /> Call Now
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

const MailIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
