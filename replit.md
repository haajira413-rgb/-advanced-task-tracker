# TaskTracker - Advanced Productivity PWA

## Overview

TaskTracker is a Progressive Web App (PWA) designed to provide a comprehensive task management solution with advanced features including gamification, analytics, Pomodoro focus sessions, and Kanban boards. The application follows a modern, function-first design philosophy inspired by Linear's clean efficiency and Notion's flexible organization, built with Material Design 3 principles.

The app is structured as a full-stack TypeScript application with a React frontend and Express backend, utilizing PostgreSQL for data persistence through Drizzle ORM. It's designed to work offline-first, be installable on mobile devices, and provide a native-like experience across all platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and caching

**UI Component System:**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Material Design 3 design language with "New York" style variant
- Custom theme system supporting light/dark modes via context provider
- Responsive breakpoints: mobile (< 768px), tablet, desktop (max 1400px)

**State Management Pattern:**
- Server state: TanStack Query with infinite stale time and disabled refetching
- Local UI state: React hooks and context
- Theme state: localStorage-persisted context provider
- Form state: React Hook Form with Zod validation (via @hookform/resolvers)

**PWA Features:**
- Service Worker capabilities for offline support
- Web App Manifest configured for home screen installation
- Supports push notifications, camera access, and geolocation
- Full-screen standalone display mode

### Backend Architecture

**API Layer:**
- Express.js REST API with TypeScript
- Middleware chain: JSON body parsing with raw body preservation, request logging
- Route organization: Centralized route registration in `server/routes.ts`
- Response handling: Consistent JSON responses with error standardization

**Storage Abstraction:**
- Interface-based storage layer (`IStorage`) for database operations
- Supports in-memory implementation for development/testing
- Designed for easy swapping between storage backends

**Data Models:**
The application manages six primary entities:
- **Users:** Profile, XP/leveling system, streak tracking
- **Tasks:** Full task management with priority, status, categories, tags, subtasks, recurrence patterns
- **Projects:** Task grouping with color coding and icons
- **Achievements:** Gamification badges with XP rewards
- **FocusSessions:** Pomodoro timer session tracking
- **Categories:** Custom task categorization with color schemes

**API Endpoints Structure:**
- User management: `/api/user/:id` (GET, PATCH)
- Task operations: `/api/tasks` with query filtering by status/priority
- Project CRUD: `/api/projects`
- Analytics: `/api/analytics/stats`, `/api/analytics/category-stats`, `/api/analytics/heatmap`
- Focus sessions: `/api/focus-sessions`
- Achievements: `/api/achievements`

### Data Storage Solutions

**Primary Database:**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries
- Schema-first approach with migrations in `/migrations` directory
- Database configuration via `DATABASE_URL` environment variable

**Schema Design:**
- UUID primary keys with `gen_random_uuid()` default
- Timestamp tracking: `createdAt`, `completedAt`, `lastActivityDate`
- JSONB columns for flexible data (tags, recurrence patterns)
- Foreign key relationships: tasks → users, tasks → parent tasks, projects → users

**Data Validation:**
- Zod schemas generated from Drizzle schema via `drizzle-zod`
- Insert schemas for all entities exported from shared schema
- Client and server share validation logic through `@shared` alias

### Authentication & Authorization

**Current Implementation:**
- Default user approach (`"default-user"`) for single-user scenarios
- Session management infrastructure in place via `connect-pg-simple`
- Prepared for multi-user expansion with user ID filtering on all queries

**Security Considerations:**
- Request credentials included in fetch calls
- 401 handling in query client with configurable behavior
- Raw body preservation for webhook signature verification

## External Dependencies

### Third-Party UI Libraries
- **Radix UI:** Headless component primitives (22+ components including Dialog, Dropdown, Popover, Tabs, Toast)
- **Lucide React:** Icon library for consistent iconography
- **cmdk:** Command palette component for keyboard-driven navigation
- **Embla Carousel:** Touch-friendly carousel component
- **Recharts:** Charting library for analytics visualizations
- **date-fns:** Date manipulation and formatting

### Development Tools
- **Drizzle Kit:** Database migration management and schema pushing
- **ESBuild:** Server-side bundling for production builds
- **PostCSS & Autoprefixer:** CSS processing pipeline
- **Replit Plugins:** Development banner, error overlay, cartographer for Replit environment

### Data & Utilities
- **class-variance-authority:** Type-safe component variant management
- **clsx & tailwind-merge:** Conditional className composition
- **nanoid:** Unique ID generation
- **zod:** Runtime type validation

### Build & Runtime
- **TypeScript:** Full type coverage across client, server, and shared code
- **Node.js:** ES Modules with top-level await support
- **Vite:** Development server with HMR and production bundling
- **Express:** HTTP server with custom middleware chain

### Fonts
- **Inter:** Primary UI font family (weights 300-700)
- **JetBrains Mono:** Monospace font for timers and statistics (weights 400-600)
- Loaded via Google Fonts CDN with preconnect optimization