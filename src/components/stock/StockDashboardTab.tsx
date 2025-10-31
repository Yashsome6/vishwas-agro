import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "./MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  TrendingDown, 
  AlertCircle, 
  DollarSign, 
  Plus,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function StockDashboardTab() {
  const { data } = useAppData();
  const stock = data.stock || [];
  const categories = data.categories || [];

  // Calculate metrics
  const totalItems = stock.length;
  const totalValue = stock.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
  const lowStockItems = stock.filter(item => item.quantity > 0 && item.quantity <= item.minQuantity).length;
  const outOfStockItems = stock.filter(item => item.quantity === 0).length;

  const now = new Date();
  const expiringItems = stock.filter(item => {
    if (!item.expiry) return false;
    const expiryDate = new Date(item.expiry);
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  }).length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Stock Dashboard</h2>
          <p className="text-muted-foreground mt-1">Real-time overview of your inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Items"
          value={totalItems}
          subtitle={`${categories.length} categories`}
          icon={Package}
          variant="default"
        />

        <MetricCard
          title="Total Value"
          value={`₹${totalValue.toLocaleString()}`}
          subtitle="Selling price valuation"
          icon={DollarSign}
          variant="success"
          trend={{ value: "12%", isPositive: true }}
        />

        <MetricCard
          title="Low Stock"
          value={lowStockItems}
          subtitle={`${outOfStockItems} out of stock`}
          icon={TrendingDown}
          variant="warning"
        />

        <MetricCard
          title="Expiring Soon"
          value={expiringItems}
          subtitle="Within 30 days"
          icon={AlertCircle}
          variant="destructive"
        />
      </div>

      {/* Category Distribution & Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Distribution */}
        <Card className="hover-lift shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Category Distribution</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.slice(0, 6).map((category) => {
                const categoryItems = stock.filter(item => item.category === category.id);
                const categoryValue = categoryItems.reduce((sum, item) => 
                  sum + (item.quantity * item.sellingPrice), 0
                );
                const percentage = totalValue > 0 ? ((categoryValue / totalValue) * 100).toFixed(1) : 0;
                
                return (
                  <div key={category.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-2xl group-hover:scale-110 transition-transform">
                          {category.image}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{categoryItems.length} items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground">₹{categoryValue.toLocaleString()}</div>
                        <Badge variant="secondary" className="text-xs mt-1">{percentage}%</Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-primary transition-all duration-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">No categories yet</p>
                  <Button variant="link" size="sm" className="mt-2">
                    Add Category
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="hover-lift shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stock
                .filter(item => item.quantity === 0 || item.quantity <= item.minQuantity)
                .slice(0, 6)
                .map((item) => {
                  const isOutOfStock = item.quantity === 0;
                  return (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
                    >
                      <div className={`
                        flex h-10 w-10 items-center justify-center rounded-lg shrink-0
                        ${isOutOfStock ? 'bg-destructive/10' : 'bg-warning/10'}
                      `}>
                        {isOutOfStock ? (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-warning" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isOutOfStock ? (
                            <span className="text-destructive font-medium">Out of stock</span>
                          ) : (
                            <>Only <span className="font-medium text-warning">{item.quantity}</span> left</>
                          )}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              {stock.filter(item => item.quantity === 0 || item.quantity <= item.minQuantity).length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-success mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium text-success">All good!</p>
                  <p className="text-xs text-muted-foreground mt-1">No alerts at the moment</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
