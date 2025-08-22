"use server";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema/cart";
import { desc, sql } from "drizzle-orm";

// ✅ Get 5 Most Recent Orders
export const getRecentOrders = async (limit = 5) => {
  try {
    const result = await db
      .select({
        id: orders.orderId,
        customer: orders.userId,
        amount: orders.finalAmount,
        status: orders.status,
        date: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error("Failed to fetch recent orders:", error);
    throw error;
  }
};

// ✅ Get Monthwise Revenue (Current Year)
export async function getMonthwiseRevenue() {
  try {
    const result = await db.execute(sql`
      WITH months AS (
        SELECT 
          TO_CHAR(d, 'Mon') AS month,
          EXTRACT(MONTH FROM d) AS month_number
        FROM generate_series(
          DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '4 months',
          DATE_TRUNC('month', CURRENT_DATE),
          INTERVAL '1 month'
        ) AS d
      )
      SELECT 
        m.month,
        m.month_number,
        COALESCE(SUM(o.final_amount), 0) AS revenue,
        COALESCE(COUNT(o.id), 0) AS orders
      FROM months m
      LEFT JOIN orders o
        ON EXTRACT(MONTH FROM o.created_at) = m.month_number
        AND EXTRACT(YEAR FROM o.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY m.month, m.month_number
      ORDER BY m.month_number;
    `);

    return result.rows; // [{ month: "Apr", revenue: 5000, orders: 120 }, ... always 5 months]
  } catch (error) {
    console.error("Failed to fetch monthwise revenue:", error);
    throw error;
  }
}

export async function getTopData() {
  try {
    const result = await db.execute(sql`
      WITH months AS (
        SELECT DATE_TRUNC('month', CURRENT_DATE) AS month
        UNION ALL
        SELECT DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      ),
      monthly_data AS (
        SELECT
          DATE_TRUNC('month', o.created_at) AS month,
          COUNT(DISTINCT o.id) AS total_orders,
          COALESCE(SUM(o.final_amount), 0) AS total_revenue,
          COALESCE(SUM(oi.quantity), 0) AS total_quantity
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        WHERE DATE_TRUNC('month', o.created_at) >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
        GROUP BY DATE_TRUNC('month', o.created_at)
      )
      SELECT
        TO_CHAR(m.month, 'Mon YYYY') AS month_name,
        COALESCE(md.total_orders, 0) AS total_orders,
        COALESCE(md.total_revenue, 0) AS total_revenue,
        COALESCE(md.total_quantity, 0) AS total_quantity
      FROM months m
      LEFT JOIN monthly_data md ON m.month = md.month
      ORDER BY m.month DESC;
    `);

    return result.rows;
    // Example Output:
    // [{ month_name: "Feb 2025", total_orders: 120, total_revenue: 5000, total_quantity: 800 },
    //  { month_name: "Jan 2025", total_orders: 0, total_revenue: 0, total_quantity: 0 }]
  } catch (error) {
    console.error("Failed to fetch top data:", error);
    throw error;
  }
}

export async function getOrderStatusCount() {
  try {
    const result = await db.execute(sql`
      SELECT
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) AS shipped
      FROM orders;
    `);

    return result.rows[0];
    // Example: { pending: 10, cancelled: 2, completed: 50, shipped: 30 }
  } catch (error) {
    console.error("Failed to fetch order status counts:", error);
    throw error;
  }
}
