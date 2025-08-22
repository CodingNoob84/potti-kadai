"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecentOrders } from "@/server/orders";
import { useQuery } from "@tanstack/react-query";

export const RecentOrders = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => getRecentOrders(),
  });

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Capitalize first letter of status
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-3 w-20 ml-auto" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          Failed to load recent orders
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          No recent orders found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">#{order.id.slice(0, 8)}...</p>
                <p className="text-sm text-muted-foreground">
                  Customer: {order.customer.slice(0, 8)}...
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="font-medium">{formatCurrency(order.amount)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.date.toDateString())}
                </p>
              </div>
              <Badge
                variant={
                  order.status === "delivered"
                    ? "default"
                    : order.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {formatStatus(order.status ?? "")}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
