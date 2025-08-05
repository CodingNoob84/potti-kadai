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
      toast.success("Promo code has been successfully deleted!");
    },
    onError: () => {
      toast.error("Failed to delete promo code");
    },
  });

  const getActiveStatus = (from: Date, To: Date) => {
    const now = new Date();
    const validFrom = new Date(from);
    const validTo = new Date(To);
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

  if (isLoading) {
    <TableSkeleton />;
  }

  return (
    <div className="p-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Promo Codes</CardTitle>
              <CardDescription>
                Manage your promotional codes and offers
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Promo Code
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
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
              {promocodes &&
                promocodes.map((promo) => {
                  const isActive = getActiveStatus(
                    promo.validFrom,
                    promo.validTo
                  );
                  return (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">
                        <div className="font-mono">{promo.code}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            promo.type === "percentage"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {promo.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {promo.type === "percentage"
                          ? `${promo.value}%`
                          : `$${promo.value}`}
                      </TableCell>
                      <TableCell>{promo.minQuantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(
                            promo.validFrom
                          ).toLocaleDateString()} -{" "}
                          {new Date(promo.validTo).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span>{promo.maxUses}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{promo.usesPerUser}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {isActive ? "Active" : "Expired"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(promo)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Usage</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(promo.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
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
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-16 rounded-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-12" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-8" />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
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
