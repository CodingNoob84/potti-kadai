"use client";
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
import { Box, ListTree, MoreHorizontal, Package, PlusIcon } from "lucide-react";
import { useState } from "react";
import { NewDiscountModal } from "./discount-modal";

const discounts = [
  {
    id: "1",
    name: "Summer Sale",
    type: "percentage",
    value: 20,
    minQuantity: 1,
    appliedTo: "all",
  },
  {
    id: "2",
    name: "Bulk Order",
    type: "amount",
    value: 50,
    minQuantity: 5,
    appliedTo: "category",
    appliedToId: "electronics",
  },
  {
    id: "3",
    name: "New Product Launch",
    type: "percentage",
    value: 15,
    minQuantity: 1,
    appliedTo: "product",
    appliedToId: "p123",
  },
];

export function DiscountsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Discounts</CardTitle>
            <CardDescription>
              Manage your discounts and promotions
            </CardDescription>
          </div>
          <div>
            {/* Your existing discounts list code */}
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Discount
            </Button>

            <NewDiscountModal
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min Qty</TableHead>
              <TableHead>Applied To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell className="font-medium">{discount.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      discount.type === "percentage" ? "secondary" : "outline"
                    }
                  >
                    {discount.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {discount.type === "percentage"
                    ? `${discount.value}%`
                    : `$${discount.value}`}
                </TableCell>
                <TableCell>{discount.minQuantity}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {discount.appliedTo === "all" && (
                      <>
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>All Products</span>
                      </>
                    )}
                    {discount.appliedTo === "category" && (
                      <>
                        <ListTree className="h-4 w-4 text-muted-foreground" />
                        <span>Electronics</span>
                      </>
                    )}
                    {discount.appliedTo === "product" && (
                      <>
                        <Box className="h-4 w-4 text-muted-foreground" />
                        <span>Specific Product</span>
                      </>
                    )}
                  </div>
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
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
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
  );
}
