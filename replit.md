# CODEWITHKAYLA Portfolio Website

## Overview

A modern, responsive portfolio website built for showcasing web development projects. The application features a public-facing portfolio with smooth animations and an admin panel for content management. Built with React, Express, TypeScript, and PostgreSQL using the Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- **React 18** with TypeScript for type-safe component development
- **Vite** for fast development and optimized production builds
- **Wouter** for lightweight client-side routing (no React Router)
- **TanStack Query** for server state management and data fetching

**UI & Styling**
- **Tailwind CSS** with custom configuration for utility-first styling
- **shadcn/ui** components (New York style) with Radix UI primitives
- **Framer Motion** for smooth animations and transitions
- **Custom Design System**: Blue and white color scheme with Space Grotesk (headings) and Inter (body) fonts
- **Responsive Design**: Mobile-first approach with desktop optimizations

**Component Structure**
- **Public Pages**: Home (with Hero, Portfolio, About, Contact sections)
- **Admin Pages**: Login and Dashboard with project/profile management
- **UI Components**: Fully-featured shadcn component library in `client/src/components/ui/`
- **Path Aliases**: `@/` for client src, `@shared/` for shared types, `@assets/` for attached assets

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for RESTful API endpoints
- **Session Management**: express-session with connect-pg-simple for PostgreSQL-backed sessions
- **Authentication**: bcrypt.js for password hashing, session-based auth for admin access

**API Design**
- RESTful endpoints under `/api/*` namespace
- Authentication middleware (`requireAuth`) protects admin routes
- Endpoints for projects (CRUD), profile (read/update), contact form, and auth

**File Upload Strategy**
- **Multer** for handling multipart/form-data uploads
- Images stored in `uploads/` directory on server filesystem
- File validation: Images only (jpeg, jpg, png, gif, webp), 10MB limit
- Unique filenames generated using timestamp + random suffix

### Data Storage

**Database**
- **PostgreSQL** via Supabase (using connection pooler for serverless compatibility)
- **Drizzle ORM** for type-safe database queries and schema management
- Connection via `DATABASE_URL` environment variable (Supabase pooler URL)

**Schema Design** (in `shared/schema.ts`)
- **admin_users**: Admin authentication (id, username, hashed password)
- **projects**: Portfolio projects (id, title, description, imageUrl, deviceType, tags array, orderIndex)
- **profile**: Single-row profile configuration (bio paragraphs, skills array, contact email, profile image)

**Development Storage Fallback**
- In-memory storage implementation (`MemStorage` class) for development without database
- Implements same `IStorage` interface as database storage for seamless switching

### External Dependencies

**Third-Party Services**
- **Google Gmail API**: For sending contact form submissions via Gmail
- **Replit Connectors**: OAuth-based Gmail integration using Replit's connector system
- Access token management with automatic refresh logic

**Google Fonts**
- Space Grotesk (300, 400, 500, 600, 700) for display/headings
- Inter (100-900) for body text and UI elements

**Build & Development Tools**
- **esbuild**: Server-side code bundling for production
- **tsx**: TypeScript execution for development server
- **drizzle-kit**: Database migrations and schema management
- **PostCSS & Autoprefixer**: CSS processing pipeline

**Replit-Specific Plugins** (development only)
- `@replit/vite-plugin-runtime-error-modal`: Error overlay
- `@replit/vite-plugin-cartographer`: Code navigation
- `@replit/vite-plugin-dev-banner`: Development banner

### Authentication & Authorization

**Admin Access Pattern**
- Password-protected admin panel at `/admin/login`
- Session-based authentication stored in PostgreSQL
- Protected routes check `req.session.userId` via middleware
- Single admin user model (username + bcrypt hashed password)

### Contact Form Integration

**Email Delivery**
- Contact form submissions sent to admin's Gmail account
- Gmail integration uses Replit Connectors (not direct SMTP)
- OAuth access tokens managed server-side with expiration handling
- Text-only submissions (no file uploads permitted)