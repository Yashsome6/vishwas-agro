import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Package, DollarSign, AlertCircle, ShoppingCart } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data } = useAppData();

  const totalSales = data.sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalPurchases = data.purchases.reduce((sum, purchase) => sum + purchase.total, 0);
  const totalStockValue = data.stock.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
  const lowStockCount = data.stock.filter(item => item.quantity <= item.minQuantity).length;
  const outstandingPayments = data.vendors.reduce((sum, vendor) => sum + vendor.outstanding, 0);
  const outstandingReceivables = data.customers.reduce((sum, customer) => sum + customer.outstanding, 0);

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(2024, 4 + i, 1);
    const monthSales = data.sales.filter(s => new Date(s.date).getMonth() === month.getMonth()).reduce((sum, s) => sum + s.total, 0);
    const monthPurchases = data.purchases.filter(p => new Date(p.date).getMonth() === month.getMonth()).reduce((sum, p) => sum + p.total, 0);
    return {
      month: month.toLocaleDateString('en-US', { month: 'short' }),
      sales: Math.round(monthSales / 1000),
      purchases: Math.round(monthPurchases / 1000),
      profit: Math.round((monthSales - monthPurchases) / 1000),
    };
  });

  const categoryData = data.categories.map(cat => ({
    name: cat.name,
    value: cat.value,
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--chart-4))'];

  const stats = [
    { title: "Total Sales", value: `₹${(totalSales / 1000).toFixed(0)}K`, icon: TrendingUp, trend: "+12.5%", color: "text-primary" },
    { title: "Total Purchases", value: `₹${(totalPurchases / 1000).toFixed(0)}K`, icon: ShoppingCart, trend: "+8.2%", color: "text-secondary" },
    { title: "Stock Value", value: `₹${(totalStockValue / 1000).toFixed(0)}K`, icon: Package, trend: "+5.1%", color: "text-accent" },
    { title: "Revenue", value: `₹${((totalSales - totalPurchases) / 1000).toFixed(0)}K`, icon: DollarSign, trend: "+15.3%", color: "text-primary" },
    { title: "Outstanding Payments", value: `₹${(outstandingPayments / 1000).toFixed(0)}K`, icon: AlertCircle, trend: "-3.2%", color: "text-destructive" },
    { title: "Low Stock Items", value: lowStockCount, icon: Package, trend: `${lowStockCount} items`, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales vs Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="sales" fill="hsl(var(--primary))" />
                <Bar dataKey="purchases" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Value by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.sales.slice(-5).reverse().map((sale) => (
                <div key={sale.id} className="flex items-center justify-between border-b border-border pb-2">
                  <div>
                    <p className="font-medium">{sale.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{sale.total.toFixed(0)}</p>
                    <p className={`text-xs ${sale.status === 'paid' ? 'text-accent' : 'text-destructive'}`}>
                      {sale.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
