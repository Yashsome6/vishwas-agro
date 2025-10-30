import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Package,
  Warehouse,
  AlertTriangle,
  BarChart3,
  FileText,
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  ArrowLeftRight,
  ScrollText,
  Home,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const commands = [
    {
      group: "Navigation",
      items: [
        { icon: Home, label: "Dashboard", action: () => navigateToTab("dashboard") },
        { icon: Package, label: "Stock Entries", action: () => navigateToTab("entries") },
        { icon: Activity, label: "Categories", action: () => navigateToTab("categories") },
        { icon: Warehouse, label: "Warehouses", action: () => navigateToTab("warehouses") },
        { icon: AlertTriangle, label: "Alerts", action: () => navigateToTab("alerts") },
        { icon: TrendingUp, label: "Smart Reorder", action: () => navigateToTab("reorder") },
        { icon: ScrollText, label: "Stock Ledger", action: () => navigateToTab("ledger") },
        { icon: FileText, label: "Reports", action: () => navigateToTab("reports") },
      ],
    },
    {
      group: "Advanced",
      items: [
        { icon: BarChart3, label: "Stock Velocity", action: () => navigateToTab("velocity") },
        { icon: DollarSign, label: "Profit Analysis", action: () => navigateToTab("profit") },
        { icon: Clock, label: "Stock Aging", action: () => navigateToTab("aging") },
        { icon: ArrowLeftRight, label: "Inter-Warehouse Transfer", action: () => navigateToTab("transfer") },
        { icon: FileText, label: "Audit Logs", action: () => navigateToTab("audit") },
      ],
    },
  ];

  const navigateToTab = (tab: string) => {
    // This would need to be connected to your tab state management
    window.dispatchEvent(new CustomEvent('navigate-stock-tab', { detail: tab }));
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search features..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.label}
                  onSelect={() => {
                    item.action();
                    onOpenChange(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
