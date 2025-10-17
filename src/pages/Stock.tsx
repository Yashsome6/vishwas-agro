import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoriesTab from "@/components/stock/CategoriesTab";
import StockEntriesTab from "@/components/stock/StockEntriesTab";
import AlertsTab from "@/components/stock/AlertsTab";
import StockLedgerTab from "@/components/stock/StockLedgerTab";

export default function Stock() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Stock Management</h1>
        <p className="text-muted-foreground">Manage your inventory and stock levels</p>
      </div>

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">Stock Entries</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="ledger">Stock Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="entries">
          <StockEntriesTab />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsTab />
        </TabsContent>

        <TabsContent value="ledger">
          <StockLedgerTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
