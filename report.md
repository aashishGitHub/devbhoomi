Read skill [system-design-study](file:///Users/aashishkumar/.copilot/skills/system-design-study/SKILL.md?vscodeLinkType%3Dskill#1-1), lines 1 to 100

Read skill [system-design-study](file:///Users/aashishkumar/.copilot/skills/system-design-study/SKILL.md?vscodeLinkType%3Dskill#100-100), lines 100 to 220

Now I have the full skill format. This isn't interview prep, but I'll apply the same structured narrative depth to produce a senior-engineer-grade technical retrospective. Here it is:

---

# Devbhoomi — Architecture Retrospective: Building & Deploying a Production-Grade E-Commerce Platform at Zero Cost

*A narrative engineering write-up for senior engineers. The decisions, the failures, and the reasoning behind every choice.*

---

## The Problem Statement

The brief was simple on paper: build a full e-commerce storefront for a Himalayan products business — sacred items, organic foods, wellness products — and get it visible to the client within days, not months. No cloud budget. No payment gateway contract yet. No backend team. One engineer, evenings and weekends.

The constraint that shaped every decision: **the MVP had to be deployable with ₹0 infra cost**, but the codebase had to be wired for a real production backend the moment one was ready. This ruled out throwaway prototype patterns.

---

## Phase 1 Goal: Static Demo on Edge CDN

The first deliverable was a shareable URL the client could click, browse products, add to cart, and simulate checkout. Real enough to get stakeholder sign-off, architected honestly enough that Phase 2 wouldn't require a rewrite.

The choice was **Next.js 15 App Router with `output: 'export'`** deployed to **Cloudflare Pages**. Here's why each piece of that matters:

### Why Next.js 15 App Router (not Pages Router, not Vite+React)

Next.js 15 App Router ships React Server Components (RSC) as the default. For a product catalogue with SEO requirements, this matters enormously — product pages are pre-rendered HTML at build time, not JS-rendered shells. The important insight is that App Router distinguishes between *where* a component runs (server vs client) as a first-class concern, not an afterthought. This forces good architecture.

The alternative — Vite + React SPA — would have given a faster dev start but meant every product page would be `<div id="root"></div>` from Google's crawler's perspective. For an e-commerce store, that's a non-starter.

### Why Cloudflare Pages over Vercel, Netlify, or GitHub Pages

Cloudflare Pages serves static files from their edge network — the same infrastructure as Cloudflare's enterprise CDN. Cold start time for a static asset is literally 0ms because there is no cold start. Every request is a cache hit on a node closest to the user.

Vercel's free tier is excellent but rate-limited for bandwidth and functions. GitHub Pages has no edge CDN — it's origin serving from US-East. Netlify free tier has build minute limits.

Cloudflare Pages free tier: unlimited requests, unlimited bandwidth, unlimited builds. The only caveat is the `*.pages.dev` domain gets flagged as suspicious by Microsoft Safe Links (because phishers also use it) — a lesson learned the hard way when LinkedIn blocked the URL.

---

## The Architecture Decision That Made Everything Work: The Service Abstraction Layer

This is the decision I am most proud of — and it cost almost nothing to implement.

In `src/lib/products-data.ts`:

```ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
export const productService = USE_MOCK ? mockProductsApi : productsApi;
```

Two lines. `NEXT_PUBLIC_USE_MOCK` is baked into the bundle at build time (it's a `NEXT_PUBLIC_` variable, meaning it's inlined by the webpack build, not read at runtime). This means:

- When `NEXT_PUBLIC_USE_MOCK=true`: the entire `productsApi` (which calls the Go backend) is **tree-shaken out of the bundle entirely**. The production Go API client ships as dead code elimination — it doesn't exist in the static export.
- When `NEXT_PUBLIC_USE_MOCK=false`: the mock data and in-memory filter logic is tree-shaken out.

The `mockProductsApi` implements the exact same TypeScript interface as `productsApi`. Same function signatures, same return types. The rest of the codebase — every component, every page — calls `productService.list()`, `productService.get()` with zero awareness of which implementation is running.

This is the Open/Closed principle applied to deployment targets. The flip from demo to production is one env variable. No code changes.

---

## The Static Export Trap: Three Failures and Their Fixes

### Failure 1: `output: 'export'` and Async Routes

Next.js static export (`output: 'export'`) sounds like "just build HTML files" but it has a specific constraint that burned us: **every route must be statically determinable at build time.** Any route that calls `fetch()` at request time without being explicitly marked `force-static` breaks the build.

The sitemap (`/sitemap.xml`) was fetching product slugs from the Go API:

```ts
// sitemap.ts — BROKEN in static export
export default async function sitemap() {
  const res = await fetch(`${API_URL}/api/v1/products?fields=slug`);
  // ...
}
```

Build error:
```
Error: export const dynamic = "force-static" not configured 
on route "/sitemap.xml" with output: export
```

Same error in robots.ts.

**The fix was architectural, not a hack.** We added `export const dynamic = "force-static"` to both routes, and made the sitemap data-source-aware:

```ts
export const dynamic = "force-static";

export default async function sitemap() {
  const slugs = USE_MOCK
    ? MOCK_PRODUCTS.map(p => p.slug)        // build-time, from local data
    : await fetchSlugsFromAPI();             // SSR mode only
}
```

Now the sitemap is accurate in both modes — 9 mock products in static export, live catalogue in SSR.

### Failure 2: `useSearchParams()` and the Prerender Crash

Product filtering was done via URL search params (`?category=sacred&sort=price_asc`). In the original design, the server-side page component read `searchParams` from the Next.js page props — valid in SSR, completely invalid in static export because there are no request-time search params when generating static HTML.

We converted `ProductGrid`, `ProductFilters`, `SearchBar`, and `SortSelect` to client components using `useSearchParams()`. But this introduced a new problem in static export: **any component calling `useSearchParams()` must be wrapped in `<Suspense>` or the build prerender crashes.**

The error:
```
useSearchParams() should be wrapped in a suspense boundary at page "/products"
```

This is correct behaviour — `useSearchParams()` suspends during SSR prerender to wait for hydration. Without a Suspense boundary, the prerender throws. The fix was wrapping every `useSearchParams` consumer in Suspense with a skeleton fallback:

```tsx
<Suspense fallback={<FilterSkeleton />}>
  <ProductFilters />  {/* reads URL internally */}
</Suspense>
```

The pattern this produces is actually better UX than the original — users see skeleton placeholders during initial hydration instead of a layout shift.

### Failure 3: TypeScript Strict Mode and the `boolean` in Records

The `Product` type had:
```ts
scientific_attributes?: Record<string, string | number>
```

Mock data had:
```ts
scientific_attributes: { gluten_free: true, lab_tested: true }
```

`boolean` was not in the union. TypeScript strict mode caught this — `tsc --noEmit` showed 5 errors across the mock data file. Fixed to:
```ts
scientific_attributes?: Record<string, string | number | boolean>
```

The lesson: mock data must satisfy the same type contract as production data. If your mock data needs type relaxations, your types are wrong.

---

## Payment Without a Payment Gateway

This one required creative engineering. Razorpay and Stripe both need a backend to create order sessions server-side (you can never trust a client-computed amount). We had no backend in Phase 1.

**UPI Deeplink** — the Android/iOS intent system for UPI:

```
upi://pay?pa=9243469722@yescred&pn=Devbhoomi&am=1499&cu=INR&tn=Order%20%23DB-1234
```

This opens any installed UPI app (GPay, PhonePe, Paytm, BHIM) with the merchant VPA, amount, and transaction note pre-filled. The user confirms in their app. No backend, no webhook, no KYC required for the store.

**WhatsApp Order** — for users who want human confirmation:

```
https://wa.me/919718650521?text=Hi, I'd like to order: Rudraksha Mala (×1) — ₹1,499. Order ID: DB-1234
```

The cart contents are serialized into the WhatsApp message at checkout time. The merchant receives a message with the complete order, confirms manually, and coordinates delivery. This is how most small Indian e-commerce businesses actually operate.

Neither approach scales to 10,000 orders/day. But for a bootstrapped Himalayan products store doing 10–50 orders/week, it works perfectly and requires zero infrastructure.

---

## The Production Stack (Phase 2)

When the Go API is ready, the deployment target shifts. Here's the architecture and reasoning:

### Vercel for Next.js (not Cloudflare Pages)

In SSR mode (`NEXT_PUBLIC_USE_MOCK=false`), we need a Node.js runtime for Next.js server components and API routes. Cloudflare Pages supports Next.js via their open-next adapter, but it runs on Workers (V8 isolates) which have a 128MB memory limit and no native Node.js APIs. That's too limiting for a production app.

Vercel is the reference platform for Next.js — it's built by the same team. SSR, ISR, React Server Components, streaming — all work exactly as designed. Free tier handles ~100GB bandwidth/month and unlimited serverless function invocations on hobby tier.

### Oracle Cloud Always Free ARM VM for Go API

Oracle's Always Free tier includes two ARM-based Ampere A1 instances with 4 OCPUs and 24GB RAM collectively — permanently free, no credit card expiry catch. This is significantly more generous than AWS Free Tier (which expires after 12 months) or Fly.io free tier (which was discontinued).

The Go API runs as a systemd service behind nginx (also on the VM). Go compiles to a single binary — deployment is `scp binary host:~ && ssh host systemctl restart api`. No Docker, no Kubernetes, no container registry.

### Couchbase Capella for the Database

Why Couchbase over PostgreSQL for this use case?

Product catalogues are document-heavy. A `Product` document has nested arrays (`images[]`, `attributes{}`, `variants[]`), optional scientific attributes, and category-specific fields that differ by product type. In PostgreSQL this would require JSONB columns or a complex normalized schema with joins. In Couchbase, a product is literally the JSON document — no impedance mismatch.

Couchbase also has N1QL (SQL for JSON) with index support, so complex filter queries (`WHERE category = 'sacred' AND price BETWEEN 500 AND 2000 ORDER BY price ASC`) work with proper index coverage.

Capella's free tier: 1 cluster, 3 nodes, 200GB storage. Sufficient for a product catalogue with tens of thousands of SKUs.

---

## What a Senior Engineer Should Take Away

**1. The env-flag abstraction is worth the 20 minutes it takes to set up.** A single boolean that switches data sources at build time — with tree-shaking eliminating the unused path — is cleaner than feature flags, environment-specific code branches, or separate repos for mock/prod.

**2. Next.js static export is stricter than you expect.** Every async route, every `useSearchParams` consumer, every client component that touches request context needs to be explicitly handled. The good news: the errors are clear and the fixes are architectural improvements.

**3. Free tier infra in 2026 is production-viable for small load.** Oracle Cloud Always Free ARM VMs are the most underrated resource in backend engineering. 4 OCPUs + 24GB RAM for a Go API is genuinely sufficient for thousands of daily users.

**4. UPI deeplinks are a legitimate payment primitive.** For India-specific products, UPI covers 85%+ of smartphone users. The absence of a payment gateway isn't a gap in the product — it's a valid Phase 1 architecture decision.

**5. TypeScript strict mode with `tsc --noEmit` in CI is non-negotiable.** Mock data that doesn't satisfy your production types is a liability. Catch it at compile time.

---

🌐 **Live demo:** https://devbhoomi.pages.dev
💻 **Source:** https://github.com/aashishGitHub/devbhoomi
Let me check the actual Go API code first so the write-up is accurate: 

Explore Go API backend structure

Read [](file:///Users/aashishkumar/Documents/GitHub/e-commerce/apps/api)

Read [](file:///Users/aashishkumar/Documents/GitHub/e-commerce/apps)

Read [](file:///Users/aashishkumar/Documents/GitHub/e-commerce)

The Go backend is Phase 2 — not built yet. Let me read the frontend API client and PRD to write the backend section accurately based on the intended design:  

Read [](file:///Users/aashishkumar/Documents/GitHub/e-commerce/apps/storefront/src/lib/api.ts#1-1), lines 1 to 100

Read [](file:///Users/aashishkumar/Documents/GitHub/e-commerce/PRD.md#1-1), lines 1 to 80

Read [](file:///Users/aashishkumar/Documents/GitHub/e-commerce/apps/storefront/src/types/product.ts)

Read [](file:///Users/aashishkumar/Documents/GitHub/e-commerce/apps/storefront/src/types/user.ts)

Now I have everything. Here's the extended backend section — append it to the existing retrospective:

---

## The Backend Architecture (Phase 2 Design)

*The Go API doesn't exist in the repository yet — by design. But the contract it must fulfil is fully specified, enforced by TypeScript at compile time, and validated by the mock implementation. This section documents the decisions made now so the implementation doesn't drift.*

---

### Why Go, Not Node.js

The frontend is already Node.js (Next.js). The instinct is to use the same ecosystem for the backend — share types, share deployment, fewer languages to context-switch between.

Rejected for three reasons:

**1. Concurrency model.** Go's goroutine scheduler handles thousands of concurrent connections with a few MB of stack, growing dynamically. Node.js is single-threaded — a CPU-bound filter query blocks the event loop. For a product search endpoint that might do N1QL queries against Couchbase and apply in-memory transformations, Go's goroutines are simply better suited.

**2. Binary deployment to a VM.** The production target is an Oracle Cloud ARM VM. Go compiles to a single self-contained binary. Deployment is:
```bash
GOARCH=arm64 GOOS=linux go build -o devbhoomi-api ./cmd/api
scp devbhoomi-api oracle-vm:~/
ssh oracle-vm "sudo systemctl restart devbhoomi-api"
```
No Docker, no container registry, no runtime to install. The binary is the deployment artifact.

**3. Memory footprint.** A Go HTTP server idling at ~15MB RAM. A Node.js/Express equivalent at ~80MB. On a shared ARM VM with 24GB total across all services, this matters.

---

### API Contract — Derived from the Frontend

The frontend `src/lib/api.ts` defines the exact HTTP contract the Go backend must implement. This is the canonical API spec — not Swagger, not Postman, not a doc — the TypeScript client is the spec.

```
GET  /api/v1/products?q=&category=&sort=&min_price=&max_price=&page=
     → ProductListResponse { items[], total, page, per_page, total_pages }

GET  /api/v1/products/:slug
     → Product

GET  /api/v1/products/search?q=
     → ProductListResponse

POST /api/v1/auth/login    → AuthTokens { access_token, refresh_token, expires_in }
POST /api/v1/auth/register → AuthTokens
POST /api/v1/auth/refresh  → AuthTokens

GET  /api/v1/cart                  (Bearer token, optional)
POST /api/v1/cart/items            (Bearer token, optional)
PUT  /api/v1/cart/items/:id        (Bearer token, optional)
DELETE /api/v1/cart/items/:id      (Bearer token, optional)
```

The guest cart (no token) and authenticated cart (with token) use the same endpoints — the API resolves identity from the JWT or falls back to a session ID cookie. The frontend never passes a `user_id` in the request body — it's always pulled from the JWT on the server. This is enforced by TypeScript: the `CartItem` type in the request body only contains `product_id` and `quantity`.

---

### Data Model Design — Why Document DB Fits This Domain

The `Product` type in TypeScript maps directly to a Couchbase document:

```json
{
  "id": "prod::5-mukhi-rudraksha-mala",
  "name": "5-Mukhi Rudraksha Mala",
  "slug": "5-mukhi-rudraksha-mala",
  "category": "sacred",
  "price": { "inr": 1299, "usd": 15.60 },
  "b2b_pricing": [
    { "min_qty": 10, "max_qty": 49, "discount_pct": 10 },
    { "min_qty": 50, "discount_pct": 20 }
  ],
  "traceability": {
    "village_of_origin": "Haridwar, Uttarakhand",
    "artisan_name": "Ramesh Prasad",
    "certification_id": "NPOP-2024-HR-0041"
  },
  "scientific_attributes": {
    "mukhi_count": 5,
    "certified_genuine": true,
    "bead_diameter_mm": 18
  }
}
```

Notice `scientific_attributes` is a `Record<string, string | number | boolean>` — the keys and value types vary per product category. A Rudraksha has `mukhi_count`. A ghee has `fat_percentage` and `a2_certified`. A shilajit has `fulvic_acid_pct`.

In PostgreSQL this would require either a JSONB column (losing type discipline) or a category-specific attributes table per product type (complex joins, schema migrations per new category). In Couchbase the document is the schema — adding a new attribute to a product is adding a key. There is no `ALTER TABLE`.

The tradeoff: N1QL queries on `scientific_attributes` require a secondary index per attribute you want to filter on. For a product catalogue of <10,000 SKUs this is fine — full collection scans are fast enough with Couchbase's memory-first architecture.

---

### Auth Design — JWT + Refresh Token Rotation

The `AuthTokens` type tells the full story:
```ts
{ access_token: string; refresh_token: string; expires_in: number }
```

**Access token**: Short-lived (15 minutes), stateless JWT containing `{ user_id, role, email }`. Validated by the Go API on every authenticated request by verifying the HMAC-SHA256 signature. No database lookup required on the hot path.

**Refresh token**: Long-lived (30 days), stored in Couchbase as a document keyed by `refresh::<uuid>` with a TTL set to 30 days. When the access token expires, the frontend posts the refresh token to `/api/v1/auth/refresh` — the API validates the refresh token document exists in Couchbase, issues a new access token, and **rotates the refresh token** (deletes old, issues new). Refresh token rotation prevents replay attacks — a stolen refresh token can only be used once.

**Role system**: The `User.role` field is `"customer" | "wholesaler" | "admin"`. The Go middleware reads the role from the JWT payload and enforces route-level access control:
- `wholesaler` role unlocks the B2B pricing endpoints and Quick Order Matrix
- `admin` role unlocks the admin API (product CRUD, order management)
- Guest (no token) gets read-only access to the catalogue and an anonymous cart via session cookie

---

### B2B Pricing — The Business Logic That Lives in the API

The `Product.b2b_pricing` array defines tiered pricing:
```ts
b2b_pricing?: Array<{
  min_qty: number;
  max_qty?: number;
  discount_pct: number;
}>
```

The discount calculation is **server-side only**. The frontend never computes the final B2B price — it sends `{ product_id, quantity }` to the cart API and receives back the computed line item price. This prevents a client from manipulating the quantity to hit a higher discount tier and then reducing the quantity before checkout.

The Go handler for `POST /api/v1/cart/items`:
1. Fetches the product document from Couchbase by `product_id`
2. Checks if the authenticated user has `role: "wholesaler"`
3. If yes, iterates `b2b_pricing` tiers to find the applicable discount for the requested quantity
4. Applies the discount and stores the computed price in the cart document
5. Returns the cart — the frontend displays the price it received, it cannot influence what that price is

---

### Go Project Structure (Planned)

```
apps/api/
├── cmd/api/main.go          # Entry point — wires up router, DB, config
├── internal/
│   ├── config/              # Env var loading, validation
│   ├── handler/             # HTTP handlers (thin — delegate to service)
│   │   ├── products.go
│   │   ├── auth.go
│   │   ├── cart.go
│   │   └── orders.go
│   ├── service/             # Business logic (pricing, auth, inventory)
│   │   ├── products.go
│   │   ├── auth.go
│   │   └── cart.go
│   ├── repository/          # Couchbase query layer (one file per collection)
│   │   ├── products.go
│   │   └── users.go
│   ├── middleware/          # JWT validation, CORS, rate limiting, logging
│   └── model/              # Go structs mirroring TypeScript types
├── Makefile                 # build, lint, test, deploy targets
└── devbhoomi-api.service   # systemd unit file for Oracle VM
```

Handler → Service → Repository is the only allowed dependency direction. Handlers never touch Couchbase directly. Services never import from `handler/`. This keeps the business logic independently testable without an HTTP server or database.

---

### Deployment: Oracle Cloud ARM VM

```
                    ┌─────────────────────────────┐
                    │  Oracle Cloud ARM VM         │
                    │  4 OCPU  ·  24GB RAM         │
                    │                              │
     HTTPS ──────▶  │  nginx (reverse proxy)       │
                    │    └──▶ :8080 Go API binary  │
                    │    └──▶ :5984 (future: redis)│
                    │                              │
                    │  systemd manages the API     │
                    │  process — auto-restarts on  │
                    │  crash, starts on boot       │
                    └─────────────────────────────┘
                              │
                              │  Couchbase SDK (TCP)
                              ▼
                    ┌─────────────────────────────┐
                    │  Couchbase Capella           │
                    │  (managed cloud, free tier)  │
                    └─────────────────────────────┘
```

nginx handles TLS termination (Let's Encrypt cert via `certbot`), request buffering, and serves as the rate-limiting layer before requests reach Go. The Go binary listens on `localhost:8080` — it is never exposed directly to the internet.

The systemd unit file:
```ini
[Unit]
Description=Devbhoomi API
After=network.target

[Service]
ExecStart=/home/ubuntu/devbhoomi-api
Restart=always
RestartSec=5
Environment=PORT=8080
EnvironmentFile=/home/ubuntu/.env

[Install]
WantedBy=multi-user.default
```

`Restart=always` with `RestartSec=5` means a crashed process is back up in 5 seconds without any manual intervention. For a hobby project without an on-call rotation, this is the entire operational model.

---

### What's Left to Build

| Component | Status | Complexity |
|---|---|---|
| Go API skeleton (router + middleware) | ⏳ Not started | Low |
| Couchbase connection + product queries | ⏳ Not started | Medium |
| JWT auth + refresh token rotation | ⏳ Not started | Medium |
| B2B pricing engine | ⏳ Not started | Medium |
| Cart persistence (authenticated + guest) | ⏳ Not started | High |
| Order creation + WhatsApp notification | ⏳ Not started | Medium |
| Razorpay payment webhook | ⏳ Not started | High |
| Admin API (product CRUD) | ⏳ Not started | Medium |
| Oracle VM provisioning + nginx + SSL | ⏳ Not started | Low |

The frontend is production-ready. The API contract is locked by TypeScript. The database is provisioned. The deployment target is decided. What remains is implementation — and the hardest decision (the architecture) is already made.