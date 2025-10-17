import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockReportsTab from "@/components/reports/StockReportsTab";
import SalesReportsTab from "@/components/reports/SalesReportsTab";
import PurchaseReportsTab from "@/components/reports/PurchaseReportsTab";
import FinancialReportsTab from "@/components/reports/FinancialReportsTab";
import StaffReportsTab from "@/components/reports/StaffReportsTab";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive reports across all business modules</p>
      </div>

      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stock">Stock Reports</TabsTrigger>
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="purchase">Purchase Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          <TabsTrigger value="staff">Staff Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          <StockReportsTab />
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <SalesReportsTab />
        </TabsContent>

        <TabsContent value="purchase" className="space-y-4">
          <PurchaseReportsTab />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialReportsTab />
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <StaffReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
