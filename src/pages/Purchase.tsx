import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VendorsTab from "@/components/purchase/VendorsTab";
import PurchaseVouchersTab from "@/components/purchase/PurchaseVouchersTab";
import PurchaseAnalyticsTab from "@/components/purchase/PurchaseAnalyticsTab";

export default function Purchase() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Purchase Management</h1>
        <p className="text-muted-foreground">Manage vendors and purchase orders</p>
      </div>

      <Tabs defaultValue="vouchers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vouchers">Purchase Vouchers</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vouchers" className="mt-6">
          <PurchaseVouchersTab />
        </TabsContent>
        
        <TabsContent value="vendors" className="mt-6">
          <VendorsTab />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <PurchaseAnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
