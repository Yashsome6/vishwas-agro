import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from "date-fns";

export default function ProfitLossTab() {
  const { data } = useAppData();
  const [period, setPeriod] = useState("month");

  const getDateRange = () => {
    const now = new Date();
    switch (period) {
      case "month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "quarter":
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
        return { start: quarterStart, end: quarterEnd };
      case "year":
        return { start: startOfYear(now), end: endOfYear(now) };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const { start, end } = getDateRange();

  // Filter sales and purchases within date range
  const filteredSales = data.sales.filter((sale: any) => {
    const saleDate = new Date(sale.date);
    return isWithinInterval(saleDate, { start, end });
  });

  const filteredPurchases = data.purchases.filter((purchase: any) => {
    const purchaseDate = new Date(purchase.date);
    return isWithinInterval(purchaseDate, { start, end });
  });

  // Calculate revenue
  const totalRevenue = filteredSales.reduce((sum: number, sale: any) => sum + sale.total, 0);
  const totalCostOfGoods = filteredPurchases.reduce((sum: number, purchase: any) => sum + purchase.total, 0);

  // Mock expenses (in real app, these would come from expenses data)
  const operatingExpenses = {
    salaries: 50000,
    utilities: 8000,
    rent: 15000,
    marketing: 5000,
    maintenance: 3000,
    other: 2000
  };

  const totalExpenses = Object.values(operatingExpenses).reduce((sum, val) => sum + val, 0);

  // Calculate profit
  const grossProfit = totalRevenue - totalCostOfGoods;
  const netProfit = grossProfit - totalExpenses;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profit & Loss Statement</CardTitle>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">From {filteredSales.length} sales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
                  <TrendingUp className="h-5 w-5 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{grossProfit.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Margin: {grossMargin.toFixed(2)}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  {netProfit >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-accent" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    ₹{netProfit.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Margin: {netMargin.toFixed(2)}%</p>
                </CardContent>
              </Card>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Description</TableHead>
                    <TableHead className="text-right font-bold">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-semibold">Revenue</TableCell>
                    <TableCell className="text-right font-semibold">₹{totalRevenue.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Sales Revenue</TableCell>
                    <TableCell className="text-right">₹{totalRevenue.toLocaleString()}</TableCell>
                  </TableRow>

                  <TableRow className="bg-muted/50">
                    <TableCell className="font-semibold">Cost of Goods Sold</TableCell>
                    <TableCell className="text-right font-semibold text-destructive">
                      (₹{totalCostOfGoods.toLocaleString()})
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Purchase Costs</TableCell>
                    <TableCell className="text-right text-destructive">(₹{totalCostOfGoods.toLocaleString()})</TableCell>
                  </TableRow>

                  <TableRow className="bg-accent/10 font-bold">
                    <TableCell>Gross Profit</TableCell>
                    <TableCell className="text-right text-accent">₹{grossProfit.toLocaleString()}</TableCell>
                  </TableRow>

                  <TableRow className="bg-muted/50">
                    <TableCell className="font-semibold">Operating Expenses</TableCell>
                    <TableCell className="text-right font-semibold text-destructive">
                      (₹{totalExpenses.toLocaleString()})
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Salaries & Wages</TableCell>
                    <TableCell className="text-right text-destructive">(₹{operatingExpenses.salaries.toLocaleString()})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Rent</TableCell>
                    <TableCell className="text-right text-destructive">(₹{operatingExpenses.rent.toLocaleString()})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Utilities</TableCell>
                    <TableCell className="text-right text-destructive">(₹{operatingExpenses.utilities.toLocaleString()})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Marketing</TableCell>
                    <TableCell className="text-right text-destructive">(₹{operatingExpenses.marketing.toLocaleString()})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Maintenance</TableCell>
                    <TableCell className="text-right text-destructive">(₹{operatingExpenses.maintenance.toLocaleString()})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">Other Expenses</TableCell>
                    <TableCell className="text-right text-destructive">(₹{operatingExpenses.other.toLocaleString()})</TableCell>
                  </TableRow>

                  <TableRow className="bg-primary/10 font-bold text-lg">
                    <TableCell>Net Profit</TableCell>
                    <TableCell className={`text-right ${netProfit >= 0 ? 'text-accent' : 'text-destructive'}`}>
                      ₹{netProfit.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
