import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function PurchaseVouchersTab() {
  const { data, updateData } = useAppData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [formData, setFormData] = useState({
    vendorId: "",
    date: new Date().toISOString().split("T")[0],
    items: [{ stockId: "", quantity: "", rate: "" }],
    paymentStatus: "pending"
  });

  const filteredVouchers = data.purchases.filter((purchase: any) => {
    const vendor = data.vendors.find((v: any) => v.id === purchase.vendorId);
    const matchesSearch = purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateRange.start || !dateRange.end || (
      new Date(purchase.date) >= dateRange.start && new Date(purchase.date) <= dateRange.end
    );
    
    return matchesSearch && matchesDate;
  });

  const handleDateFilter = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
  };

  const calculateVoucherTotal = (items: any[]) => {
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
    
    const { subtotal, cgst, sgst, total } = calculateVoucherTotal(formData.items);
    
    const newPurchase = {
      id: `PUR${String(data.purchases.length + 1).padStart(4, "0")}`,
      vendorId: formData.vendorId,
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

    updateData("purchases", [...data.purchases, newPurchase]);

    // Update stock quantities
    const updatedStock = data.stock.map((stockItem: any) => {
      const purchasedItem = formData.items.find(item => item.stockId === stockItem.id);
      if (purchasedItem) {
        return {
          ...stockItem,
          quantity: stockItem.quantity + parseFloat(purchasedItem.quantity)
        };
      }
      return stockItem;
    });
    updateData("stock", updatedStock);

    toast({ title: "Purchase voucher created successfully" });
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
    setFormData({ ...formData, items: newItems });
  };

  const handleDelete = (id: string) => {
    const updatedPurchases = data.purchases.filter((p: any) => p.id !== id);
    updateData("purchases", updatedPurchases);
    toast({ title: "Purchase voucher deleted" });
  };

  const resetForm = () => {
    setFormData({
      vendorId: "",
      date: new Date().toISOString().split("T")[0],
      items: [{ stockId: "", quantity: "", rate: "" }],
      paymentStatus: "pending"
    });
    setIsDialogOpen(false);
  };

  const getVendorName = (vendorId: string) => {
    return data.vendors.find((v: any) => v.id === vendorId)?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Purchase Vouchers</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" /> New Purchase
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Purchase Voucher</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vendor *</Label>
                      <Select required value={formData.vendorId} onValueChange={(value) => setFormData({ ...formData, vendorId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.vendors.map((vendor: any) => (
                            <SelectItem key={vendor.id} value={vendor.id}>
                              {vendor.name}
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
                              {data.stock.map((stockItem: any) => (
                                <SelectItem key={stockItem.id} value={stockItem.id}>
                                  {stockItem.name} - {stockItem.batch}
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
                      const { subtotal, cgst, sgst, total } = calculateVoucherTotal(formData.items);
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
                    <Button type="submit">Create Voucher</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vouchers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DateRangeFilter onFilterChange={handleDateFilter} />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voucher ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.map((purchase: any) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.id}</TableCell>
                    <TableCell>{format(new Date(purchase.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{getVendorName(purchase.vendorId)}</TableCell>
                    <TableCell>{purchase.items.length} items</TableCell>
                    <TableCell className="font-semibold">₹{purchase.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        purchase.paymentStatus === "paid" ? "default" :
                        purchase.paymentStatus === "partial" ? "secondary" : "destructive"
                      }>
                        {purchase.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(purchase.id)}>
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
