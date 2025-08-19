import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CreditCardIcon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
  RefreshCwIcon,
  SearchIcon,
  TruckIcon,
} from "lucide-react";

export default function HelpCenter() {
  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "You'll receive a tracking link via email once your order ships. You can also check order status in your account dashboard.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, UPI, Net Banking, and popular wallets like Paytm and PhonePe.",
    },
    {
      question: "Can I modify my order after placement?",
      answer:
        "Orders can be modified within 1 hour of placement. Contact support immediately at support@pottikadai.com.",
    },
  ];

  const contactMethods = [
    {
      icon: <MailIcon className="w-5 h-5 text-primary" />,
      title: "Email Support",
      details: "support@pottikadai.com",
      response: "Typically within 12 hours",
    },
    {
      icon: <PhoneIcon className="w-5 h-5 text-primary" />,
      title: "Phone Support",
      details: "+91 XXXX XXX XXX",
      response: "Mon-Sat, 10AM-6PM IST",
    },
    {
      icon: <MessageSquareIcon className="w-5 h-5 text-primary" />,
      title: "Live Chat",
      details: "Click the chat icon below",
      response: "Available 24/7",
    },
  ];

  const quickLinks = [
    {
      icon: <TruckIcon className="w-5 h-5" />,
      title: "Shipping Info",
      href: "/shipping-info",
    },
    {
      icon: <CreditCardIcon className="w-5 h-5" />,
      title: "Payment Methods",
      href: "/payment-methods",
    },
    {
      icon: <RefreshCwIcon className="w-5 h-5" />,
      title: "Returns & Refunds",
      href: "/returns-refunds",
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-4">
          How can we help you?
        </h1>
        <div className="max-w-2xl mx-auto relative">
          <Input
            placeholder="Search help articles..."
            className="pl-10 pr-4 py-6 text-base"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary">
            Search
          </Button>
        </div>
      </div>

      {/* Quick Assistance */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-primary mb-6">
          Quick Assistance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <Card
              key={index}
              className="hover:border-primary transition-colors group"
            >
              <a href={link.href}>
                <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                  <div className="bg-secondary/10 p-3 rounded-full group-hover:bg-primary/10">
                    {link.icon}
                  </div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                </CardHeader>
              </a>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-primary mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-secondary">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 text-muted-foreground">
                {faq.answer}
              </CardContent>
            </Card>
          ))}
        </div>
        <Button variant="outline" className="mt-6 border-primary text-primary">
          View All FAQs
        </Button>
      </div>

      {/* Contact Section */}
      <div>
        <h2 className="text-2xl font-semibold text-primary mb-6">
          Contact Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <Card
              key={index}
              className="border-secondary hover:border-primary transition-colors"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {method.icon}
                  <CardTitle>{method.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-medium mb-1">{method.details}</p>
                <p className="text-sm text-muted-foreground">
                  Response time: {method.response}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Help */}
      <div className="mt-16 bg-secondary/10 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          Still need help?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          Our customer care team is available to assist you with any questions
          about your orders, products, or account.
        </p>
        <Button className="bg-primary hover:bg-primary/90">
          Contact Support
        </Button>
      </div>
    </div>
  );
}
