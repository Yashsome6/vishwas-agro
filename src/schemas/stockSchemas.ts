import { z } from "zod";

export const stockItemSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number()
    .min(0, "Quantity cannot be negative"),
  minQuantity: z.coerce.number()
    .min(0, "Minimum quantity cannot be negative"),
  batch: z.string()
    .trim()
    .min(3, "Batch number must be at least 3 characters")
    .max(20, "Batch number must be less than 20 characters")
    .regex(/^[A-Za-z0-9-_]+$/, "Batch number can only contain letters, numbers, hyphens, and underscores"),
  expiry: z.date({
    required_error: "Expiry date is required",
  }).refine((date) => date > new Date(), {
    message: "Expiry date must be in the future",
  }),
  purchasePrice: z.coerce.number()
    .positive("Purchase price must be positive"),
  sellingPrice: z.coerce.number()
    .positive("Selling price must be positive"),
  warehouse: z.string().min(1, "Warehouse is required"),
  averageDailySales: z.coerce.number()
    .min(0, "Average daily sales cannot be negative")
    .optional(),
  leadTimeDays: z.coerce.number()
    .min(0, "Lead time cannot be negative")
    .optional(),
}).refine((data) => data.sellingPrice >= data.purchasePrice, {
  message: "Selling price must be greater than or equal to purchase price",
  path: ["sellingPrice"],
});

export const categorySchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters"),
  image: z.string()
    .min(1, "Category image/icon is required"),
});

export const warehouseSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Warehouse name must be at least 2 characters")
    .max(100, "Warehouse name must be less than 100 characters"),
  location: z.string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(200, "Location must be less than 200 characters"),
  capacity: z.coerce.number()
    .positive("Capacity must be positive")
    .max(1000000, "Capacity seems unreasonably high"),
});

export const stockMovementSchema = z.object({
  stockId: z.string().min(1, "Stock item is required"),
  type: z.enum(['in', 'out', 'adjustment'], {
    errorMap: () => ({ message: "Invalid movement type" }),
  }),
  quantity: z.coerce.number()
    .min(1, "Quantity must be at least 1"),
  referenceType: z.enum(['purchase', 'sale', 'return', 'adjustment'], {
    errorMap: () => ({ message: "Invalid reference type" }),
  }),
  referenceId: z.string().optional(),
  warehouse: z.string().min(1, "Warehouse is required"),
  notes: z.string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

export type StockItemFormData = z.infer<typeof stockItemSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type WarehouseFormData = z.infer<typeof warehouseSchema>;
export type StockMovementFormData = z.infer<typeof stockMovementSchema>;
