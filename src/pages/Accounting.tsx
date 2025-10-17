import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfitLossTab from "@/components/accounting/ProfitLossTab";
import BalanceReportsTab from "@/components/accounting/BalanceReportsTab";
import RevenueAnalyticsTab from "@/components/accounting/RevenueAnalyticsTab";

export default function Accounting() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Accounting & Revenue</h1>
        <p className="text-muted-foreground">Track profits, losses, and financial reports</p>
      </div>

      <Tabs defaultValue="profitloss" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profitloss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="balance">Balance Reports</TabsTrigger>
          <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profitloss" className="mt-6">
          <ProfitLossTab />
        </TabsContent>
        
        <TabsContent value="balance" className="mt-6">
          <BalanceReportsTab />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <RevenueAnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
