import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Package, AlertCircle, ShoppingCart } from "lucide-react";
import { calculateReorderPoint, getReorderSuggestions } from "@/lib/reorderCalculations";

export default function ReorderTab() {
  const { data } = useAppData();
  
  const suggestions = getReorderSuggestions(data.stock);
  const totalReorderValue = suggestions.reduce((sum, s) => {
    const item = data.stock.find((i: any) => i.id === s.itemId);
    return sum + (item ? s.reorderQuantity * item.purchasePrice : 0);
  }, 0);

  const getCategoryName = (categoryId: string) => {
    return data.categories.find((cat: any) => cat.id === categoryId)?.name || "Unknown";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Items Need Reorder</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{suggestions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reorder Value</CardTitle>
            <ShoppingCart className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalReorderValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <TrendingUp className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {suggestions.filter(s => s.urgency === 'critical').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Smart Reorder Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>All items are well stocked!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Reorder Point</TableHead>
                  <TableHead>Suggested Order Qty</TableHead>
                  <TableHead>Est. Cost</TableHead>
                  <TableHead>Days Until Critical</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((suggestion) => {
                  const item = data.stock.find((i: any) => i.id === suggestion.itemId);
                  if (!item) return null;
                  
                  const totalCost = suggestion.reorderQuantity * item.purchasePrice;
                  
                  return (
                    <TableRow key={suggestion.itemId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{getCategoryName(item.category)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.quantity === 0 ? 'destructive' : 'outline'}>
                          {item.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>{suggestion.reorderPoint}</TableCell>
                      <TableCell className="font-semibold">{suggestion.reorderQuantity}</TableCell>
                      <TableCell>₹{totalCost.toLocaleString()}</TableCell>
                      <TableCell>
                        {suggestion.daysUntilReorder <= 0 ? (
                          <Badge variant="destructive">Now</Badge>
                        ) : (
                          <span>{suggestion.daysUntilReorder} days</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getUrgencyColor(suggestion.urgency) as any}>
                          {suggestion.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="default">
                          Create PO
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reorder Calculation Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Reorder Point Formula:</strong> (Average Daily Sales × Lead Time Days) + Safety Stock</p>
          <p><strong>Safety Stock:</strong> 7 days worth of average sales</p>
          <p><strong>Reorder Quantity:</strong> Covers lead time + 2 weeks buffer (minimum: min quantity)</p>
          <p><strong>Urgency Levels:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Critical:</strong> Out of stock</li>
            <li><strong>High:</strong> Below safety stock level</li>
            <li><strong>Medium:</strong> Below reorder point</li>
            <li><strong>Low:</strong> Above reorder point</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
