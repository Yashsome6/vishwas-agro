import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, PieChart, Download } from "lucide-react";

export default function FinancialReportsTab() {
  const { data } = useAppData();

  const totalRevenue = data.sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
  const totalCOGS = data.purchases.reduce((sum: number, purchase: any) => sum + purchase.total, 0);
  const totalExpenses = data.employees.reduce((sum: number, emp: any) => sum + emp.salary, 0) * 6; // 6 months estimate
  
  const grossProfit = totalRevenue - totalCOGS;
  const netProfit = grossProfit - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const accountsReceivable = data.sales.reduce((sum: number, sale: any) => 
    sum + (sale.total - sale.paid), 0
  );

  const accountsPayable = data.purchases.reduce((sum: number, purchase: any) => 
    sum + (purchase.total - purchase.paid), 0
  );

  const cashInHand = data.sales.reduce((sum: number, sale: any) => sum + sale.paid, 0) -
                     data.purchases.reduce((sum: number, purchase: any) => sum + purchase.paid, 0);

  const stockValue = data.stock.reduce((sum: number, item: any) => 
    sum + (item.quantity * item.purchasePrice), 0
  );

  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(2024, 4 + i, 1);
    const monthStart = month.toISOString().slice(0, 7);
    
    const sales = data.sales.filter((sale: any) => sale.date.startsWith(monthStart));
    const purchases = data.purchases.filter((purchase: any) => purchase.date.startsWith(monthStart));
    
    const revenue = sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
    const cost = purchases.reduce((sum: number, purchase: any) => sum + purchase.total, 0);
    const profit = revenue - cost;

    return {
      month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue,
      cost,
      profit,
    };
  });

  const downloadReport = () => {
    alert("Financial report export functionality");
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{grossProfit.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{netProfit.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profit & Loss Summary</CardTitle>
              <Button onClick={downloadReport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="text-lg font-semibold">₹{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-muted-foreground">Cost of Goods Sold</span>
                <span className="text-lg font-semibold text-red-600">-₹{totalCOGS.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Gross Profit</span>
                <span className="text-lg font-bold text-green-600">₹{grossProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-muted-foreground">Operating Expenses</span>
                <span className="text-lg font-semibold text-red-600">-₹{totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">Net Profit</span>
                <span className="text-2xl font-bold text-blue-600">₹{netProfit.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balance Sheet Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Assets</h4>
                <div className="space-y-2 ml-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cash in Hand</span>
                    <span className="font-medium">₹{cashInHand.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accounts Receivable</span>
                    <span className="font-medium">₹{accountsReceivable.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inventory</span>
                    <span className="font-medium">₹{stockValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>Total Assets</span>
                    <span>₹{(cashInHand + accountsReceivable + stockValue).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Liabilities</h4>
                <div className="space-y-2 ml-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accounts Payable</span>
                    <span className="font-medium">₹{accountsPayable.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>Total Liabilities</span>
                    <span>₹{accountsPayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Financial Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyRevenue.map((month: any) => (
                  <TableRow key={month.month}>
                    <TableCell className="font-medium">{month.month}</TableCell>
                    <TableCell>₹{month.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">₹{month.cost.toLocaleString()}</TableCell>
                    <TableCell className={`text-right font-semibold ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{month.profit.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
