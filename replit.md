# AI Video Generator

## Overview

This is an AI-powered video generation platform that creates videos with consistent characters using Stable Video Diffusion. Users can upload character images, write scripts, and generate professional videos through a web interface. The application uses free Hugging Face inference endpoints to make AI video generation accessible without cost barriers.

## Recent Changes

### September 25, 2025 - Initial Replit Environment Setup
- Successfully configured TypeScript environment with proper types and aliases
- Set up Vite configuration to bind to 0.0.0.0:5000 with allowedHosts: true for Replit proxy support  
- Configured PostgreSQL database with Drizzle ORM and pushed schema successfully
- Created development workflow running Express server with Vite HMR on port 5000
- Verified API endpoints are working (Express serving React app with API at /api/*)
- Configured deployment settings for production (autoscale with npm build/start)
- Application now ready for development and testing in Replit environment

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: TailwindCSS with shadcn/ui components for consistent design system
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side navigation
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Dual Backend Support**: Designed to work with both Express.js (development) and FastAPI (production)
- **Express Backend**: Node.js/TypeScript backend with `/api` prefixed routes for development
- **FastAPI Backend**: Python backend optimized for deployment on Hugging Face Spaces
- **File Handling**: Multer for multipart file uploads with local storage
- **Background Processing**: Async video generation with status tracking
- **API Design**: RESTful endpoints with automatic OpenAPI documentation

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Structured tables for users, video generations with status tracking
- **Development Storage**: In-memory storage for rapid development iteration
- **File Storage**: Local file system for uploaded images and generated videos

### Authentication & Security
- **CORS Configuration**: Flexible CORS setup for different deployment scenarios
- **File Validation**: Image upload validation with size limits (10MB)
- **Environment Variables**: Secure configuration management for API keys

## External Dependencies

### AI Services
- **Hugging Face API**: Primary integration for Stable Video Diffusion model inference
- **Model**: `stabilityai/stable-video-diffusion-img2vid-xt` for character-consistent video generation
- **Authentication**: Requires `HUGGING_FACE_TOKEN` or `HF_TOKEN` environment variable

### Cloud Deployment
- **Frontend Deployment**: Vercel for React application hosting
- **Backend Deployment**: Hugging Face Spaces for FastAPI backend
- **Database**: Neon Database (PostgreSQL) for production data storage
- **CDN**: Vercel's edge network for static asset delivery

### Development Tools
- **Database Migration**: Drizzle Kit for schema management
- **Type Generation**: Drizzle ORM for automatic TypeScript types
- **Development Server**: Vite dev server with HMR and Express proxy
- **Build Process**: Vite for frontend, esbuild for backend compilation

### UI Components
- **Design System**: Radix UI primitives with shadcn/ui styling
- **Icons**: Font Awesome for consistent iconography
- **Fonts**: Google Fonts integration for typography
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints