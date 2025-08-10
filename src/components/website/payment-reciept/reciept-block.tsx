"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Mail, MapPin, Phone, ShoppingBag, User } from "lucide-react";
import QRCode from "react-qr-code";

export type OrderItem = {
  itemId: number;
  quantity: number;
  orginalprice: number;
  finalprice: number;
  productname: string;
  size: string;
  color: string;
};

export type Order = {
  id: number;
  userId: string;
  orginalAmount: number;
  totalAmount: number;
  discountAmount: number | null;
  shippingAmount: number | null;
  finalAmount: number;
  status: string;
  paymentMethod: string;
  addressId: number;
  createdAt: Date | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  isAnonymous: boolean | null;
  role: string;
};

export type Address = {
  id: number;
  userId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
};

type ReceiptBlockProps = {
  order: Order;
  user: User;
  useraddress: Address;
  items: OrderItem[];
};

export const ReceiptBlock = ({
  order,
  user,
  useraddress,
  items,
}: ReceiptBlockProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.finalprice, 0);
  const discount = items.reduce(
    (sum, item) => sum + (item.finalprice - item.orginalprice),
    0
  );
  const shipping = subtotal > 2999 ? 0 : 99;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  return (
    <Card className="border shadow-none print:p-0 print:shadow-none print:border-0">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 print:p-4 print:bg-green-800 print:text-white">
        <div className="flex justify-between items-start print:flex-row print:gap-2">
          <div>
            <CardTitle className="text-2xl font-bold print:text-xl">
              POTTI KADAI
            </CardTitle>
            <p className="text-sm text-green-100 print:text-white">
              123 Business Street, Central
            </p>
            <p className="text-sm text-green-100 print:text-white">
              Chennai,TamilNadu, India
            </p>
            <p className="text-sm text-green-100 print:text-white">600001.</p>
            <p className="text-sm text-green-100 print:text-white">
              GSTIN: 22ABCDE1234F1Z5
            </p>
          </div>
          <div className="text-right print:text-left print:mt-4">
            <p className="text-lg font-semibold print:text-base">INVOICE</p>
            <p className="text-sm text-green-100 print:text-white">
              #{order.id}
            </p>
            <p className="text-sm text-green-100 print:text-white">
              {order.createdAt?.toDateString()}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 print:p-2">
        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 print:grid-cols-2 print:gap-4 print:p-4">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <User className="h-5 w-5 text-green-600" />
              Customer Details
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium ml-6">{useraddress.name}</p>
              <p className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                <span>
                  {useraddress.address}
                  <br />
                  {useraddress.city}, {useraddress.state}
                  <br />
                  {useraddress.country}
                </span>
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-green-600" />
                {useraddress.phone}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 text-green-600" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <ShoppingBag className="h-5 w-5 text-green-600" />
              Order Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="text-gray-500">Order Number</p>
                <p className="font-medium">#{order.id}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500">Payment Method</p>
                <p className="font-medium">
                  {order.paymentMethod == "cod"
                    ? "Cash on Delivery"
                    : "Credit Card"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium">{order.createdAt?.toDateString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500">Status</p>
                {order.status == "pending" && (
                  <p className="font-medium text-orange-600">Pending</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="px-6 print:px-4">
          <div className="border rounded-lg overflow-hidden print:border print:rounded">
            <table className="w-full text-sm print:text-xs">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="p-3 font-medium">Product</th>
                  <th className="p-3 font-medium text-right">Price</th>
                  <th className="p-3 font-medium text-right">Qty</th>
                  <th className="p-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item.itemId}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{item.productname}</p>
                          <p className="text-xs text-gray-500">
                            {item.size} | {item.color}
                          </p>
                          {item.orginalprice > item.finalprice && (
                            <p className="text-xs text-gray-400 line-through">
                              ₹{item.orginalprice}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      ₹{item.finalprice / item.quantity}
                    </td>
                    <td className="p-3 text-right">{item.quantity}</td>
                    <td className="p-3 text-right font-medium">
                      ₹{item.finalprice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 print:grid-cols-2 print:gap-4 print:p-4">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex justify-center mb-3">
                <div className="bg-white p-2 rounded border">
                  <QRCode
                    value={`order:${order.id}`}
                    size={128}
                    level="H"
                    className="h-32 w-32"
                  />
                </div>
              </div>
              <p className="text-center text-xs text-gray-500">
                Scan QR code for payment verification
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span
                className={
                  shipping === 0 ? "text-green-600 font-medium" : "font-medium"
                }
              >
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Tax (18%)</span>
              <span className="font-medium">₹{tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center text-sm text-gray-500 print:p-4 print:text-xs">
          <p>Thank you for shopping with Potti Kadai!</p>
          <p className="mt-1">
            For any queries, contact support@pottikadai.com or call +91
            9876543210
          </p>
          <p className="mt-2 text-xs">
            This is a computer generated receipt and does not require signature
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
