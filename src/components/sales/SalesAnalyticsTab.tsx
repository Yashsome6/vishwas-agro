import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, ShoppingBag, Users, AlertCircle } from "lucide-react";

export default function SalesAnalyticsTab() {
  const { data } = useAppData();

  const totalSalesAmount = (data.sales || []).reduce((sum: number, s: any) => sum + (s.total || 0), 0);
  const pendingPayments = (data.sales || [])
    .filter((s: any) => s.paymentStatus === "pending" || s.paymentStatus === "partial")
    .reduce((sum: number, s: any) => sum + (s.total || 0), 0);

  // Monthly sales data
  const monthlySales = (data.sales || []).reduce((acc: any, sale: any) => {
    const month = new Date(sale.date).toLocaleString("default", { month: "short" });
    const existing = acc.find((item: any) => item.month === month);
    if (existing) {
      existing.amount += sale.total;
    } else {
      acc.push({ month, amount: sale.total });
    }
    return acc;
  }, []);

  // Customer-wise sales data
  const customerSales = (data.customers || []).map((customer: any) => {
    const sales = (data.sales || []).filter((s: any) => s.customerId === customer.id);
    const total = sales.reduce((sum: number, s: any) => sum + (s.total || 0), 0);
    return { name: customer.name, value: total };
  }).filter((c: any) => c.value > 0).slice(0, 5);

  // Payment status distribution
  const paymentStatusData = [
    { name: "Paid", value: (data.sales || []).filter((s: any) => s.paymentStatus === "paid").length },
    { name: "Partial", value: (data.sales || []).filter((s: any) => s.paymentStatus === "partial").length },
    { name: "Pending", value: (data.sales || []).filter((s: any) => s.paymentStatus === "pending").length }
  ];

  // Top selling products
  const productSales = (data.stock || []).map((stockItem: any) => {
    const totalQtySold = (data.sales || []).reduce((sum: number, sale: any) => {
      const saleItem = (sale.items || []).find((item: any) => item.stockId === stockItem.id);
      return sum + (saleItem?.quantity || 0);
    }, 0);
    return { name: stockItem.name, quantity: totalQtySold, value: totalQtySold * (stockItem.sellingPrice || 0) };
  }).filter((p: any) => p.quantity > 0).sort((a: any, b: any) => b.value - a.value).slice(0, 5);

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalSalesAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.sales.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Sales orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.customers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Collections</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Outstanding amount</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Customers by Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productSales.map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty Sold: {product.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{product.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
              {productSales.length === 0 && (
                <p className="text-sm text-muted-foreground">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
