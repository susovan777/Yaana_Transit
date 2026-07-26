# YAANA Transit — Admin Panel (`apps/admin`)

Internal operations and management dashboard for the YAANA Transit team. A React single-page application for managing the complete corporate transportation workflow.

---

## Overview

The admin panel is exclusively for YAANA Transit's internal operations team. It provides full visibility and control over every aspect of the platform — corporate clients, fleet, bookings, chauffeur assignments, invoicing, and GST reporting.

Access is restricted to users with the `ADMIN` role. There is no public-facing component to this application.

---

## Tech Stack

| Tool            | Version | Role                                       |
| --------------- | ------- | ------------------------------------------ |
| React           | 19      | UI framework                               |
| Vite            | 6       | Build tool and dev server                  |
| TypeScript      | 5       | Type safety                                |
| Tailwind CSS    | v4      | CSS-first styling                          |
| TanStack Table  | 8       | Sortable, filterable, paginated data grids |
| Recharts        | 2       | Dashboard charts and analytics             |
| React Hook Form | 7       | Form state management                      |
| Zod             | 3       | Form schema validation                     |
| Lucide React    | latest  | Icon library                               |
| xlsx            | latest  | Excel report generation                    |

**Fonts:** Poppins (headings), Outfit (body)

**Design tokens:**

- Sidebar: `#1C1F26`
- Primary accent: `#3A6AB6`
- Navy: `#0B1F3A`
- Sky Blue: `#2E6FD8`

---

## Project Structure

```
apps/admin/
├── src/
│   ├── main.tsx              → Application entry point
│   ├── App.tsx               → Router and layout wrapper
│   ├── pages/
│   │   ├── Dashboard.tsx     → Stats overview and recent activity
│   │   ├── Companies.tsx     → Corporate client management
│   │   ├── Fleet.tsx         → Vehicle catalogue management
│   │   ├── Bookings.tsx      → Booking list, filters, status workflow
│   │   ├── Invoices.tsx      → Invoice management and PDF download
│   │   ├── Reports.tsx       → GST and revenue Excel exports
│   │   └── Users.tsx         → Customer user management
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx   → Navigation sidebar
│   │   │   └── Topbar.tsx    → Page header and user menu
│   │   ├── ui/               → Button, Input, Badge, Modal, Drawer
│   │   ├── bookings/         → BookingTable, StatusBadge, BookingDrawer
│   │   ├── companies/        → CompanyTable, CompanyDrawer
│   │   ├── fleet/            → FleetTable, FleetDrawer
│   │   └── charts/           → RevenueChart, BookingTrendChart
│   ├── lib/
│   │   ├── api.ts            → Axios/fetch API client with auth headers
│   │   └── utils.ts          → Formatters, helpers (paise → rupees etc.)
│   └── store/
│       └── auth.ts           → Auth state (current admin user + token)
├── index.html
└── vite.config.ts
```

---

## Features

### Dashboard

- Key metrics: total bookings, active trips, revenue (MTD), registered companies
- Recent bookings table with quick status update
- Booking trend chart (Recharts bar/line)
- Quick action buttons — create booking, add company, add vehicle

### Company Management

- List all corporate clients with search and filter
- Add and edit company profiles — name, GSTIN, PAN, billing address
- Contract details — start date, end date, credit limit, payment terms (net-30 etc.)
- View all bookings and invoices linked to a company

### Fleet Management

- List all vehicles with category filter and availability toggle
- Add new vehicles with full details — make, model, year, category, features, services
- Edit vehicle details and upload images
- Soft-deactivate vehicles (removed from booking without deletion)

**Vehicle categories:** Sedan · MUV · SUV · Premium SUV · Premium · Luxury

### Booking Management

- Full booking list with multi-column filters (status, company, car, date range)
- Status workflow progression with confirmation at each step:
  `PENDING → CONFIRMED → ASSIGNED → ACTIVE → COMPLETED`
- Assign chauffeur — name and contact number entered by admin
- Internal notes field per booking
- Cancel booking with reason capture

### Invoice Management

- Auto-generated GST-compliant invoices linked to completed bookings
- Invoice numbering format: `YAANA/2025-26/001`
- View invoice breakdown — subtotal, CGST, SGST/IGST, total
- Mark invoice as issued with timestamp
- Download invoice as PDF

### Reports & Exports

- **GST Report** — filterable by date range and company, downloadable as Excel (.xlsx)
  Columns: Invoice No., Company, GSTIN, SAC Code, Taxable Amount, CGST, SGST, IGST, Total
- **Booking Summary** — trip count, revenue by company, service type breakdown
- **Revenue Report** — monthly revenue trend, category-wise split

### User Management

- List all customer users across all companies
- Link users to their respective companies
- Activate or deactivate user accounts

---

## Access Control

The admin panel is accessible only to users with the `ADMIN` role. All API requests include the JWT access token in the `Authorization` header. Token refresh is handled automatically when the access token expires.

Customer users (`CUSTOMER` role) do not have access to this panel — they access their company's data through the web portal.

---

## Booking Status Workflow

```
PENDING     → Enquiry received, awaiting admin confirmation
CONFIRMED   → Admin confirmed the booking
ASSIGNED    → Chauffeur name and contact entered by admin
ACTIVE      → Trip in progress
COMPLETED   → Trip finished, invoice generated
CANCELLED   → Cancelled with reason recorded
```

Status transitions are linear and enforced — you cannot skip from PENDING to ACTIVE.

---

## Development

```bash
# From apps/admin directory
pnpm install

# Start dev server
pnpm dev

# Admin runs at http://localhost:5173

# Build for production
pnpm build
```

The admin panel connects to the API at `http://localhost:4000` in development. Ensure the API and Docker containers are running before starting the admin panel.

---

## Environment Variables

```env
VITE_API_URL=http://localhost:4000
```

For production deployment on Vercel, update `VITE_API_URL` to the Railway API URL.

---

## Deployment

The admin panel is deployed as a static SPA on Vercel at `admin.yanatransit.in`. Vercel detects the Vite build output (`dist/`) automatically.

All routes are handled client-side — Vercel's rewrite rules redirect all paths to `index.html`.

---

© YAANA Transit. All rights reserved. Confidential and proprietary.
