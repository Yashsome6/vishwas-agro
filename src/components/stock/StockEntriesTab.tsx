import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Barcode as BarcodeIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import BarcodeDisplay, { PrintableBarcode } from "@/components/common/BarcodeDisplay";

export default function StockEntriesTab() {
  const { data, updateData } = useAppData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [showBarcode, setShowBarcode] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    minQuantity: "50",
    batch: "",
    purchasePrice: "",
    sellingPrice: "",
    warehouse: "main",
    avgSales: "",
    leadTime: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      const updated = data.stock.map((item: any) =>
        item.id === editingItem.id
          ? { 
              ...item, 
              ...formData, 
              expiry: expiryDate?.toISOString(), 
              quantity: Number(formData.quantity), 
              minQuantity: Number(formData.minQuantity), 
              purchasePrice: Number(formData.purchasePrice), 
              sellingPrice: Number(formData.sellingPrice),
              averageDailySales: Number(formData.avgSales) || 5,
              leadTimeDays: Number(formData.leadTime) || 7
            }
          : item
      );
      updateData("stock", updated);
      toast({ title: "Stock item updated successfully" });
    } else {
      const newItem = {
        id: `stock-${Date.now()}`,
        ...formData,
        expiry: expiryDate?.toISOString() || new Date().toISOString(),
        quantity: Number(formData.quantity),
        minQuantity: Number(formData.minQuantity),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        averageDailySales: Number(formData.avgSales) || 5,
        leadTimeDays: Number(formData.leadTime) || 7
      };
      updateData("stock", [...data.stock, newItem]);
      toast({ title: "Stock item added successfully" });
    }
    
    setIsOpen(false);
    setEditingItem(null);
    setExpiryDate(undefined);
    setFormData({ name: "", category: "", quantity: "", minQuantity: "50", batch: "", purchasePrice: "", sellingPrice: "", warehouse: "main", avgSales: "", leadTime: "" });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      minQuantity: item.minQuantity.toString(),
      batch: item.batch,
      purchasePrice: item.purchasePrice.toString(),
      sellingPrice: item.sellingPrice.toString(),
      warehouse: item.warehouse || "main",
      avgSales: item.averageDailySales?.toString() || "",
      leadTime: item.leadTimeDays?.toString() || ""
    });
    setExpiryDate(new Date(item.expiry));
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    updateData("stock", data.stock.filter((item: any) => item.id !== id));
    toast({ title: "Stock item deleted successfully" });
  };

  const filteredStock = data.stock.filter((item: any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (categoryId: string) => {
    return data.categories.find((cat: any) => cat.id === categoryId)?.name || "Unknown";
  };

  const getStockStatus = (quantity: number, minQuantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity <= minQuantity) return { label: "Low Stock", variant: "destructive" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stock items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setFormData({ name: "", category: "", quantity: "", minQuantity: "50", batch: "", purchasePrice: "", sellingPrice: "", warehouse: "main", avgSales: "", leadTime: "" }); setExpiryDate(undefined); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Stock Item" : "Add New Stock Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="minQuantity">Minimum Quantity</Label>
                  <Input id="minQuantity" type="number" value={formData.minQuantity} onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <Select value={formData.warehouse || "main"} onValueChange={(value) => setFormData({ ...formData, warehouse: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.warehouses?.map((w: any) => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="avgSales">Avg Daily Sales</Label>
                  <Input id="avgSales" type="number" value={formData.avgSales || ""} onChange={(e) => setFormData({ ...formData, avgSales: e.target.value })} placeholder="For reorder calculation" />
                </div>
                <div>
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input id="batch" value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required />
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !expiryDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                  <Input id="purchasePrice" type="number" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                  <Input id="sellingPrice" type="number" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="leadTime">Lead Time (days)</Label>
                  <Input id="leadTime" type="number" value={formData.leadTime} onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })} placeholder="Supplier lead time" />
                </div>
              </div>
              <Button type="submit" className="w-full">{editingItem ? "Update" : "Add"} Stock Item</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Purchase Price</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStock.map((item: any) => {
              const status = getStockStatus(item.quantity, item.minQuantity);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{getCategoryName(item.category)}</TableCell>
                  <TableCell>{item.batch}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{format(new Date(item.expiry), "dd/MM/yyyy")}</TableCell>
                  <TableCell>₹{item.purchasePrice}</TableCell>
                  <TableCell>₹{item.sellingPrice}</TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowBarcode(item)}
                      className="gap-2"
                    >
                      <BarcodeIcon className="h-4 w-4" />
                      Show
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Barcode Dialog */}
      <Dialog open={!!showBarcode} onOpenChange={() => setShowBarcode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Barcode - {showBarcode?.name}</DialogTitle>
          </DialogHeader>
          {showBarcode && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4 p-6 bg-muted/50 rounded-lg">
                <BarcodeDisplay value={showBarcode.id} />
                <div className="text-center space-y-1">
                  <p className="font-semibold text-lg">{showBarcode.name}</p>
                  <p className="text-sm text-muted-foreground">Batch: {showBarcode.batch}</p>
                  <p className="text-sm text-muted-foreground">SKU: {showBarcode.id}</p>
                  <p className="font-semibold text-lg">₹{showBarcode.sellingPrice}</p>
                </div>
              </div>
              <div className="flex justify-center">
                <PrintableBarcode value={showBarcode.id} itemName={showBarcode.name} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
