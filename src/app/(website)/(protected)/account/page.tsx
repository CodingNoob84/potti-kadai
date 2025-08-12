"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileSection } from "@/components/website/account/profile-section";
import { OrdersClientPage } from "@/components/website/orders/orders-page";
import { WishlistClientPage } from "@/components/website/wishlist/wishlist-page";
import { useSession } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  CreditCard,
  Edit,
  Heart,
  MapPin,
  Package,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

const dummyAddresses = [
  {
    id: 1,
    name: "John Doe",
    address: "123 Main Street, Apartment 4B",
    city: "New York",
    state: "NY",
    pincode: "10001",
    phone: "+1 (555) 123-4567",
    isDefault: true,
    type: "home",
  },
  {
    id: 2,
    name: "John Doe",
    address: "456 Oak Avenue, Suite 200",
    city: "Brooklyn",
    state: "NY",
    pincode: "11201",
    phone: "+1 (555) 987-6543",
    isDefault: false,
    type: "work",
  },
];

const dummyPaymentMethods = [
  {
    id: 1,
    type: "card",
    cardNumber: "**** **** **** 1234",
    cardType: "Visa",
    expiryDate: "12/25",
    isDefault: true,
  },
  {
    id: 2,
    type: "card",
    cardNumber: "**** **** **** 5678",
    cardType: "Mastercard",
    expiryDate: "08/26",
    isDefault: false,
  },
];

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
  const [addresses, setAddresses] = useState(dummyAddresses);
  const paymentMethods = dummyPaymentMethods;
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    type: "home",
  });

  const handleAddAddress = () => {
    const address = {
      id: addresses.length + 1,
      ...newAddress,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, address]);
    setNewAddress({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      type: "home",
    });
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const renderProfileSection = () => <ProfileSection />;

  const renderAddressesSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              Saved Addresses ({addresses.length})
            </div>
            <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressName">Full Name</Label>
                      <Input
                        id="addressName"
                        value={newAddress.name}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressPhone">Phone</Label>
                      <Input
                        id="addressPhone"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine">Address</Label>
                    <Input
                      id="addressLine"
                      value={newAddress.address}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            state: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={newAddress.pincode}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            pincode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddAddress}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Add Address
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                address.isDefault
                  ? "border-primary bg-primary/10"
                  : "border-muted bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{address.name}</span>
                    {address.isDefault && (
                      <Badge className="bg-primary text-primary-foreground">
                        Default
                      </Badge>
                    )}
                    <Badge variant="outline" className="capitalize">
                      {address.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefaultAddress(address.id)}
                      className="text-primary border-primary/30 hover:bg-primary/10"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderOrdersSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <OrdersClientPage />
    </motion.div>
  );

  const renderWishlistSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <WishlistClientPage />
    </motion.div>
  );

  const renderPaymentMethodsSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <CreditCard className="h-5 w-5 text-primary-foreground" />
              </div>
              Payment Methods ({paymentMethods.length})
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                method.isDefault
                  ? "border-primary bg-primary/10"
                  : "border-muted bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{method.cardType}</span>
                      {method.isDefault && (
                        <Badge className="bg-primary text-primary-foreground">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.cardNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:bg-primary/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );

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
