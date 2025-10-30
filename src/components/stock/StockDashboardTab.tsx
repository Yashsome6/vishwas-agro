import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingDown, AlertCircle, DollarSign } from "lucide-react";

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Stock Dashboard</h2>
        <p className="text-muted-foreground">Overview of your inventory</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">{categories.length} categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Selling price valuation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">{outOfStockItems} out of stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{expiringItems}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.slice(0, 5).map((category) => {
                const categoryItems = stock.filter(item => item.category === category.id);
                const categoryValue = categoryItems.reduce((sum, item) => 
                  sum + (item.quantity * item.sellingPrice), 0
                );
                
                return (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.image}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">₹{categoryValue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{categoryItems.length} items</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stock
                .filter(item => item.quantity === 0 || item.quantity <= item.minQuantity)
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <AlertCircle className={`h-4 w-4 ${item.quantity === 0 ? 'text-destructive' : 'text-warning'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity === 0 ? 'Out of stock' : `Only ${item.quantity} left`}
                      </p>
                    </div>
                  </div>
                ))}
              {stock.filter(item => item.quantity === 0 || item.quantity <= item.minQuantity).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
