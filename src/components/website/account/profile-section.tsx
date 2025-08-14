"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";
import { updateUser } from "@/server/users";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Edit, Mail, Phone, Save, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role: string;
  phone: string | null;
};

export const ProfileSection = () => {
  const { data: session, isPending: isSessionPending, refetch } = useSession();
  const [user, setUser] = useState<User | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as User);
      setEditedUser({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
      });
    }
  }, [session]);

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async (updatedUser) => {
      refetch();
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      setIsEditingProfile(false);
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    },
  });

  const handleSaveProfile = async () => {
    if (!user) return;

    // Validate fields
    if (!editedUser.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (editedUser.phone && !/^[0-9]{10,15}$/.test(editedUser.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    updateMutation.mutate({
      id: user.id,
      name: editedUser.name,
      phone: editedUser.phone,
    });
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditedUser({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
    }
    setIsEditingProfile(false);
  };

  if (isSessionPending) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center p-8">No user data available</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 px-4 sm:px-0"
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-white">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl">Profile Information</span>
            </div>
            {!isEditingProfile ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingProfile(true)}
                className="border-primary/30 text-primary hover:bg-primary/10 w-full sm:w-auto"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveProfile}
                  className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                  disabled={updateMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-primary/20">
              <AvatarImage src={user?.image || "/images/auth/no-avatar.jpg"} />
              <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold">{user?.name}</h3>
              <p className="text-muted-foreground">
                Member since {new Date(user?.createdAt).getFullYear()}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              {isEditingProfile ? (
                <Input
                  id="name"
                  value={editedUser.name}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-lg font-medium">
                  {user.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <div className="p-3 bg-muted/50 rounded-lg font-medium">
                {user.email}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              {isEditingProfile ? (
                <Input
                  id="phone"
                  type="tel"
                  value={editedUser.phone}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="p-3 bg-muted/50 rounded-lg font-medium">
                  {user?.phone || "Not provided"}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
