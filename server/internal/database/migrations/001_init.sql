-- ─────────────────────────────────────────────────────────────────────────────
-- Devbhoomi — Schema Initialisation (idempotent)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT        NOT NULL,
    email         TEXT        UNIQUE NOT NULL,
    password_hash TEXT        NOT NULL,
    role          TEXT        NOT NULL DEFAULT 'customer'
                              CHECK (role IN ('customer', 'wholesaler', 'admin')),
    phone         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ── Wholesaler Profiles ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wholesaler_profiles (
    user_id          UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name     TEXT,
    gstin            TEXT,
    tier             TEXT        NOT NULL DEFAULT 'starter',
    credit_limit_inr NUMERIC(15,2) NOT NULL DEFAULT 0,
    credit_used_inr  NUMERIC(15,2) NOT NULL DEFAULT 0,
    credit_terms     TEXT,
    tax_exempt       BOOLEAN     NOT NULL DEFAULT FALSE,
    approval_status  TEXT        NOT NULL DEFAULT 'pending'
                                 CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Refresh Tokens ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT        UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash    ON refresh_tokens(token_hash);

-- ── Products ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name                  TEXT        NOT NULL,
    slug                  TEXT        UNIQUE NOT NULL,
    category              TEXT        NOT NULL
                                      CHECK (category IN ('sacred', 'foods', 'wellness')),
    subcategory           TEXT        NOT NULL DEFAULT '',
    description           TEXT        NOT NULL DEFAULT '',
    price_inr             NUMERIC(12,2) NOT NULL,
    price_usd             NUMERIC(12,2),
    b2b_pricing           JSONB       NOT NULL DEFAULT '[]',
    traceability          JSONB,
    scientific_attributes JSONB       NOT NULL DEFAULT '{}',
    images                TEXT[]      NOT NULL DEFAULT '{}',
    seo                   JSONB,
    inventory_retail      INT         NOT NULL DEFAULT 0,
    inventory_wholesale   INT         NOT NULL DEFAULT 0,
    moq_wholesale         INT,
    weight_kg             NUMERIC(8,3),
    dimensions_cm         JSONB,
    status                TEXT        NOT NULL DEFAULT 'active'
                                      CHECK (status IN ('active', 'inactive', 'out_of_stock')),
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug     ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status   ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_price    ON products(price_inr);

-- ── Carts ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        REFERENCES users(id) ON DELETE CASCADE,
    session_id TEXT,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_carts_user_id    ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);

-- ── Cart Items ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id    UUID        NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name       TEXT        NOT NULL,
    slug       TEXT        NOT NULL,
    image      TEXT        NOT NULL DEFAULT '',
    price_inr  NUMERIC(12,2) NOT NULL,
    quantity   INT         NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
