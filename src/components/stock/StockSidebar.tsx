import {
  Home,
  Package,
  Activity,
  Warehouse,
  AlertTriangle,
  TrendingUp,
  ScrollText,
  FileText,
  BarChart3,
  DollarSign,
  Clock,
  ArrowLeftRight,
  FileCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface StockSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function StockSidebar({ activeTab, onTabChange }: StockSidebarProps) {
  const mainItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "entries", icon: Package, label: "Stock Entries" },
    { id: "categories", icon: Activity, label: "Categories" },
    { id: "warehouses", icon: Warehouse, label: "Warehouses" },
    { id: "alerts", icon: AlertTriangle, label: "Alerts" },
    { id: "reorder", icon: TrendingUp, label: "Smart Reorder" },
    { id: "ledger", icon: ScrollText, label: "Stock Ledger" },
  ];

  const advancedItems = [
    { id: "reports", icon: FileText, label: "Reports" },
    { id: "velocity", icon: BarChart3, label: "Stock Velocity" },
    { id: "profit", icon: DollarSign, label: "Profit Analysis" },
    { id: "aging", icon: Clock, label: "Stock Aging" },
    { id: "transfer", icon: ArrowLeftRight, label: "Transfers" },
    { id: "audit", icon: FileCheck, label: "Audit Logs" },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Stock Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={activeTab === item.id}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Advanced</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {advancedItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={activeTab === item.id}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
