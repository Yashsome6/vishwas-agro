import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, ShoppingCart, Download } from "lucide-react";

export default function SalesReportsTab() {
  const { data } = useAppData();

  const totalSales = data.sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
  const totalPaid = data.sales.reduce((sum: number, sale: any) => sum + sale.paid, 0);
  const totalPending = totalSales - totalPaid;

  const customerWiseSales = data.customers.map((customer: any) => {
    const customerSales = data.sales.filter((sale: any) => sale.customerId === customer.id);
    const totalAmount = customerSales.reduce((sum: number, sale: any) => sum + sale.total, 0);
    const totalPaidAmount = customerSales.reduce((sum: number, sale: any) => sum + sale.paid, 0);
    return {
      ...customer,
      salesCount: customerSales.length,
      totalAmount,
      totalPaid: totalPaidAmount,
      pending: totalAmount - totalPaidAmount,
    };
  }).filter((c: any) => c.salesCount > 0)
    .sort((a: any, b: any) => b.totalAmount - a.totalAmount);

  const productWiseSales = data.stock.map((item: any) => {
    let totalQuantity = 0;
    let totalRevenue = 0;

    data.sales.forEach((sale: any) => {
      sale.items.forEach((saleItem: any) => {
        if (saleItem.itemId === item.id) {
          totalQuantity += saleItem.quantity;
          totalRevenue += saleItem.quantity * saleItem.rate;
        }
      });
    });

    return {
      ...item,
      soldQuantity: totalQuantity,
      revenue: totalRevenue,
    };
  }).filter((item: any) => item.soldQuantity > 0)
    .sort((a: any, b: any) => b.revenue - a.revenue);

  const downloadReport = () => {
    alert("Sales report export functionality");
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSales.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{totalPending.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.sales.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer-wise Sales Report</CardTitle>
            <Button onClick={downloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Total Invoices</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerWiseSales.slice(0, 15).map((customer: any) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.salesCount}</TableCell>
                    <TableCell>₹{customer.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">₹{customer.totalPaid.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-orange-600">
                      ₹{customer.pending.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product-wise Sales Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity Sold</TableHead>
                  <TableHead>Avg. Selling Price</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productWiseSales.slice(0, 15).map((product: any) => {
                  const category = data.categories.find((cat: any) => cat.id === product.category);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{category?.name || "-"}</TableCell>
                      <TableCell>{product.soldQuantity}</TableCell>
                      <TableCell>
                        ₹{Math.round(product.revenue / product.soldQuantity).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{product.revenue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
