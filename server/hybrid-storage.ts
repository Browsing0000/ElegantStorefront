import {
  User, InsertUser,
  Product, InsertProduct,
  CartItem, InsertCartItem,
  Order, InsertOrder,
  PrototypingProject, InsertPrototypingProject,
  PrintingRequest, InsertPrintingRequest
} from "../shared/schema.js";
import { IStorage } from './storage.js';

// In-memory storage implementation for fallback
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private orders: Map<string, Order> = new Map();
  private prototypingProjects: Map<string, PrototypingProject> = new Map();
  private printingRequests: Map<string, PrintingRequest> = new Map();

  constructor() {
    this.initializeProducts();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
        price: "199.99",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        inStock: true,
      },
      {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracking with heart rate monitoring and GPS capabilities.",
        price: "299.99",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        inStock: true,
      },
      {
        name: "Ergonomic Office Chair",
        description: "Comfortable ergonomic chair designed for long working hours with lumbar support.",
        price: "449.99",
        category: "Furniture",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
        inStock: true,
      },
      {
        name: "Professional Camera Lens",
        description: "High-quality camera lens for professional photography with excellent clarity.",
        price: "799.99",
        category: "Photography",
        imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop",
        inStock: true,
      },
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      _id: this.generateId(),
      createdAt: new Date()
    };
    this.users.set(user._id!, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = {
      ...insertProduct,
      _id: this.generateId(),
      createdAt: new Date()
    };
    this.products.set(product._id!, product);
    return product;
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const cartItem: CartItem = {
      ...insertCartItem,
      _id: this.generateId(),
      createdAt: new Date()
    };
    this.cartItems.set(cartItem._id!, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<void> {
    const userItems = Array.from(this.cartItems.entries()).filter(([_, item]) => item.userId === userId);
    userItems.forEach(([id]) => this.cartItems.delete(id));
  }

  async getOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = {
      ...insertOrder,
      _id: this.generateId(),
      createdAt: new Date()
    };
    this.orders.set(order._id!, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
      return order;
    }
    return undefined;
  }

  async getPrototypingProjects(userId: string): Promise<PrototypingProject[]> {
    return Array.from(this.prototypingProjects.values()).filter(project => project.userId === userId);
  }

  async getPrototypingProject(id: string): Promise<PrototypingProject | undefined> {
    return this.prototypingProjects.get(id);
  }

  async createPrototypingProject(insertProject: InsertPrototypingProject): Promise<PrototypingProject> {
    const project: PrototypingProject = {
      ...insertProject,
      _id: this.generateId(),
      createdAt: new Date()
    };
    this.prototypingProjects.set(project._id!, project);
    return project;
  }

  async updateProjectStatus(id: string, status: string): Promise<PrototypingProject | undefined> {
    const project = this.prototypingProjects.get(id);
    if (project) {
      project.status = status;
      this.prototypingProjects.set(id, project);
      return project;
    }
    return undefined;
  }

  async getPrintingRequests(userId: string): Promise<PrintingRequest[]> {
    return Array.from(this.printingRequests.values()).filter(request => request.userId === userId);
  }

  async getPrintingRequest(id: string): Promise<PrintingRequest | undefined> {
    return this.printingRequests.get(id);
  }

  async createPrintingRequest(insertRequest: InsertPrintingRequest): Promise<PrintingRequest> {
    const request: PrintingRequest = {
      ...insertRequest,
      _id: this.generateId(),
      createdAt: new Date()
    };
    this.printingRequests.set(request._id!, request);
    return request;
  }

  async updatePrintingStatus(id: string, status: string): Promise<PrintingRequest | undefined> {
    const request = this.printingRequests.get(id);
    if (request) {
      request.status = status;
      this.printingRequests.set(id, request);
      return request;
    }
    return undefined;
  }
}