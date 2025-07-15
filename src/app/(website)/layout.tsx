import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function WebSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  console.log("session :", session);
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-background px-4 sm:px-6 lg:px-8">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
