"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderStatusCount } from "@/server/orders";
import { useQuery } from "@tanstack/react-query";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export const OrderStatus = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["order-status"],
    queryFn: getOrderStatusCount,
  });

  // Transform the API data to match the chart format
  const chartData = data
    ? [
        { name: "Completed", value: parseInt(data.completed as string) || 0 },
        { name: "Pending", value: parseInt(data.pending as string) || 0 },
        { name: "Cancelled", value: parseInt(data.cancelled as string) || 0 },
        { name: "Shipped", value: parseInt(data.shipped as string) || 0 },
      ].filter((item) => item.value > 0)
    : []; // Filter out statuses with 0 values

  // Calculate total orders for percentage calculation
  const totalOrders = chartData.reduce((sum, item) => sum + item.value, 0);

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          Failed to load order status data
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, value }) => {
                const percentage =
                  totalOrders > 0
                    ? ((value ?? 0 / totalOrders) * 100).toFixed(0)
                    : "0";
                return `${name}: ${value} (${percentage}%)`;
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} orders`, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {totalOrders === 0 && (
          <div className="text-center text-muted-foreground mt-4">
            No orders found
          </div>
        )}
      </CardContent>
    </Card>
  );
};
