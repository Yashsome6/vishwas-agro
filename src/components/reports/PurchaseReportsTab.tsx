import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingDown, Store, ShoppingBag, Download } from "lucide-react";

export default function PurchaseReportsTab() {
  const { data } = useAppData();

  const totalPurchases = data.purchases.reduce((sum: number, purchase: any) => sum + purchase.total, 0);
  const totalPaidToPurchase = data.purchases.reduce((sum: number, purchase: any) => sum + purchase.paid, 0);
  const totalPendingPurchase = totalPurchases - totalPaidToPurchase;

  const vendorWisePurchases = data.vendors.map((vendor: any) => {
    const vendorPurchases = data.purchases.filter((purchase: any) => purchase.vendorId === vendor.id);
    const totalAmount = vendorPurchases.reduce((sum: number, purchase: any) => sum + purchase.total, 0);
    const totalPaid = vendorPurchases.reduce((sum: number, purchase: any) => sum + purchase.paid, 0);
    return {
      ...vendor,
      purchaseCount: vendorPurchases.length,
      totalAmount,
      totalPaid,
      pending: totalAmount - totalPaid,
    };
  }).filter((v: any) => v.purchaseCount > 0)
    .sort((a: any, b: any) => b.totalAmount - a.totalAmount);

  const categoryWisePurchases = data.categories.map((cat: any) => {
    let totalAmount = 0;
    let totalQuantity = 0;

    data.purchases.forEach((purchase: any) => {
      purchase.items.forEach((item: any) => {
        const stockItem = data.stock.find((s: any) => s.id === item.itemId);
        if (stockItem && stockItem.category === cat.id) {
          totalAmount += item.quantity * item.rate;
          totalQuantity += item.quantity;
        }
      });
    });

    return {
      ...cat,
      purchaseAmount: totalAmount,
      quantity: totalQuantity,
    };
  }).filter((c: any) => c.purchaseAmount > 0)
    .sort((a: any, b: any) => b.purchaseAmount - a.purchaseAmount);

  const downloadReport = () => {
    alert("Purchase report export functionality");
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPurchases.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalPaidToPurchase.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{totalPendingPurchase.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.purchases.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vendor-wise Purchase Report</CardTitle>
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
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Total Vouchers</TableHead>
                  <TableHead>Total Purchases</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorWisePurchases.slice(0, 15).map((vendor: any) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.purchaseCount}</TableCell>
                    <TableCell>₹{vendor.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">₹{vendor.totalPaid.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-orange-600">
                      ₹{vendor.pending.toLocaleString()}
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
          <CardTitle>Category-wise Purchase Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity Purchased</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryWisePurchases.map((category: any) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <span className="mr-2">{category.image}</span>
                      {category.name}
                    </TableCell>
                    <TableCell>{category.quantity}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{category.purchaseAmount.toLocaleString()}
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
