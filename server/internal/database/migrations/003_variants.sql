-- ─────────────────────────────────────────────────────────────────────────────
-- 003 — Add product variants and enhance product management
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB NOT NULL DEFAULT '[]';

-- Orders table for tracking purchases
CREATE TABLE IF NOT EXISTS orders (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID        REFERENCES users(id) ON DELETE SET NULL,
    status         TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
    items          JSONB       NOT NULL DEFAULT '[]',
    subtotal_inr   NUMERIC(12,2) NOT NULL DEFAULT 0,
    shipping_inr   NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_inr      NUMERIC(12,2) NOT NULL DEFAULT 0,
    shipping_address JSONB,
    payment_method TEXT,
    payment_status TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (payment_status IN ('pending','paid','failed','refunded')),
    notes          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status);
