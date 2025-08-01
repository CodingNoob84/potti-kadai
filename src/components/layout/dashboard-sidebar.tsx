"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  LayoutDashboard,
  List,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

type MenuSubItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

type MenuItem = {
  title: string;
  href?: string;
  icon: ReactNode;
  submenu?: MenuSubItem[];
};

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Products",
    icon: <Package className="h-4 w-4" />,
    submenu: [
      {
        title: "List Products",
        href: "/dashboard/products",
        icon: <List className="h-4 w-4" />,
      },
      {
        title: "Create Product",
        href: "/dashboard/products/create",
        icon: <Plus className="h-4 w-4" />,
      },
      {
        title: "Categories",
        href: "/dashboard/products/categories",
        icon: <FolderPlus className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Offers",
    icon: <ShoppingCart className="h-4 w-4" />,
    submenu: [
      {
        title: "Discounts",
        href: "/dashboard/discounts",
        icon: <List className="h-4 w-4" />,
      },
      {
        title: "Promocodes",
        href: "/dashboard/promocodes",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Orders",
    icon: <ShoppingCart className="h-4 w-4" />,
    submenu: [
      {
        title: "List Orders",
        href: "/dashboard/orders",
        icon: <List className="h-4 w-4" />,
      },
      {
        title: "Order Analytics",
        href: "/dashboard/orders/analytics",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Users",
    icon: <Users className="h-4 w-4" />,
    submenu: [
      {
        title: "Admin Users",
        href: "/dashboard/users/admins",
        icon: <UserCheck className="h-4 w-4" />,
      },
      {
        title: "Customers",
        href: "/dashboard/users/customers",
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

function SidebarContent({
  pathname,
  openMenus,
  toggleMenu,
}: {
  pathname: string;
  openMenus: string[];
  toggleMenu: (title: string) => void;
}) {
  const isActive = (href: string) => pathname === href;
  const isParentActive = (submenu: MenuSubItem[]) =>
    submenu.some((item) => pathname === item.href);

  return (
    <div className="w-64 bg-background border-r h-full">
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary">PottiKadai</span>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
      </div>

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.title} className="space-y-1">
              {item.submenu ? (
                <Collapsible
                  open={openMenus.includes(item.title)}
                  onOpenChange={() => toggleMenu(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={
                        isParentActive(item.submenu) ? "secondary" : "ghost"
                      }
                      className="w-full justify-between px-3 py-2"
                    >
                      <div className="flex items-center space-x-3">
                        <span>{item.icon}</span>
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </div>
                      {openMenus.includes(item.title) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 mt-1 space-y-1">
                    {item.submenu.map((sub) => (
                      <Button
                        key={sub.href}
                        asChild
                        variant={isActive(sub.href) ? "secondary" : "ghost"}
                        className="w-full justify-start px-3 py-2 h-auto"
                      >
                        <Link
                          href={sub.href}
                          className="min-h-9 flex items-center"
                        >
                          {sub.icon}
                          <span className="ml-3 text-sm">{sub.title}</span>
                        </Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Button
                  asChild
                  variant={isActive(item.href!) ? "secondary" : "ghost"}
                  className="w-full justify-start px-3 py-2"
                >
                  <Link href={item.href!} className="min-h-9 flex items-center">
                    {item.icon}
                    <span className="ml-3 text-sm font-medium">
                      {item.title}
                    </span>
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([
    "Products",
    "Orders",
    "Users",
  ]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <>
      {/* Mobile top bar with Sheet button */}
      <div className="md:hidden ">
        <SidebarContent
          pathname={pathname}
          openMenus={openMenus}
          toggleMenu={toggleMenu}
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <SidebarContent
          pathname={pathname}
          openMenus={openMenus}
          toggleMenu={toggleMenu}
        />
      </div>
    </>
  );
}
