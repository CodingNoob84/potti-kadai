"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMonthwiseRevenue } from "@/server/orders";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const OrdersMonthWise = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders-monthwise"],
    queryFn: getMonthwiseRevenue,
  });

  // Transform the API data to match the chart format
  const chartData =
    data?.map((item) => ({
      name: item.month,
      revenue: parseFloat(item.revenue as string) || 0,
      orders: parseInt(item.orders as string) || 0,
    })) || [];

  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue & Orders</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue & Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          Failed to load chart data
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue & Orders</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              formatter={(value) => value.toLocaleString()}
              labelStyle={{ color: "#333" }}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="#8884d8"
              name="Revenue (₹)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="orders"
              fill="#82ca9d"
              name="Orders"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
