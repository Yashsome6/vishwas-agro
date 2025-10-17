import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Calculator,
  Users,
  FileText,
  Settings,
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

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Stock Management", url: "/stock", icon: Package },
  { title: "Purchase", url: "/purchase", icon: ShoppingCart },
  { title: "Sales", url: "/sales", icon: TrendingUp },
  { title: "Accounting", url: "/accounting", icon: Calculator },
  { title: "Staff ERP", url: "/staff", icon: Users },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="text-3xl">🌱</div>
            {open && (
              <div>
                <h1 className="font-bold text-sidebar-foreground">Agro ERP</h1>
                <p className="text-xs text-sidebar-foreground/60">Seed Management</p>
              </div>
            )}
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
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
