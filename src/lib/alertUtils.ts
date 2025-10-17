import { toast } from "sonner";

// Check low stock items
export function checkLowStockAlerts(stockItems: any[]) {
  const lowStockItems = stockItems.filter(item => item.quantity <= item.minQuantity);
  
  if (lowStockItems.length > 0) {
    lowStockItems.forEach(item => {
      toast.warning(`Low Stock Alert: ${item.name}`, {
        description: `Only ${item.quantity} units remaining. Minimum required: ${item.minQuantity}`,
        duration: 5000,
      });
    });
  }
  
  return lowStockItems;
}

// Check expiring items (if expiry date is within 30 days)
export function checkExpiryAlerts(stockItems: any[]) {
  const today = new Date();
  const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const expiringItems = stockItems.filter(item => {
    if (!item.expiry) return false;
    const expiryDate = new Date(item.expiry);
    return expiryDate <= thirtyDaysLater && expiryDate >= today;
  });
  
  if (expiringItems.length > 0) {
    expiringItems.forEach(item => {
      const daysUntilExpiry = Math.ceil((new Date(item.expiry).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      toast.warning(`Expiry Alert: ${item.name}`, {
        description: `Expires in ${daysUntilExpiry} days (${new Date(item.expiry).toLocaleDateString()})`,
        duration: 5000,
      });
    });
  }
  
  return expiringItems;
}

// Check overdue payments
export function checkOverduePayments(sales: any[]) {
  const today = new Date();
  const overdueSales = sales.filter(sale => {
    if (sale.status === 'paid') return false;
    // Consider sales older than 30 days as overdue
    const saleDate = new Date(sale.date);
    const daysSinceSale = Math.ceil((today.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceSale > 30;
  });
  
  if (overdueSales.length > 0) {
    const totalOverdue = overdueSales.reduce((sum, sale) => sum + (sale.total - sale.paid), 0);
    toast.error(`Overdue Payments`, {
      description: `${overdueSales.length} invoices overdue. Total: ₹${totalOverdue.toFixed(0)}`,
      duration: 5000,
    });
  }
  
  return overdueSales;
}

// Check customer credit limit
export function checkCreditLimit(customer: any, newSaleAmount: number) {
  if (!customer) return false;
  
  const totalOutstanding = customer.outstanding + newSaleAmount;
  
  if (totalOutstanding > customer.creditLimit) {
    toast.warning("Credit Limit Warning", {
      description: `Customer ${customer.name} will exceed credit limit. Outstanding: ₹${totalOutstanding.toFixed(0)}, Limit: ₹${customer.creditLimit.toFixed(0)}`,
      duration: 5000,
    });
    return true;
  }
  
  return false;
}

// Check overdue purchases
export function checkOverduePurchases(purchases: any[]) {
  const today = new Date();
  const overduePurchases = purchases.filter(purchase => {
    if (purchase.status === 'paid') return false;
    // Consider purchases older than 45 days as overdue
    const purchaseDate = new Date(purchase.date);
    const daysSincePurchase = Math.ceil((today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSincePurchase > 45;
  });
  
  if (overduePurchases.length > 0) {
    const totalOverdue = overduePurchases.reduce((sum, purchase) => sum + (purchase.total - purchase.paid), 0);
    toast.error(`Overdue Purchases`, {
      description: `${overduePurchases.length} purchases overdue. Total: ₹${totalOverdue.toFixed(0)}`,
      duration: 5000,
    });
  }
  
  return overduePurchases;
}

// Show success notification
export function showSuccess(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 3000,
  });
}

// Show error notification
export function showError(message: string, description?: string) {
  toast.error(message, {
    description,
    duration: 4000,
  });
}

// Show warning notification
export function showWarning(message: string, description?: string) {
  toast.warning(message, {
    description,
    duration: 4000,
  });
}

// Show info notification
export function showInfo(message: string, description?: string) {
  toast.info(message, {
    description,
    duration: 3000,
  });
}
