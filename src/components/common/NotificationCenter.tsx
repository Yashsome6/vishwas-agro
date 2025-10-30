import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAppData } from "@/contexts/AppContext";

export function NotificationCenter() {
  const { data } = useAppData();
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate notifications
  const stock = data.stock || [];
  const now = new Date();

  const lowStockItems = stock.filter(
    item => item.quantity > 0 && item.quantity <= item.minQuantity
  );

  const outOfStockItems = stock.filter(item => item.quantity === 0);

  const expiringItems = stock.filter(item => {
    if (!item.expiry) return false;
    const expiryDate = new Date(item.expiry);
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
  });

  const notifications = [
    ...outOfStockItems.map(item => ({
      type: 'critical' as const,
      message: `Out of stock: ${item.name}`,
      time: 'Now',
    })),
    ...lowStockItems.map(item => ({
      type: 'warning' as const,
      message: `Low stock: ${item.name} (${item.quantity} remaining)`,
      time: 'Now',
    })),
    ...expiringItems.map(item => ({
      type: 'info' as const,
      message: `Expiring soon: ${item.name}`,
      time: 'Now',
    })),
  ].slice(0, 10);

  const totalCount = notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {totalCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {totalCount > 9 ? '9+' : totalCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-background">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <>
            {notifications.map((notification, index) => (
              <DropdownMenuItem key={index} className="flex flex-col items-start p-3">
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      notification.type === 'critical'
                        ? 'bg-destructive'
                        : notification.type === 'warning'
                        ? 'bg-warning'
                        : 'bg-primary'
                    }`}
                  />
                  <p className="text-sm flex-1">{notification.message}</p>
                </div>
                <span className="text-xs text-muted-foreground ml-4">
                  {notification.time}
                </span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
