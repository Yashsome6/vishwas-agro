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
  Sprout,
  Plus,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface StockSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function StockSidebar({ activeTab, onTabChange }: StockSidebarProps) {
  const { open } = useSidebar();
  const { data } = useAppData();
  const stock = data.stock || [];
  
  // Calculate alerts count
  const alertsCount = stock.filter(
    item => item.quantity === 0 || item.quantity <= item.minQuantity
  ).length;

  const mainItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", description: "Overview" },
    { id: "entries", icon: Package, label: "Stock Entries", description: "Manage items" },
    { id: "categories", icon: Activity, label: "Categories", description: "Organize stock" },
    { id: "warehouses", icon: Warehouse, label: "Warehouses", description: "Locations" },
    { 
      id: "alerts", 
      icon: AlertTriangle, 
      label: "Alerts", 
      description: "Stock alerts",
      badge: alertsCount > 0 ? alertsCount : undefined,
    },
    { id: "reorder", icon: TrendingUp, label: "Smart Reorder", description: "Auto reorder" },
    { id: "ledger", icon: ScrollText, label: "Stock Ledger", description: "Transaction log" },
  ];

  const advancedItems = [
    { id: "reports", icon: FileText, label: "Reports", description: "Analytics" },
    { id: "velocity", icon: BarChart3, label: "Stock Velocity", description: "Movement rate" },
    { id: "profit", icon: DollarSign, label: "Profit Analysis", description: "Margins" },
    { id: "aging", icon: Clock, label: "Stock Aging", description: "Age tracking" },
    { id: "transfer", icon: ArrowLeftRight, label: "Transfers", description: "Move stock" },
    { id: "audit", icon: FileCheck, label: "Audit Logs", description: "History" },
  ];

  return (
    <Sidebar className={cn("border-r transition-all duration-300", open ? "w-[280px]" : "w-16")}>
      <SidebarContent>
        {/* Header */}
        <div className={cn(
          "p-4 border-b transition-all duration-300",
          !open && "px-2"
        )}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shrink-0">
              <Sprout className="h-5 w-5" />
            </div>
            {open && (
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-foreground truncate">Stock Management</h2>
                <p className="text-xs text-muted-foreground truncate">Advanced Inventory</p>
              </div>
            )}
          </div>
          
          {open && (
            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium text-foreground">{stock.length}</span>
                <span className="text-muted-foreground">Items</span>
              </div>
              {alertsCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-warning/10 text-warning border-warning/20">
                    {alertsCount}
                  </Badge>
                </div>
              )}
            </div>
          )}
          
          {open && (
            <Button 
              size="sm" 
              className="w-full mt-3 bg-gradient-primary hover:opacity-90 transition-opacity"
              onClick={() => onTabChange("entries")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Stock
            </Button>
          )}
        </div>

        {/* Core Operations */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Core Operations</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={isActive}
                      tooltip={!open ? item.label : undefined}
                      className={cn(
                        "relative transition-all duration-200",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm",
                        !isActive && "hover:bg-sidebar-accent/50"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                      )}
                      <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                        isActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground/70"
                      )}>
                        <Icon className={cn("h-4 w-4", isActive && "animate-scale-in")} />
                      </div>
                      {open && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="truncate">{item.label}</span>
                            {item.badge !== undefined && item.badge > 0 && (
                              <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs bg-warning/10 text-warning border-warning/20">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Advanced Analytics */}
        <SidebarGroup>
          {open && <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Analytics & Reports</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {advancedItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={isActive}
                      tooltip={!open ? item.label : undefined}
                      className={cn(
                        "relative transition-all duration-200",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm",
                        !isActive && "hover:bg-sidebar-accent/50"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                      )}
                      <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                        isActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground/70"
                      )}>
                        <Icon className={cn("h-4 w-4", isActive && "animate-scale-in")} />
                      </div>
                      {open && (
                        <div className="flex-1 min-w-0">
                          <span className="truncate">{item.label}</span>
                          <span className="text-xs text-muted-foreground truncate block">{item.description}</span>
                        </div>
                      )}
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
