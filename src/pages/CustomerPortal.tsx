import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, FileText, User, Download, CreditCard } from "lucide-react";
import { format } from "date-fns";
import StripePaymentForm from "@/components/payments/StripePaymentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CustomerPortal() {
  const { data } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentDialog, setPaymentDialog] = useState<any>(null);

  // Simulated customer login - in real app this would be authenticated
  const currentCustomer = data.customers[0];
  
  const customerOrders = data.sales.filter((sale: any) => sale.customerId === currentCustomer.id);
  const pendingInvoices = customerOrders.filter((order: any) => order.status === "pending");
  const paidInvoices = customerOrders.filter((order: any) => order.status === "paid");

  const totalOutstanding = pendingInvoices.reduce((sum: number, inv: any) => sum + (inv.total - inv.paid), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Customer Portal</h1>
              <p className="text-muted-foreground">Welcome, {currentCustomer.name}</p>
            </div>
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              My Account
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customerOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
              <CreditCard className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{totalOutstanding.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Credit Available</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ₹{(currentCustomer.creditLimit - currentCustomer.outstanding).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">My Invoices</TabsTrigger>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
            <TabsTrigger value="products">Browse Products</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerOrders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{format(new Date(order.date), "dd MMM yyyy")}</TableCell>
                        <TableCell>₹{order.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === "paid" ? "default" : "destructive"}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            {order.status === "pending" && (
                              <Button size="sm" onClick={() => setPaymentDialog(order)}>
                                Pay Now
                              </Button>
                            )}
                          </div>
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
                <CardTitle>Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingInvoices.map((invoice: any) => {
                      const balance = invoice.total - invoice.paid;
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{format(new Date(invoice.date), "dd MMM yyyy")}</TableCell>
                          <TableCell>₹{invoice.total.toLocaleString()}</TableCell>
                          <TableCell>₹{invoice.paid.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold text-destructive">
                            ₹{balance.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => setPaymentDialog(invoice)}>
                              <CreditCard className="h-4 w-4 mr-1" />
                              Pay
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Available Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input 
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {data.stock
                    .filter((item: any) => item.quantity > 0)
                    .filter((item: any) => 
                      searchTerm === "" || 
                      item.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .slice(0, 12)
                    .map((item: any) => (
                      <Card key={item.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold">₹{item.sellingPrice}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Stock:</span>
                            <Badge variant="outline">{item.quantity} available</Badge>
                          </div>
                          <Button className="w-full mt-2" size="sm">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Request Quote
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Dialog */}
      <Dialog open={!!paymentDialog} onOpenChange={() => setPaymentDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Make Payment - {paymentDialog?.id}</DialogTitle>
          </DialogHeader>
          {paymentDialog && (
            <StripePaymentForm 
              amount={paymentDialog.total - paymentDialog.paid}
              invoiceId={paymentDialog.id}
              onSuccess={() => setPaymentDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
