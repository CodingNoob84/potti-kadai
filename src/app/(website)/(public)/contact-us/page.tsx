import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TeamMember {
  name: string;
  role: string;
  email: string;
  phone: string;
  image: string;
  fallback: string;
  fallbackColor: string;
  buttonText: string;
  buttonVariant: "outline";
  borderColor: string;
  textColor: string;
  hoverColor: string;
  description: string;
}

interface IconProps {
  className?: string;
}

const ContactPage = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Product Team",
      role: "For product questions & suggestions",
      email: "products@pottikadai.com",
      phone: "+91 98765 43210",
      image: "/product-manager.jpg",
      fallback: "PM",
      fallbackColor: "bg-blue-100 text-blue-800",
      buttonText: "Schedule Product Call",
      buttonVariant: "outline",
      borderColor: "border-blue-300",
      textColor: "text-blue-700",
      hoverColor: "hover:bg-blue-50",
      description:
        "Meet our product manager who ensures our offerings meet your needs.",
    },
    {
      name: "Support Team",
      role: "For order issues & general help",
      email: "support@pottikadai.com",
      phone: "+91 98765 43211",
      image: "/support-lead.jpg",
      fallback: "CS",
      fallbackColor: "bg-green-100 text-green-800",
      buttonText: "Live Chat Support",
      buttonVariant: "outline",
      borderColor: "border-green-300",
      textColor: "text-green-700",
      hoverColor: "hover:bg-green-50",
      description:
        "Our support team is available 10AM-7PM daily to assist you.",
    },
    {
      name: "Sales Team",
      role: "For bulk orders & partnerships",
      email: "sales@pottikadai.com",
      phone: "+91 98765 43212",
      image: "/sales-head.jpg",
      fallback: "SL",
      fallbackColor: "bg-purple-100 text-purple-800",
      buttonText: "Request Quote",
      buttonVariant: "outline",
      borderColor: "border-purple-300",
      textColor: "text-purple-700",
      hoverColor: "hover:bg-purple-50",
      description:
        "Contact our sales team for wholesale inquiries and special pricing.",
    },
    {
      name: "Marketing Team",
      role: "For collaborations & promotions",
      email: "marketing@pottikadai.com",
      phone: "+91 98765 43213",
      image: "/marketing-head.jpg",
      fallback: "MK",
      fallbackColor: "bg-amber-100 text-amber-800",
      buttonText: "Partnership Inquiry",
      buttonVariant: "outline",
      borderColor: "border-amber-300",
      textColor: "text-amber-700",
      hoverColor: "hover:bg-amber-50",
      description:
        "Reach out for influencer partnerships, events, and media inquiries.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <section className="text-center mb-16">
        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary">
          We&apos;re Here to Help
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Connect With Pottikadai
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Whether you have questions, feedback, or partnership inquiries, our
          teams are ready to assist you.
        </p>
      </section>

      {/* General Contact Form */}
      <Card className="mb-16">
        <CardHeader>
          <CardTitle className="text-2xl">Send Us a Message</CardTitle>
          <CardDescription>
            We typically respond within 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Your Name" />
              <Input placeholder="Email Address" type="email" />
            </div>
            <Input placeholder="Subject" />
            <Textarea placeholder="Your Message" rows={5} />
            <Button type="button" className="bg-primary hover:bg-primary/90">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Team Sections */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {teamMembers.map((member, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.image} />
                  <AvatarFallback className={member.fallbackColor}>
                    {member.fallback}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{member.description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MailIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{member.phone}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={member.buttonVariant}
                className={`w-full ${member.borderColor} ${member.textColor} ${member.hoverColor}`}
              >
                {member.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Physical Location */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Visit Our Office</CardTitle>
          <CardDescription>
            We&apos;d love to meet you in person
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-2">
                Pottikadai Headquarters
              </h3>
              <p className="text-gray-700 mb-4">
                12 Market Street, near Old Tree, Kukgramam
                <br />
                Chennai, Tamil Nadu 600000
                <br />
                India
              </p>
              <div className="flex items-center gap-2 text-gray-700">
                <ClockIcon className="w-4 h-4" />
                <span>Monday-Saturday: 9:30AM - 7:00PM</span>
              </div>
            </div>
            <div className="h-64 rounded-lg overflow-hidden border">
              {/* Map placeholder */}
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Map View</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Icon Components
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

const ClockIcon = ({ className }: IconProps) => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default ContactPage;
