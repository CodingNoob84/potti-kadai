"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AddressSection } from "@/components/website/account/address-section";
import { PaymentSection } from "@/components/website/account/payment-section";
import { ProfileSection } from "@/components/website/account/profile-section";
import { OrdersClientPage } from "@/components/website/orders/orders-page";
import { WishlistClientPage } from "@/components/website/wishlist/wishlist-page";
import { useSession } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Heart, MapPin, Package, User } from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "My Wishlist", icon: Heart },
  { id: "payments", label: "Payment Methods", icon: CreditCard },
];

export default function AccountPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  console.log("session", session, isSessionPending);
  const [activeSection, setActiveSection] = useState("profile");

  const renderProfileSection = () => <ProfileSection />;

  const renderAddressesSection = () => <AddressSection />;

  const renderOrdersSection = () => <OrdersClientPage />;

  const renderWishlistSection = () => <WishlistClientPage />;

  const renderPaymentMethodsSection = () => <PaymentSection />;

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection();
      case "addresses":
        return renderAddressesSection();
      case "orders":
        return renderOrdersSection();
      case "wishlist":
        return renderWishlistSection();
      case "payments":
        return renderPaymentMethodsSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Account
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm sticky top-8">
              <CardContent className="p-0">
                <nav className="space-y-1 p-4">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                          activeSection === item.id
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
