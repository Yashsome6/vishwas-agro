import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/contexts/AppContext";
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart, Wrench, AlertCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";

export default function Analytics() {
  const { data } = useAppData();

  // Calculate KPIs
  const totalRevenue = data.sales.reduce((sum, inv) => sum + inv.total, 0);
  const totalCost = data.purchases.reduce((sum, pv) => sum + pv.total, 0);
  const grossProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const totalStockValue = data.stock.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
  const lowStockItems = data.stock.filter(item => item.quantity < item.minQuantity).length;
  const activeCustomers = data.customers.length;
  const activeVendors = data.vendors.length;

  // Monthly trends
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = startOfMonth(subMonths(new Date(), 5 - i));
    return format(date, "MMM yyyy");
  });

  const monthlyTrends = last6Months.map((month) => {
    const revenue = data.sales
      .filter(inv => format(new Date(inv.date), "MMM yyyy") === month)
      .reduce((sum, inv) => sum + inv.total, 0);
    
    const cost = data.purchases
      .filter(pv => format(new Date(pv.date), "MMM yyyy") === month)
      .reduce((sum, pv) => sum + pv.total, 0);

    return {
      month,
      revenue,
      cost,
      profit: revenue - cost,
    };
  });

  // Category-wise analysis
  const categoryData = data.categories.map(cat => {
    const items = data.stock.filter(item => item.category === cat.id);
    const value = items.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
    return { name: cat.name, value, items: items.length };
  });

  // Top performers
  const topProducts = data.stock
    .map(item => ({
      name: item.name,
      revenue: data.sales
        .flatMap(inv => inv.items)
        .filter(invItem => invItem.itemId === item.id)
        .reduce((sum, invItem) => sum + (invItem.quantity * invItem.rate), 0),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Warehouse distribution
  const warehouseData = data.warehouses.map(wh => ({
    name: wh.name,
    items: data.stock.filter(item => item.warehouse === wh.id).length,
    value: data.stock
      .filter(item => item.warehouse === wh.id)
      .reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0),
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--muted))', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Advanced Analytics</h1>
        <p className="text-muted-foreground">Comprehensive business intelligence and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Gross profit margin: {profitMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalStockValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              {lowStockItems} items below reorder level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {data.customers.length} total customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVendors}</div>
            <p className="text-xs text-muted-foreground">
              {data.vendors.length} total vendors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Trends */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Cost Trends</CardTitle>
            <CardDescription>Last 6 months financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Area type="monotone" dataKey="cost" stackId="2" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit Margins</CardTitle>
            <CardDescription>Monthly profitability analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category & Product Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category-wise Stock Value</CardTitle>
            <CardDescription>Distribution of inventory across categories</CardDescription>
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
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
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
            <CardTitle>Top 5 Revenue Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Stock Distribution</CardTitle>
          <CardDescription>Inventory value across different warehouses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={warehouseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="items" fill="hsl(var(--accent))" name="Item Count" />
              <Bar dataKey="value" fill="hsl(var(--primary))" name="Total Value (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
