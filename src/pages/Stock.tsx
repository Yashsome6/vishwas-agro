import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StockSidebar } from "@/components/stock/StockSidebar";
import StockDashboardTab from "@/components/stock/StockDashboardTab";
import CategoriesTab from "@/components/stock/CategoriesTab";
import StockEntriesTab from "@/components/stock/StockEntriesTab";
import AlertsTab from "@/components/stock/AlertsTab";
import StockLedgerTab from "@/components/stock/StockLedgerTab";
import ReorderTab from "@/components/stock/ReorderTab";
import WarehouseTab from "@/components/stock/WarehouseTab";
import { AuditTab } from "@/components/stock/AuditTab";
import StockVelocityTab from "@/components/stock/StockVelocityTab";
import ProfitAnalysisTab from "@/components/stock/ProfitAnalysisTab";
import StockAgingTab from "@/components/stock/StockAgingTab";
import StockTransferTab from "@/components/stock/StockTransferTab";
import { CommandPalette } from "@/components/common/CommandPalette";
import { NotificationCenter } from "@/components/common/NotificationCenter";
import { ShortcutsHelp } from "@/components/common/ShortcutsHelp";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useStockMonitoring } from "@/hooks/useStockMonitoring";

export default function Stock() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Enable real-time stock monitoring
  useStockMonitoring();

  // Setup keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      callback: () => setCommandOpen(true),
      description: 'Open command palette',
    },
    {
      key: '?',
      callback: () => setShortcutsOpen(true),
      description: 'Show keyboard shortcuts',
    },
  ]);

  // Listen for custom navigation events from command palette
  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('navigate-stock-tab', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate-stock-tab', handleNavigate as EventListener);
  }, []);

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        <StockSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">Stock Management</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Advanced inventory control system</p>
            </div>
            <NotificationCenter />
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-6">
            {activeTab === "dashboard" && <StockDashboardTab />}
            {activeTab === "entries" && <StockEntriesTab />}
            {activeTab === "categories" && <CategoriesTab />}
            {activeTab === "warehouses" && <WarehouseTab />}
            {activeTab === "alerts" && <AlertsTab />}
            {activeTab === "ledger" && <StockLedgerTab />}
            {activeTab === "reorder" && <ReorderTab />}
            {activeTab === "reports" && <div className="text-center p-8 text-muted-foreground">Reports coming soon...</div>}
            {activeTab === "velocity" && <StockVelocityTab />}
            {activeTab === "profit" && <ProfitAnalysisTab />}
            {activeTab === "aging" && <StockAgingTab />}
            {activeTab === "transfer" && <StockTransferTab />}
            {activeTab === "audit" && <AuditTab />}
          </main>
        </div>

        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        <ShortcutsHelp open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      </div>
    </SidebarProvider>
  );
}
