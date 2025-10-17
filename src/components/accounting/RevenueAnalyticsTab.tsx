import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, DollarSign, Percent, Target } from "lucide-react";

export default function RevenueAnalyticsTab() {
  const { data } = useAppData();

  // Calculate total metrics
  const totalRevenue = data.sales.reduce((sum: number, s: any) => sum + s.total, 0);
  const totalCost = data.purchases.reduce((sum: number, p: any) => sum + p.total, 0);
  const grossProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Monthly revenue and profit trend
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyData = months.map((month, index) => {
    const monthSales = data.sales.filter((s: any) => {
      const saleMonth = new Date(s.date).getMonth();
      return saleMonth === index + 6; // Mock data for last 6 months
    });
    
    const monthPurchases = data.purchases.filter((p: any) => {
      const purchaseMonth = new Date(p.date).getMonth();
      return purchaseMonth === index + 6;
    });

    const revenue = monthSales.reduce((sum: number, s: any) => sum + s.total, 0);
    const cost = monthPurchases.reduce((sum: number, p: any) => sum + p.total, 0);
    const profit = revenue - cost;

    return { month, revenue, cost, profit };
  });

  // Revenue by category
  const categoryRevenue = data.categories.map((category: any) => {
    const categoryStock = data.stock.filter((s: any) => s.category === category.id);
    const revenue = categoryStock.reduce((sum: number, stock: any) => {
      const stockSales = data.sales.reduce((saleSum: number, sale: any) => {
        const saleItem = sale.items.find((item: any) => item.stockId === stock.id);
        return saleSum + (saleItem ? saleItem.quantity * saleItem.rate : 0);
      }, 0);
      return sum + stockSales;
    }, 0);
    return { name: category.name, value: revenue };
  }).filter((c: any) => c.value > 0);

  // Daily revenue trend (last 30 days)
  const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
    const day = 30 - i;
    const dayRevenue = Math.random() * 50000 + 20000; // Mock data
    return { day: `Day ${day}`, revenue: dayRevenue };
  });

  // Profit margin trend
  const profitMarginData = months.map((month, index) => {
    const revenue = monthlyData[index].revenue;
    const cost = monthlyData[index].cost;
    const margin = revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0;
    return { month, margin };
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-accent mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <Target className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{grossProfit.toLocaleString()}</div>
            <p className="text-xs text-accent mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Percent className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Gross margin ratio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{data.sales.length > 0 ? (totalRevenue / data.sales.length).toFixed(0) : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per invoice</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Revenue" />
                <Area type="monotone" dataKey="profit" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} name="Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Cost Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                <Bar dataKey="cost" fill="hsl(var(--destructive))" name="Cost" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={false} />
                <YAxis />
                <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit Margin Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitMarginData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${value.toFixed(2)}%`} />
                <Line type="monotone" dataKey="margin" stroke="hsl(var(--accent))" strokeWidth={2} name="Margin %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categoryRevenue.map((cat: any, index: number) => {
              const percentage = totalRevenue > 0 ? (cat.value / totalRevenue) * 100 : 0;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">₹{cat.value.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
