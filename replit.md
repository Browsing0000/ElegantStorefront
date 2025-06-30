# E-Commerce & 3D Services Platform

## Overview

This is a modern full-stack web application that combines e-commerce functionality with prototyping services and 3D printing capabilities. The platform allows users to browse and purchase products, submit prototyping projects, and request 3D printing services through an integrated interface.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with React 18 and TypeScript
- **Build Tool**: Next.js with built-in optimization and hot module replacement
- **Routing**: Next.js App Router with file-based routing
- **UI Components**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **File Uploads**: Multer middleware for handling file uploads
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions
- **Development**: Hot module replacement via Vite integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database serverless connection
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for database schema management
- **File Storage**: Local file system with Multer (uploads directory)

## Key Components

### Database Schema
The application uses the following main entities:
- **Users**: Authentication and user profile management
- **Products**: E-commerce product catalog with categories and pricing
- **Cart Items**: Shopping cart functionality with user association
- **Orders**: Order processing with JSON-based item storage
- **Prototyping Projects**: Custom project requests with file attachments
- **Printing Requests**: 3D printing service requests with specifications

### API Structure
- **Product Management**: CRUD operations for product catalog
- **Shopping Cart**: Add, update, remove, and clear cart operations
- **Order Processing**: Order creation and status management
- **File Upload**: Multi-format file upload with validation
- **Project Submission**: Prototyping and 3D printing request handling

### UI Components
- **Tabbed Interface**: Clean separation between e-commerce, prototyping, and 3D printing services
- **Product Grid**: Responsive product display with search and filtering
- **File Upload**: Drag-and-drop file upload with validation and preview
- **Form Components**: Reusable form elements with validation feedback
- **Toast Notifications**: User feedback for actions and errors

## Data Flow

1. **Client Requests**: React components make API calls through TanStack Query
2. **API Processing**: Express routes handle requests and interact with the database
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Handling**: Structured JSON responses with error handling
5. **UI Updates**: React Query automatically updates UI based on server state changes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation
- **multer**: File upload handling

### UI Dependencies
- **@radix-ui/***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Consistent icon library

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type safety and development experience
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development
- **Dev Server**: Next.js development server with HMR on port 3000
- **API Server**: Express server with TypeScript compilation via tsx on port 5000
- **Database**: Direct connection to Neon Database
- **API Proxy**: Next.js rewrites API calls to Express server

### Production Build
1. **Frontend**: Next.js builds optimized static assets and server-side components
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command
4. **Serving**: Next.js serves frontend, Express serves API routes

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **File Storage**: Local filesystem with uploads directory

The application is designed for easy deployment on platforms like Replit, with automatic static file serving and integrated development tools.

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
- June 30, 2025. Migrated from Vite to Next.js 15 while maintaining same UI theme and functionality
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```