import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StockVelocityTab() {
  const { data } = useAppData();
  const stock = data.stock || [];

  // Calculate velocity metrics
  const stockWithVelocity = stock.map(item => {
    const avgDailySales = item.averageDailySales || 0;
    const turnoverDays = item.quantity > 0 && avgDailySales > 0 
      ? Math.round(item.quantity / avgDailySales) 
      : 0;
    
    const velocity = avgDailySales > 0
      ? avgDailySales * 30 // Monthly velocity
      : 0;

    return {
      ...item,
      velocity,
      turnoverDays,
      velocityCategory: velocity >= 100 ? 'fast' : velocity >= 50 ? 'medium' : 'slow',
    };
  }).sort((a, b) => b.velocity - a.velocity);

  const fastMoving = stockWithVelocity.filter(i => i.velocityCategory === 'fast').length;
  const mediumMoving = stockWithVelocity.filter(i => i.velocityCategory === 'medium').length;
  const slowMoving = stockWithVelocity.filter(i => i.velocityCategory === 'slow').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Stock Velocity Analysis</h2>
        <p className="text-muted-foreground">Track how fast items are moving</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fast Moving</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{fastMoving}</div>
            <p className="text-xs text-muted-foreground">≥100 units/month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Moving</CardTitle>
            <Minus className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{mediumMoving}</div>
            <p className="text-xs text-muted-foreground">50-99 units/month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slow Moving</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{slowMoving}</div>
            <p className="text-xs text-muted-foreground">&lt;50 units/month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Items by Velocity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Avg Daily Sales</TableHead>
                <TableHead>Monthly Velocity</TableHead>
                <TableHead>Turnover Days</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockWithVelocity.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.averageDailySales || 0}</TableCell>
                  <TableCell>{Math.round(item.velocity)}</TableCell>
                  <TableCell>{item.turnoverDays || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.velocityCategory === 'fast'
                          ? 'default'
                          : item.velocityCategory === 'medium'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {item.velocityCategory}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {stockWithVelocity.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No stock items available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
