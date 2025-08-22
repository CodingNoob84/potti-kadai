"use client";

import { OrdersMonthWise } from "@/components/dashboard/orders/monthwise";
import { OrderStatus } from "@/components/dashboard/orders/order-status";
import { RecentOrders } from "@/components/dashboard/orders/recent-orders";
import { OrderSummaryCard } from "@/components/dashboard/orders/summary-cards";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

export default function OrdersAnalyticsPage() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders Analytics</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <OrderSummaryCard />

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <OrdersMonthWise />
        <OrderStatus />
      </div>

      {/* Recent Orders Table */}
      <RecentOrders />
    </div>
  );
}
