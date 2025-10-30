import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, Percent } from "lucide-react";

export default function ProfitAnalysisTab() {
  const { data } = useAppData();
  const stock = data.stock || [];

  // Calculate profit metrics
  const stockWithProfit = stock.map(item => {
    const profitPerUnit = item.sellingPrice - item.purchasePrice;
    const profitMargin = item.purchasePrice > 0 
      ? ((profitPerUnit / item.purchasePrice) * 100) 
      : 0;
    const totalProfit = profitPerUnit * item.quantity;
    const totalInvestment = item.purchasePrice * item.quantity;

    return {
      ...item,
      profitPerUnit,
      profitMargin,
      totalProfit,
      totalInvestment,
    };
  }).sort((a, b) => b.totalProfit - a.totalProfit);

  const totalInvestment = stockWithProfit.reduce((sum, item) => sum + item.totalInvestment, 0);
  const totalPotentialProfit = stockWithProfit.reduce((sum, item) => sum + item.totalProfit, 0);
  const avgProfitMargin = stockWithProfit.length > 0
    ? stockWithProfit.reduce((sum, item) => sum + item.profitMargin, 0) / stockWithProfit.length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Profit Analysis</h2>
        <p className="text-muted-foreground">Analyze profit margins and potential returns</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Purchase value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{totalPotentialProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">If all stock sold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
            <Percent className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{avgProfitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average profit margin</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Items by Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Purchase Price</TableHead>
                <TableHead className="text-right">Selling Price</TableHead>
                <TableHead className="text-right">Profit/Unit</TableHead>
                <TableHead className="text-right">Margin %</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Total Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockWithProfit.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">₹{item.purchasePrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{item.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-success">₹{item.profitPerUnit.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={item.profitMargin >= 30 ? 'text-success font-semibold' : ''}>
                      {item.profitMargin.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right font-semibold text-success">
                    ₹{item.totalProfit.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {stockWithProfit.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
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
