import AdminSidebar from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { auth } from "@/lib/auth";
import { Menu } from "lucide-react";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  console.log("session :", session);
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Mobile Navbar */}
      <div className="md:hidden sticky top-0 z-50 bg-background border-b px-4 py-2 flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar />
          </SheetContent>
        </Sheet>

        <span className="text-sm font-semibold bg-primary text-white px-3 py-1 rounded-full">
          Admin
        </span>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-2 py-6">{children}</main>
    </div>
  );
}
