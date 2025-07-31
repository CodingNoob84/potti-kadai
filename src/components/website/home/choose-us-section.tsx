import { Headphones, RotateCcw, Shield, Truck } from "lucide-react";

const whyChooseUs = [
  {
    icon: <Truck className="h-8 w-8" />,
    title: "Free Shipping",
    description: "Free shipping on orders above ₹1000",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Secure Payment",
    description: "100% secure payment gateway",
  },
  {
    icon: <Headphones className="h-8 w-8" />,
    title: "24/7 Support",
    description: "Round the clock customer support",
  },
  {
    icon: <RotateCcw className="h-8 w-8" />,
    title: "Easy Returns",
    description: "30-day hassle-free returns",
  },
];
export const ChooseUsSection = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose PottiKadai?
          </h2>
          <p className="text-muted-foreground text-lg">
            We&apos;re committed to providing the best shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
