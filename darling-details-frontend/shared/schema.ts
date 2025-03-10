import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  images: text("images").array(),
  available: integer("available").default(1),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  date: timestamp("date").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  date: timestamp("date").defaultNow(),
});

// Custom product schema with proper type handling
export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().min(0, "Price must be a positive number")
  ),
  categoryId: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int("Category ID must be an integer")
  ),
  available: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int("Quantity must be an integer").min(0, "Quantity cannot be negative")
  ),
  images: z.any().optional(),
});

// Replace the auto-generated schema with our custom one
export const insertProductSchema = productSchema;

// Create update schema (partial version for updates)
export const updateProductSchema = productSchema.partial();

export const insertCategorySchema = createInsertSchema(categories);
export const insertTestimonialSchema = createInsertSchema(testimonials);
export const insertContactSchema = createInsertSchema(contacts);

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Contact = typeof contacts.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
