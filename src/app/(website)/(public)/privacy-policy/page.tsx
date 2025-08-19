import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Effective:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <Card className="border-secondary">
        <CardContent className="p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              1. Introduction
            </h2>
            <p className="text-muted-foreground">
              At <strong>Pottikadai</strong> (&quot;we&quot;, &quot;us&quot;),
              we respect your privacy. This policy explains how we collect, use,
              and protect your personal information when you use our website
              (www.pottikadai.com) and services.
            </p>
          </section>

          <Separator className="bg-secondary" />

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              2. Information We Collect
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Card className="bg-secondary/10 border-secondary">
                <CardHeader>
                  <CardTitle className="text-md">
                    Information You Provide
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Name, email, phone number</li>
                    <li>Shipping/billing addresses</li>
                    <li>Payment information</li>
                    <li>Account credentials</li>
                    <li>Communications with us</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-secondary/10 border-secondary">
                <CardHeader>
                  <CardTitle className="text-md">
                    Automatically Collected
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>IP address & device information</li>
                    <li>Browser type & cookies</li>
                    <li>Usage data (pages visited)</li>
                    <li>Purchase history</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Process orders and deliver products</li>
              <li>Provide customer support</li>
              <li>Improve our website and services</li>
              <li>Send transactional emails (order confirmations)</li>
              <li>Prevent fraud and enhance security</li>
              <li>With consent: send marketing communications</li>
            </ul>
          </section>

          <Separator className="bg-secondary" />

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              4. Data Sharing
            </h2>
            <p className="text-muted-foreground mb-3">
              We only share data with third parties when necessary:
            </p>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                <li>
                  <strong>Payment processors</strong> to complete transactions
                </li>
                <li>
                  <strong>Shipping carriers</strong> for order delivery
                </li>
                <li>
                  <strong>Service providers</strong> (e.g., hosting, analytics)
                </li>
                <li>When required by law or legal process</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              5. Your Rights
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Access",
                  content: "Request copies of your personal data",
                },
                {
                  title: "Correction",
                  content: "Update inaccurate information",
                },
                {
                  title: "Deletion",
                  content: "Request erasure under certain conditions",
                },
                {
                  title: "Opt-Out",
                  content: "Unsubscribe from marketing emails",
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="bg-secondary/10 border-secondary hover:bg-secondary/20 transition-colors"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm">
                    {item.content}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="bg-secondary" />

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              6. Cookies
            </h2>
            <p className="text-muted-foreground">
              We use cookies to enhance your experience. You can manage
              preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              7. Policy Updates
            </h2>
            <p className="text-muted-foreground">
              We may update this policy periodically. Significant changes will
              be notified via email or website notice.
            </p>
          </section>

          <div className="bg-secondary/10 p-6 rounded-lg mt-6">
            <h2 className="text-lg font-semibold text-primary mb-2">
              Contact Us
            </h2>
            <p className="text-muted-foreground">
              For privacy-related inquiries: <br />
              <strong>Email:</strong> privacy@pottikadai.com <br />
              <strong>Mail:</strong> Data Protection Officer, Pottikadai, [Your
              Business Address]
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
