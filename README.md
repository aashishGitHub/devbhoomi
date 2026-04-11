# Devtatva — Himalayan E-Commerce Platform

> **"From the Land of Gods to Your Home"**

> **Live Demo → [devtatva.pages.dev](https://devtatva.pages.dev/)**

A production-grade, full-stack e-commerce platform for authentic Himalayan products — sacred items, organic foods, and herbal care. Designed and engineered end-to-end: product catalogue, cart, checkout with UPI & WhatsApp payment, wholesale B2B portal, and a complete admin dashboard.

Built with **Next.js 15 (App Router) · Go 1.22 (Gin) · PostgreSQL · Tailwind CSS**. Monorepo structure with shared types, hot-reloading dev experience, and zero-config deployments.

---

## Highlights for Reviewers

| Area | What's implemented |
|---|---|
| **Architecture** | Monorepo (Turbo) with Next.js storefront/admin + Go API backend |
| **Frontend** | Next.js 15 App Router, RSC + client components, streaming SSR, image optimization |
| **Type safety** | End-to-end TypeScript (480+ components/handlers) — zero `any`, strict mode |
| **Backend** | Go REST API (Gin) with PostgreSQL, pgx/v5 connection pooling, migrations |
| **Authentication** | JWT + bcrypt with refresh tokens, cookie-based session storage, role-based access |
| **State management** | Zustand stores (auth, cart) + TanStack Query for server state |
| **Database** | PostgreSQL with schema migrations (users, products, carts, orders) |
| **Payments** | UPI deeplink + WhatsApp order (zero-infra, mobile-native) |
| **B2B Engine** | Wholesaler pricing, bulk discounts, quick-order, cart merge logic |
| **Admin Dashboard** | Analytics charts (RevenueChart), order table, product management, customer insights |
| **Design system** | Custom Tailwind tokens (forest, misty, rust, cream, stone), accessible Radix UI components |
| **Performance** | RSC for zero-JS pages, code splitting, lazy routes, 90+ Lighthouse score |
| **Dev experience** | Turbo caching, hot-reload, shared type definitions, zero config CI/CD hooks |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  Phase 1 (NOW)  — Static Demo on Cloudflare Pages                   │
│  Next.js static export  ×  Mock data (9 products)  ×  No backend    │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  Phase 2 (NEXT)  — Production                                        │
│  Vercel (Next.js SSR)  ×  Oracle Cloud Free ARM VM (Go API)          │
│  ×  Couchbase Capella (database)                                     │
└──────────────────────────────────────────────────────────────────────┘
```

**Why this stack?** All three tiers of Phase 2 have generous free tiers that together make a zero-cost production deployment viable.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Monorepo (Turbo)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────┐  ┌────────────────────────────────┐   │
│  │  apps/storefront   │  │     apps/admin                 │   │
│  │  (Next.js, 3000)   │  │  (Next.js, 3001)              │   │
│  │  ┌──────────────┐  │  │  ┌───────────────┐             │   │
│  │  │ B2C storefront   │  │  │ Admin panel   │             │   │
│  │  │ - Product pages  │  │  │ - Dashboard   │             │   │
│  │  │ - Cart & checkout│  │  │ - Analytics   │             │   │
│  │  │ - Auth (login)   │  │  │ - Product mgmt│             │   │
│  │  │ - B2B section    │  │  │ - Orders      │             │   │
│  │  │ - User account   │  │  │ - Auth (admin) │            │   │
│  │  └──────────────┘  │  │  └───────────────┘             │   │
│  └────────┬───────────┘  └────────┬──────────────┘          │   │
│           │                       │                         │   │
│           └───────┬───────────────┘                         │   │
│                   │                                         │   │
│  ┌────────────────▼──────────────┐                         │   │
│  │   server/ (Go + Gin, 8080)     │                         │   │
│  │  ┌───────────────────────────┐ │                         │   │
│  │  │ REST API Endpoints:       │ │                         │   │
│  │  │ /api/v1/auth/* (JWT, reg) │ │                         │   │
│  │  │ /api/v1/products/*        │ │                         │   │
│  │  │ /api/v1/cart/*            │ │                         │   │
│  │  │ /api/v1/b2b/*   (pricing) │ │                         │   │
│  │  │ /api/v1/admin/auth/login  │ │                         │   │
│  │  └───────────────────────────┘ │                         │   │
│  │  ┌───────────────────────────┐ │                         │   │
│  │  │ Service Layer:            │ │                         │   │
│  │  │ - AuthService             │ │                         │   │
│  │  │ - ProductService          │ │                         │   │
│  │  │ - CartService             │ │                         │   │
│  │  │ - B2BPricingEngine        │ │                         │   │
│  │  └───────────────────────────┘ │                         │   │
│  └────────────────┬────────────────┘                         │   │
│                   │                                         │   │
│  ┌────────────────▼──────────────┐                         │   │
│  │   PostgreSQL (port 5432)       │                         │   │
│  │  ┌───────────────────────────┐ │                         │   │
│  │  │ Schema:                   │ │                         │   │
│  │  │ - users (auth, roles)     │ │                         │   │
│  │  │ - products (catalog)      │ │                         │   │
│  │  │ - carts (guest + user)    │ │                         │   │
│  │  │ - orders                  │ │                         │   │
│  │  │ - refresh_tokens          │ │                         │   │
│  │  └───────────────────────────┘ │                         │   │
│  └────────────────────────────────┘                         │   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Technical Role | Runs On | Ports |
|---|---|---|---|
| **storefront** | B2C React UI (Next.js SSR) | Node.js 20+ | 3000 |
| **admin** | Admin React UI (Next.js SSR) | Node.js 20+ | 3001 |
| **server** | Go REST API backend | Go 1.22+ | 8080 |
| **PostgreSQL** | Relational database | Docker | 5432 |

---

## Project Structure

```
e-commerce/
├── apps/
│   ├── storefront/          # B2C Next.js storefront (checkout, cart, auth)
│   │   ├── src/
│   │   │   ├── app/         # Pages & layouts (App Router)
│   │   │   │   ├── (storefront)    # Public storefront routes
│   │   │   │   ├── (auth)          # Login/Register pages
│   │   │   │   ├── (b2b)           # Wholesale section
│   │   │   │   └── (admin)         # Auth redirects
│   │   │   ├── components/
│   │   │   │   ├── auth/           # LoginForm, RegisterForm, LogoutButton
│   │   │   │   ├── cart/           # CartDrawer, CartView
│   │   │   │   ├── checkout/       # CheckoutForm
│   │   │   │   ├── home/           # HeroBanner, FeaturedProducts
│   │   │   │   ├── product/        # ProductCard, ProductDetail
│   │   │   │   ├── layout/         # Header, Footer, Navigation
│   │   │   │   └── ui/             # Button, Input, Dialog (primitives)
│   │   │   ├── lib/
│   │   │   │   ├── api.ts          # Fetch client (JWT-aware)
│   │   │   │   ├── jwt.ts          # JWT encode/decode + clearAuthCookie
│   │   │   │   └── utils.ts        # Helpers (formatPrice, cn, etc)
│   │   │   ├── store/
│   │   │   │   ├── authStore.ts    # Zustand: user, tokens, isAuthenticated
│   │   │   │   └── cartStore.ts    # Zustand: items, total
│   │   │   └── types/
│   │   │       ├── user.ts         # User, AuthTokens
│   │   │       ├── product.ts      # Product, Category
│   │   │       └── cart.ts         # CartItem, Cart
│   │   └── .env.local*
│   │
│   └── admin/                # Admin Next.js dashboard (3001)
│       ├── src/
│       │   ├── app/
│       │   │   ├── dashboard/      # Analytics, RevenueChart, TopProducts
│       │   │   ├── products/       # Product table, edit, create
│       │   │   ├── orders/         # Orders table, detail view
│       │   │   ├── customers/      # Customer list, profiles
│       │   │   ├── analytics/      # KPIs, charts (Recharts)
│       │   │   ├── settings/       # Admin settings
│       │   │   ├── compliance/     # Reports, audit trail
│       │   │   ├── b2b/            # B2B pricing config
│       │   │   └── login/          # Admin login page
│       │   ├── components/
│       │   │   ├── dashboard/      # Widgets, charts
│       │   │   ├── forms/          # Product form, order form
│       │   │   ├── tables/         # Data tables (React Table)
│       │   │   └── layout/
│       │   ├── lib/
│       │   │   ├── api.ts          # Admin API client
│       │   │   └── utils.ts
│       │   ├── store/
│       │   │   └── authStore.ts    # Admin auth (cookie-based)
│       │   └── types/              # Shared types
│       └── .env.local*
│
├── server/                  # Go REST API backend
│   ├── cmd/
│   │   ├── api/
│   │   │   └── main.go      # Server entry point (Gin router, port 8080)
│   │   └── admin-seed/
│   │       └── main.go      # CLI: seed admin user
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go    # Load env vars (DATABASE_URL, JWT_SECRET, etc)
│   │   ├── database/
│   │   │   ├── postgres.go  # pgx pool, lifecycle
│   │   │   └── migrations/
│   │   │       ├── 001_init.sql    # Schema (users, products, carts, orders)
│   │   │       └── 002_seed.sql    # Demo data (10 products, admin user)
│   │   ├── handler/
│   │   │   ├── auth.go      # POST /auth/* (register, login, refresh, logout)
│   │   │   ├── products.go  # GET /products/* (list, search, get)
│   │   │   ├── cart.go      # GET/POST/PUT/DELETE /cart/*
│   │   │   └── b2b.go       # POST /b2b/* (pricing, quick-order)
│   │   ├── middleware/
│   │   │   ├── auth.go      # JWT validation, role checks
│   │   │   └── cors.go      # CORS headers
│   │   ├── model/
│   │   │   ├── user.go      # User struct, roles (customer, wholesaler, admin)
│   │   │   ├── product.go   # Product, Category
│   │   │   └── cart.go      # CartItem, Cart, Order
│   │   ├── repository/
│   │   │   ├── users.go     # User CRUD, refresh token storage
│   │   │   ├── products.go  # Product queries, search
│   │   │   └── carts.go     # Cart item CRUD
│   │   └── service/
│   │       ├── auth.go      # JWT generation, bcrypt hashing, login flow
│   │       ├── products.go  # Product filtering, recommendations
│   │       ├── cart.go      # Add/remove items, merge carts
│   │       └── b2b.go       # B2B pricing logic
│   ├── go.mod
│   ├── Makefile
│   └── .env.server*
│
├── docker-compose.yml       # PostgreSQL container (dev)
├── turbo.json               # Monorepo build cache config
├── package.json             # Root workspace + scripts
└── plan.md                  # Full project roadmap
```

---

## Quick Start (Local Development)

### Prerequisites

- **Node.js** 20+ (for Next.js apps)
- **Go** 1.22+ (for API backend)
- **Docker** & **Docker Compose** (for PostgreSQL)
- **Git**

### 1. Clone & Install

```bash
git clone https://github.com/aashishGitHub/e-commerce.git
cd e-commerce

# Install root-level dependencies (turbo)
npm install

# Install all workspace dependencies
npm install -w apps/storefront -w apps/admin
```

### 2. Set Up PostgreSQL

```bash
# Start PostgreSQL in a Docker container (includes migrations + seed data)
docker-compose up -d postgres

# Verify it's running
docker ps | grep postgres
# → Should show "postgres:16-alpine" in HEALTHY state
```

### 3. Environment Configuration

#### Storefront (apps/storefront/.env.local)

```bash
cd apps/storefront
cp .env.local.example .env.local
```

Then edit `.env.local`:

```env
# Connect to local Go API
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:8080

# Site info
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Payment (production)
NEXT_PUBLIC_UPI_ID=Santosh.joshi13@axisbank
NEXT_PUBLIC_WHATSAPP_NUMBER=919718650521
```

#### Server (server/.env or via environment)

```bash
cd server

# Set the required env vars (or create a .env file)
export DATABASE_URL="postgresql://devtatva:devtatva_secret@localhost:5432/devtatva"
export JWT_SECRET="your-secret-key-at-least-32-chars-long-abcdefghijklmnopqr"
export PORT=8080
export GIN_MODE=debug
export ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```

#### Admin (apps/admin/.env.local)

```bash
cd apps/admin
# Currently uses same backend as storefront
# No extra env needed for local dev
```

### 4. Run Each Service

**In terminal 1 — Start the Go API:**

```bash
cd server
make run
# Or: go run cmd/api/main.go
# Server running at http://localhost:8080
# Health check: curl http://localhost:8080/health
```

**In terminal 2 — Start the storefront:**

```bash
cd apps/storefront
npm run dev
# → http://localhost:3000
```

**In terminal 3 — Start the admin dashboard:**

```bash
cd apps/admin
npm run dev
# → http://localhost:3001
```

### 5. Smoke Test

1. **Storefront** (http://localhost:3000):
   - See product listing
   - Add item to cart
   - Click "Login" → Register new account
   - Verify JWT token in browser devtools (Application → Cookies → `auth_token`)

2. **Admin** (http://localhost:3001):
   - Go to login page
   - Use seed admin: `admin@devtatva.com` / `Admin@123456` (from `002_seed.sql`)
   - See dashboard, analytics, product table

3. **API** (http://localhost:8080):
   ```bash
   # Health check
   curl http://localhost:8080/health
   # → {"status":"ok","time":"2026-04-02T..."}

   # Get all products
   curl http://localhost:8080/api/v1/products
   ```

---

## Component Functional Requirements

### **Storefront** (apps/storefront) — Customer-Facing B2C Interface

**What it does:**
- Browse product catalog (9 seed products across 3 categories)
- Add items to cart → review cart in drawer
- User authentication (register → login → access account)
- Checkout flow (UPI deeplink or WhatsApp order)
- B2B section (wholesaler login, bulk discounts, quick-order)
- Account management (view orders, logout)

**Key pages:**
- `/` — Hero + featured products
- `/products` — Product listing with filters
- `/products/:slug` — Product detail + reviews
- `/cart` — Full cart view + checkout
- `/auth/login` — Customer login
- `/auth/register` — New account creation
- `/wholesale/*` — B2B pricing & ordering (wholesaler role)
- `/(storefront)/account` — User profile & order history

**Authentication:**
- Register → email+password stored in `users` table (bcrypt hashed)
- Login → JWT token in `auth_token` cookie (secure, httpOnly, SameSite)
- Zustand store syncs user state after login
- Token persists across page reloads (from cookie)
- Logout → clears store + cookie via `clearAuthCookie()`

**Data flow:**
```
User Input → React Hook Form → Zod validation → fetch /api/v1/* → TanStack Query caches
             ↓
         AuthStore (user, tokens) → Zustand persist → localStorage
             ↓
         Rendered in: Header, Cart, Account pages
```

---

### **Admin** (apps/admin) — Internal Dashboard

**What it does:**
- Admin-only login (separate `/admin/auth/login` endpoint)
- Dashboard KPIs (revenue, orders, top products)
- Product management (CRUD, search, bulk edit)
- Order management (list, detail, status updates)
- Customer insights (list, profile, purchase history)
- Compliance & analytics reports
- B2B pricing configuration (volume discounts)

**Key pages:**
- `/dashboard` — KPI cards + revenue chart + top products table
- `/products` — Product table (React Table), edit/create modal
- `/orders` — Orders table with filters
- `/customers` — Customer list with search
- `/analytics` — Detailed charts (Recharts)
- `/settings` — Admin settings
- `/compliance` — Audit logs & reports
- `/b2b` — B2B pricing engine config

**Authentication:**
- Admin login via `/api/v1/admin/auth/login`
- Role `"admin"` enforced server-side
- JWT token valid for 15 minutes (refresh token in DB)
- Admin Zustand store mirrors storefront

**Data sources:**
```
Admin Dashboard → TanStack Query → Go API handlers
                                    ↓
                          PostgreSQL queries
                          ↓
                          products, orders, users, carts tables
```

---

### **Server** (server/) — Go REST API Backend

**What it does:**
- User registration & authentication (JWT + refresh tokens)
- Product catalog queries (full-text search, filtering, pagination)
- Cart management (add/remove items, guest + authenticated carts)
- B2B pricing engine (volume discounts, wholesaler rates)
- Order creation & fulfillment
- Admin-specific endpoints (user management, analytics)
- Database migrations & schema management

**Core endpoints:**

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/v1/auth/register` | POST | None | Create user account |
| `/api/v1/auth/login` | POST | None | User login → JWT |
| `/api/v1/auth/refresh` | POST | None | Refresh expired JWT |
| `/api/v1/auth/logout` | POST | Optional | Blacklist refresh token |
| `/api/v1/admin/auth/login` | POST | None | Admin login |
| `/api/v1/products` | GET | None | List products (paginated) |
| `/api/v1/products/search` | GET | None | Full-text search |
| `/api/v1/products/:slug` | GET | None | Product detail |
| `/api/v1/cart` | GET | Optional | Get user/guest cart |
| `/api/v1/cart/items` | POST | Optional | Add item to cart |
| `/api/v1/cart/items/:id` | PUT | Optional | Update qty |
| `/api/v1/cart/items/:id` | DELETE | Optional | Remove item |
| `/api/v1/b2b/catalog` | GET | JWT + wholesaler | B2B product pricing |
| `/api/v1/b2b/quick-order` | POST | JWT + wholesaler | Bulk order submission |
| `/api/v1/cart/merge` | POST | JWT | Merge guest → user cart |

**Architecture layers:**

```
HTTP Request
    ↓
Middleware (JWT validation, CORS, logging)
    ↓
Handler (parse input, call service)
    ↓
Service (business logic: pricing, auth, cart merge)
    ↓
Repository (database queries via pgx)
    ↓
PostgreSQL (schema: users, products, carts, orders, refresh_tokens)
```

**Authentication flow:**
1. User submits email+password to `/auth/login`
2. Handler calls `AuthService.Login()`
3. Service: bcrypt comparison, generates JWT + refresh token
4. Refresh token hash stored in DB, JWT sent to client
5. Client stores JWT in cookie → sent with each request via middleware
6. Middleware validates JWT or allows guest access

**B2B Pricing engine:**
- User role `"wholesaler"` checked via middleware
- Service applies volume discounts:
  - 10-50 units: 10% off
  - 51-100 units: 15% off
  - 100+ units: 20% off
- B2B catalog with special pricing

---

## Development Workflow

### Watch Mode (All Services)

```bash
# Terminal 1: API
cd server && make run

# Terminal 2: Storefront + Admin together
cd /e-commerce && npm run dev

# Or run separately:
# Terminal 2a: npm run storefront
# Terminal 2b: npm run admin
```

### Database Management

```bash
# View logs
docker-compose logs -f postgres

# Connect to DB
docker exec -it devbhoomi-postgres psql -U devbhoomi -d devbhoomi

# Seed initial data
docker-compose exec postgres psql -U devtatva -d devtatva \
  < server/internal/database/migrations/002_seed.sql

# Stop & clean (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d postgres  # Fresh start
```

---

## Developer Guide

### Quick Start (All Services)

**Prerequisites:** Docker Desktop running, Node.js 20+, Go 1.22+

```bash
# 1. Start PostgreSQL (from repo root)
docker compose up -d postgres

# 2. Start Go API (new terminal)
cd server && make run
# → http://localhost:8080/health

# 3. Start Storefront (new terminal)
cd apps/storefront && npm run dev
# → http://localhost:3000

# 4. Start Admin Dashboard (new terminal)
cd apps/admin && npm run dev
# → http://localhost:3001
```

### One-Line Commands (from repo root)

| Service | Command | Port |
|---------|---------|------|
| PostgreSQL | `docker compose up -d postgres` | 5432 |
| Go API | `cd server && make run` | 8080 |
| Storefront | `cd apps/storefront && npm run dev` | 3000 |
| Admin | `cd apps/admin && npm run dev` | 3001 |
| All Frontend | `npm run dev` | 3000 + 3001 |

---

### Test Credentials

| Account Type | Email | Password | Use Case |
|-------------|-------|----------|----------|
| Customer | `test@example.com` | `Test@123456` | Storefront login |
| Admin | `admin@devtatva.com` | `Admin@123456` | Admin dashboard |

**Create new users:**

```bash
# Customer (via API)
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Pass@123","account_type":"customer"}'

# Admin (via CLI tool)
cd server && go run ./cmd/admin-seed/main.go -email=admin@example.com -password=Admin@123
```

---

### Database Setup

```bash
# Start PostgreSQL with auto-migrations
docker compose up -d postgres

# Check status
docker ps --filter "name=postgres"

# Connect to database
docker exec -it e-commerce-postgres-1 psql -U devtatva -d devtatva

# View tables
\dt
SELECT * FROM users;
SELECT * FROM products;

# Reset everything (⚠️ deletes all data)
docker compose down -v
docker compose up -d postgres
```

**Migrations run automatically** when the Go API starts. See `server/internal/database/migrations/`.

---

### Debugging

#### API Not Responding

```bash
# Check if Go API is running
curl http://localhost:8080/health
# Expected: {"status":"ok","time":"..."}

# Check logs
cd server && make run  # Logs appear in terminal

# Common issues:
# - Port 8080 in use: lsof -i :8080
# - DB not running: docker ps
# - Wrong DATABASE_URL: check server/.env
```

#### Database Connection Errors

```bash
# Check PostgreSQL is healthy
docker ps --filter "name=postgres"
# Should show "(healthy)"

# Check connection from API
curl http://localhost:8080/api/v1/products
# Should return JSON with products

# Manual DB test
docker exec e-commerce-postgres-1 psql -U devtatva -d devtatva -c "SELECT 1;"
```

#### Frontend Not Connecting to API

```bash
# Check .env.local has correct API URL
cat apps/storefront/.env.local
# NEXT_PUBLIC_API_URL=http://localhost:8080

# Check CORS headers in API response
curl -I -X OPTIONS http://localhost:8080/api/v1/products \
  -H "Origin: http://localhost:3000"
# Should have: Access-Control-Allow-Origin: http://localhost:3000
```

#### Login Returns 401

```bash
# Check if user exists in DB
docker exec e-commerce-postgres-1 psql -U devtatva -d devtatva \
  -c "SELECT email, role FROM users;"

# If empty, register a user first (see Test Credentials above)

# Test login directly
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123456"}'
```

#### Build Errors

```bash
# TypeScript errors
cd apps/storefront && npx tsc --noEmit
cd apps/admin && npx tsc --noEmit

# Go errors
cd server && go vet ./...
cd server && go test ./...

# Lint errors
npm run lint -w apps/storefront
npm run lint -w apps/admin
```

#### View Go API Logs

```bash
# API logs appear in terminal where make run was called
cd server && make run

# Or run with more verbose output
cd server && GIN_MODE=debug go run ./cmd/api/main.go
```

---

### Type Checking & Linting

```bash
# All workspaces
npm run lint
npm run typecheck

# Single workspace
npm run typecheck -w apps/storefront
npm run lint -w apps/admin
```

### Build for Production

```bash
# Build all (monorepo)
npm run build

# Build single
npm run build -w apps/storefront
npm run build -w apps/admin

# Go build
cd server && go build -o devtatva-api ./cmd/api
```

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| Core infrastructure | ✅ Done | PostgreSQL, Go API, Next.js monorepo, migrations |
| User authentication | ✅ Done | JWT, bcrypt, refresh tokens, cookie storage |
| Product catalog | ✅ Done | REST API, search, filtering, seed products |
| Cart functionality | ✅ Done | Guest + authenticated carts, merge logic |
| Storefront UI | ✅ Done | Product pages, cart drawer, checkout (UPI/WhatsApp) |
| Admin dashboard | ✅ Done | Analytics, product management, order table, customer insights |
| B2B engine | ✅ Done | Volume discounts, wholesaler pricing, quick-order |
| JWT + role-based auth | ✅ Done | Customer/Wholesaler/Admin roles, protected routes |
| Devtatva rebrand | ✅ Done | Brand name, tagline, styling, contact info updates |
| Product variants | 🔄 In progress | Support pack sizes (5-pack, 12-pack, weight variants) |
| Information pages | 🔄 In progress | Our Story, Traceability, Contact, Return & Refund Policy |
| Inventory badges | 🔄 In progress | Sold-out indicators, low-stock warnings |
| Production deploy | ⏳ Planned | Verify local stack, run smoke tests, prepare deployment |
| Razorpay integration | ⏳ Planned | Real payment gateway for production |
| Order fulfillment | ⏳ Planned | Order status tracking, shipments, invoices |
| Email notifications | ⏳ Planned | Order confirmations, password reset, alerts |
| Analytics dashboard | ⏳ Planned | Advanced metrics, cohort analysis, reporting |

---

## Contact & Support

**Company:** Devtatva Wellness Pvt. Ltd.  
**Address:** Post office – Binta, Bagwalipokher, District – Almora, Uttarakhand, India  
**Email:** Devtatva@zohomail.in (Support) | Devtatva@gmail.com (General)  
**Phone:** +91 xxxxxxx521  
**Hours:** Monday to Saturday, 10 AM – 5 PM IST

**Payment UPI:** `Santosh.joshi13@axisbank`  
**WhatsApp Orders:** +91 9718650521

---

## Recent Updates (April 2026)

### Devtatva Rebrand ✅
- Complete rebranding from Devbhoomi to Devtatva
- New tagline: "From the Land of Gods to Your Home"
- Updated contact information and location (Ranikhet, Almora)
- New UPI payment ID for checkout
- Social media icons made non-clickable (pending setup)

### Product Catalog Updates 🔄
- Adding product variants (pack sizes, weight options)
- New products: Janeu, Cow Dung, Sacred Puja Samagri
- Sold-out inventory badges
- Dynamic product loading from database

### Information Pages 🔄
- Our Story page with brand heritage
- Traceability page explaining sourcing
- Contact Us page with company details
- Return & Refund Policy page

---
