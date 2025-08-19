import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsConditions() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Terms & Conditions
        </h1>
        <p className="text-muted-foreground">
          Last Updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <Card className="border-secondary">
        <CardContent className="p-6 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing or using{" "}
              <strong>https://potti-kadai.vercel.app</strong>{" "}
              (&quot;Site&quot;), you agree to be bound by these Terms. If you
              disagree, please refrain from using our Site.
            </p>
          </section>

          <Separator className="bg-secondary" />

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              2. Account Registration
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                You must provide accurate information when creating an account
              </li>
              <li>
                You are responsible for maintaining account confidentiality
              </li>
              <li>
                We reserve the right to suspend accounts violating these Terms
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              3. Ordering & Payments
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Card className="bg-secondary/10 border-secondary">
                <CardHeader>
                  <CardTitle className="text-md">Pricing</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>All prices are in INR</li>
                    <li>Prices may change without notice</li>
                    <li>Taxes are calculated at checkout</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-secondary/10 border-secondary">
                <CardHeader>
                  <CardTitle className="text-md">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Credit/Debit Cards</li>
                    <li>UPI Payments</li>
                    <li>Net Banking</li>
                    <li>Wallet Payments</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              4. Shipping & Delivery
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Delivery times are estimates, not guarantees</li>
              <li>Risk of loss transfers upon delivery to carrier</li>
              <li>International orders may incur customs fees</li>
            </ul>
          </section>

          <Separator className="bg-secondary" />

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              5. Returns & Refunds
            </h2>
            <p className="text-muted-foreground mb-3">
              Refer to our{" "}
              <a href="/returns-refunds" className="text-primary underline">
                Return Policy
              </a>{" "}
              for detailed information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              6. Intellectual Property
            </h2>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                <li>All content on this Site is owned by Pottikadai</li>
                <li>Unauthorized use of trademarks is prohibited</li>
                <li>
                  You may not reproduce, modify, or distribute site content
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              7. User Conduct
            </h2>
            <p className="text-muted-foreground mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Use the Site for illegal purposes</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Post false, misleading, or harmful content</li>
              <li>Interfere with other user&apos;s experience</li>
            </ul>
          </section>

          <Separator className="bg-secondary" />

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              8. Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              Pottikadai shall not be liable for any indirect, incidental, or
              consequential damages arising from Site use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              9. Governing Law
            </h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with
              the laws of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">
              10. Changes to Terms
            </h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. Continued
              use constitutes acceptance of changes.
            </p>
          </section>

          <div className="bg-secondary/10 p-6 rounded-lg mt-6">
            <h2 className="text-lg font-semibold text-primary mb-2">
              Contact Information
            </h2>
            <p className="text-muted-foreground">
              For questions about these Terms: <br />
              <strong>Email:</strong> legal@pottikadai.com <br />
              <strong>Registered Office:</strong> [Your Business Address]
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
