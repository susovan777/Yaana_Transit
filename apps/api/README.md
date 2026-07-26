# YAANA Transit — API (`apps/api`)

RESTful backend API serving both the customer web portal and the admin panel. Built with Node.js, Express, and Prisma v7 on PostgreSQL.

---

## Overview

The API is the single source of truth for all YAANA Transit data. It handles authentication, fleet management, booking lifecycle, invoice generation, and reporting. Both the web (`apps/web`) and admin (`apps/admin`) applications communicate exclusively through this API.

---

## Tech Stack

| Tool         | Version | Role                             |
| ------------ | ------- | -------------------------------- |
| Node.js      | 18+     | Runtime                          |
| Express      | 4       | HTTP server and routing          |
| TypeScript   | 5       | Type safety                      |
| Prisma       | v7      | ORM — type-safe database queries |
| PostgreSQL   | 16      | Primary database                 |
| Redis        | 7       | Rate limiting, session caching   |
| Zod          | 3       | Request validation               |
| jsonwebtoken | 9       | JWT access tokens                |
| bcryptjs     | 2       | Token hashing                    |
| MSG91        | —       | OTP delivery via SMS (India)     |
| Helmet       | 8       | HTTP security headers            |
| Morgan       | 1       | Request logging                  |

---

## Project Structure

```
apps/api/
├── prisma/
│   ├── schema.prisma       → Database schema (single source of truth)
│   ├── migrations/         → Auto-generated migration history
│   └── seed.ts             → Seed script for initial data
├── src/
│   ├── app.ts              → Express app entry point
│   ├── lib/
│   │   └── prisma.ts       → Singleton Prisma client
│   ├── middleware/
│   │   ├── auth.ts         → JWT protect + requireAdmin guards
│   │   ├── cors.ts         → CORS origin whitelist
│   │   ├── errorHandler.ts → AppError class + global error handler
│   │   ├── rateLimiter.ts  → Global + auth-specific rate limits
│   │   └── validate.ts     → Zod request body validation
│   ├── routes/
│   │   ├── auth.ts         → OTP login, token refresh, logout, /me
│   │   ├── cars.ts         → Fleet listing and detail
│   │   ├── companies.ts    → Corporate client management
│   │   ├── bookings.ts     → Booking CRUD and status workflow
│   │   ├── invoices.ts     → Invoice generation and PDF download
│   │   └── reports.ts      → GST and revenue Excel exports
│   └── services/
│       ├── msg91.ts        → MSG91 OTP send/resend
│       └── token.ts        → JWT sign/verify + refresh token helpers
└── .env.example            → Documented environment variable reference
```

---

## API Endpoints

### Authentication

| Method | Endpoint               | Access        | Description                     |
| ------ | ---------------------- | ------------- | ------------------------------- |
| POST   | `/api/auth/send-otp`   | Public        | Send OTP to mobile number       |
| POST   | `/api/auth/verify-otp` | Public        | Verify OTP and issue tokens     |
| POST   | `/api/auth/refresh`    | Public        | Refresh access token via cookie |
| POST   | `/api/auth/logout`     | Authenticated | Invalidate session              |
| GET    | `/api/auth/me`         | Authenticated | Get current user profile        |

### Fleet

| Method | Endpoint          | Access | Description                               |
| ------ | ----------------- | ------ | ----------------------------------------- |
| GET    | `/api/cars`       | Public | List vehicles with filters and pagination |
| GET    | `/api/cars/:slug` | Public | Single vehicle detail                     |
| POST   | `/api/cars`       | Admin  | Add new vehicle                           |
| PATCH  | `/api/cars/:id`   | Admin  | Update vehicle details                    |
| DELETE | `/api/cars/:id`   | Admin  | Soft-delete vehicle                       |

### Companies

| Method | Endpoint             | Access | Description                  |
| ------ | -------------------- | ------ | ---------------------------- |
| GET    | `/api/companies`     | Admin  | List all corporate clients   |
| POST   | `/api/companies`     | Admin  | Create corporate client      |
| GET    | `/api/companies/:id` | Admin  | Company detail with bookings |
| PATCH  | `/api/companies/:id` | Admin  | Update company details       |

### Bookings

| Method | Endpoint                      | Access   | Description               |
| ------ | ----------------------------- | -------- | ------------------------- |
| GET    | `/api/bookings`               | Admin    | All bookings with filters |
| GET    | `/api/bookings/mine`          | Customer | Own company's bookings    |
| POST   | `/api/bookings`               | Admin    | Create booking            |
| PATCH  | `/api/bookings/:id/status`    | Admin    | Update booking status     |
| PATCH  | `/api/bookings/:id/chauffeur` | Admin    | Assign chauffeur          |

### Invoices & Reports

| Method | Endpoint                  | Access           | Description                 |
| ------ | ------------------------- | ---------------- | --------------------------- |
| GET    | `/api/invoices`           | Admin            | List invoices               |
| GET    | `/api/invoices/:id`       | Admin / Customer | Invoice detail              |
| POST   | `/api/invoices/:id/issue` | Admin            | Mark invoice as issued      |
| GET    | `/api/reports/gst`        | Admin            | GST report (Excel download) |
| GET    | `/api/reports/bookings`   | Admin            | Booking summary (Excel)     |

---

## Database Schema

Key models and their relationships:

```
Company (corporate client)
  └── User (company employee with login access)
        └── Booking
              ├── Payment (Razorpay)
              └── Invoice (GST-compliant)

Car (fleet vehicle)
  └── Booking (which car was booked)

City (operational locations with office details)
```

All monetary values are stored in **paise** (₹1 = 100 paise) as integers to avoid floating-point precision errors. Divide by 100 only at the display layer.

---

## Authentication Flow

YAANA Transit uses OTP-based authentication — no passwords.

```
1. POST /api/auth/send-otp    → OTP sent via MSG91 SMS
2. POST /api/auth/verify-otp  → Returns accessToken (15 min) in body
                                 Sets refreshToken (30 days) in httpOnly cookie
3. Subsequent requests        → Authorization: Bearer <accessToken>
4. POST /api/auth/refresh     → Issues new accessToken using cookie
5. POST /api/auth/logout      → Deletes token from DB, clears cookie
```

In development mode, OTPs are printed directly to the terminal — no SMS credits used.

---

## Access Control

Two roles are enforced at middleware level:

| Role       | Access                                                               |
| ---------- | -------------------------------------------------------------------- |
| `ADMIN`    | Full access — all companies, all bookings, fleet management, reports |
| `CUSTOMER` | Read-only — own company's bookings and invoices only                 |

Admin users are created manually — never via self-registration.

---

## Development

```bash
# From apps/api directory

# Install dependencies
pnpm install

# Start Docker containers (PostgreSQL + Redis must be running)
docker compose up -d   # from monorepo root

# Run migrations
pnpm db:migrate

# Generate Prisma client
pnpm db:generate

# Start dev server (hot reload via tsx watch)
pnpm dev

# Open Prisma Studio (visual DB browser)
pnpm db:studio
```

Server runs at `http://localhost:4000`

Health check: `GET http://localhost:4000/health`

---

## Environment Variables

Copy `apps/api/.env.example` to `apps/api/.env` and fill in the values.

| Variable                | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string                    |
| `REDIS_URL`             | Redis connection string                         |
| `JWT_SECRET`            | Secret for signing access tokens (min 64 chars) |
| `JWT_REFRESH_SECRET`    | Secret for refresh token hashing                |
| `MSG91_AUTH_KEY`        | MSG91 API authentication key                    |
| `MSG91_TEMPLATE_ID`     | OTP SMS template ID from MSG91 dashboard        |
| `RAZORPAY_KEY_ID`       | Razorpay API key                                |
| `RAZORPAY_KEY_SECRET`   | Razorpay secret key                             |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name                         |
| `ALLOWED_ORIGINS`       | Comma-separated list of allowed frontend URLs   |

---

## Scripts

| Command            | Description                                   |
| ------------------ | --------------------------------------------- |
| `pnpm dev`         | Start development server with hot reload      |
| `pnpm build`       | Compile TypeScript to `dist/`                 |
| `pnpm start`       | Run compiled production build                 |
| `pnpm db:migrate`  | Run pending Prisma migrations                 |
| `pnpm db:generate` | Regenerate Prisma client after schema changes |
| `pnpm db:studio`   | Open Prisma Studio visual database browser    |
| `pnpm db:seed`     | Seed database with initial data               |
| `pnpm db:reset`    | Reset database and re-run all migrations      |

---

© YAANA Transit. All rights reserved. Confidential and proprietary.
