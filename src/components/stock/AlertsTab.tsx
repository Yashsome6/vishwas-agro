import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, PackageX } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function AlertsTab() {
  const { data } = useAppData();

  const today = new Date();
  
  const lowStockItems = data.stock.filter((item: any) => item.quantity <= item.minQuantity && item.quantity > 0);
  const outOfStockItems = data.stock.filter((item: any) => item.quantity === 0);
  
  const expiringItems = data.stock.filter((item: any) => {
    const expiryDate = new Date(item.expiry);
    const daysUntilExpiry = differenceInDays(expiryDate, today);
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  });
  
  const expiredItems = data.stock.filter((item: any) => {
    const expiryDate = new Date(item.expiry);
    return expiryDate < today;
  });

  const getCategoryName = (categoryId: string) => {
    return data.categories.find((cat: any) => cat.id === categoryId)?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lowStockItems.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <PackageX className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{outOfStockItems.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon (30 days)</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{expiringItems.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expired Items</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{expiredItems.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No low stock items</p>
              ) : (
                lowStockItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{getCategoryName(item.category)} • {item.batch}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">{item.quantity} left</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Min: {item.minQuantity}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageX className="h-5 w-5 text-destructive" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outOfStockItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No out of stock items</p>
              ) : (
                outOfStockItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{getCategoryName(item.category)} • {item.batch}</p>
                    </div>
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Expiring Soon (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items expiring soon</p>
              ) : (
                expiringItems.map((item: any) => {
                  const daysLeft = differenceInDays(new Date(item.expiry), today);
                  return (
                    <div key={item.id} className="flex items-center justify-between border-b border-border pb-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{getCategoryName(item.category)} • {item.batch}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={daysLeft <= 15 ? "destructive" : "default"}>
                          {daysLeft} days
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{format(new Date(item.expiry), "dd/MM/yyyy")}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Expired Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiredItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No expired items</p>
              ) : (
                expiredItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{getCategoryName(item.category)} • {item.batch}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Expired</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(item.expiry), "dd/MM/yyyy")}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
