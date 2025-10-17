import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Warehouse, Package, TrendingUp, ArrowRightLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function WarehouseTab() {
  const { data, updateData } = useAppData();
  const { toast } = useToast();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [transferDialog, setTransferDialog] = useState(false);
  const [transferData, setTransferData] = useState({
    itemId: "",
    fromWarehouse: "",
    toWarehouse: "",
    quantity: ""
  });

  const getWarehouseStock = (warehouseId: string) => {
    return data.stock.filter((item: any) => item.warehouse === warehouseId);
  };

  const getWarehouseValue = (warehouseId: string) => {
    return getWarehouseStock(warehouseId).reduce((sum: number, item: any) => 
      sum + (item.quantity * item.purchasePrice), 0
    );
  };

  const handleTransfer = () => {
    const item = data.stock.find((i: any) => i.id === transferData.itemId);
    if (!item || item.warehouse !== transferData.fromWarehouse) {
      toast({ title: "Error", description: "Invalid transfer", variant: "destructive" });
      return;
    }

    const quantity = Number(transferData.quantity);
    if (quantity > item.quantity) {
      toast({ title: "Error", description: "Insufficient quantity", variant: "destructive" });
      return;
    }

    const updatedStock = data.stock.map((i: any) => {
      if (i.id === transferData.itemId) {
        return { ...i, quantity: i.quantity - quantity };
      }
      return i;
    });

    // Create new entry in destination warehouse
    const newEntry = {
      ...item,
      id: `stock-${Date.now()}`,
      warehouse: transferData.toWarehouse,
      quantity: quantity
    };

    updateData("stock", [...updatedStock, newEntry]);
    toast({ title: "Transfer completed successfully" });
    setTransferDialog(false);
    setTransferData({ itemId: "", fromWarehouse: "", toWarehouse: "", quantity: "" });
  };

  const filteredStock = selectedWarehouse === "all" 
    ? data.stock 
    : getWarehouseStock(selectedWarehouse);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {data.warehouses.map((warehouse: any) => {
          const stock = getWarehouseStock(warehouse.id);
          const value = getWarehouseValue(warehouse.id);
          const utilization = (warehouse.currentStock / warehouse.capacity) * 100;

          return (
            <Card key={warehouse.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{warehouse.name}</CardTitle>
                <Warehouse className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-2xl font-bold">{stock.length} Items</div>
                  <p className="text-xs text-muted-foreground">{warehouse.location}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Utilization</span>
                    <span className="font-semibold">{utilization.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {warehouse.currentStock} / {warehouse.capacity} capacity
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-lg font-bold">₹{value.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Warehouse Stock Details
            </CardTitle>
            <div className="flex gap-2">
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {data.warehouses.map((w: any) => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog open={transferDialog} onOpenChange={setTransferDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Transfer Stock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transfer Stock Between Warehouses</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Item</Label>
                      <Select value={transferData.itemId} onValueChange={(value) => setTransferData({ ...transferData, itemId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.stock.map((item: any) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} (Qty: {item.quantity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>From Warehouse</Label>
                        <Select value={transferData.fromWarehouse} onValueChange={(value) => setTransferData({ ...transferData, fromWarehouse: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="From" />
                          </SelectTrigger>
                          <SelectContent>
                            {data.warehouses.map((w: any) => (
                              <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>To Warehouse</Label>
                        <Select value={transferData.toWarehouse} onValueChange={(value) => setTransferData({ ...transferData, toWarehouse: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="To" />
                          </SelectTrigger>
                          <SelectContent>
                            {data.warehouses.map((w: any) => (
                              <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input 
                        type="number" 
                        value={transferData.quantity}
                        onChange={(e) => setTransferData({ ...transferData, quantity: e.target.value })}
                        placeholder="Enter quantity"
                      />
                    </div>
                    <Button onClick={handleTransfer} className="w-full">Complete Transfer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.map((item: any) => {
                const warehouse = data.warehouses.find((w: any) => w.id === item.warehouse);
                const status = item.quantity <= item.minQuantity ? 'low' : 'good';
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{warehouse?.name || 'Unknown'}</Badge>
                    </TableCell>
                    <TableCell>{item.batch}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{(item.quantity * item.purchasePrice).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={status === 'low' ? 'destructive' : 'default'}>
                        {status === 'low' ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
