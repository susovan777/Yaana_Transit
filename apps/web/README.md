# YAANA Transit — Web (`apps/web`)

Corporate-facing website and client portal for YAANA Transit. Built with Next.js 15 App Router for performance, SEO, and server-side rendering.

---

## Purpose

This application serves two audiences:

- **Corporate visitors** — Companies exploring YAANA Transit's fleet and services. The site communicates quality, reliability, and professionalism to drive inbound enquiries.
- **Corporate client users** — Authenticated client users who log in to view their company's bookings, trip history, and invoices (read-only access).

---

## Pages

| Route       | Description                                                             |
| ----------- | ----------------------------------------------------------------------- |
| `/`         | Homepage — hero, fleet preview, services, cities, testimonials, enquiry |
| `/fleet`    | Full fleet listing with category filters                                |
| `/services` | All service offerings with enquiry CTAs                                 |
| `/about`    | Company background and values                                           |
| `/contact`  | Office locations and contact details                                    |

---

## Tech Stack

| Tool            | Version | Role                                |
| --------------- | ------- | ----------------------------------- |
| Next.js         | 15      | App Router, SSR, SSG, metadata API  |
| React           | 19      | UI rendering                        |
| TypeScript      | 5       | Type safety                         |
| Tailwind CSS    | v4      | CSS-first styling, no config file   |
| Framer Motion   | 12      | Scroll animations, page transitions |
| Lucide React    | latest  | Icon library                        |
| React Hook Form | 7       | Form handling                       |
| Zod             | 3       | Schema validation                   |

**Fonts:** Poppins (headings), Outfit (body)

**Design tokens:**

- Navy: `#0B1F3A`
- Sky Blue: `#2E6FD8`
- Light Blue: `#7EB3FF`

---

## Project Structure

```
apps/web/
├── app/
│   ├── layout.tsx          → Root layout, fonts, metadata
│   ├── page.tsx            → Homepage
│   ├── fleet/
│   │   └── page.tsx        → Fleet listing page
│   ├── services/
│   │   └── page.tsx        → Services page
│   └── globals.css         → Tailwind v4 theme (CSS variables)
├── components/
│   ├── home/               → Homepage section components
│   ├── fleet/              → CarCard, FilterBar, CarGrid, FleetClient
│   ├── services/           → ServicesGrid
│   └── layout/             → Navbar, Footer
├── lib/
│   ├── constants.ts        → Site config, contact details, nav links
│   └── data/
│       ├── fleet.ts        → Vehicle catalogue and helpers
│       ├── services.ts     → Service types and WhatsApp messages
│       ├── cities.ts       → City data with office locations
│       ├── testimonials.ts → Client testimonials
│       └── why-us.ts       → USP content
└── public/
    └── images/
        ├── cars/           → Vehicle images (<id>.jpg)
        └── cities/         → City hero images (<id>.jpg)
```

---

## Architecture Decisions

**Server Components by default**
Every page is a Server Component unless it requires interactivity. This gives the best SEO, fastest initial load, and no client-side JavaScript for static content.

**Client boundary isolation**
Interactive components (`FilterBar`, `CarGrid`, `ServicesGrid`) are isolated in separate `"use client"` files. Pages themselves remain server-rendered.

**Static data → API-ready**
All content currently lives in `lib/data/*.ts` static files. When the backend API is ready, these are swapped for `fetch()` calls — no component changes needed.

**Image optimisation**
All vehicle and city images use `next/image` with `fill` + `sizes` — Next.js automatically serves WebP/AVIF at the right resolution per device.

---

## Services

YAANA Transit offers the following corporate services:

- Chauffeur-Driven — city and intercity
- Airport Transfers — with flight tracking
- Outstation Trips — one-way and round-trip
- Corporate Rentals — managed accounts with GST billing
- Employee Transportation Services (ETS)
- Events & Occasions — group fleet management

---

## Fleet Categories

| Category    | Vehicle                              |
| ----------- | ------------------------------------ |
| Sedan       | Maruti Suzuki Dzire                  |
| MUV         | Maruti Suzuki Ertiga / Toyota Rumion |
| SUV         | Toyota Innova Crysta                 |
| Premium SUV | Toyota Innova HyCross                |
| Premium     | Kia Carnival                         |
| Luxury      | Mercedes-Benz / BMW                  |

---

## Development

```bash
# From monorepo root
pnpm dev

# Web runs at http://localhost:3000

# Build for production
pnpm build
```

---

## Environment Variables

No environment variables are required for the web app in its current static-data phase. Once connected to the API, add:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

© YAANA Transit. All rights reserved. Confidential and proprietary.
