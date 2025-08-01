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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Hash, MoreHorizontal, PlusIcon, User } from "lucide-react";
import { useState } from "react";

const promoCodes = [
  {
    id: "1",
    code: "SUMMER20",
    type: "percentage",
    value: 20,
    minQuantity: 1,
    validFrom: "2023-06-01",
    validTo: "2023-08-31",
    totalUses: 142,
    usesPerUser: 2,
    status: "active",
  },
  {
    id: "2",
    code: "FREESHIP",
    type: "amount",
    value: 5,
    minQuantity: 1,
    validFrom: "2023-01-01",
    validTo: "2023-12-31",
    totalUses: 89,
    usesPerUser: 1,
    status: "active",
  },
  {
    id: "3",
    code: "BULK10",
    type: "percentage",
    value: 10,
    minQuantity: 3,
    validFrom: "2023-05-15",
    validTo: "2023-06-15",
    totalUses: 23,
    usesPerUser: 1,
    status: "expired",
  },
];

export default function PromoCodesListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Promo Codes</CardTitle>
              <CardDescription>
                Manage your promotional codes and offers
              </CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
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
              {promoCodes.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">
                    <div className="font-mono">{promo.code}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        promo.type === "percentage" ? "secondary" : "outline"
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
                      {new Date(promo.validFrom).toLocaleDateString()} -{" "}
                      {new Date(promo.validTo).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span>{promo.totalUses}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{promo.usesPerUser}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        promo.status === "active" ? "default" : "secondary"
                      }
                    >
                      {promo.status}
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Usage</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewPromoCodeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
