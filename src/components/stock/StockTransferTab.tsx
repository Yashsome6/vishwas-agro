import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { ArrowLeftRight } from "lucide-react";

export default function StockTransferTab() {
  const { data, updateData } = useAppData();
  const stock = data.stock || [];
  const warehouses = data.warehouses || [];
  
  const [selectedItem, setSelectedItem] = useState("");
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [quantity, setQuantity] = useState("");
  const [transfers, setTransfers] = useState<any[]>([]);

  const handleTransfer = () => {
    if (!selectedItem || !fromWarehouse || !toWarehouse || !quantity) {
      toast.error("Please fill all fields");
      return;
    }

    const transferQty = parseInt(quantity);
    if (transferQty <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    const item = stock.find(s => s.id === selectedItem);
    if (!item || item.warehouse !== fromWarehouse) {
      toast.error("Item not found in source warehouse");
      return;
    }

    if (item.quantity < transferQty) {
      toast.error("Insufficient quantity in source warehouse");
      return;
    }

    // Create transfer record
    const transfer = {
      id: `transfer_${Date.now()}`,
      itemName: item.name,
      from: warehouses.find(w => w.id === fromWarehouse)?.name,
      to: warehouses.find(w => w.id === toWarehouse)?.name,
      quantity: transferQty,
      date: new Date().toISOString(),
    };

    setTransfers([transfer, ...transfers]);

    // For now, just show success (in real app, would update stock)
    toast.success("Transfer recorded successfully");
    
    // Reset form
    setSelectedItem("");
    setFromWarehouse("");
    setToWarehouse("");
    setQuantity("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Inter-Warehouse Transfer</h2>
        <p className="text-muted-foreground">Move stock between warehouse locations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Create Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Select Item</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose item" />
                </SelectTrigger>
                <SelectContent>
                  {stock.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} (Qty: {item.quantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>From Warehouse</Label>
              <Select value={fromWarehouse} onValueChange={setFromWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Source warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>To Warehouse</Label>
              <Select value={toWarehouse} onValueChange={setToWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Destination warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleTransfer} className="mt-4">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Create Transfer
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{new Date(transfer.date).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{transfer.itemName}</TableCell>
                  <TableCell>{transfer.from}</TableCell>
                  <TableCell>{transfer.to}</TableCell>
                  <TableCell className="text-right">{transfer.quantity}</TableCell>
                </TableRow>
              ))}
              {transfers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No transfers yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
