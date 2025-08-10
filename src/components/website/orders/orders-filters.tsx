"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Calendar, Package } from "lucide-react";

interface Order {
  id: string;
  status: string;
  date: string;
}

export function OrderFilters({
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  orders,
}: {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  orders: Order[];
}) {
  const statusCounts = {
    all: orders.length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const statusOptions = [
    { value: "all", label: "All Orders", count: statusCounts.all },
    { value: "confirmed", label: "Confirmed", count: statusCounts.confirmed },
    {
      value: "processing",
      label: "Processing",
      count: statusCounts.processing,
    },
    { value: "shipped", label: "Shipped", count: statusCounts.shipped },
    { value: "delivered", label: "Delivered", count: statusCounts.delivered },
    { value: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
  ];

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "last30", label: "Last 30 Days" },
    { value: "last90", label: "Last 3 Months" },
    { value: "thisYear", label: "This Year" },
  ];

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 bg-primary rounded-lg">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="space-y-3"
            >
              {statusOptions.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="text-primary"
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-secondary/50 text-secondary-foreground"
                  >
                    {option.count}
                  </Badge>
                </motion.div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </motion.div>

      {/* Date Filter */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-secondary/5 border-secondary/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 bg-secondary rounded-lg">
                <Calendar className="h-4 w-4 text-secondary-foreground" />
              </div>
              Time Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={dateFilter}
              onValueChange={setDateFilter}
              className="space-y-3"
            >
              {dateOptions.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`date-${option.value}`}
                    className="text-secondary"
                  />
                  <Label
                    htmlFor={`date-${option.value}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
