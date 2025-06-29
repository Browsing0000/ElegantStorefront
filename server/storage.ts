import { 
  users, products, cartItems, orders, prototypingProjects, printingRequests,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type CartItem, type InsertCartItem,
  type Order, type InsertOrder,
  type PrototypingProject, type InsertPrototypingProject,
  type PrintingRequest, type InsertPrintingRequest
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<void>;

  // Order methods
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Prototyping methods
  getPrototypingProjects(userId: number): Promise<PrototypingProject[]>;
  getPrototypingProject(id: number): Promise<PrototypingProject | undefined>;
  createPrototypingProject(project: InsertPrototypingProject): Promise<PrototypingProject>;
  updateProjectStatus(id: number, status: string): Promise<PrototypingProject | undefined>;

  // 3D Printing methods
  getPrintingRequests(userId: number): Promise<PrintingRequest[]>;
  getPrintingRequest(id: number): Promise<PrintingRequest | undefined>;
  createPrintingRequest(request: InsertPrintingRequest): Promise<PrintingRequest>;
  updatePrintingStatus(id: number, status: string): Promise<PrintingRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private prototypingProjects: Map<number, PrototypingProject>;
  private printingRequests: Map<number, PrintingRequest>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentProjectId: number;
  private currentPrintingId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.prototypingProjects = new Map();
    this.printingRequests = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentProjectId = 1;
    this.currentPrintingId = 1;

    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality sound with noise cancellation",
        price: "299.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Classic White Sneakers",
        description: "Comfortable and versatile for everyday wear",
        price: "89.00",
        category: "Fashion",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Smart Fitness Watch",
        description: "Track your health and fitness goals",
        price: "249.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Professional Camera",
        description: "Capture stunning photos and videos",
        price: "899.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Modern Laptop",
        description: "High-performance for work and gaming",
        price: "1299.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Designer Sunglasses",
        description: "UV protection with premium style",
        price: "159.00",
        category: "Fashion",
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Bluetooth Speaker",
        description: "Portable audio with rich sound quality",
        price: "79.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Gaming Keyboard",
        description: "Mechanical switches for precision gaming",
        price: "149.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      }
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
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
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const cartItem: CartItem = {
      ...insertCartItem,
      id,
      createdAt: new Date()
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<void> {
    const userItems = Array.from(this.cartItems.entries()).filter(([_, item]) => item.userId === userId);
    userItems.forEach(([id]) => this.cartItems.delete(id));
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
      return order;
    }
    return undefined;
  }

  // Prototyping methods
  async getPrototypingProjects(userId: number): Promise<PrototypingProject[]> {
    return Array.from(this.prototypingProjects.values()).filter(project => project.userId === userId);
  }

  async getPrototypingProject(id: number): Promise<PrototypingProject | undefined> {
    return this.prototypingProjects.get(id);
  }

  async createPrototypingProject(insertProject: InsertPrototypingProject): Promise<PrototypingProject> {
    const id = this.currentProjectId++;
    const project: PrototypingProject = {
      ...insertProject,
      id,
      createdAt: new Date()
    };
    this.prototypingProjects.set(id, project);
    return project;
  }

  async updateProjectStatus(id: number, status: string): Promise<PrototypingProject | undefined> {
    const project = this.prototypingProjects.get(id);
    if (project) {
      project.status = status;
      this.prototypingProjects.set(id, project);
      return project;
    }
    return undefined;
  }

  // 3D Printing methods
  async getPrintingRequests(userId: number): Promise<PrintingRequest[]> {
    return Array.from(this.printingRequests.values()).filter(request => request.userId === userId);
  }

  async getPrintingRequest(id: number): Promise<PrintingRequest | undefined> {
    return this.printingRequests.get(id);
  }

  async createPrintingRequest(insertRequest: InsertPrintingRequest): Promise<PrintingRequest> {
    const id = this.currentPrintingId++;
    const request: PrintingRequest = {
      ...insertRequest,
      id,
      createdAt: new Date()
    };
    this.printingRequests.set(id, request);
    return request;
  }

  async updatePrintingStatus(id: number, status: string): Promise<PrintingRequest | undefined> {
    const request = this.printingRequests.get(id);
    if (request) {
      request.status = status;
      this.printingRequests.set(id, request);
      return request;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
