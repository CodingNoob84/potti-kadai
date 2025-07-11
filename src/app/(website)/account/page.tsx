"use client";

import { useState } from "react";
import {
  Lock,
  Heart,
  Package,
  CreditCard,
  Trash2,
  Edit,
  Plus,
  ShoppingBag,
  Frown,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import Link from "next/link";

export default function AccountPage() {
  const [userInfo, setUserInfo] = useState({
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 9876543210",
    dateOfBirth: "1990-05-15",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("1");

  // Dummy data
  const orders = [
    {
      id: "ORD-78945",
      date: "2023-12-15",
      status: "Delivered",
      items: [
        {
          id: 1,
          name: "Classic Cotton T-Shirt",
          price: 599,
          quantity: 2,
          image: "/images/products/tshirt.jpg",
        },
        {
          id: 2,
          name: "Slim Fit Jeans",
          price: 1299,
          quantity: 1,
          image: "/images/products/jeans.jpg",
        },
      ],
      total: 2497,
      deliveryDate: "2023-12-20",
    },
    {
      id: "ORD-78432",
      date: "2023-11-28",
      status: "Cancelled",
      items: [
        {
          id: 3,
          name: "Wireless Headphones",
          price: 1999,
          quantity: 1,
          image: "/images/products/headphones.jpg",
        },
      ],
      total: 1999,
      deliveryDate: null,
    },
  ];

  const addresses = [
    {
      id: "1",
      name: "Rajesh Kumar",
      address: "123, Main Street, Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560034",
      phone: "+91 9876543210",
      isDefault: true,
    },
    {
      id: "2",
      name: "Rajesh Kumar (Work)",
      address: "456, Tech Park, Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560066",
      phone: "+91 9876543210",
      isDefault: false,
    },
  ];

  const wishlist = [
    {
      id: 1,
      name: "Premium Leather Wallet",
      price: 1299,
      originalPrice: 1999,
      image: "/images/products/wallet.jpg",
      inStock: true,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 5999,
      originalPrice: 7999,
      image: "/images/products/smartwatch.jpg",
      inStock: true,
    },
    {
      id: 3,
      name: "Wireless Earbuds",
      price: 2499,
      originalPrice: 2999,
      image: "/images/products/earbuds.jpg",
      inStock: false,
    },
  ];

  const handleSave = () => {
    console.log("Saving user info:", userInfo);
    setIsEditing(false);
  };

  return (
    <div className="container px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Personal Information</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={userInfo.firstName}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              firstName: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={userInfo.lastName}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              lastName: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, email: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={userInfo.phone}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, phone: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={userInfo.dateOfBirth}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            dateOfBirth: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    {isEditing && (
                      <Button onClick={handleSave} className="w-full">
                        Save Changes
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Order History
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      My Wishlist
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              Placed on{" "}
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "secondary"
                                : order.status === "Cancelled"
                                ? "destructive"
                                : "default"
                            }
                            className="mt-2 sm:mt-0"
                          >
                            {order.status}
                          </Badge>
                        </div>

                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-sm">₹{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            {order.deliveryDate && (
                              <p className="text-sm">
                                Delivered on{" "}
                                {new Date(
                                  order.deliveryDate
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Total Amount
                            </p>
                            <p className="font-medium">₹{order.total}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Frown className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Your order history will appear here once you make a
                      purchase.
                    </p>
                    <Button asChild>
                      <Link href="/products">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Browse Products
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Saved Addresses</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {addresses.length > 0 ? (
                  <RadioGroup
                    value={selectedAddress}
                    onValueChange={setSelectedAddress}
                    className="space-y-3"
                  >
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 transition-all ${
                          selectedAddress === address.id
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <RadioGroupItem
                            value={address.id}
                            id={address.id}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                              <Label
                                htmlFor={address.id}
                                className="font-medium cursor-pointer"
                              >
                                {address.name}
                              </Label>
                              {address.isDefault && (
                                <Badge
                                  variant="secondary"
                                  className="mt-1 sm:mt-0 w-fit"
                                >
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {address.address}
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                              {address.city}, {address.state} -{" "}
                              {address.pincode}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Phone: {address.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          {!address.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No saved addresses
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Add an address for faster checkout and order tracking.
                    </p>
                    <Button asChild>
                      <Link href="/account/addresses/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                {wishlist.length == 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="relative aspect-square mb-4">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">₹{item.price}</span>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>
                          {!item.inStock && (
                            <Badge
                              variant="outline"
                              className="text-destructive"
                            >
                              Out of Stock
                            </Badge>
                          )}
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" className="flex-1">
                              Add to Cart
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Your wishlist is empty
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Save items you love to your wishlist for easy access
                      later.
                    </p>
                    <div className="flex gap-4">
                      <Button asChild variant="outline">
                        <Link href="/collections/new-arrivals">
                          <Package className="h-4 w-4 mr-2" />
                          New Arrivals
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/products">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Browse All
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
