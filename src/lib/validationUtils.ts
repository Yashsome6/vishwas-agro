import { toast } from "sonner";

export interface ValidationError {
  field: string;
  message: string;
}

// Validate stock item
export function validateStockItem(item: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!item.name || item.name.trim().length === 0) {
    errors.push({ field: "name", message: "Item name is required" });
  }

  if (item.name && item.name.length > 100) {
    errors.push({ field: "name", message: "Item name must be less than 100 characters" });
  }

  if (!item.category) {
    errors.push({ field: "category", message: "Category is required" });
  }

  if (item.quantity < 0) {
    errors.push({ field: "quantity", message: "Quantity cannot be negative" });
  }

  if (item.sellingPrice <= 0) {
    errors.push({ field: "sellingPrice", message: "Selling price must be greater than 0" });
  }

  if (item.purchasePrice <= 0) {
    errors.push({ field: "purchasePrice", message: "Purchase price must be greater than 0" });
  }

  if (item.sellingPrice < item.purchasePrice) {
    errors.push({ field: "sellingPrice", message: "Warning: Selling price is less than purchase price" });
  }

  if (item.minQuantity < 0) {
    errors.push({ field: "minQuantity", message: "Minimum quantity cannot be negative" });
  }

  return errors;
}

// Validate sale
export function validateSale(sale: any, stockItems: any[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!sale.customerId) {
    errors.push({ field: "customerId", message: "Customer is required" });
  }

  if (!sale.items || sale.items.length === 0) {
    errors.push({ field: "items", message: "At least one item is required" });
  }

  // Check stock availability
  sale.items?.forEach((item: any, index: number) => {
    const stockItem = stockItems.find(s => s.id === item.stockId);
    if (stockItem && item.quantity > stockItem.quantity) {
      errors.push({ 
        field: `items[${index}].quantity`, 
        message: `Insufficient stock for ${stockItem.name}. Available: ${stockItem.quantity}` 
      });
    }
  });

  if (sale.total <= 0) {
    errors.push({ field: "total", message: "Total amount must be greater than 0" });
  }

  return errors;
}

// Validate purchase
export function validatePurchase(purchase: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!purchase.vendorId) {
    errors.push({ field: "vendorId", message: "Vendor is required" });
  }

  if (!purchase.items || purchase.items.length === 0) {
    errors.push({ field: "items", message: "At least one item is required" });
  }

  if (purchase.total <= 0) {
    errors.push({ field: "total", message: "Total amount must be greater than 0" });
  }

  return errors;
}

// Validate customer
export function validateCustomer(customer: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!customer.name || customer.name.trim().length === 0) {
    errors.push({ field: "name", message: "Customer name is required" });
  }

  if (customer.name && customer.name.length > 100) {
    errors.push({ field: "name", message: "Name must be less than 100 characters" });
  }

  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  if (customer.phone && !/^\d{10}$/.test(customer.phone.replace(/\D/g, ''))) {
    errors.push({ field: "phone", message: "Phone number must be 10 digits" });
  }

  if (customer.creditLimit < 0) {
    errors.push({ field: "creditLimit", message: "Credit limit cannot be negative" });
  }

  return errors;
}

// Validate vendor
export function validateVendor(vendor: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!vendor.name || vendor.name.trim().length === 0) {
    errors.push({ field: "name", message: "Vendor name is required" });
  }

  if (vendor.name && vendor.name.length > 100) {
    errors.push({ field: "name", message: "Name must be less than 100 characters" });
  }

  if (vendor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendor.email)) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  if (vendor.phone && !/^\d{10}$/.test(vendor.phone.replace(/\D/g, ''))) {
    errors.push({ field: "phone", message: "Phone number must be 10 digits" });
  }

  if (vendor.gstNo && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(vendor.gstNo)) {
    errors.push({ field: "gstNo", message: "Invalid GST number format" });
  }

  return errors;
}

// Validate employee
export function validateEmployee(employee: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!employee.name || employee.name.trim().length === 0) {
    errors.push({ field: "name", message: "Employee name is required" });
  }

  if (!employee.department) {
    errors.push({ field: "department", message: "Department is required" });
  }

  if (!employee.position) {
    errors.push({ field: "position", message: "Position is required" });
  }

  if (employee.salary <= 0) {
    errors.push({ field: "salary", message: "Salary must be greater than 0" });
  }

  if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  if (employee.phone && !/^\d{10}$/.test(employee.phone.replace(/\D/g, ''))) {
    errors.push({ field: "phone", message: "Phone number must be 10 digits" });
  }

  return errors;
}

// Display validation errors
export function showValidationErrors(errors: ValidationError[]) {
  if (errors.length > 0) {
    errors.forEach(error => {
      toast.error(error.message);
    });
    return true;
  }
  return false;
}

// Check for duplicate entries
export function checkDuplicate(items: any[], newItem: any, field: string, excludeId?: string): boolean {
  const duplicate = items.find(item => 
    item[field].toLowerCase() === newItem[field].toLowerCase() && 
    item.id !== excludeId
  );
  
  if (duplicate) {
    toast.error(`${field} already exists`);
    return true;
  }
  
  return false;
}
