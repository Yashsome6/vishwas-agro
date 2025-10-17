import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Trash2, Search, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function SalesInvoicesTab() {
  const { data, updateData } = useAppData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    date: new Date().toISOString().split("T")[0],
    items: [{ stockId: "", quantity: "", rate: "" }],
    paymentStatus: "pending"
  });

  const filteredInvoices = data.sales.filter((sale: any) => {
    const customer = data.customers.find((c: any) => c.id === sale.customerId);
    return (
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const calculateInvoiceTotal = (items: any[]) => {
    const subtotal = items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      return sum + (qty * rate);
    }, 0);
    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    return { subtotal, cgst, sgst, total: subtotal + cgst + sgst };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { subtotal, cgst, sgst, total } = calculateInvoiceTotal(formData.items);
    
    const newSale = {
      id: `INV${String(data.sales.length + 1).padStart(4, "0")}`,
      customerId: formData.customerId,
      date: formData.date,
      items: formData.items.map(item => ({
        stockId: item.stockId,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate)
      })),
      subtotal,
      cgst,
      sgst,
      total,
      paymentStatus: formData.paymentStatus
    };

    updateData("sales", [...data.sales, newSale]);

    // Update stock quantities
    const updatedStock = data.stock.map((stockItem: any) => {
      const soldItem = formData.items.find(item => item.stockId === stockItem.id);
      if (soldItem) {
        return {
          ...stockItem,
          quantity: stockItem.quantity - parseFloat(soldItem.quantity)
        };
      }
      return stockItem;
    });
    updateData("stock", updatedStock);

    toast({ title: "Sales invoice created successfully" });
    resetForm();
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { stockId: "", quantity: "", rate: "" }]
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill rate from stock selling price
    if (field === "stockId" && value) {
      const stockItem = data.stock.find((s: any) => s.id === value);
      if (stockItem) {
        newItems[index].rate = stockItem.sellingPrice.toString();
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const handleDelete = (id: string) => {
    const updatedSales = data.sales.filter((s: any) => s.id !== id);
    updateData("sales", updatedSales);
    toast({ title: "Sales invoice deleted" });
  };

  const resetForm = () => {
    setFormData({
      customerId: "",
      date: new Date().toISOString().split("T")[0],
      items: [{ stockId: "", quantity: "", rate: "" }],
      paymentStatus: "pending"
    });
    setIsDialogOpen(false);
  };

  const getCustomerName = (customerId: string) => {
    return data.customers.find((c: any) => c.id === customerId)?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Invoices</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" /> New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Sales Invoice</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Customer *</Label>
                      <Select required value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.customers.map((customer: any) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date *</Label>
                      <Input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Items</Label>
                      <Button type="button" size="sm" onClick={handleAddItem}>
                        <Plus className="h-4 w-4 mr-2" /> Add Item
                      </Button>
                    </div>
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                          <Label className="text-xs">Stock Item</Label>
                          <Select value={item.stockId} onValueChange={(value) => handleItemChange(index, "stockId", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {data.stock.filter((s: any) => s.quantity > 0).map((stockItem: any) => (
                                <SelectItem key={stockItem.id} value={stockItem.id}>
                                  {stockItem.name} - ₹{stockItem.sellingPrice} (Qty: {stockItem.quantity})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-3">
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-3">
                          <Label className="text-xs">Rate</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="col-span-1">
                          {formData.items.length > 1 && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    {(() => {
                      const { subtotal, cgst, sgst, total } = calculateInvoiceTotal(formData.items);
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>CGST (9%):</span>
                            <span>₹{cgst.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>SGST (9%):</span>
                            <span>₹{sgst.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>₹{total.toFixed(2)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div>
                    <Label>Payment Status</Label>
                    <Select value={formData.paymentStatus} onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Invoice</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((sale: any) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{format(new Date(sale.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{getCustomerName(sale.customerId)}</TableCell>
                    <TableCell>{sale.items.length} items</TableCell>
                    <TableCell className="font-semibold">₹{sale.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        sale.paymentStatus === "paid" ? "default" :
                        sale.paymentStatus === "partial" ? "secondary" : "destructive"
                      }>
                        {sale.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(sale.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
