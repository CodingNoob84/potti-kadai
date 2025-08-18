"use client";
import { NewPromoCodeModal } from "@/components/dashboard/promocodes/promocode-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deletePromoCode, getPromocodesList } from "@/server/offers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Hash, MoreHorizontal, PlusIcon, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type PromoCodeType = {
  id: number;
  code: string;
  type: string;
  value: number;
  minQuantity: number | null;
  validFrom: Date;
  validTo: Date;
  maxUses: number;
  usesPerUser: number;
  appliedTo: string;
  categoryIds?: number[];
  subcategoryIds?: number[];
  productIds?: number[];
};

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  // Add ordinal suffix to day
  const suffix = day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";

  return `${day}${suffix} ${month} ${year}`;
};

export default function PromoCodesListPage() {
  const queryClient = useQueryClient();
  const { data: promocodes, isLoading } = useQuery({
    queryKey: ["all-promocodes"],
    queryFn: getPromocodesList,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPromoCode, setCurrentPromoCode] =
    useState<PromoCodeType | null>(null);

  const deletePromoCodeMutation = useMutation({
    mutationFn: deletePromoCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-promocodes"] });
      toast.success("Promo code deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete promo code");
    },
  });

  const getActiveStatus = (from: Date, to: Date) => {
    const now = new Date();
    const validFrom = new Date(from);
    const validTo = new Date(to);
    return now >= validFrom && now <= validTo;
  };

  const handleEdit = (promo: PromoCodeType) => {
    setCurrentPromoCode(promo);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentPromoCode(null);
    setIsModalOpen(true);
  };

  const handleDelete = (promoId: number) => {
    deletePromoCodeMutation.mutate(promoId);
  };

  return (
    <div className="p-6">
      <Card className="border-none shadow-sm">
        <CardHeader className="px-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Promo Codes</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Create and manage promotional codes for your store
              </CardDescription>
            </div>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Promo Code
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Min Qty</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableSkeleton />
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Code</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[100px]">Value</TableHead>
                  <TableHead className="w-[100px]">Min Qty</TableHead>
                  <TableHead className="min-w-[180px]">Validity</TableHead>
                  <TableHead className="min-w-[150px]">Usage</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promocodes && promocodes.length > 0 ? (
                  promocodes.map((promo) => {
                    const isActive = getActiveStatus(
                      promo.validFrom,
                      promo.validTo
                    );
                    const validFrom = new Date(promo.validFrom);
                    const validTo = new Date(promo.validTo);

                    return (
                      <TableRow key={promo.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="font-mono bg-muted/20 px-2 py-1 rounded-md inline-block">
                            {promo.code}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              promo.type === "percentage"
                                ? "default"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {promo.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {promo.type === "percentage"
                            ? `${promo.value}%`
                            : `$${promo.value.toFixed(2)}`}
                        </TableCell>
                        <TableCell>
                          {promo.minQuantity ? (
                            <Badge variant="outline">{promo.minQuantity}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col sm:flex-row sm:gap-1">
                              <span>{formatDate(validFrom)}</span>
                              <span className="hidden sm:inline">-</span>
                              <span>{formatDate(validTo)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Hash className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{promo.maxUses}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {promo.usesPerUser}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={isActive ? "default" : "secondary"}
                            className={
                              !isActive ? "bg-muted text-muted-foreground" : ""
                            }
                          >
                            {isActive ? "Active" : "Expired"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-muted"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() => handleEdit(promo)}
                                className="cursor-pointer"
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                View Usage
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                                onClick={() => handleDelete(promo.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No promo codes found. Create your first promo code.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NewPromoCodeModal
        type={currentPromoCode ? "Edit" : "Create"}
        promoCodeValues={currentPromoCode || undefined}
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCurrentPromoCode(null);
          }
          setIsModalOpen(open);
        }}
      />
    </div>
  );
}

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-6 w-24 rounded-md" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-16 rounded-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-12" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-8 rounded-full" />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-16 rounded-full" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-8 rounded-md ml-auto" />
        </TableCell>
      </TableRow>
    ))}
  </>
);
