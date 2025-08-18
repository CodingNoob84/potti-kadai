"use client";
import { AdminUsersTableSkeleton } from "@/components/dashboard/users/admin-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllAdmins } from "@/server/users";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Phone, Shield, User } from "lucide-react";
import { useState } from "react";
// Types
type UserRole = "ADMIN" | "MANAGER" | "USER" | "SUPPORT";
type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export default function AdminUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["all-admins"],
    queryFn: () => getAllAdmins(),
  });

  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL");

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <AdminUsersTableSkeleton />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div>User Management</div>
          <div>Manage all system users and their permissions</div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap">
                <Shield className="mr-2 h-4 w-4" />
                {roleFilter === "ALL" ? "All Roles" : roleFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRoleFilter("ALL")}>
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("ADMIN")}>
                ADMIN
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("MANAGER")}>
                MANAGER
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("SUPPORT")}>
                SUPPORT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("USER")}>
                USER
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap">
                <User className="mr-2 h-4 w-4" />
                {statusFilter === "ALL" ? "All Statuses" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("ACTIVE")}>
                ACTIVE
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("INACTIVE")}>
                INACTIVE
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("SUSPENDED")}>
                SUSPENDED
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={"default"}>{user.role}</Badge>
                </TableCell>

                <TableCell>
                  {formatDate(user.createdAt.toDateString())}
                </TableCell>
                <TableCell>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>Login Activity</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
