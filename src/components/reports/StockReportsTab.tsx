import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, TrendingDown, AlertTriangle, Download } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";

export default function StockReportsTab() {
  const { data } = useAppData();

  const totalStockValue = data.stock.reduce((sum: number, item: any) => 
    sum + (item.quantity * item.purchasePrice), 0
  );

  const lowStockItems = data.stock.filter((item: any) => item.quantity <= item.minQuantity);
  
  const expiringSoon = data.stock.filter((item: any) => {
    const expiryDate = new Date(item.expiry);
    const today = new Date();
    const daysToExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 30 && daysToExpiry >= 0;
  });

  const categoryWiseStock = data.categories.map((cat: any) => {
    const items = data.stock.filter((item: any) => item.category === cat.id);
    const value = items.reduce((sum: number, item: any) => sum + (item.quantity * item.purchasePrice), 0);
    const quantity = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    return {
      ...cat,
      stockValue: value,
      totalQuantity: quantity,
      itemCount: items.length,
    };
  });

  const downloadReport = () => {
    const reportData = categoryWiseStock.map((cat: any) => ({
      Category: cat.name,
      Items: cat.itemCount,
      TotalQuantity: cat.totalQuantity,
      StockValue: cat.stockValue,
    }));
    exportToCSV(reportData, "stock-report");
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalStockValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stock.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{expiringSoon.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Category-wise Stock Valuation</CardTitle>
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
                  <TableHead>Category</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Quantity</TableHead>
                  <TableHead className="text-right">Stock Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryWiseStock.map((cat: any) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">
                      <span className="mr-2">{cat.image}</span>
                      {cat.name}
                    </TableCell>
                    <TableCell>{cat.itemCount}</TableCell>
                    <TableCell>{cat.totalQuantity}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{cat.stockValue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell>{data.stock.length}</TableCell>
                  <TableCell>
                    {data.stock.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                  </TableCell>
                  <TableCell className="text-right">₹{totalStockValue.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead className="text-right">Shortage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.slice(0, 10).map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-orange-600">{item.quantity}</TableCell>
                      <TableCell>{item.minQuantity}</TableCell>
                      <TableCell className="text-right text-red-600">
                        {item.minQuantity - item.quantity}
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
            <CardTitle>Expiring Soon (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringSoon.slice(0, 10).map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.batch}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right text-red-600">
                        {new Date(item.expiry).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
