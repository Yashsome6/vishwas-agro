import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function StockAgingTab() {
  const { data } = useAppData();
  const stock = data.stock || [];

  // Calculate aging metrics
  const now = new Date();
  const stockWithAging = stock.map(item => {
    const expiryDate = item.expiry ? new Date(item.expiry) : null;
    const daysUntilExpiry = expiryDate 
      ? Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    let agingCategory: 'fresh' | 'aging' | 'near-expiry' | 'expired' = 'fresh';
    if (daysUntilExpiry === null) {
      agingCategory = 'fresh';
    } else if (daysUntilExpiry < 0) {
      agingCategory = 'expired';
    } else if (daysUntilExpiry <= 7) {
      agingCategory = 'near-expiry';
    } else if (daysUntilExpiry <= 30) {
      agingCategory = 'aging';
    }

    return {
      ...item,
      expiryDate,
      daysUntilExpiry,
      agingCategory,
    };
  }).sort((a, b) => {
    if (a.daysUntilExpiry === null) return 1;
    if (b.daysUntilExpiry === null) return -1;
    return a.daysUntilExpiry - b.daysUntilExpiry;
  });

  const fresh = stockWithAging.filter(i => i.agingCategory === 'fresh').length;
  const aging = stockWithAging.filter(i => i.agingCategory === 'aging').length;
  const nearExpiry = stockWithAging.filter(i => i.agingCategory === 'near-expiry').length;
  const expired = stockWithAging.filter(i => i.agingCategory === 'expired').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Stock Aging Analysis</h2>
        <p className="text-muted-foreground">Monitor product freshness and expiry</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fresh</CardTitle>
            <Clock className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{fresh}</div>
            <p className="text-xs text-muted-foreground">&gt;30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aging</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{aging}</div>
            <p className="text-xs text-muted-foreground">8-30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Near Expiry</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{nearExpiry}</div>
            <p className="text-xs text-muted-foreground">≤7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{expired}</div>
            <p className="text-xs text-muted-foreground">Past expiry</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Items by Expiry</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Days Remaining</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockWithAging.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.batch}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {item.expiryDate 
                      ? item.expiryDate.toLocaleDateString()
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {item.daysUntilExpiry !== null
                      ? item.daysUntilExpiry < 0
                        ? `${Math.abs(item.daysUntilExpiry)} days ago`
                        : `${item.daysUntilExpiry} days`
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.agingCategory === 'fresh'
                          ? 'default'
                          : item.agingCategory === 'aging'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {item.agingCategory}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {stockWithAging.length === 0 && (
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
