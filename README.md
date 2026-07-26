# YAANA Transit

**Driven by Trust** — Enterprise-grade corporate transportation platform serving businesses across India.

YAANA Transit is a B2B corporate car rental and employee transportation management platform. Built for companies that need reliable, GST-compliant, chauffeur-driven fleet services across 50+ cities in India.

---

## Platform Overview

YAANA Transit is composed of three independently deployable applications within a single managed monorepo:

| Application              | Description                                  | Stack                       |
| ------------------------ | -------------------------------------------- | --------------------------- |
| **Web** (`apps/web`)     | Corporate-facing website and client portal   | Next.js 15, Tailwind CSS v4 |
| **Admin** (`apps/admin`) | Internal operations and management dashboard | React, Vite, TanStack Table |
| **API** (`apps/api`)     | RESTful backend serving both applications    | Node.js, Express, Prisma v7 |

---

## Monorepo Architecture

This project uses **Turborepo** — a high-performance build system for JavaScript/TypeScript monorepos — with **pnpm workspaces** for dependency management.

```
yaana-transit/
├── apps/
│   ├── web/          → Customer-facing website (Next.js)
│   ├── admin/        → Internal admin panel (React + Vite)
│   └── api/          → REST API backend (Node.js + Express)
├── packages/
│   ├── ui/           → Shared component library
│   └── types/        → Shared TypeScript interfaces
├── turbo.json        → Turborepo task pipeline
└── pnpm-workspace.yaml
```

**Why Turborepo?**

- Parallel task execution across all apps simultaneously
- Intelligent caching — unchanged apps are never rebuilt
- Single command to run, build, or lint the entire platform
- Shared packages ensure type consistency across all three apps

---

## Key Features

### Corporate Client Management

- Multi-company B2B architecture — each corporate client is a separate entity
- Company-scoped data access — clients see only their own bookings and invoices
- Contract management with credit limits and payment terms
- GSTIN-linked billing for seamless tax compliance

### Fleet Management

- Six vehicle categories: Sedan, MUV, SUV, Premium SUV, Premium, Luxury
- Real-time availability tracking across all cities
- Chauffeur assignment workflow managed by operations team
- Fleet image management via cloud CDN

### Booking & Operations

- End-to-end booking lifecycle: Pending → Confirmed → Assigned → Active → Completed
- Manual chauffeur assignment by admin (name + contact)
- Multi-city operations: Bengaluru, Delhi, Mumbai, Pune, Hyderabad, Chennai
- Airport transfers, outstation trips, Employee Transportation Services (ETS), events

### Invoicing & Compliance

- GST-compliant invoice generation (SAC code: 996411)
- CGST, SGST, and IGST breakdown per invoice
- Sequential invoice numbering (YAANA/YYYY-YY/001)
- Excel report exports for GST filing and revenue analysis

### Security & Access Control

- Role-based access control (RBAC): Admin and Customer roles
- OTP-based authentication via MSG91 (no passwords)
- JWT access tokens (15 min) + rotating httpOnly refresh tokens (30 days)
- All financial data stored in paise to avoid floating-point errors

---

## Technology Stack

### Frontend — Web & Admin

- **Next.js 15** — App Router, SSR/SSG, SEO-optimised pages
- **React 19 + Vite** — Admin panel SPA
- **TypeScript** — End-to-end type safety
- **Tailwind CSS v4** — CSS-first configuration, no config file required
- **Framer Motion** — Page transitions and scroll animations
- **TanStack Table** — Sortable, filterable data grids
- **Recharts** — Revenue and analytics charts

### Backend

- **Node.js + Express** — REST API server
- **Prisma v7** — Type-safe ORM with PostgreSQL adapter
- **PostgreSQL** — Primary relational database
- **Redis** — Rate limiting and session caching
- **Zod** — Runtime request validation and schema enforcement

### Infrastructure

- **Vercel** — Web and Admin deployment
- **Railway** — API server and PostgreSQL hosting
- **Docker** — Local development environment (Postgres + Redis)
- **MSG91** — OTP delivery via SMS (Indian provider)
- **Cloudinary** — Vehicle and asset image CDN

---

## Local Development

### Prerequisites

- Node.js 18 or higher
- pnpm 9 or higher
- Docker Desktop

### Setup

```bash
# Install all dependencies across all apps
pnpm install

# Start Docker containers (PostgreSQL + Redis)
docker compose up -d

# Run database migrations
cd apps/api && pnpm db:migrate

# Start all apps simultaneously (from monorepo root)
pnpm dev
```

### Running Apps

| App                   | URL                            |
| --------------------- | ------------------------------ |
| Web — customer portal | http://localhost:3000          |
| Admin panel           | http://localhost:5173          |
| API server            | http://localhost:4000          |
| API health check      | http://localhost:4000/health   |
| Prisma Studio — DB UI | `pnpm db:studio` from apps/api |

---

## Environment Configuration

Each app requires its own `.env` file. A fully documented `.env.example` is provided in `apps/api/`. Key variables include database connection string, JWT secrets, MSG91 API credentials, Razorpay payment keys, and Cloudinary configuration.

Never commit `.env` files to version control.

---

## Office Locations

**Head Office** — Bengaluru, Karnataka

**Branch Offices** — Delhi · Mumbai · Pune · Hyderabad · Chennai

---

© YAANA Transit. All rights reserved. Confidential and proprietary.
