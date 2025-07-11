"use client";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Banknote,
  CheckCircle,
  CreditCard,
  Loader2,
  Plus,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const cartItems = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    price: 599,
    image: "/images/products/p_img4.png",
    size: "M",
    color: "Black",
    quantity: 2,
  },
  {
    id: 2,
    name: "Denim Casual Shirt",
    price: 1299,
    image: "/images/products/p_img5.png",
    size: "L",
    color: "Blue",
    quantity: 1,
  },
];

const savedAddresses = [
  {
    id: 1,
    name: "Rajesh Kumar",
    address: "123 MG Road, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    phone: "+91 9876543210",
    isDefault: true,
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    address: "456 Park Street, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "+91 9876543210",
    isDefault: false,
  },
];

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    phone: "",
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 1000 ? 0 : 99;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);

    // Simulate API call
    setTimeout(() => {
      setIsPlacingOrder(false);
      setOrderSuccess(true);

      // Reset after showing success
      setTimeout(() => {
        setOrderSuccess(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={selectedAddress}
                onValueChange={setSelectedAddress}
                className="space-y-4"
              >
                {savedAddresses.map((address) => (
                  <div key={address.id} className="flex items-start space-x-4">
                    <div className="flex items-center h-full pt-4">
                      <RadioGroupItem
                        value={address.id.toString()}
                        id={address.id.toString()}
                        className="h-5 w-5 text-primary border-2 border-muted-foreground/30 hover:border-primary"
                      />
                    </div>
                    <Label
                      htmlFor={address.id.toString()}
                      className="flex-1 w-full cursor-pointer"
                    >
                      <div
                        className={`border rounded-lg p-4 transition-all w-full ${
                          selectedAddress === address.id.toString()
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-muted hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{address.name}</span>
                          {address.isDefault && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {address.address}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Phone: {address.phone}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={newAddress.firstName}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={newAddress.lastName}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address1">Address Line 1</Label>
                      <Input
                        id="address1"
                        value={newAddress.address1}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            address1: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address2">
                        Address Line 2 (Optional)
                      </Label>
                      <Input
                        id="address2"
                        value={newAddress.address2}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            address2: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              city: e.target.value,
                            })
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={newAddress.country}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              country: e.target.value,
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

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Save Address
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                {/* UPI Payment Option */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="upi" id="upi" className="h-5 w-5" />
                    <Label
                      htmlFor="upi"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Smartphone className="h-5 w-5" />
                      <span>UPI Payment</span>
                    </Label>
                  </div>
                  {paymentMethod === "upi" && (
                    <div className="mt-3 pl-8 space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your UPI ID to complete payment
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Payment Option */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="razorpay"
                      id="razorpay"
                      className="h-5 w-5"
                    />
                    <Label
                      htmlFor="razorpay"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>
                  {paymentMethod === "razorpay" && (
                    <div className="mt-3 pl-8 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              number: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                expiry: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                cvv: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* COD Payment Option */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="cod" id="cod" className="h-5 w-5" />
                    <Label
                      htmlFor="cod"
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Banknote className="h-5 w-5" />
                      <span>Cash on Delivery</span>
                    </Label>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="mt-3 pl-8">
                      <p className="text-sm text-muted-foreground">
                        Pay cash when your order is delivered. An additional ₹50
                        may be charged for COD orders.
                      </p>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.size} | {item.color} | Qty: {item.quantity}
                      </p>
                      <p className="font-semibold">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span
                    className={
                      shipping === 0 ? "text-green-600 font-semibold" : ""
                    }
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || orderSuccess}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : orderSuccess ? (
                      "Order Placed!"
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </DialogTrigger>
                {orderSuccess && (
                  <DialogContent className="max-w-md text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                      <h3 className="text-2xl font-bold mb-2">
                        Order Placed Successfully!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Your order has been confirmed. We&apos;ll send you a
                        confirmation email shortly.
                      </p>
                      <Button asChild className="w-full">
                        <a href="/orders">View Order Details</a>
                      </Button>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
