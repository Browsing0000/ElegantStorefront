# E-Commerce & 3D Services Platform

A modern full-stack web application that combines e-commerce functionality with prototyping services and 3D printing capabilities. Built with Next.js, React, TypeScript, and MongoDB.

## Features

- **E-Commerce**: Browse products, shopping cart, order management
- **Prototyping Services**: Submit projects, file uploads, team collaboration
- **3D Printing Services**: Upload designs, custom component requests, quotes
- **MongoDB Integration**: Comprehensive schema with Users, Products, Orders, Cart, Categories, Payments, Reviews
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Prerequisites

Before running this project locally, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ecommerce-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=ecommerce_platform

# For MongoDB Atlas (replace with your connection string)
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
# MONGODB_DB_NAME=ecommerce_platform
```

### 4. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/
2. Start MongoDB service:
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://cloud.mongodb.com
2. Create a new cluster
3. Get your connection string from the "Connect" button
4. Replace the `MONGODB_URL` in `.env.local` with your Atlas connection string

### 5. Start the Development Server

```bash
npm run dev
```

This will start:
- **Frontend**: Next.js development server on `http://localhost:3000`
- **Backend**: Express API server on `http://localhost:5000`
- **Database**: MongoDB connection as configured

### 6. Access the Application

Open your browser and navigate to:
- **Main Application**: http://localhost:3000
- **API Endpoints**: http://localhost:5000/api/*

## Project Structure

```
├── app/                    # Next.js app directory
├── client/                 # React client components
│   └── src/
│       ├── components/     # UI components
│       ├── pages/          # Page components
│       └── lib/            # Utilities and query client
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── mongodb.ts         # MongoDB connection
│   └── storage.ts         # Storage interface
├── shared/                 # Shared schemas and types
│   └── schema.ts          # Zod schemas and TypeScript types
├── components/             # Shared React components
└── uploads/               # File upload directory
```

## Available Scripts

```bash
# Development
npm run dev              # Start development servers

# Building
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Drizzle schema
npm run db:push         # Push schema to database
```

## Database Schema

The application uses MongoDB with the following collections:

- **Users**: User accounts and profiles
- **Products**: Product catalog with variants and images
- **Orders**: Order management with items and shipping
- **Cart**: Shopping cart functionality
- **Categories**: Product categories
- **Payments**: Payment tracking
- **Reviews**: Product reviews and ratings
- **Prototyping Projects**: Custom project requests
- **Printing Requests**: 3D printing services

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

### Prototyping
- `GET /api/prototyping` - Get user's projects
- `POST /api/prototyping` - Submit new project

### 3D Printing
- `GET /api/printing` - Get user's requests
- `POST /api/printing` - Submit printing request

## File Upload

The application supports file uploads for:
- Prototyping project files
- 3D printing model files
- Product images (admin)

Files are stored in the `uploads/` directory and served statically.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running (local) or connection string is correct (Atlas)
   - Check firewall settings for MongoDB port (27017)

2. **Port Already in Use**
   - Kill processes using ports 3000 or 5000
   - Or modify ports in `package.json` scripts

3. **Module Not Found**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

4. **Build Errors**
   - Check TypeScript errors: `npm run type-check`
   - Ensure all dependencies are properly installed

### Development Tips

- Use `npm run dev` for development with hot reloading
- Check browser console for frontend errors
- Check terminal for backend API errors
- MongoDB data persists between restarts (unlike in-memory storage)

## Production Deployment

For production deployment:

1. Set production environment variables
2. Build the application: `npm run build`
3. Start production server: `npm start`
4. Ensure MongoDB is accessible from production environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.