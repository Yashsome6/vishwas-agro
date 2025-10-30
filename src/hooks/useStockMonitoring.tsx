import { useEffect } from 'react';
import { useAppData } from '@/contexts/AppContext';
import { toast } from 'sonner';

export function useStockMonitoring(intervalMs: number = 5 * 60 * 1000) {
  const { data } = useAppData();

  useEffect(() => {
    const checkStockLevels = () => {
      const stock = data.stock || [];
      const now = new Date();

      // Check for low stock
      const lowStockItems = stock.filter(
        item => item.quantity > 0 && item.quantity <= item.minQuantity
      );

      // Check for out of stock
      const outOfStockItems = stock.filter(item => item.quantity === 0);

      // Check for expiring items (within 7 days)
      const expiringItems = stock.filter(item => {
        if (!item.expiry) return false;
        const expiryDate = new Date(item.expiry);
        const daysUntilExpiry = Math.floor(
          (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
      });

      // Check for expired items
      const expiredItems = stock.filter(item => {
        if (!item.expiry) return false;
        return new Date(item.expiry) < now;
      });

      // Show notifications for critical issues
      if (outOfStockItems.length > 0) {
        toast.error(`${outOfStockItems.length} item(s) out of stock`, {
          description: outOfStockItems.slice(0, 3).map(i => i.name).join(', '),
        });
      }

      if (expiredItems.length > 0) {
        toast.error(`${expiredItems.length} item(s) expired`, {
          description: expiredItems.slice(0, 3).map(i => i.name).join(', '),
        });
      }

      if (lowStockItems.length > 0) {
        toast.warning(`${lowStockItems.length} item(s) low on stock`, {
          description: lowStockItems.slice(0, 3).map(i => i.name).join(', '),
        });
      }

      if (expiringItems.length > 0) {
        toast.warning(`${expiringItems.length} item(s) expiring soon`, {
          description: expiringItems.slice(0, 3).map(i => i.name).join(', '),
        });
      }
    };

    // Run initial check
    checkStockLevels();

    // Set up interval for periodic checks
    const interval = setInterval(checkStockLevels, intervalMs);

    return () => clearInterval(interval);
  }, [data.stock, intervalMs]);
}
