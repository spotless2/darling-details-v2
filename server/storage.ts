import {
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type Testimonial, type InsertTestimonial,
  type Contact, type InsertContact
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  
  // Products
  getProducts(categoryId?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  addTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private testimonials: Map<number, Testimonial>;
  private contacts: Map<number, Contact>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.testimonials = new Map();
    this.contacts = new Map();
    this.currentIds = {
      category: 1,
      product: 1,
      testimonial: 1,
      contact: 1
    };
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample categories
    const categories: InsertCategory[] = [
      { name: "Decorațiuni", slug: "decoratiuni", description: "Decorațiuni elegante pentru evenimente", image: "/images/decorations.svg" },
      { name: "Mărturii", slug: "marturii", description: "Mărturii unice pentru invitați", image: "/images/favors.svg" },
      { name: "Cabină Foto", slug: "cabina-foto", description: "Cabine foto profesionale", image: "/images/photobooth.svg" }
    ];
    
    categories.forEach(cat => {
      const id = this.currentIds.category++;
      this.categories.set(id, { ...cat, id });
    });

    // Add sample products
    const products: InsertProduct[] = [
      { name: "Lumânări decorative", description: "Set lumânări elegante", price: 150, categoryId: 1, images: ["/images/candles.svg"], available: 10 },
      { name: "Vază cristal", description: "Vază din cristal pentru aranjamente", price: 200, categoryId: 1, images: ["/images/vase.svg"], available: 5 }
    ];
    
    products.forEach(prod => {
      const id = this.currentIds.product++;
      this.products.set(id, { ...prod, id });
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(c => c.slug === slug);
  }

  async getProducts(categoryId?: number): Promise<Product[]> {
    const products = Array.from(this.products.values());
    return categoryId ? products.filter(p => p.categoryId === categoryId) : products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async addTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentIds.testimonial++;
    const newTestimonial = { ...testimonial, id };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.currentIds.contact++;
    const newContact = { ...contact, id, date: new Date() };
    this.contacts.set(id, newContact);
    return newContact;
  }
}

export const storage = new MemStorage();
