import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Users, TrendingUp, AlertCircle } from "lucide-react";

export default function BalanceReportsTab() {
  const { data } = useAppData();

  // Calculate assets
  const stockValue = data.stock.reduce((sum: number, item: any) => 
    sum + (item.quantity * item.purchasePrice), 0
  );
  
  const accountsReceivable = data.customers.reduce((sum: number, customer: any) => 
    sum + customer.outstanding, 0
  );

  const cashInHand = 150000; // Mock value
  const bankBalance = 450000; // Mock value
  
  const totalCurrentAssets = cashInHand + bankBalance + stockValue + accountsReceivable;

  // Calculate liabilities
  const accountsPayable = data.vendors.reduce((sum: number, vendor: any) => 
    sum + vendor.outstanding, 0
  );

  const pendingSalaries = 45000; // Mock value
  const otherLiabilities = 25000; // Mock value
  
  const totalCurrentLiabilities = accountsPayable + pendingSalaries + otherLiabilities;

  // Calculate equity
  const ownerEquity = 500000; // Mock value
  const retainedEarnings = totalCurrentAssets - totalCurrentLiabilities - ownerEquity;
  const totalEquity = ownerEquity + retainedEarnings;

  // Aging analysis for receivables
  const receivablesAging = [
    { range: "0-30 days", amount: accountsReceivable * 0.6 },
    { range: "31-60 days", amount: accountsReceivable * 0.25 },
    { range: "61-90 days", amount: accountsReceivable * 0.1 },
    { range: "90+ days", amount: accountsReceivable * 0.05 }
  ];

  // Aging analysis for payables
  const payablesAging = [
    { range: "0-30 days", amount: accountsPayable * 0.7 },
    { range: "31-60 days", amount: accountsPayable * 0.2 },
    { range: "61-90 days", amount: accountsPayable * 0.08 },
    { range: "90+ days", amount: accountsPayable * 0.02 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCurrentAssets.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Current assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCurrentLiabilities.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Current liabilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Owner's Equity</CardTitle>
            <Wallet className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEquity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Capital + Retained</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Working Capital</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(totalCurrentAssets - totalCurrentLiabilities).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Assets - Liabilities</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Particulars</TableHead>
                  <TableHead className="text-right font-bold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold text-lg">ASSETS</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow className="bg-accent/5">
                  <TableCell className="font-semibold">Current Assets</TableCell>
                  <TableCell className="text-right font-semibold">₹{totalCurrentAssets.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Cash in Hand</TableCell>
                  <TableCell className="text-right">₹{cashInHand.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Bank Balance</TableCell>
                  <TableCell className="text-right">₹{bankBalance.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Stock/Inventory</TableCell>
                  <TableCell className="text-right">₹{stockValue.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Accounts Receivable</TableCell>
                  <TableCell className="text-right">₹{accountsReceivable.toLocaleString()}</TableCell>
                </TableRow>

                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold text-lg">LIABILITIES</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow className="bg-destructive/5">
                  <TableCell className="font-semibold">Current Liabilities</TableCell>
                  <TableCell className="text-right font-semibold">₹{totalCurrentLiabilities.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Accounts Payable</TableCell>
                  <TableCell className="text-right">₹{accountsPayable.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Salaries Payable</TableCell>
                  <TableCell className="text-right">₹{pendingSalaries.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Other Liabilities</TableCell>
                  <TableCell className="text-right">₹{otherLiabilities.toLocaleString()}</TableCell>
                </TableRow>

                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold text-lg">EQUITY</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Owner's Capital</TableCell>
                  <TableCell className="text-right">₹{ownerEquity.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Retained Earnings</TableCell>
                  <TableCell className="text-right">₹{retainedEarnings.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow className="bg-primary/5">
                  <TableCell className="font-semibold">Total Equity</TableCell>
                  <TableCell className="text-right font-semibold">₹{totalEquity.toLocaleString()}</TableCell>
                </TableRow>

                <TableRow className="bg-primary/10 font-bold text-lg">
                  <TableCell>Total Liabilities + Equity</TableCell>
                  <TableCell className="text-right">
                    ₹{(totalCurrentLiabilities + totalEquity).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accounts Receivable Aging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Age</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivablesAging.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.range}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{item.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">₹{accountsReceivable.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounts Payable Aging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Age</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payablesAging.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.range}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{item.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">₹{accountsPayable.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
