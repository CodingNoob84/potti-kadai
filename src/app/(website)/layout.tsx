import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default async function WebSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-background px-4 sm:px-6 lg:px-8">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
