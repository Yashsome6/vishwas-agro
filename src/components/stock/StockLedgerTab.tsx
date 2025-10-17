import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function StockLedgerTab() {
  const { data } = useAppData();
  const [selectedItem, setSelectedItem] = useState<string>("");

  const getCategoryName = (categoryId: string) => {
    return data.categories.find((cat: any) => cat.id === categoryId)?.name || "Unknown";
  };

  const selectedStockItem = data.stock.find((item: any) => item.id === selectedItem);

  // Generate mock movement history for demonstration
  const generateMovementHistory = () => {
    if (!selectedStockItem) return [];
    
    const movements = [];
    let runningBalance = selectedStockItem.quantity;
    
    // Add current stock as opening
    movements.push({
      date: new Date().toISOString(),
      type: "Current Stock",
      quantity: selectedStockItem.quantity,
      balance: runningBalance,
      reference: selectedStockItem.batch,
    });
    
    // Generate some historical movements
    for (let i = 0; i < 5; i++) {
      const isInward = Math.random() > 0.5;
      const qty = Math.floor(Math.random() * 50) + 10;
      const date = new Date(2024, Math.floor(Math.random() * 6) + 4, Math.floor(Math.random() * 28) + 1);
      
      runningBalance = isInward ? runningBalance - qty : runningBalance + qty;
      
      movements.push({
        date: date.toISOString(),
        type: isInward ? "Purchase" : "Sale",
        quantity: qty,
        balance: runningBalance,
        reference: isInward ? `PUR-${String(i + 1).padStart(4, "0")}` : `INV-${String(i + 1).padStart(4, "0")}`,
      });
    }
    
    return movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const movements = generateMovementHistory();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Stock Item</label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a stock item" />
                </SelectTrigger>
                <SelectContent>
                  {data.stock.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - {item.batch} ({getCategoryName(item.category)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStockItem && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                  <p className="text-xl font-bold">{selectedStockItem.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minimum Stock</p>
                  <p className="text-xl font-bold">{selectedStockItem.minQuantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock Value</p>
                  <p className="text-xl font-bold">₹{(selectedStockItem.quantity * selectedStockItem.sellingPrice).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="text-xl font-bold">{format(new Date(selectedStockItem.expiry), "dd/MM/yyyy")}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedItem && (
        <Card>
          <CardHeader>
            <CardTitle>Movement History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(movement.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant={movement.type === "Purchase" ? "default" : movement.type === "Sale" ? "secondary" : "outline"}>
                          {movement.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{movement.reference}</TableCell>
                      <TableCell className="text-right">
                        <span className={movement.type === "Purchase" ? "text-accent" : movement.type === "Sale" ? "text-destructive" : ""}>
                          {movement.type === "Purchase" ? "+" : movement.type === "Sale" ? "-" : ""}{movement.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{movement.balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
