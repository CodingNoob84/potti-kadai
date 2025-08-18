"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import {
  deleteUserAddress,
  getAllUserAddresses,
  setAddressDefault,
} from "@/server/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, MapPin, Trash2 } from "lucide-react";
import { AddressForm } from "../checkout/address-form";

const AddressSkeleton = () => {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-9 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border-2 border-muted bg-white"
            >
              <div className="flex flex-col gap-5 items-start justify-between">
                <div className="space-y-3 w-full">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export const AddressSection = () => {
  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionPending } = useSession();
  const userId = session?.user.id;

  const { data: userAddresses, isLoading } = useQuery({
    queryKey: ["user-addresses", session?.user.id],
    queryFn: () => getAllUserAddresses({ userId: session?.user.id as string }),
    enabled: !!session?.user.id,
  });

  const updateDefaultAddress = useMutation({
    mutationFn: setAddressDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses", userId] });
    },
  });

  const deleteAddress = useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses", userId] });
    },
  });

  const handleDeleteAddress = (id: number) => {
    deleteAddress.mutate({
      userId: userId as string,
      userAddressId: id,
    });
  };

  const handleSetDefaultAddress = (id: number) => {
    updateDefaultAddress.mutate({
      userId: userId as string,
      userAddressId: id,
    });
  };

  if (isSessionPending || isLoading) {
    return <AddressSkeleton />;
  }

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
              Saved Addresses ({userAddresses?.length})
            </div>
            <div>
              <AddressForm userId={userId as string} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userAddresses?.map((address) => (
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
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefaultAddress(address.id)}
                        className="text-primary border-primary/30 hover:bg-primary/10"
                        disabled={updateDefaultAddress.isPending}
                      >
                        {updateDefaultAddress.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Set Default"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 hover:bg-red-50"
                        disabled={deleteAddress.isPending}
                      >
                        {deleteAddress.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Delete <Trash2 className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};
