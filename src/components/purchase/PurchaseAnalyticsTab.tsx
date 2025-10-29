import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, ShoppingCart, Users, AlertCircle } from "lucide-react";

export default function PurchaseAnalyticsTab() {
  const { data } = useAppData();

  const totalPurchaseAmount = (data.purchases || []).reduce((sum: number, p: any) => sum + (p.total || 0), 0);
  const pendingPayments = (data.purchases || [])
    .filter((p: any) => p.paymentStatus === "pending" || p.paymentStatus === "partial")
    .reduce((sum: number, p: any) => sum + (p.total || 0), 0);

  // Monthly purchase data
  const monthlyPurchases = (data.purchases || []).reduce((acc: any, purchase: any) => {
    const month = new Date(purchase.date).toLocaleString("default", { month: "short" });
    const existing = acc.find((item: any) => item.month === month);
    if (existing) {
      existing.amount += purchase.total;
    } else {
      acc.push({ month, amount: purchase.total });
    }
    return acc;
  }, []);

  // Vendor-wise purchase data
  const vendorPurchases = (data.vendors || []).map((vendor: any) => {
    const purchases = (data.purchases || []).filter((p: any) => p.vendorId === vendor.id);
    const total = purchases.reduce((sum: number, p: any) => sum + (p.total || 0), 0);
    return { name: vendor.name, value: total };
  }).filter((v: any) => v.value > 0).slice(0, 5);

  // Payment status distribution
  const paymentStatusData = [
    { name: "Paid", value: (data.purchases || []).filter((p: any) => p.paymentStatus === "paid").length },
    { name: "Partial", value: (data.purchases || []).filter((p: any) => p.paymentStatus === "partial").length },
    { name: "Pending", value: (data.purchases || []).filter((p: any) => p.paymentStatus === "pending").length }
  ];

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalPurchaseAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.purchases.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Purchase orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.vendors.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
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
            <CardTitle>Monthly Purchase Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPurchases}>
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
            <CardTitle>Top 5 Vendors by Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendorPurchases}>
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
            <CardTitle>Recent Outstanding Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(data.vendors || [])
                .filter((v: any) => v.outstanding > 0)
                .slice(0, 5)
                .map((vendor: any) => (
                  <div key={vendor.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground">{vendor.contact}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-destructive">₹{vendor.outstanding.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{vendor.paymentTerms} days term</p>
                    </div>
                  </div>
                ))}
              {(data.vendors || []).filter((v: any) => v.outstanding > 0).length === 0 && (
                <p className="text-sm text-muted-foreground">No outstanding payments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
