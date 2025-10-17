import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, FileText, User, Download, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function VendorPortal() {
  const { data } = useAppData();
  
  // Simulated vendor login - in real app this would be authenticated
  const currentVendor = data.vendors[0];
  
  const vendorPurchases = data.purchases.filter((purchase: any) => purchase.vendorId === currentVendor.id);
  const pendingPayments = vendorPurchases.filter((p: any) => p.status === "pending");
  const completedOrders = vendorPurchases.filter((p: any) => p.status === "paid");

  const totalRevenue = completedOrders.reduce((sum: number, p: any) => sum + p.total, 0);
  const pendingAmount = pendingPayments.reduce((sum: number, p: any) => sum + (p.total - p.paid), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Vendor Portal</h1>
              <p className="text-muted-foreground">Welcome, {currentVendor.name}</p>
            </div>
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              My Account
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{vendorPurchases.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <FileText className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{pendingAmount.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <FileText className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{currentVendor.outstanding.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorPurchases.map((purchase: any) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.id}</TableCell>
                        <TableCell>{format(new Date(purchase.date), "dd MMM yyyy")}</TableCell>
                        <TableCell>{purchase.items.length} items</TableCell>
                        <TableCell>₹{purchase.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={purchase.status === "paid" ? "default" : "destructive"}>
                            {purchase.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Balance Due</TableHead>
                      <TableHead>Payment Terms</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((purchase: any) => {
                      const balance = purchase.total - purchase.paid;
                      return (
                        <TableRow key={purchase.id}>
                          <TableCell className="font-medium">{purchase.id}</TableCell>
                          <TableCell>{format(new Date(purchase.date), "dd MMM yyyy")}</TableCell>
                          <TableCell>₹{purchase.total.toLocaleString()}</TableCell>
                          <TableCell>₹{purchase.paid.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold text-destructive">
                            ₹{balance.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{currentVendor.paymentTerms}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Average Order Value</p>
                    <p className="text-2xl font-bold">
                      ₹{vendorPurchases.length > 0 ? Math.round(totalRevenue / vendorPurchases.length).toLocaleString() : 0}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Payment Terms</p>
                    <p className="text-2xl font-bold">{currentVendor.paymentTerms}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Completed Orders</p>
                    <p className="text-2xl font-bold">{completedOrders.length}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">GST Number</p>
                    <p className="text-lg font-mono">{currentVendor.gst}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Address:</strong> {currentVendor.address}</p>
                    <p><strong>Contact:</strong> {currentVendor.contact}</p>
                    <p><strong>GST:</strong> {currentVendor.gst}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
