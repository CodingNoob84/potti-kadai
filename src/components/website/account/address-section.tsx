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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Zod schema for form validation
const addressFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  country: z.string().default("India"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  type: z.enum(["home", "work", "other"]),
  isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

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

export const AddressSection = () => {
  const [addresses, setAddresses] = useState(dummyAddresses);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const form = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      phone: "",
      type: "home",
      isDefault: false,
    },
  });

  const handleAddAddress = (data: AddressFormValues) => {
    const address = {
      id: addresses.length + 1,
      ...data,
      isDefault: data.isDefault || addresses.length === 0,
    };

    // If this is set as default, update other addresses
    if (address.isDefault) {
      setAddresses(addresses.map((addr) => ({ ...addr, isDefault: false })));
    }

    setAddresses([...addresses, address]);
    setShowAddressForm(false);
    form.reset();
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

  return (
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
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleAddAddress)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter full address"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter state" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="USA">
                                  United States
                                </SelectItem>
                                <SelectItem value="UK">
                                  United Kingdom
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input placeholder="6 digits" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">
                                +91
                              </span>
                              <Input
                                placeholder="9876543210"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Set as default address</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddressForm(false);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90"
                      >
                        Add Address
                      </Button>
                    </div>
                  </form>
                </Form>
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
              <div className="flex flex-col gap-5 items-start justify-between">
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
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Delete <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};
