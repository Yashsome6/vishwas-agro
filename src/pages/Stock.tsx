import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StockSidebar } from "@/components/stock/StockSidebar";
import { Package } from "lucide-react";
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
        
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b backdrop-blur-glass px-6 shadow-sm">
            <SidebarTrigger className="-ml-1 hover:bg-sidebar-accent rounded-md transition-colors" />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-foreground truncate">Stock Management</h1>
              <p className="text-xs text-muted-foreground hidden sm:block truncate">
                Advanced inventory control system for agro products
              </p>
            </div>
            <NotificationCenter />
          </header>

          <main className="flex-1 overflow-auto p-6 md:p-8 bg-muted/30">
            <div className="max-w-[1920px] mx-auto">
              {activeTab === "dashboard" && <StockDashboardTab />}
              {activeTab === "entries" && <StockEntriesTab />}
              {activeTab === "categories" && <CategoriesTab />}
              {activeTab === "warehouses" && <WarehouseTab />}
              {activeTab === "alerts" && <AlertsTab />}
              {activeTab === "ledger" && <StockLedgerTab />}
              {activeTab === "reorder" && <ReorderTab />}
              {activeTab === "reports" && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Reports Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md">
                      Advanced reporting features are under development and will be available soon.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "velocity" && <StockVelocityTab />}
              {activeTab === "profit" && <ProfitAnalysisTab />}
              {activeTab === "aging" && <StockAgingTab />}
              {activeTab === "transfer" && <StockTransferTab />}
              {activeTab === "audit" && <AuditTab />}
            </div>
          </main>
        </div>

        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        <ShortcutsHelp open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      </div>
    </SidebarProvider>
  );
}
