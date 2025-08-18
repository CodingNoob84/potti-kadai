"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyOrders } from "@/components/website/orders/empty-orders";
import { OrdersList } from "@/components/website/orders/orders-list";
import { OrdersLoading } from "@/components/website/orders/orders-loading";
import { useSession } from "@/lib/auth-client";
import { getAllUserOrders } from "@/server/cart";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Filter, Package, Sparkles } from "lucide-react";
import { useState } from "react";

export const OrdersClientPage = () => {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;

  const { data: orders, isLoading } = useQuery({
    queryKey: ["all-orders", user?.id],
    queryFn: () => getAllUserOrders(user?.id as string),
    enabled: !!user?.id,
  });
  console.log("data", orders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Filter orders based on selected filters
  const filteredOrders = orders?.filter((order) => {
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    return statusMatch;
  });

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "last30", label: "Last 30 Days" },
    { value: "last90", label: "Last 3 Months" },
    { value: "thisYear", label: "This Year" },
  ];

  if (isLoading || sessionLoading) {
    return <OrdersLoading />;
  }

  if (orders?.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-7xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary rounded-xl">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            My Orders
          </h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
          >
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-600">
            {filteredOrders?.length}{" "}
            {filteredOrders?.length === 1 ? "order" : "orders"} found
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                {statusOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Filter by Time Period</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={dateFilter}
                onValueChange={setDateFilter}
              >
                {dateOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-1 gap-8">
        {" "}
        {/* Changed to 1 column as filters are in dropdown */}
        <div className="lg:col-span-1">
          <OrdersList orders={filteredOrders} />
        </div>
      </div>
    </motion.div>
  );
};
