import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomersTab from "@/components/sales/CustomersTab";
import SalesInvoicesTab from "@/components/sales/SalesInvoicesTab";
import SalesAnalyticsTab from "@/components/sales/SalesAnalyticsTab";

export default function Sales() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Management</h1>
        <p className="text-muted-foreground">Manage customers and sales invoices</p>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Sales Invoices</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices" className="mt-6">
          <SalesInvoicesTab />
        </TabsContent>
        
        <TabsContent value="customers" className="mt-6">
          <CustomersTab />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <SalesAnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
