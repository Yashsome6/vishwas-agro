import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calculator } from "lucide-react";
import { useAppData } from "@/contexts/AppContext";
import { format } from "date-fns";

export default function GSTCompliance() {
  const { data } = useAppData();
  const [gstRate, setGstRate] = useState(18);

  // Calculate GST for sales (GST already included in mockData)
  const salesWithGST = data.sales.map(invoice => {
    return {
      ...invoice,
      taxableAmount: invoice.subtotal,
      // cgst and sgst already exist in mockData
    };
  });

  // Calculate GST for purchases (GST already included in mockData)
  const purchasesWithGST = data.purchases.map(voucher => {
    return {
      ...voucher,
      taxableAmount: voucher.subtotal,
      // cgst and sgst already exist in mockData
    };
  });

  // GSTR-1 Summary (Outward Supplies)
  const totalSales = salesWithGST.reduce((sum, s) => sum + s.total, 0);
  const totalSalesTaxable = salesWithGST.reduce((sum, s) => sum + s.taxableAmount, 0);
  const totalSalesCGST = salesWithGST.reduce((sum, s) => sum + s.cgst, 0);
  const totalSalesSGST = salesWithGST.reduce((sum, s) => sum + s.sgst, 0);

  // GSTR-2 Summary (Inward Supplies)
  const totalPurchases = purchasesWithGST.reduce((sum, p) => sum + p.total, 0);
  const totalPurchasesTaxable = purchasesWithGST.reduce((sum, p) => sum + p.taxableAmount, 0);
  const totalPurchasesCGST = purchasesWithGST.reduce((sum, p) => sum + p.cgst, 0);
  const totalPurchasesSGST = purchasesWithGST.reduce((sum, p) => sum + p.sgst, 0);

  // GSTR-3B Summary (Net Tax Liability)
  const netCGST = totalSalesCGST - totalPurchasesCGST;
  const netSGST = totalSalesSGST - totalPurchasesSGST;
  const totalTaxLiability = netCGST + netSGST;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          GST Compliance
        </h1>
        <p className="text-muted-foreground">Goods and Services Tax reporting and filing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GST Configuration</CardTitle>
          <CardDescription>Configure GST rates and business details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gstRate">Default GST Rate (%)</Label>
              <Input
                id="gstRate"
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input id="gstin" placeholder="Enter your GSTIN" defaultValue="27AABCU9603R1ZX" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="gstr1" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gstr1">GSTR-1</TabsTrigger>
          <TabsTrigger value="gstr2">GSTR-2</TabsTrigger>
          <TabsTrigger value="gstr3b">GSTR-3B</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="gstr1" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GSTR-1: Outward Supplies</CardTitle>
              <CardDescription>Details of outward supplies of goods or services</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Taxable Value</TableHead>
                    <TableHead className="text-right">CGST</TableHead>
                    <TableHead className="text-right">SGST</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesWithGST.map((sale) => {
                    const customer = data.customers.find(c => c.id === sale.customerId);
                    return (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{format(new Date(sale.date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>{customer?.name || 'Unknown'}</TableCell>
                        <TableCell className="text-right">₹{sale.taxableAmount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₹{sale.cgst.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₹{sale.sgst.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₹{sale.total.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">₹{totalSalesTaxable.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{totalSalesCGST.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{totalSalesSGST.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{totalSales.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download GSTR-1
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gstr2" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GSTR-2: Inward Supplies</CardTitle>
              <CardDescription>Details of inward supplies of goods or services</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voucher No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">Taxable Value</TableHead>
                    <TableHead className="text-right">CGST</TableHead>
                    <TableHead className="text-right">SGST</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchasesWithGST.map((purchase) => {
                    const vendor = data.vendors.find(v => v.id === purchase.vendorId);
                    return (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.id}</TableCell>
                        <TableCell>{format(new Date(purchase.date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>{vendor?.name || 'Unknown'}</TableCell>
                        <TableCell className="text-right">₹{purchase.taxableAmount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₹{purchase.cgst.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₹{purchase.sgst.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₹{purchase.total.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">₹{totalPurchasesTaxable.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{totalPurchasesCGST.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{totalPurchasesSGST.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{totalPurchases.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download GSTR-2
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gstr3b" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GSTR-3B: Monthly Return</CardTitle>
              <CardDescription>Summary of outward and inward supplies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 p-4 border rounded-lg">
                    <h3 className="font-semibold">Outward Taxable Supplies</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Taxable Value:</span>
                        <span className="font-medium">₹{totalSalesTaxable.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CGST:</span>
                        <span className="font-medium">₹{totalSalesCGST.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGST:</span>
                        <span className="font-medium">₹{totalSalesSGST.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 p-4 border rounded-lg">
                    <h3 className="font-semibold">Eligible ITC</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Taxable Value:</span>
                        <span className="font-medium">₹{totalPurchasesTaxable.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CGST:</span>
                        <span className="font-medium">₹{totalPurchasesCGST.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGST:</span>
                        <span className="font-medium">₹{totalPurchasesSGST.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary rounded-lg">
                  <h3 className="font-semibold mb-3">Net Tax Liability</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Net CGST Payable:</span>
                      <span className="font-medium">₹{netCGST.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net SGST Payable:</span>
                      <span className="font-medium">₹{netSGST.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total Tax Payable:</span>
                      <span className="text-primary">₹{totalTaxLiability.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate GSTR-3B Return
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Output GST</CardTitle>
                <CardDescription>Tax collected on sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  ₹{(totalSalesCGST + totalSalesSGST).toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input GST</CardTitle>
                <CardDescription>Tax credit on purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  ₹{(totalPurchasesCGST + totalPurchasesSGST).toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Net GST Payable</CardTitle>
                <CardDescription>Final tax liability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  ₹{totalTaxLiability.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
