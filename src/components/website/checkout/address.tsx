"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllUserAddresses } from "@/server/users";
import { useQuery } from "@tanstack/react-query";
import { AddressForm } from "./address-form";

export const AddressBlock = ({
  userId,
  addressId,
  setAddressId,
}: {
  userId: string;
  addressId: string;
  setAddressId: (addressId: string) => void;
}) => {
  const { data: userAddresses, isLoading } = useQuery({
    queryKey: ["user-addresses", userId],
    queryFn: () => getAllUserAddresses({ userId }),
  });
  console.log("data", userAddresses);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="flex items-center h-full pt-4">
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <div className="flex-1 w-full">
                  <div className="border rounded-lg p-4 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[50px]" />
                    </div>
                    <Skeleton className="h-4 w-[200px] mb-1" />
                    <Skeleton className="h-4 w-[150px] mb-1" />
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={addressId}
          onValueChange={setAddressId}
          className="space-y-4"
        >
          {userAddresses &&
            userAddresses.map((address) => (
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
                      addressId === address.id.toString()
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

        <AddressForm userId={userId as string} />
      </CardContent>
    </Card>
  );
};
