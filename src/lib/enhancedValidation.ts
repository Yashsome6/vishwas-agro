// Enhanced validation rules for production readiness
import { z } from "zod";

// Common validation schemas
export const phoneSchema = z.string()
  .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number")
  .or(z.string().regex(/^\+91[6-9]\d{9}$/, "Invalid Indian mobile number with +91"));

export const gstinSchema = z.string()
  .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format");

export const panSchema = z.string()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format");

export const pinCodeSchema = z.string()
  .regex(/^[1-9][0-9]{5}$/, "Invalid PIN code");

export const emailSchema = z.string()
  .email("Invalid email address")
  .max(255, "Email too long");

// Product validation
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name too short").max(200, "Name too long"),
  category: z.string().min(1, "Category required"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  unit: z.string().min(1, "Unit required"),
  price: z.number().min(0, "Price cannot be negative"),
  minQuantity: z.number().min(0, "Min quantity cannot be negative"),
  barcode: z.string().optional(),
  // Agro-specific fields
  seedCertification: z.object({
    certificationNumber: z.string().optional(),
    certifyingAgency: z.string().optional(),
    certificationDate: z.string().optional(),
    expiryDate: z.string().optional(),
    germinationRate: z.number().min(0).max(100).optional(),
    purityPercentage: z.number().min(0).max(100).optional(),
  }).optional(),
  batchInfo: z.object({
    batchNumber: z.string().optional(),
    manufacturingDate: z.string().optional(),
    expiryDate: z.string().optional(),
    parentBatch: z.string().optional(),
  }).optional(),
  seasonality: z.object({
    season: z.enum(['kharif', 'rabi', 'zaid', 'all']).optional(),
    plantingMonths: z.array(z.number().min(1).max(12)).optional(),
    harvestMonths: z.array(z.number().min(1).max(12)).optional(),
  }).optional(),
});

// Customer validation
export const customerSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name too short").max(200, "Name too long"),
  email: emailSchema.optional(),
  phone: phoneSchema,
  address: z.string().max(500, "Address too long").optional(),
  gstin: gstinSchema.optional(),
  pinCode: pinCodeSchema.optional(),
  creditLimit: z.number().min(0, "Credit limit cannot be negative").optional(),
  customerType: z.enum(['regular', 'premium', 'wholesale', 'farmer']).optional(),
  // Agro-specific
  farmDetails: z.object({
    farmSize: z.number().min(0).optional(),
    farmLocation: z.string().optional(),
    cropsGrown: z.array(z.string()).optional(),
    soilType: z.string().optional(),
  }).optional(),
});

// Vendor validation
export const vendorSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name too short").max(200, "Name too long"),
  email: emailSchema.optional(),
  phone: phoneSchema,
  address: z.string().max(500, "Address too long").optional(),
  gstin: gstinSchema.optional(),
  pan: panSchema.optional(),
  paymentTerms: z.string().optional(),
  // Agro-specific
  supplierRating: z.number().min(0).max(5).optional(),
  seedDealerLicense: z.string().optional(),
  licenseExpiry: z.string().optional(),
  certifications: z.array(z.string()).optional(),
});

// Invoice validation
export const invoiceSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string().min(1, "Invoice number required"),
  date: z.string(),
  customerId: z.string().min(1, "Customer required"),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(0.01, "Quantity must be positive"),
    price: z.number().min(0, "Price cannot be negative"),
    discount: z.number().min(0).max(100).optional(),
  })).min(1, "At least one item required"),
  total: z.number().min(0, "Total cannot be negative"),
  paid: z.number().min(0, "Paid amount cannot be negative"),
  status: z.enum(['draft', 'pending', 'paid', 'overdue', 'cancelled']),
});

// Session/Auth validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain number"),
});

export const userSchema = z.object({
  id: z.string(),
  email: emailSchema,
  name: z.string().min(2, "Name too short").max(100, "Name too long"),
  role: z.enum(['admin', 'manager', 'staff', 'viewer']),
  phone: phoneSchema.optional(),
  lastLogin: z.string().optional(),
});

// Helper function for validation with friendly errors
export function validateWithErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return { success: false, errors };
}

// Business rule validations
export function validateStockLevel(quantity: number, minQuantity: number): {
  isValid: boolean;
  urgency: 'ok' | 'low' | 'critical';
  message: string;
} {
  if (quantity <= 0) {
    return { isValid: false, urgency: 'critical', message: 'Out of stock' };
  }
  if (quantity <= minQuantity) {
    return { isValid: false, urgency: 'low', message: 'Below minimum stock level' };
  }
  return { isValid: true, urgency: 'ok', message: 'Stock level adequate' };
}

export function validateExpiryDate(expiryDate: string): {
  isValid: boolean;
  daysRemaining: number;
  urgency: 'ok' | 'warning' | 'critical';
  message: string;
} {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysRemaining = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { isValid: false, daysRemaining, urgency: 'critical', message: 'Product expired' };
  }
  if (daysRemaining <= 7) {
    return { isValid: true, daysRemaining, urgency: 'critical', message: `Expires in ${daysRemaining} days` };
  }
  if (daysRemaining <= 30) {
    return { isValid: true, daysRemaining, urgency: 'warning', message: `Expires in ${daysRemaining} days` };
  }
  return { isValid: true, daysRemaining, urgency: 'ok', message: 'Expiry date valid' };
}

export function validateGSTCalculation(
  amount: number,
  gstRate: number,
  gstAmount: number
): { isValid: boolean; expectedGST: number; difference: number } {
  const expectedGST = Math.round((amount * gstRate / 100) * 100) / 100;
  const difference = Math.abs(gstAmount - expectedGST);
  
  return {
    isValid: difference < 0.01, // Allow 1 paisa difference for rounding
    expectedGST,
    difference
  };
}
