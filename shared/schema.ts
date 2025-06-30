import { z } from "zod";

// User Collection Schema
export const userSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string()
  }).optional(),
  phone: z.string().optional(),
  created_at: z.date().optional(),
  role: z.enum(["customer", "admin"]).default("customer")
});

// Products Collection Schema
export const productSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  images: z.array(z.string()),
  stock: z.number(),
  created_at: z.date().optional(),
  variants: z.array(z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    stock: z.number().optional(),
    price_adjustment: z.number().optional()
  })).optional()
});

// Orders Collection Schema
export const orderSchema = z.object({
  _id: z.string().optional(),
  user_id: z.string(),
  status: z.enum(["pending", "completed", "cancelled", "shipped"]).default("pending"),
  total: z.number(),
  order_items: z.array(z.object({
    product_id: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number()
  })),
  shipping_address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string()
  }),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});

// Cart Collection Schema (Optional)
export const cartSchema = z.object({
  _id: z.string().optional(),
  user_id: z.string(),
  items: z.array(z.object({
    product_id: z.string(),
    quantity: z.number()
  })),
  updated_at: z.date().optional()
});

// Categories Collection Schema
export const categorySchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  description: z.string()
});

// Payments Collection Schema (Optional)
export const paymentSchema = z.object({
  _id: z.string().optional(),
  order_id: z.string(),
  user_id: z.string(),
  amount: z.number(),
  status: z.enum(["paid", "failed", "pending"]).default("pending"),
  method: z.enum(["card", "paypal", "bank_transfer"]),
  transaction_id: z.string().optional(),
  created_at: z.date().optional()
});

// Reviews Collection Schema (Optional)
export const reviewSchema = z.object({
  _id: z.string().optional(),
  product_id: z.string(),
  user_id: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  created_at: z.date().optional()
});

// Prototyping Projects Schema
export const prototypingProjectSchema = z.object({
  _id: z.string().optional(),
  user_id: z.string(),
  project_name: z.string(),
  category: z.string(),
  description: z.string(),
  budget_range: z.string().optional(),
  timeline: z.string().optional(),
  status: z.string().default("submitted"),
  files: z.array(z.any()).default([]),
  created_at: z.date().optional()
});

// 3D Printing Requests Schema
export const printingRequestSchema = z.object({
  _id: z.string().optional(),
  user_id: z.string(),
  file_name: z.string(),
  file_url: z.string(),
  material: z.string(),
  quality: z.string(),
  infill_density: z.number().default(20),
  color: z.string().default("white"),
  estimated_cost: z.string(),
  estimated_time: z.string(),
  status: z.string().default("pending"),
  created_at: z.date().optional()
});

// Insert schemas (omit _id and timestamps for new documents)
export const insertUserSchema = userSchema.omit({
  _id: true,
  created_at: true
});

export const insertProductSchema = productSchema.omit({
  _id: true,
  created_at: true
});

export const insertOrderSchema = orderSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true
});

export const insertCartSchema = cartSchema.omit({
  _id: true,
  updated_at: true
});

export const insertCategorySchema = categorySchema.omit({
  _id: true
});

export const insertPaymentSchema = paymentSchema.omit({
  _id: true,
  created_at: true
});

export const insertReviewSchema = reviewSchema.omit({
  _id: true,
  created_at: true
});

export const insertPrototypingProjectSchema = prototypingProjectSchema.omit({
  _id: true,
  created_at: true
});

export const insertPrintingRequestSchema = printingRequestSchema.omit({
  _id: true,
  created_at: true
});

// Legacy schemas for backward compatibility
export const cartItemSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  productId: z.string(),
  quantity: z.number(),
  createdAt: z.date().optional()
});

export const insertCartItemSchema = cartItemSchema.omit({
  _id: true,
  createdAt: true
});

// Type definitions
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Cart = z.infer<typeof cartSchema>;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type Category = z.infer<typeof categorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Payment = z.infer<typeof paymentSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Review = z.infer<typeof reviewSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type PrototypingProject = z.infer<typeof prototypingProjectSchema>;
export type InsertPrototypingProject = z.infer<typeof insertPrototypingProjectSchema>;

export type PrintingRequest = z.infer<typeof printingRequestSchema>;
export type InsertPrintingRequest = z.infer<typeof insertPrintingRequestSchema>;

// Legacy types for backward compatibility
export type CartItem = z.infer<typeof cartItemSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;