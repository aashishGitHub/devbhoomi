# Devbhoomi — Himalayan E-Commerce Platform

> **Live Demo → [devbhoomi.pages.dev](https://devbhoomi.pages.dev/)**

A production-grade, full-stack e-commerce platform for authentic Himalayan products — sacred items, organic foods, and heritage wellness. Designed and engineered end-to-end: product catalogue, cart, checkout with UPI & WhatsApp payment, wholesale portal, and an admin dashboard.

Built with **Next.js 15 App Router · Go REST API · Couchbase · Tailwind CSS**.

---

## Highlights for Reviewers

| Area | What's implemented |
|---|---|
| **Frontend** | Next.js 15 App Router, RSC + client components, static export pipeline |
| **Type safety** | End-to-end TypeScript — zero `any`, strict mode |
| **State** | React Context (cart), URL-driven filters (no Redux boilerplate) |
| **Performance** | Static pre-render of all product pages, image optimisation, code splitting |
| **Payments** | UPI deeplink + WhatsApp order (zero-infra, works on mobile instantly) |
| **Design system** | Custom Tailwind tokens, accessible components built on Radix UI primitives |
| **Architecture** | Clear service abstraction layer — mock data ↔ real API with a single env flag |
| **CI-ready** | `typecheck`, `lint`, `build:static` scripts; static export builds in ~2s |
| **Deployment** | Live on Cloudflare Pages (edge CDN, 0 ms cold start, free tier) |

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

## Repository Structure

```
e-commerce/
├── apps/
│   ├── storefront/          # Next.js 15 App Router front-end
│   │   ├── src/
│   │   │   ├── app/         # Pages (App Router)
│   │   │   ├── components/  # UI, product, cart, checkout components
│   │   │   ├── lib/
│   │   │   │   ├── mock/    # Mock data + in-memory API (static demo)
│   │   │   │   └── products-data.ts  # Service switch (mock ↔ real API)
│   │   │   └── types/       # Shared TypeScript types
│   │   ├── public/
│   │   │   └── _redirects   # Cloudflare Pages SPA routing
│   │   ├── .env.local        # Local environment variables (gitignored)
│   │   └── .env.local.example
│   └── api/                 # Go REST API (Phase 2)
├── detailed-requirements.md
├── PRD.md
└── README.md
```

---

## Quick Start (Local Dev)

```bash
# 1. Clone and install
git clone https://github.com/aashishGitHub/devbhoomi.git
cd devbhoomi/apps/storefront
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local as needed (defaults work for mock mode)

# 3. Run dev server (with mock data)
NEXT_PUBLIC_USE_MOCK=true npm run dev
# → http://localhost:3000
```

---

## Mock vs Real Data

The service layer in `src/lib/products-data.ts` auto-switches at build time:

| `NEXT_PUBLIC_USE_MOCK` | Data source | Deployment target |
|---|---|---|
| `true` | `src/lib/mock/data.ts` (9 local products) | Cloudflare Pages (static export) |
| `false` (default) | Go API at `NEXT_PUBLIC_API_URL` | Vercel + Oracle Cloud VM |

**Mock products (9 total across 3 categories):**

| Category | Products |
|---|---|
| Sacred & Ritual | 5-Mukhi Rudraksha Mala, Brass Nataraj Idol (6"), Bambooless Dhoop Cones |
| Himalayan Foods | Wild Raw Honey (500g), Pure A2 Bilona Ghee, Mandua (Finger Millet) Flour |
| Wellness & Ayurveda | Shilajit Resin (30g), Ashwagandha Root Powder, Sea Buckthorn Juice |

---

## Payment Flow (Demo)

The checkout uses two zero-infrastructure payment methods suitable for the demo:

1. **UPI Deeplink** — Opens any UPI app (GPay, PhonePe, Paytm) with pre-filled amount and merchant ID. Set `NEXT_PUBLIC_UPI_ID` in `.env.local`.

2. **WhatsApp Order** — Pre-fills a WhatsApp message with the cart summary and sends it to your business number. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` (e.g. `919876543210`).

---

## Cloudflare Pages Deployment (Static Demo)

### One-time setup in Cloudflare dashboard

| Setting | Value |
|---|---|
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build:static` |
| Build output directory | `out` |
| Root directory | `apps/storefront` |

### Environment variables (set in CF dashboard)

```
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_UPI_ID=9243469722@yescred
NEXT_PUBLIC_WHATSAPP_NUMBER=919718650521
NEXT_PUBLIC_SITE_URL=https://your-pages-domain.pages.dev
```

### Deploy via Git

Push to `main` → Cloudflare auto-builds and deploys. The `out/` directory is never committed — it's generated fresh each deploy.

---

## Design System Tokens

All colours are defined as Tailwind CSS custom tokens:

| Token | Hex | Usage |
|---|---|---|
| `forest` | `#254B5A` | Primary text, headings, buttons |
| `misty` | `#A6CBD3` | Accents, borders |
| `rust` | `#9D5F1B` | CTA highlights, prices |
| `cream` | `#FDF1DB` | Page backgrounds |
| `stone` | `#344E95` | Secondary actions |
| `muted` | `#BBA48D` | Subtext, placeholders |

---

## Available Scripts

```bash
# Development
npm run dev            # Dev server with HMR
npm run build:static   # Static export (NEXT_PUBLIC_USE_MOCK=true)
npm run build          # Production SSR build (requires Go API)
npm run typecheck      # TypeScript check (no emit)
npm run lint           # ESLint
```

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| Static demo | ✅ Done | Mock data, UPI + WhatsApp, Cloudflare Pages |
| Go API | 🔄 In progress | REST endpoints, Couchbase, JWT auth |
| Production deploy | ⏳ Planned | Vercel + Oracle Cloud Free ARM VM |
| Admin dashboard | ⏳ Planned | Product/order management |
| Razorpay integration | ⏳ Planned | Full payment gateway |
| Wholesale portal | ⏳ Planned | B2B ordering with approval flow |
