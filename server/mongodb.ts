import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import {
  User,
  Product,
  CartItem,
  Order,
  PrototypingProject,
  PrintingRequest,
  InsertUser,
  InsertProduct,
  InsertCartItem,
  InsertOrder,
  InsertPrototypingProject,
  InsertPrintingRequest,
} from '../shared/schema.js';

class MongoDB {
  private client: MongoClient;
  private db: Db;
  private isConnected = false;

  constructor() {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB_NAME || 'ecommerce_platform';
    
    this.client = new MongoClient(mongoUrl);
    this.db = this.client.db(dbName);
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
      console.log('Connected to MongoDB');
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }

  private get users(): Collection<User> {
    return this.db.collection<User>('users');
  }

  private get products(): Collection<Product> {
    return this.db.collection<Product>('products');
  }

  private get cartItems(): Collection<CartItem> {
    return this.db.collection<CartItem>('cartItems');
  }

  private get orders(): Collection<Order> {
    return this.db.collection<Order>('orders');
  }

  private get prototypingProjects(): Collection<PrototypingProject> {
    return this.db.collection<PrototypingProject>('prototypingProjects');
  }

  private get printingRequests(): Collection<PrintingRequest> {
    return this.db.collection<PrintingRequest>('printingRequests');
  }

  // User methods
  async getUser(id: string): Promise<User | null> {
    await this.connect();
    return await this.users.findOne({ _id: id });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    await this.connect();
    return await this.users.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.connect();
    return await this.users.findOne({ email });
  }

  async createUser(user: InsertUser): Promise<User> {
    await this.connect();
    const newUser = {
      ...user,
      _id: new ObjectId().toString(),
      createdAt: new Date(),
    };
    await this.users.insertOne(newUser);
    return newUser;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    await this.connect();
    return await this.products.find({}).toArray();
  }

  async getProduct(id: string): Promise<Product | null> {
    await this.connect();
    return await this.products.findOne({ _id: id });
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    await this.connect();
    return await this.products.find({ category }).toArray();
  }

  async searchProducts(query: string): Promise<Product[]> {
    await this.connect();
    return await this.products.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    await this.connect();
    const newProduct = {
      ...product,
      _id: new ObjectId().toString(),
      createdAt: new Date(),
    };
    await this.products.insertOne(newProduct);
    return newProduct;
  }

  // Cart methods
  async getCartItems(userId: string): Promise<CartItem[]> {
    await this.connect();
    return await this.cartItems.find({ userId }).toArray();
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    await this.connect();
    const newCartItem = {
      ...cartItem,
      _id: new ObjectId().toString(),
      createdAt: new Date(),
    };
    await this.cartItems.insertOne(newCartItem);
    return newCartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | null> {
    await this.connect();
    const result = await this.cartItems.findOneAndUpdate(
      { _id: id },
      { $set: { quantity } },
      { returnDocument: 'after' }
    );
    return result || null;
  }

  async removeFromCart(id: string): Promise<boolean> {
    await this.connect();
    const result = await this.cartItems.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async clearCart(userId: string): Promise<void> {
    await this.connect();
    await this.cartItems.deleteMany({ userId });
  }

  // Order methods
  async getOrders(userId: string): Promise<Order[]> {
    await this.connect();
    return await this.orders.find({ userId }).toArray();
  }

  async getOrder(id: string): Promise<Order | null> {
    await this.connect();
    return await this.orders.findOne({ _id: id });
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    await this.connect();
    const newOrder = {
      ...order,
      _id: new ObjectId().toString(),
      createdAt: new Date(),
    };
    await this.orders.insertOne(newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | null> {
    await this.connect();
    const result = await this.orders.findOneAndUpdate(
      { _id: id },
      { $set: { status } },
      { returnDocument: 'after' }
    );
    return result || null;
  }

  // Prototyping methods
  async getPrototypingProjects(userId: string): Promise<PrototypingProject[]> {
    await this.connect();
    return await this.prototypingProjects.find({ userId }).toArray();
  }

  async getPrototypingProject(id: string): Promise<PrototypingProject | null> {
    await this.connect();
    return await this.prototypingProjects.findOne({ _id: id });
  }

  async createPrototypingProject(project: InsertPrototypingProject): Promise<PrototypingProject> {
    await this.connect();
    const newProject = {
      ...project,
      _id: new ObjectId().toString(),
      createdAt: new Date(),
    };
    await this.prototypingProjects.insertOne(newProject);
    return newProject;
  }

  async updateProjectStatus(id: string, status: string): Promise<PrototypingProject | null> {
    await this.connect();
    const result = await this.prototypingProjects.findOneAndUpdate(
      { _id: id },
      { $set: { status } },
      { returnDocument: 'after' }
    );
    return result || null;
  }

  // 3D Printing methods
  async getPrintingRequests(userId: string): Promise<PrintingRequest[]> {
    await this.connect();
    return await this.printingRequests.find({ userId }).toArray();
  }

  async getPrintingRequest(id: string): Promise<PrintingRequest | null> {
    await this.connect();
    return await this.printingRequests.findOne({ _id: id });
  }

  async createPrintingRequest(request: InsertPrintingRequest): Promise<PrintingRequest> {
    await this.connect();
    const newRequest = {
      ...request,
      _id: new ObjectId().toString(),
      createdAt: new Date(),
    };
    await this.printingRequests.insertOne(newRequest);
    return newRequest;
  }

  async updatePrintingStatus(id: string, status: string): Promise<PrintingRequest | null> {
    await this.connect();
    const result = await this.printingRequests.findOneAndUpdate(
      { _id: id },
      { $set: { status } },
      { returnDocument: 'after' }
    );
    return result || null;
  }

  // Initialize with sample data
  async initializeWithSampleData(): Promise<void> {
    await this.connect();
    
    // Check if products already exist
    const existingProducts = await this.products.countDocuments();
    if (existingProducts > 0) {
      return; // Data already initialized
    }

    // Sample products
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

    // Insert sample products
    for (const product of sampleProducts) {
      await this.createProduct(product);
    }

    console.log('Sample data initialized in MongoDB');
  }
}

export const mongodb = new MongoDB();