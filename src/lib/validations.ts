import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone required").optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  source: z.string().default("contact"),
});

export const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().optional(),
  propertyId: z.string().optional(),
  propertySlug: z.string().optional(),
  source: z.string().default("property-inquiry"),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const propertySchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(20),
  price: z.coerce.number().positive(),
  propertyType: z.string(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  areaSqFt: z.coerce.number().optional(),
  amenities: z.array(z.string()).default([]),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  images: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  videos: z.array(z.string()).default([]),
  virtualTourUrl: z.string().url().optional().or(z.literal("")),
  floorPlans: z.array(z.string()).default([]),
  possession: z.string().optional(),
  builder: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]),
  categoryId: z.string().optional(),
  areaId: z.string().optional(),
});

export const blogSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(50),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type BlogInput = z.infer<typeof blogSchema>;
