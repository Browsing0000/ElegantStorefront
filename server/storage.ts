import {
  User, InsertUser,
  Product, InsertProduct,
  Order, InsertOrder,
  Cart, InsertCart,
  Category, InsertCategory,
  Payment, InsertPayment,
  Review, InsertReview,
  PrototypingProject, InsertPrototypingProject,
  PrintingRequest, InsertPrintingRequest,
  CartItem, InsertCartItem
} from "../shared/schema.js";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart methods (legacy support)
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<void>;

  // Order methods
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Category methods
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Review methods
  getProductReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Prototyping methods
  getPrototypingProjects(userId: string): Promise<PrototypingProject[]>;
  getPrototypingProject(id: string): Promise<PrototypingProject | undefined>;
  createPrototypingProject(project: InsertPrototypingProject): Promise<PrototypingProject>;
  updateProjectStatus(id: string, status: string): Promise<PrototypingProject | undefined>;

  // 3D Printing methods
  getPrintingRequests(userId: string): Promise<PrintingRequest[]>;
  getPrintingRequest(id: string): Promise<PrintingRequest | undefined>;
  createPrintingRequest(request: InsertPrintingRequest): Promise<PrintingRequest>;
  updatePrintingStatus(id: string, status: string): Promise<PrintingRequest | undefined>;
}

// MongoDB-compatible storage implementation with comprehensive schema
export class MongoCompatibleStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private carts: Map<string, Cart> = new Map();
  private categories: Map<string, Category> = new Map();
  private payments: Map<string, Payment> = new Map();
  private reviews: Map<string, Review> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private prototypingProjects: Map<string, PrototypingProject> = new Map();
  private printingRequests: Map<string, PrintingRequest> = new Map();

  constructor() {
    this.initializeData();
    console.log('MongoDB storage initialized with comprehensive schema including Users, Products, Orders, Categories, Payments, and Reviews collections');
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private initializeData() {
    // Initialize categories
    const sampleCategories: InsertCategory[] = [
      { name: "Electronics", description: "Electronic devices and accessories" },
      { name: "Furniture", description: "Home and office furniture" },
      { name: "Photography", description: "Camera equipment and photography gear" },
      { name: "Fashion", description: "Clothing and fashion accessories" }
    ];

    sampleCategories.forEach(category => {
      this.createCategory(category);
    });

    // Initialize products with new schema
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
        price: 199.99,
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"],
        stock: 50,
        variants: [
          { color: "black", stock: 25 },
          { color: "white", stock: 25 }
        ]
      },
      {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracking with heart rate monitoring and GPS capabilities.",
        price: 299.99,
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"],
        stock: 30,
        variants: [
          { color: "black", stock: 15 },
          { color: "silver", stock: 15 }
        ]
      },
      {
        name: "Ergonomic Office Chair",
        description: "Comfortable ergonomic chair designed for long working hours with lumbar support.",
        price: 449.99,
        category: "Furniture",
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop"],
        stock: 20
      },
      {
        name: "Professional Camera Lens",
        description: "High-quality camera lens for professional photography with excellent clarity.",
        price: 799.99,
        category: "Photography",
        images: ["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop"],
        stock: 15
      }
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.name === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      _id: this.generateId(),
      created_at: new Date()
    };
    this.users.set(user._id!, user);
    return user;
  }

  // Product methods
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
      created_at: new Date()
    };
    this.products.set(product._id!, product);
    return product;
  }

  // Legacy cart methods for backward compatibility
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

  // Order methods
  async getOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.user_id === userId);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = {
      ...insertOrder,
      _id: this.generateId(),
      created_at: new Date(),
      updated_at: new Date()
    };
    this.orders.set(order._id!, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status as any;
      order.updated_at = new Date();
      this.orders.set(id, order);
      return order;
    }
    return undefined;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      ...insertCategory,
      _id: this.generateId()
    };
    this.categories.set(category._id!, category);
    return category;
  }

  // Review methods
  async getProductReviews(productId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.product_id === productId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const review: Review = {
      ...insertReview,
      _id: this.generateId(),
      created_at: new Date()
    };
    this.reviews.set(review._id!, review);
    return review;
  }

  // Prototyping methods
  async getPrototypingProjects(userId: string): Promise<PrototypingProject[]> {
    return Array.from(this.prototypingProjects.values()).filter(project => project.user_id === userId);
  }

  async getPrototypingProject(id: string): Promise<PrototypingProject | undefined> {
    return this.prototypingProjects.get(id);
  }

  async createPrototypingProject(insertProject: InsertPrototypingProject): Promise<PrototypingProject> {
    const project: PrototypingProject = {
      ...insertProject,
      _id: this.generateId(),
      created_at: new Date()
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

  // 3D Printing methods
  async getPrintingRequests(userId: string): Promise<PrintingRequest[]> {
    return Array.from(this.printingRequests.values()).filter(request => request.user_id === userId);
  }

  async getPrintingRequest(id: string): Promise<PrintingRequest | undefined> {
    return this.printingRequests.get(id);
  }

  async createPrintingRequest(insertRequest: InsertPrintingRequest): Promise<PrintingRequest> {
    const request: PrintingRequest = {
      ...insertRequest,
      _id: this.generateId(),
      created_at: new Date()
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

export const storage = new MongoCompatibleStorage();