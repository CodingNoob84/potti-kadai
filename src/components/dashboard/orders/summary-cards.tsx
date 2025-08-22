"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getTopData } from "@/server/orders";
import { useQuery } from "@tanstack/react-query";

export const OrderSummaryCard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["summary-order"],
    queryFn: getTopData,
  });

  // Calculate metrics from data
  const currentMonthData = data?.[0];
  const previousMonthData = data?.[1];

  const totalRevenue = currentMonthData
    ? parseFloat(currentMonthData.total_revenue as string)
    : 0;
  const totalOrders = currentMonthData
    ? parseInt(currentMonthData.total_orders as string)
    : 0;
  const totalQuantity = currentMonthData
    ? parseInt(currentMonthData.total_quantity as string)
    : 0;

  const prevRevenue = previousMonthData
    ? parseFloat(previousMonthData.total_revenue as string)
    : 0;
  const prevOrders = previousMonthData
    ? parseInt(previousMonthData.total_orders as string)
    : 0;
  const prevQuantity = previousMonthData
    ? parseInt(previousMonthData.total_quantity as string)
    : 0;

  // Calculate average order value
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const prevAvgOrderValue = prevOrders > 0 ? prevRevenue / prevOrders : 0;

  // Calculate percentage changes
  const revenueChange =
    prevRevenue > 0
      ? ((totalRevenue - prevRevenue) / prevRevenue) * 100
      : totalRevenue > 0
      ? 100
      : 0;

  const ordersChange =
    prevOrders > 0
      ? ((totalOrders - prevOrders) / prevOrders) * 100
      : totalOrders > 0
      ? 100
      : 0;

  const aovChange =
    prevAvgOrderValue > 0
      ? ((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100
      : avgOrderValue > 0
      ? 100
      : 0;

  const quantityChange =
    prevQuantity > 0
      ? ((totalQuantity - prevQuantity) / prevQuantity) * 100
      : totalQuantity > 0
      ? 100
      : 0;

  // Format values for display
  const formattedRevenue = totalRevenue.toLocaleString();
  const formattedOrders = totalOrders.toLocaleString();
  const formattedQuantity = totalQuantity.toLocaleString();
  const formattedAOV = avgOrderValue.toFixed(2);

  const formattedRevenueChange = revenueChange.toFixed(1);
  const formattedOrdersChange = ordersChange.toFixed(1);
  const formattedAOVChange = aovChange.toFixed(1);
  const formattedQuantityChange = quantityChange.toFixed(1);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6 text-center text-muted-foreground">
              Failed to load data
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{formattedRevenue}</div>
          <p
            className={`text-xs ${
              revenueChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {revenueChange >= 0 ? "+" : ""}
            {formattedRevenueChange}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedOrders}</div>
          <p
            className={`text-xs ${
              ordersChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {ordersChange >= 0 ? "+" : ""}
            {formattedOrdersChange}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Order Value
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{formattedAOV}</div>
          <p
            className={`text-xs ${
              aovChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {aovChange >= 0 ? "+" : ""}
            {formattedAOVChange}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedQuantity}</div>
          <p
            className={`text-xs ${
              quantityChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {quantityChange >= 0 ? "+" : ""}
            {formattedQuantityChange}% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
