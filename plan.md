# Plan: Devbhoomi Himalayan Heritage E-Commerce Platform

## TL;DR

Build a custom hybrid B2B/B2C e-commerce PWA for sacred and organic Himalayan products using **Next.js 15 + Tailwind CSS** (frontend), **Golang** (backend), **Couchbase Capella** (database), deployed on **AWS (CloudFront + EC2 + S3)**. Replaces the Shopify-based approach from the PRD with a fully custom, free/open-source stack.

---

## Confirmed Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Mobile Strategy** | PWA (Progressive Web App) | Single responsive Next.js codebase; installable on phones |
| **Frontend** | Next.js 15 (App Router) | SSR/SSG/ISR for superior SEO over client-side SPAs |
| **Styling** | Tailwind CSS 4 | Utility-first, design-token friendly, zero runtime cost |
| **Backend** | Golang (Gin framework) | High-performance, excellent concurrency, low memory |
| **Database** | Couchbase Capella Free Tier | JSON document model, built-in FTS, free 1-cluster forever |
| **Deployment** | AWS (EC2 + S3 + CloudFront) | EC2 free tier yr1, CloudFront CDN, ~$6/mo total |
| **Admin Panel** | Custom (Next.js + Tailwind) | Full control over UX, matches storefront design system |

---

## Why Next.js Over a Vite SPA?

For an e-commerce site where Google discoverability is critical (users searching "buy rudraksha online", "organic himalayan honey"), **server-side rendering is a major competitive advantage**.

| Concern | Vite SPA (Client-Side) | Next.js (SSR/SSG/ISR) |
|---|---|---|
| **SEO** | Google sees empty `<div id="root">`; JS must execute first | Full HTML rendered server-side; crawlers see complete content |
| **Product Pages** | Client fetches data after page load — slow FCP | SSG + ISR: pre-rendered at build, revalidated on schedule |
| **Category Pages** | No content until JS hydrates | SSG: static HTML, instant load, perfect for crawling |
| **Search Results** | Client-only — invisible to Google | SSR: fresh server-rendered HTML per query |
| **Meta Tags / OG** | Requires hacky workarounds (prerender.io) | Native Metadata API — per-page `<title>`, OG, JSON-LD |
| **Image Optimization** | Manual (sharp, imagemin, lazy load) | Built-in `next/image` — auto WebP/AVIF, responsive, lazy |
| **Sitemap** | Manual generation script | `app/sitemap.ts` — auto-generated |
| **Initial Load** | Full JS bundle must download + parse | Streaming SSR + code splitting — faster FCP/LCP |

---

## Tech Stack (All Free / Open-Source)

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) | SSR/SSG/ISR for SEO, built-in image optimization |
| **Styling** | Tailwind CSS 4 | Utility-first, design-token friendly |
| **State Mgmt** | Zustand | Lightweight, no boilerplate |
| **Routing** | Next.js App Router (built-in) | File-based routing, layouts, loading states |
| **Forms** | React Hook Form + Zod | Performant forms + schema validation |
| **API Client** | TanStack Query (React Query) | Caching, background refetch, optimistic updates |
| **Backend** | Go 1.22+ with Gin framework | High-performance HTTP, great concurrency |
| **Auth** | JWT + bcrypt (Go) | Stateless auth, role-based (B2C/B2B/Admin) |
| **Database** | Couchbase Capella Free Tier | JSON document model fits flexible product schema |
| **Cache** | Redis (self-hosted on EC2) | Session cache, rate limiting, cart TTL |
| **Search** | Couchbase FTS (Full-Text Search) | Built-in to Capella, no extra service needed |
| **File Storage** | AWS S3 | Product images, compliance docs, invoices |
| **CDN** | AWS CloudFront | Static asset delivery, SSL termination |
| **Compute** | AWS EC2 (t3.micro → t3.small) | Go backend + Redis + Next.js self-hosted SSR |
| **CI/CD** | GitHub Actions | Free for public/private repos |
| **Email** | AWS SES (free: 62K emails/mo from EC2) | Order confirmations, OTPs, invoices |
| **SMS** | MSG91 or Twilio (pay-as-you-go) | OTP and shipping notifications |
| **Payments** | Razorpay (domestic) + Stripe (intl) | Free integration, pay-per-transaction only |
| **Shipping** | Shiprocket API | Aggregates Delhivery, BlueDart, DHL, FedEx |
| **PWA** | next-pwa + Workbox | Offline support, installability, push notifications |
| **SEO** | next-sitemap + Next.js Metadata API | Auto sitemap, per-page meta/OG tags, JSON-LD |
| **Image Opt** | next/image (built-in) | Auto WebP/AVIF, lazy load, responsive sizes |

---

## Architecture Overview

```
                    ┌───────────────────────────┐
                    │    AWS CloudFront (CDN)    │
                    └────┬──────────────┬───────┘
                         │              │
                 ┌───────▼──┐    ┌──────▼──────────┐
                 │ S3 Bucket│    │  EC2 Instance    │
                 │ (static  │    │ ┌──────────────┐ │
                 │ assets)  │    │ │ Next.js SSR  │ │
                 └──────────┘    │ │ (Node 20)    │ │
                                 │ ├──────────────┤ │
                                 │ │ Go API (Gin) │ │
                                 │ ├──────────────┤ │
                                 │ │ Redis Cache  │ │
                                 │ └──────┬───────┘ │
                                 └────────┼─────────┘
                                          │
                                 ┌────────▼─────────┐
                                 │ Couchbase Capella │
                                 │   (Cloud DB)      │
                                 └──────────────────┘

External Services: Razorpay │ Stripe │ Shiprocket │ AWS SES │ MSG91
```

### Deployment Model

- **Next.js** runs as a self-hosted Node.js server on EC2 (required for SSR/ISR)
- **Go API** runs on the same EC2 instance as a separate process
- **Nginx** reverse proxy on EC2:
  - `devbhoomi.com` → `:3000` (Next.js storefront)
  - `api.devbhoomi.com` → `:8080` (Go API)
  - `admin.devbhoomi.com` → `:3001` (Next.js admin)
- **S3 + CloudFront** serve product images, fonts, and uploaded assets
- **Couchbase Capella** runs as a managed cloud service (no self-hosting needed)
- **Redis** runs locally on EC2 for session cache, rate limiting, and cart TTL

---

## Monorepo Structure

```
e-commerce/
├── apps/
│   ├── storefront/                 # Next.js 15 (App Router) — B2C + B2B unified
│   │   ├── app/
│   │   │   ├── (storefront)/       # B2C route group
│   │   │   │   ├── page.tsx        # Homepage (SSG + ISR)
│   │   │   │   ├── products/
│   │   │   │   │   ├── [slug]/page.tsx  # Product detail (SSG + ISR)
│   │   │   │   │   └── page.tsx         # Product listing (SSR)
│   │   │   │   ├── categories/[slug]/page.tsx  # Category page (SSG)
│   │   │   │   ├── cart/page.tsx
│   │   │   │   ├── checkout/page.tsx
│   │   │   │   └── orders/page.tsx
│   │   │   ├── (b2b)/              # B2B route group (protected)
│   │   │   │   ├── wholesale/page.tsx   # B2B dashboard
│   │   │   │   ├── quick-order/page.tsx # Quick Order Matrix
│   │   │   │   └── credit/page.tsx      # Credit terms view
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   ├── layout.tsx          # Root layout (nav, footer)
│   │   │   ├── sitemap.ts         # Dynamic sitemap generation
│   │   │   └── robots.ts         # Robots.txt generation
│   │   ├── components/
│   │   │   ├── ui/                # Button, Card, Modal, Input
│   │   │   ├── layout/            # Header, Footer, MegaMenu
│   │   │   ├── product/           # ProductCard, ProductGrid, BentoGrid
│   │   │   ├── cart/              # CartDrawer, CartItem
│   │   │   └── b2b/              # QuickOrderMatrix, TierPricing
│   │   ├── lib/
│   │   │   ├── api.ts            # Go backend API client
│   │   │   ├── auth.ts           # JWT helpers, Next.js middleware
│   │   │   └── utils.ts
│   │   ├── styles/
│   │   │   └── globals.css       # Tailwind base + design tokens
│   │   ├── public/
│   │   │   └── manifest.json     # PWA manifest
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── admin/                     # Next.js 15 — Custom Admin Dashboard
│       ├── app/
│       │   ├── dashboard/page.tsx  # Sales charts, alerts
│       │   ├── products/page.tsx   # Product CRUD, bulk upload
│       │   ├── orders/page.tsx     # Order management
│       │   ├── inventory/page.tsx  # Stock levels, channels
│       │   ├── b2b/page.tsx       # Wholesaler approvals
│       │   ├── compliance/page.tsx # IEC/AD codes, certs
│       │   ├── customers/page.tsx  # Customer database
│       │   └── layout.tsx
│       ├── components/
│       └── package.json
│
├── server/                         # Go backend (modular monolith)
│   ├── cmd/
│   │   └── api/main.go            # Entry point
│   ├── internal/
│   │   ├── auth/                   # JWT, RBAC middleware
│   │   ├── catalog/                # Products, categories, search
│   │   ├── cart/                   # Cart + pricing engine
│   │   ├── checkout/               # Orders, payment orchestration
│   │   ├── b2b/                   # Tiered pricing, credit terms
│   │   ├── payment/                # Razorpay + Stripe adapters
│   │   ├── shipping/               # Shiprocket integration
│   │   ├── inventory/              # Stock management, alerts
│   │   ├── compliance/             # Export docs, certifications
│   │   └── notification/           # Email (SES) + SMS
│   ├── pkg/
│   │   ├── couchbase/              # DB connection, bucket helpers
│   │   ├── middleware/             # CORS, rate-limit, logging
│   │   └── config/                 # Env config loader
│   ├── go.mod
│   └── go.sum
│
├── infra/
│   ├── terraform/                  # AWS infrastructure as code
│   ├── nginx/                      # Reverse proxy config
│   └── github-actions/             # CI/CD workflows
│
├── docs/
│   └── plan.md                     # This document
├── PRD.md
├── detailed-requirements.md
└── README.md
```

### Key Next.js Architecture Decisions

- **Single storefront app** with route groups: `(storefront)` for B2C and `(b2b)` for wholesale — shared layout, auth, and components, but separate route trees
- **Admin is a separate Next.js app** — different auth context, not public-facing, runs on `:3001`
- **App Router** for layouts, loading states, error boundaries, and parallel routes
- **SSG + ISR** for product/category pages (revalidate every 60s) — Google sees full HTML
- **SSR** for search results and filtered listings — dynamic content needs fresh data
- **Client components** only for interactive parts (cart drawer, checkout form, quick order matrix)

---

## Rendering Strategy Per Page

| Page | Rendering Mode | Revalidate | Rationale |
|---|---|---|---|
| Homepage | SSG + ISR | 300s (5 min) | Mostly static hero + category cards |
| Category pages | SSG + ISR | 60s | New products added occasionally |
| Product detail | SSG + ISR | 60s | Price/stock changes need near-real-time |
| Product listing (filtered) | SSR | — | Dynamic filters, can't pre-render all combos |
| Search results | SSR | — | Infinite query combinations |
| Cart | Client-side | — | Fully interactive, user-specific |
| Checkout | Client-side | — | Forms, payment modals, user-specific |
| B2B Dashboard | SSR (protected) | — | User-specific data, behind auth |
| Quick Order Matrix | Client-side | — | Heavy interactivity (spreadsheet UI) |
| Admin pages | SSR (protected) | — | Real-time data, behind auth |

---

## Design Tokens (Tailwind Config)

From the PRD visual identity, configured as custom Tailwind theme:

```ts
// apps/storefront/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#254B5A",   // Primary — navigation, CTAs, primary buttons
        misty:  "#A6CBD3",   // Secondary — hero backgrounds, accents
        rust:   "#9D5F1B",   // Heritage — sacred category highlights
        cream:  "#FDF1DB",   // Background — content containers
        stone:  "#344E95",   // Text — secondary headings, labels
        muted:  "#BBA48D",   // Borders, dividers, breadcrumbs
        snow:   "#FFFFFF",   // Content containers, typography BG
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "sans-serif"],       // Headings + body
        signature: ["Himalaya Signature", "cursive"],    // Artisanal accents
      },
    },
  },
};

export default config;
```

### Color Usage Guide

| Token | Hex | Psychological Impact | Application |
|---|---|---|---|
| `forest` | `#254B5A` | Stability, growth, ancient wisdom | Main navigation, primary buttons, CTAs |
| `misty` | `#A6CBD3` | Serenity, purity, Himalayan atmosphere | Hero backgrounds, secondary accents |
| `rust` | `#9D5F1B` | Groundedness, ritual, craftsmanship | Heritage icons, sacred category highlights |
| `cream` | `#FDF1DB` | Warmth, organic, natural | Content containers, page backgrounds |
| `stone` | `#344E95` | Reliability, traditional foundations | Secondary headings, labels |
| `muted` | `#BBA48D` | Subtlety, supporting structure | Borders, divider lines, breadcrumbs |
| `snow` | `#FFFFFF` | Purity, clarity, minimalist luxury | Cards, typography containers |

---

## Couchbase Data Model

### Bucket: `devbhoomi`

| Scope | Collection | Document Type |
|---|---|---|
| `catalog` | `products` | Products with traceability & scientific attrs |
| `catalog` | `categories` | Category tree (Sacred, Foods, Wellness) |
| `catalog` | `reviews` | Customer reviews per product |
| `users` | `customers` | B2C user profiles |
| `users` | `wholesalers` | B2B accounts with tier & credit terms |
| `users` | `admins` | Admin user accounts |
| `orders` | `retail_orders` | B2C orders |
| `orders` | `wholesale_orders` | B2B orders with PO references |
| `orders` | `carts` | Active shopping carts (TTL-backed via Redis) |
| `commerce` | `pricing_tiers` | B2B volume discount rules |
| `commerce` | `coupons` | Discount codes |
| `commerce` | `inventory` | Stock counts per SKU per channel |
| `compliance` | `certifications` | NPOP, APEDA, FSSAI docs |
| `compliance` | `export_codes` | IEC, AD codes per product |

### Sample Product Document

```json
{
  "id": "prod_rudraksha_5mukhi_001",
  "type": "product",
  "name": "5 Mukhi Rudraksha Bead",
  "slug": "5-mukhi-rudraksha-bead",
  "category": "sacred",
  "subcategory": "rudraksha",
  "description": "Authentic 5-face Rudraksha bead sourced directly from Rishikesh artisans.",
  "price": {
    "inr": 1200,
    "usd": 14.50
  },
  "b2b_pricing": [
    { "min_qty": 50, "max_qty": 200, "discount_pct": 10 },
    { "min_qty": 201, "max_qty": 500, "discount_pct": 18 },
    { "min_qty": 501, "discount_pct": 25 }
  ],
  "traceability": {
    "village_of_origin": "Rishikesh, Uttarakhand",
    "artisan_name": "Ramesh Joshi",
    "certification_id": "NPOP-UK-2024-0892"
  },
  "scientific_attributes": {
    "mukhi_count": 5,
    "weight_grams": 3.2
  },
  "images": [
    "https://cdn.devbhoomi.com/products/rudraksha-5m-01.webp",
    "https://cdn.devbhoomi.com/products/rudraksha-5m-02.webp"
  ],
  "seo": {
    "title": "5 Mukhi Rudraksha Bead — Authentic from Rishikesh",
    "description": "Genuine 5-face Rudraksha bead from Rishikesh, Uttarakhand. NPOP certified.",
    "keywords": ["rudraksha", "5 mukhi", "rishikesh", "sacred beads"]
  },
  "inventory": {
    "retail": 340,
    "wholesale": 5000
  },
  "moq": { "wholesale": 50 },
  "weight_kg": 0.0032,
  "dimensions_cm": { "l": 2.0, "w": 2.0, "h": 2.0 },
  "status": "active",
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-03-10T08:15:00Z"
}
```

### Sample Wholesaler Document

```json
{
  "id": "ws_temple_delhi_001",
  "type": "wholesaler",
  "company_name": "Shri Ram Temple Trust",
  "contact_name": "Vikram Sharma",
  "email": "vikram@shriramt.org",
  "phone": "+91-9876543210",
  "gstin": "07AABCT1234F1ZH",
  "tier": "enterprise",
  "credit_terms": {
    "type": "net_60",
    "limit_inr": 500000,
    "used_inr": 120000,
    "approved": true
  },
  "tax_exempt": true,
  "tax_exemption_cert": "https://cdn.devbhoomi.com/docs/tax-exempt-001.pdf",
  "approval_status": "approved",
  "approved_by": "admin_001",
  "approved_at": "2026-02-20T14:00:00Z",
  "roles": [
    { "user_id": "user_vikram_001", "role": "buyer" },
    { "user_id": "user_priya_002", "role": "accountant" }
  ],
  "created_at": "2026-02-15T09:00:00Z"
}
```

### Sample Retail Order Document

```json
{
  "id": "ord_retail_20260312_001",
  "type": "retail_order",
  "customer_id": "cust_ananya_001",
  "items": [
    {
      "product_id": "prod_rudraksha_5mukhi_001",
      "name": "5 Mukhi Rudraksha Bead",
      "quantity": 2,
      "unit_price_inr": 1200,
      "subtotal_inr": 2400
    },
    {
      "product_id": "prod_honey_raw_001",
      "name": "Raw Himalayan Honey (500g)",
      "quantity": 1,
      "unit_price_inr": 850,
      "subtotal_inr": 850
    }
  ],
  "subtotal_inr": 3250,
  "shipping_inr": 99,
  "gst_inr": 585,
  "total_inr": 3934,
  "currency": "INR",
  "payment": {
    "gateway": "razorpay",
    "payment_id": "pay_LmN1234567890",
    "order_id": "order_Rzp1234567890",
    "status": "captured",
    "method": "upi"
  },
  "shipping": {
    "provider": "shiprocket",
    "tracking_id": "SR1234567890",
    "status": "in_transit",
    "estimated_delivery": "2026-03-16"
  },
  "address": {
    "name": "Ananya Verma",
    "line1": "42, Sector 15",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "country": "IN"
  },
  "status": "shipped",
  "created_at": "2026-03-12T11:30:00Z"
}
```

---

## API Design (Go Backend)

### Route Structure

```
/api/v1
│
├── /auth
│   ├── POST   /register              # User registration (B2C / B2B)
│   ├── POST   /login                 # Login → JWT access + refresh tokens
│   ├── POST   /refresh               # Refresh access token
│   ├── POST   /forgot-password       # Send OTP via email/SMS
│   └── POST   /reset-password        # Reset password with OTP
│
├── /products
│   ├── GET    /                       # List products (filterable, paginated, sortable)
│   ├── GET    /:slug                  # Product detail by slug
│   ├── POST   /                       # Create product (admin only)
│   ├── PUT    /:id                    # Update product (admin only)
│   ├── DELETE /:id                    # Soft-delete product (admin only)
│   ├── POST   /bulk-import            # CSV/JSON bulk import (admin only)
│   └── GET    /search?q=             # Full-text search via Couchbase FTS
│
├── /categories
│   ├── GET    /                       # List all categories
│   └── GET    /:slug                  # Category detail with products
│
├── /reviews
│   ├── GET    /product/:productId     # Reviews for a product
│   └── POST   /product/:productId     # Submit review (authenticated)
│
├── /cart
│   ├── GET    /                       # Get current cart
│   ├── POST   /items                  # Add item to cart
│   ├── PUT    /items/:id              # Update item quantity
│   └── DELETE /items/:id              # Remove item from cart
│
├── /checkout
│   ├── POST   /                       # Create order from cart
│   ├── POST   /shipping-rates        # Calculate shipping options
│   └── POST   /verify-payment        # Verify Razorpay/Stripe payment
│
├── /orders
│   ├── GET    /                       # List user's orders (paginated)
│   ├── GET    /:id                    # Order detail
│   └── GET    /:id/track             # Shipping tracking info
│
├── /b2b
│   ├── POST   /register              # Wholesaler application
│   ├── GET    /catalog                # B2B pricing catalog
│   ├── POST   /quick-order           # Bulk order submission (multi-SKU)
│   ├── GET    /credit                 # Credit balance and terms
│   └── POST   /reorder/:orderId      # One-click reorder from history
│
├── /admin
│   ├── GET    /dashboard              # Analytics: sales, revenue, top products
│   ├── GET    /inventory              # All stock levels
│   ├── PUT    /inventory/:sku         # Update stock for a SKU
│   ├── GET    /orders                 # All orders (filterable)
│   ├── PUT    /orders/:id/status      # Update order status
│   ├── GET    /b2b/applications       # Pending wholesaler applications
│   ├── PUT    /b2b/applications/:id   # Approve or reject wholesaler
│   ├── POST   /compliance/upload      # Upload certification documents
│   ├── GET    /customers              # Customer database (filterable)
│   └── POST   /products/bulk-import   # Bulk product import
│
├── /upload
│   └── POST   /image                  # Upload image → S3, return CloudFront URL
│
└── /webhooks
    ├── POST   /razorpay               # Razorpay payment status webhook
    ├── POST   /stripe                 # Stripe payment status webhook
    └── POST   /shiprocket             # Shiprocket shipping status webhook
```

### Auth Flow

```
1. User registers → POST /auth/register
   → Password hashed with bcrypt → stored in Couchbase
   → Returns JWT access token (15min) + refresh token (7d)

2. User logs in → POST /auth/login
   → Validates credentials → Returns JWT pair

3. Protected routes → Gin middleware extracts JWT from Authorization header
   → Validates claims → Injects user context (id, role) into request

4. Role-based access:
   → "customer"    → B2C routes
   → "wholesaler"  → B2B routes
   → "admin"       → Admin routes
```

---

## Implementation Phases (12 Weeks)

### Phase 1: Foundation & Auth (Weeks 1–2)

**Backend (Go):**

| # | Task | Details |
|---|---|---|
| 1 | Initialize Go project | Gin framework, modular `/internal` structure |
| 2 | Couchbase connection | Connect to Capella, create bucket/scopes/collections |
| 3 | JWT auth system | Access + refresh tokens, bcrypt passwords, RBAC middleware |
| 4 | Registration/Login API | Email + OTP, role assignment (customer/wholesaler/admin) |
| 5 | Redis setup | Session cache, rate limiter (10 req/s per IP), cart TTL |
| 6 | Middleware | CORS (allow storefront origin), request logging, panic recovery |

**Frontend (Next.js):**

| # | Task | Details |
|---|---|---|
| 7 | Init monorepo | `apps/storefront` + `apps/admin`, Next.js 15, Tailwind CSS 4 |
| 8 | Design tokens | Tailwind config with PRD colors (#254B5A, #A6CBD3, etc.) |
| 9 | UI component library | Button, Input, Card, Modal, Nav — all with Tailwind variants |
| 10 | Auth pages | Login, Register, Forgot Password — responsive mobile-first |
| 11 | Route protection | Next.js middleware for B2B and admin routes (JWT validation) |
| 12 | PWA config | `next-pwa`, `manifest.json`, service worker, app icons |

**Infrastructure:**

| # | Task | Details |
|---|---|---|
| 13 | EC2 setup | Node.js 20, Go 1.22, Redis 7, Nginx — Amazon Linux 2023 |
| 14 | S3 + CloudFront | Bucket for assets, CloudFront distribution with custom domain |
| 15 | Nginx config | Reverse proxy: storefront (:3000), API (:8080), admin (:3001) |
| 16 | CI/CD | GitHub Actions: lint → test → build → deploy (storefront + API) |

**Verification Checklist:**
- [ ] User registers, logs in, receives JWT
- [ ] Protected routes reject unauthenticated requests
- [ ] PWA installable on mobile Chrome and Safari
- [ ] CI/CD deploys to EC2 and S3/CloudFront on push to `main`
- [ ] `curl https://devbhoomi.com` returns full HTML (SSR working)

---

### Phase 2: Product Catalog & Search (Weeks 3–4)

**Backend (Go):**

| # | Task | Details |
|---|---|---|
| 1 | Product CRUD API | All PRD fields: traceability, scientific attrs, B2B pricing |
| 2 | Category API | 3-pillar hierarchy: Sacred, Foods, Wellness + subcategories |
| 3 | Couchbase FTS index | Full-text search index on product name, description, category |
| 4 | Filtering API | Price range, category, origin village, certifications |
| 5 | Image upload | Multipart upload → S3 → return CloudFront URL |
| 6 | Bulk import | CSV/JSON upload → validate → batch insert to Couchbase |

**Frontend (Storefront):**

| # | Task | Details |
|---|---|---|
| 7 | Homepage | Hero banner + value proposition, SSG + ISR (revalidate 5min) |
| 8 | Bento Grid | 3 category cards with hover animations revealing heritage story |
| 9 | Product listing | Responsive grid: 2-col mobile, 4–5 col desktop. SSR for filtering |
| 10 | Filter UI | Desktop: left sidebar. Mobile: full-screen overlay with toggles |
| 11 | Product detail | Expandable sections (Benefits, Origin, How to Use). SSG + ISR |
| 12 | Search bar | Predictive search with debounce (300ms), suggestion dropdown |
| 13 | SEO | `generateMetadata()` per page, JSON-LD ProductSchema, breadcrumbs |

**Verification Checklist:**
- [ ] 50+ products imported via CSV bulk upload
- [ ] Couchbase FTS search returns results within 200ms
- [ ] `curl` on product page returns full HTML with product data (SSR)
- [ ] Product pages have correct `<title>`, `<meta>`, OG tags, JSON-LD
- [ ] Mobile layout: bottom nav, thumb-friendly, 2-column grid

---

### Phase 3: Cart, Checkout & Payments (Weeks 5–6)

**Backend (Go):**

| # | Task | Details |
|---|---|---|
| 1 | Cart API | Redis-backed with 7-day TTL, supports guest (cookie) + authenticated |
| 2 | Razorpay | Create order → checkout → verify signature via webhook |
| 3 | Stripe | PaymentIntent API, multi-currency (USD/EUR/GBP), webhook verify |
| 4 | Checkout API | Address validation, Shiprocket rate API, GST calculation |
| 5 | Order creation | Atomic: create order + deduct inventory in single Couchbase txn |
| 6 | Email confirmation | AWS SES: order confirmation with items, total, tracking link |

**Frontend (Storefront):**

| # | Task | Details |
|---|---|---|
| 7 | Cart page | Quantity +/-, remove item, price summary. Client component |
| 8 | Guest checkout | No login required — cart persisted via cookie/localStorage |
| 9 | Checkout page | Address form (Zod validation), shipping options, payment picker |
| 10 | Razorpay modal | `razorpay-checkout.js` integration for UPI/card/net banking |
| 11 | Stripe Elements | Card input component for international payments |
| 12 | Order confirmation | Success page with order ID, items summary, tracking link |
| 13 | Order history | User profile → past orders with status badges |

**Verification Checklist:**
- [ ] Full flow: browse → add to cart → checkout → pay → order confirmed
- [ ] Razorpay test mode: UPI, debit card, net banking all succeed
- [ ] Stripe test mode: international Visa/Mastercard succeeds
- [ ] Guest checkout works end-to-end without creating an account
- [ ] Inventory atomically decrements on successful payment
- [ ] Order confirmation email received within 30 seconds

---

### Phase 4: B2B Wholesale Portal (Weeks 7–8)

**Backend (Go):**

| # | Task | Details |
|---|---|---|
| 1 | Wholesaler registration | Application form → pending state → admin approval required |
| 2 | Tiered pricing engine | Auto-discount: 50–200 units → 10%, 201–500 → 18%, 500+ → 25% |
| 3 | B2B catalog API | Customer-specific prices, MOQ enforcement, filtered SKUs |
| 4 | Credit terms | Net 30/60 engine — credit limit, used amount, approval workflow |
| 5 | PO support | Purchase Order reference field on wholesale orders |
| 6 | One-click reorder | Clone items from a previous order into a new cart |
| 7 | Tax exemption | Flag on wholesaler account → GST removed from invoices |

**Frontend (Storefront — `(b2b)` route group):**

| # | Task | Details |
|---|---|---|
| 8 | B2B portal | Protected via Next.js middleware — redirects unapproved users |
| 9 | Quick Order Matrix | Spreadsheet-style UI: SKU, name, price, qty input, bulk add to cart |
| 10 | B2B dashboard | Order history, credit balance, pending POs, reorder buttons (SSR) |
| 11 | Price list | Customer-specific pricing table, downloadable as PDF |
| 12 | Role-based views | Buyer sees ordering UI; Accountant sees invoices & credit |

**B2B Tiered Pricing Rules:**

| Tier | Quantity Range | Discount |
|---|---|---|
| Starter | 50 – 200 units | 10% off |
| Growth | 201 – 500 units | 18% off |
| Enterprise | 500+ units | 25% off |

**Verification Checklist:**
- [ ] Wholesaler registers → admin approves → B2B pricing visible
- [ ] Adding 100 units auto-applies 10% Starter discount
- [ ] Quick Order Matrix: add 20+ SKUs in one action, single "Add to Cart"
- [ ] Credit terms display correctly: limit, used, available balance
- [ ] Net 30/60 orders created without immediate payment
- [ ] Tax-exempt wholesaler sees no GST on invoices

---

### Phase 5: Admin Dashboard (Weeks 9–10)

**Backend (Go):**

| # | Task | Details |
|---|---|---|
| 1 | Analytics API | Revenue (daily/weekly/monthly), order count, top 10 products, AOV |
| 2 | Inventory API | Stock levels per channel (retail/wholesale), low-stock alerts |
| 3 | B2B workflows | List pending applications, approve/reject with notes |
| 4 | Compliance API | Upload/attach NPOP, APEDA, FSSAI certs to products/orders |
| 5 | Customer API | Full customer list with purchase history, segmentation, export |

**Frontend (Admin App — separate Next.js app on `:3001`):**

| # | Task | Details |
|---|---|---|
| 6 | Dashboard home | Revenue chart (Recharts), recent orders, low-stock alerts |
| 7 | Product management | CRUD table, inline edit, bulk CSV upload, image gallery manager |
| 8 | Order management | Status updates (processing → shipped → delivered), invoice gen |
| 9 | Inventory panel | Stock for retail + wholesale pools, manual adjustment, alerts |
| 10 | B2B management | Wholesaler application queue, approve/reject, edit credit terms |
| 11 | Compliance panel | Upload IEC/AD codes, attach NPOP/APEDA certs to products |
| 12 | Customer database | Searchable table, purchase history, export as CSV |

**Verification Checklist:**
- [ ] Admin can CRUD products with all PRD fields (traceability, scientific attrs)
- [ ] Low-stock alerts fire at configurable thresholds
- [ ] B2B approval flow: pending → approved/rejected → wholesaler notified
- [ ] Compliance docs attached to international order invoices
- [ ] Dashboard loads within 2 seconds with 1000+ orders
- [ ] All admin pages protected — non-admin users get 403

---

### Phase 6: Shipping, Notifications & Launch (Weeks 11–12)

**Backend (Go):**

| # | Task | Details |
|---|---|---|
| 1 | Shiprocket integration | Create shipment, fetch rates, receive tracking webhooks |
| 2 | Shipping calculator | Weight + dimensions + pincode → live rates at checkout |
| 3 | Push notifications | Web Push API via service worker — order status updates |
| 4 | SMS notifications | MSG91: OTP, order placed, shipped, out for delivery, delivered |
| 5 | Currency conversion | Cache exchange rates (Open Exchange Rates API), daily refresh |

**Frontend (Storefront + Admin):**

| # | Task | Details |
|---|---|---|
| 6 | Shipping selector | Checkout: show 2–3 shipping options with price/ETA |
| 7 | Order tracking | Timeline UI: placed → processing → shipped → delivered |
| 8 | Push opt-in | Permission prompt + toggle in user settings |
| 9 | Multi-currency | Toggle: INR (default), USD, EUR, GBP — stored in cookie |
| 10 | SEO final pass | Verify all pages: meta tags, JSON-LD, `sitemap.ts`, `robots.ts` |
| 11 | Performance | `next/image` everywhere, dynamic imports, prefetch key routes |
| 12 | Accessibility | ARIA labels, keyboard nav, focus rings, contrast ratio ≥ 4.5:1 |

**Verification Checklist:**
- [ ] Shipping rates calculate correctly for 5+ sample pincodes
- [ ] Shiprocket webhook updates order tracking status in real-time
- [ ] Push notification received on mobile when order status changes
- [ ] Multi-currency toggle shows correct converted prices
- [ ] Lighthouse scores: PWA ≥ 90, Performance ≥ 85, SEO ≥ 95
- [ ] All apps (storefront + admin) fully responsive on mobile
- [ ] SSL certificate active, all HTTP redirects to HTTPS
- [ ] Load test: 100 concurrent users, p95 response time < 500ms

---

## Regulatory & Export Compliance

The system must manage compliance for Uttarakhand-sourced organic exports.

### Required Documents (Managed via Admin Panel)

| Document | Authority | Purpose |
|---|---|---|
| IEC (Import Export Code) | DGFT | Authorizes foreign trade |
| AD Code (Authorized Dealer) | Bank | Authorizes forex remittances |
| NPOP Certification | APEDA | National Program for Organic Production |
| APEDA Registration | APEDA | Required for agricultural exports |
| FSSAI Central License | FSSAI | Mandatory for food export businesses |
| Transaction Certificate (TC) | Certifying body | Per-shipment organic certification |

### System Behavior

- Admin uploads certs in the **Compliance Panel** → stored in S3
- Certs are linked to products/categories in Couchbase
- International orders automatically attach relevant certs to invoices
- Compliance status shown per product in Admin → Products view

---

## Product Catalog: Three Pillars of Devbhoomi

### 1. Sacred (Devbhoomi Ritual Products)

The spiritual anchor of the brand — items for daily pujas and ceremonies.

| Subcategory | Products | Key Attributes |
|---|---|---|
| Incense & Fragrance | Bambooless incense, dhoop cones (recycled temple flowers) | Weight, fragrance type, burn time |
| Ritual Artifacts | Brass idols, hand-carved pinewood temples, sacred vessels | Artisan name, village, material |
| Sacred Seeds | Rudraksha beads (by mukhi), sacred tulsi | Mukhi count, weight, certification |
| Havan Samagri | Pre-mixed samagri, camphor, ghee wicks | Ingredients list, weight, purity |

### 2. Himalayan Organic Foods

High-altitude superfoods — naturally nutrient-dense and chemical-free.

| Subcategory | Products | Key Attributes |
|---|---|---|
| Grains & Pulses | Dehradun Basmati, Mandua (ragi), Jhangora, red rice | Origin altitude, mineral content |
| Oils & Ghee | Cold-pressed mustard/apricot/walnut oil, A2 Bilona Ghee | Extraction method, cow breed |
| Wild Herbs & Honey | Raw honey, Nettle (Kandali), Sea Buckthorn infusions | Harvest season, altitude, raw/processed |

### 3. Heritage Himalayan Wellness

Bridges ancient Ayurvedic wisdom with modern lifestyle needs.

| Subcategory | Products | Key Attributes |
|---|---|---|
| Traditional Supplements | Purified Shilajit, Ashwagandha, Gokshura capsules | Purity %, active compound % |
| Personal Care | Herbal face wash, body lotion, therapeutic crystals | Ingredients, herb source, certifications |

---

## Mobile-First Design Strategy

Based on the PRD requirement for "Amazon/Flipkart-level" efficiency with 70%+ mobile traffic:

| Component | Mobile Strategy | Desktop Strategy |
|---|---|---|
| Navigation | Bottom-anchored icon bar (thumb-friendly) | Sticky top header with mega-menu |
| Product Grid | 2-column vertical scroll | 4–5 column responsive grid |
| Filters | Full-screen overlay with large toggles | Left-side persistent sidebar |
| Checkout | Single-page accordion (address → shipping → pay) | Multi-step progress bar with sidebar summary |
| Search | Predictive with large tap targets | Predictive with visual thumbnail suggestions |
| Cart | Slide-in drawer from right | Full page with sidebar summary |
| B2B Quick Order | Full-width table, horizontal scroll | Spreadsheet-style fixed-header matrix |

---

## AWS Cost Estimate (Monthly)

| Service | Tier | Year 1 | Post-Free Tier |
|---|---|---|---|
| EC2 | t3.micro (free) → t3.small | $0/mo | ~$15/mo |
| S3 | ~10GB product images + assets | ~$0.25/mo | ~$0.25/mo |
| CloudFront | ~50GB transfer/mo | ~$5/mo | ~$5/mo |
| SES | 62K emails free from EC2 | $0/mo | $0/mo |
| Route 53 | 1 hosted zone | ~$0.50/mo | ~$0.50/mo |
| **Total** | | **~$6/mo** | **~$21/mo** |

**Couchbase Capella Free Tier**: $0/mo (1 cluster, sufficient for launch and initial scale)

**Third-party costs (pay-per-use):**
- Razorpay: 2% per domestic transaction
- Stripe: 2.9% + 30¢ per international transaction
- Shiprocket: starts free, per-shipment billing
- MSG91: ~₹0.20 per SMS

---

## Scope Boundaries

### In Scope (MVP — 12 Weeks)

- Full B2C storefront with guest checkout and SSR/SSG for SEO
- B2B wholesale portal (tiered pricing, credit terms, Quick Order Matrix)
- Custom admin panel (inventory, orders, compliance, B2B approvals)
- Razorpay (domestic) + Stripe (international) payment integration
- Shiprocket shipping integration with live rate calculation
- PWA with offline support, installability, and push notifications
- Multi-currency display (INR, USD, EUR, GBP)
- Product traceability (village, artisan, certification)
- Scientific attributes (mukhi count, curcumin %, weight)
- Regulatory compliance document management
- Full SEO: SSR, generateMetadata, JSON-LD, sitemap, robots.txt
- Responsive mobile-first design with bottom navigation
- CI/CD via GitHub Actions

### Out of Scope (Future Phases)

| Feature | Rationale for Deferral |
|---|---|
| AI-powered product recommendations | Add later with a recommendation microservice |
| Multi-vendor marketplace mode | Significant architectural change — Phase 2 |
| Language localization (i18n) | English-first MVP; add Hindi/regional later |
| Automated DDP (Delivered Duty Paid) | Complex customs logic — manual for now |
| Voice-activated search | Low priority vs. text search |
| ERP/Accounting sync (Tally/Zoho) | Manual CSV export sufficient initially |
| Chatbot (Intercom/Zendesk) | Add post-launch based on support volume |
| Loyalty/rewards program | Phase 2 after establishing customer base |
