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
      { 
        name: "Decorațiuni", 
        slug: "decoratiuni", 
        description: "Decorațiuni elegante pentru evenimente", 
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800" 
      },
      { 
        name: "Mărturii", 
        slug: "marturii", 
        description: "Mărturii unice pentru invitați", 
        image: "https://images.unsplash.com/photo-1522682078546-47888fe04e81?w=800" 
      },
      { 
        name: "Cabină Foto", 
        slug: "cabina-foto", 
        description: "Cabine foto profesionale pentru evenimente", 
        image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800" 
      },
      { 
        name: "Aranjamente Florale", 
        slug: "aranjamente-florale", 
        description: "Aranjamente florale pentru nunți și evenimente", 
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800" 
      },
      { 
        name: "Lumini și Efecte", 
        slug: "lumini-efecte", 
        description: "Iluminat decorativ și efecte speciale", 
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800" 
      }
    ];

    categories.forEach(cat => {
      const id = this.currentIds.category++;
      this.categories.set(id, { ...cat, id, description: cat.description || null, image: cat.image || null });
    });

    // Add sample products for each category
    const products: InsertProduct[] = [
      {
        name: "Lumânări decorative",
        description: "Set lumânări elegante pentru centrul mesei",
        price: 150,
        categoryId: 1,
        images: ["https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=800&q=80"],
        available: 10
      },
      {
        name: "Vază cristal",
        description: "Vază din cristal pentru aranjamente florale",
        price: 200,
        categoryId: 1,
        images: ["https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&q=80"],
        available: 5
      },
      {
        name: "Mărturie personalizată",
        description: "Mărturii elegante personalizate",
        price: 15,
        categoryId: 2,
        images: ["https://images.unsplash.com/photo-1522682078546-47888fe04e81?w=800&q=80"],
        available: 100
      },
      {
        name: "Cabină foto premium",
        description: "Cabină foto profesională cu props și imprimantă",
        price: 1500,
        categoryId: 3,
        images: ["https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80"],
        available: 2
      }
    ];

    products.forEach(prod => {
      const id = this.currentIds.product++;
      this.products.set(id, { 
        ...prod, 
        id, 
        description: prod.description || null,
        categoryId: prod.categoryId || null,
        images: prod.images || null,
        available: prod.available || null
      });
    });

    // Add sample testimonials
    const testimonials: InsertTestimonial[] = [
      {
        name: "Ana M.",
        content: "Echipa Darling Details a transformat nunta noastră într-un vis devenit realitate. Decorațiunile au fost exact așa cum ne-am imaginat!",
        rating: 5,
        date: new Date("2024-02-15"),
      },
      {
        name: "Ioan și Maria",
        content: "Cabina foto a fost punctul de atracție al evenimentului. Toți invitații au fost încântați de calitatea fotografiilor și de recuzită.",
        rating: 5,
        date: new Date("2024-01-20"),
      },
      {
        name: "Elena P.",
        content: "Mărturiile personalizate au fost absolut minunate. Invitații noștri încă vorbesc despre cât de speciale au fost!",
        rating: 5,
        date: new Date("2024-03-01"),
      },
    ];

    testimonials.forEach(testimonial => {
      const id = this.currentIds.testimonial++;
      this.testimonials.set(id, { ...testimonial, id, date: testimonial.date || new Date() });
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