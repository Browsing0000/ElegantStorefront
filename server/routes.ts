import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCartItemSchema, insertOrderSchema, insertPrototypingProjectSchema, insertPrintingRequestSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\.(stl|obj|3mf|ply|pdf|doc|docx|xls|xlsx|jpg|jpeg|png)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search } = req.query;
      let products;

      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (category && category !== "All Categories") {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getProducts();
      }

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart routes (using session for simplicity - in production would use proper auth)
  app.get("/api/cart", async (req, res) => {
    try {
      // For demo purposes, using userId = 1
      const cartItems = await storage.getCartItems(1);
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        })
      );
      res.json(itemsWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        userId: 1 // Demo user ID
      });
      
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      const updatedItem = await storage.updateCartItem(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders(1); // Demo user ID
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId: 1 // Demo user ID
      });
      
      const order = await storage.createOrder(validatedData);
      
      // Clear cart after successful order
      await storage.clearCart(1);
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  // Prototyping routes
  app.get("/api/prototyping", async (req, res) => {
    try {
      const projects = await storage.getPrototypingProjects(1); // Demo user ID
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prototyping projects" });
    }
  });

  app.post("/api/prototyping", upload.array("files", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const fileInfo = files?.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      })) || [];

      const validatedData = insertPrototypingProjectSchema.parse({
        ...req.body,
        userId: 1, // Demo user ID
        files: fileInfo
      });
      
      const project = await storage.createPrototypingProject(validatedData);
      res.json(project);
    } catch (error) {
      console.error("Prototyping submission error:", error);
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  // 3D Printing routes
  app.get("/api/printing", async (req, res) => {
    try {
      const requests = await storage.getPrintingRequests(1); // Demo user ID
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch printing requests" });
    }
  });

  app.post("/api/printing/quote", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { material, quality, infillDensity, color } = req.body;
      
      // Calculate quote (simplified calculation)
      const materialCosts = {
        PLA: 0.05,
        ABS: 0.07,
        PETG: 0.08,
        Metal: 2.50
      };
      
      const qualityMultipliers = {
        draft: 0.8,
        standard: 1.0,
        fine: 1.5
      };
      
      const baseWeight = 125; // grams - would normally be calculated from file
      const materialCost = baseWeight * materialCosts[material as keyof typeof materialCosts];
      const qualityMultiplier = qualityMultipliers[quality as keyof typeof qualityMultipliers];
      const laborCost = 8.00;
      const processingFee = 5.00;
      
      const total = (materialCost * qualityMultiplier) + laborCost + processingFee;
      
      const quote = {
        materialCost: materialCost.toFixed(2),
        printTime: "4h 32m",
        laborCost: laborCost.toFixed(2),
        processingFee: processingFee.toFixed(2),
        total: total.toFixed(2),
        weight: `${baseWeight}g`,
        deliveryTime: "3-5 days",
        selectedMaterial: material,
        fileInfo: {
          originalName: file.originalname,
          filename: file.filename,
          size: file.size
        }
      };
      
      res.json(quote);
    } catch (error) {
      console.error("Quote calculation error:", error);
      res.status(500).json({ message: "Failed to calculate quote" });
    }
  });

  app.post("/api/printing", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const validatedData = insertPrintingRequestSchema.parse({
        ...req.body,
        userId: 1, // Demo user ID
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`
      });
      
      const request = await storage.createPrintingRequest(validatedData);
      res.json(request);
    } catch (error) {
      console.error("Printing request error:", error);
      res.status(400).json({ message: "Invalid printing request data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
