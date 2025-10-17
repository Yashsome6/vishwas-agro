// Smart Reorder Point Calculations

interface StockItem {
  id: string;
  quantity: number;
  minQuantity: number;
  averageDailySales: number;
  leadTimeDays: number;
}

interface ReorderCalculation {
  itemId: string;
  reorderPoint: number;
  reorderQuantity: number;
  safetyStock: number;
  daysUntilReorder: number;
  shouldReorder: boolean;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export function calculateReorderPoint(item: StockItem): ReorderCalculation {
  // Safety stock = 7 days worth of average sales (buffer)
  const safetyStock = Math.ceil(item.averageDailySales * 7);
  
  // Reorder point = (Average daily sales × Lead time) + Safety stock
  const reorderPoint = Math.ceil((item.averageDailySales * item.leadTimeDays) + safetyStock);
  
  // Economic Order Quantity (simplified)
  const reorderQuantity = Math.max(
    Math.ceil(item.averageDailySales * (item.leadTimeDays + 14)), // 2 weeks buffer
    item.minQuantity
  );
  
  // Days until reorder needed
  const daysUntilReorder = item.quantity > 0 
    ? Math.floor((item.quantity - reorderPoint) / item.averageDailySales)
    : 0;
  
  // Should reorder flag
  const shouldReorder = item.quantity <= reorderPoint;
  
  // Urgency calculation
  let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (item.quantity <= 0) {
    urgency = 'critical';
  } else if (item.quantity <= safetyStock) {
    urgency = 'high';
  } else if (item.quantity <= reorderPoint) {
    urgency = 'medium';
  }
  
  return {
    itemId: item.id,
    reorderPoint,
    reorderQuantity,
    safetyStock,
    daysUntilReorder,
    shouldReorder,
    urgency
  };
}

export function calculateBulkReorderPoints(items: StockItem[]): ReorderCalculation[] {
  return items.map(calculateReorderPoint);
}

export function getReorderSuggestions(items: StockItem[]): ReorderCalculation[] {
  const calculations = calculateBulkReorderPoints(items);
  return calculations
    .filter(calc => calc.shouldReorder)
    .sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
}
