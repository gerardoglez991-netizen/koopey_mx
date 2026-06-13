-- ═══════════════════════════════════════════════════
-- koopey_mx — Supabase Schema
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════

-- 1. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  subtitle      TEXT,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL,
  badge         TEXT,
  category      TEXT NOT NULL DEFAULT 'Polo',
  images        TEXT[] DEFAULT '{}',
  materials     TEXT,
  stripe_price_id TEXT,
  in_stock      BOOLEAN DEFAULT true,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  customer_email    TEXT,
  customer_name     TEXT,
  amount_total      NUMERIC(10,2),
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  items             JSONB DEFAULT '[]',
  shipping_address  JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBSCRIBERS (newsletter / launch notify)
CREATE TABLE IF NOT EXISTS subscribers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDEXES ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_stripe    ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_email     ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status    ON orders(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- ── ROW LEVEL SECURITY ───────────────────────────────
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);

-- Orders: only service role can write; users can read their own
CREATE POLICY "orders_service_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_service_update" ON orders FOR UPDATE USING (true);
CREATE POLICY "orders_read_own" ON orders FOR SELECT USING (
  customer_email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- Subscribers: anyone can insert; service role reads
CREATE POLICY "subscribers_insert" ON subscribers FOR INSERT WITH CHECK (true);

-- ── SEED PRODUCTS ────────────────────────────────────
INSERT INTO products (name, subtitle, description, price, badge, category, images, materials, stripe_price_id, in_stock, sort_order) VALUES
('Polo Verde Agua',   'Con cuello azul marino', 'Polo de algodón piqué premium en verde agua con cuello y puños azul marino. Un contraste sofisticado que evoca el Mediterráneo en su mejor expresión.', 89.00, 'Nuevo',   'Polo',     ARRAY['/images/polo-verde-agua.jpg'],   '100% algodón piqué egipcio · 220g/m² · Bordado jaguar · Lavado 30°C', 'price_REEMPLAZAR', true, 1),
('Polo Verde Oliva',  'Clásico de temporada',   'El verde oliva es el tono definitivo del mediterráneo. Una pieza que nunca pasa de moda.',                                                             85.00, NULL,       'Polo',     ARRAY['/images/polo-verde-oliva.jpg'],  '100% algodón piqué · 220g/m² · Bordado jaguar · Lavado 30°C',         'price_REEMPLAZAR', true, 2),
('Polo Verde Oscuro', 'Con cuello camel',        'Verde bosque con cuello y puños camel. Edición limitada.',                                                                                             92.00, 'Limitado', 'Polo',     ARRAY['/images/polo-verde-oscuro.jpg'], '100% algodón piqué · 240g/m² · Cuello contraste · Bordado jaguar',    'price_REEMPLAZAR', true, 3),
('Polo Azul Marino',  'El esencial definitivo',  'El azul marino es el lenguaje universal del estilo. La pieza central de cualquier guardarropa bien construido.',                                       85.00, NULL,       'Polo',     ARRAY['/images/polo-azul-marino.jpg'],  '100% algodón piqué · 220g/m² · Corte slim · Bordado jaguar',          'price_REEMPLAZAR', true, 4),
('Camiseta Rayas Granate', 'Estilo marinero',   'Inspirada en la tradición marinera mediterránea. Rayas granate y crema en punto algodón suave.',                                                       69.00, NULL,       'Camiseta', ARRAY['/images/camiseta-rayas.jpg'],    '100% algodón jersey · 180g/m² · Cuello redondo · Bordado jaguar',     'price_REEMPLAZAR', true, 5),
('Camisa Rosa Cuadros','Lino premium',           'Camisa en lino con estampado de cuadros en tonos rosa. Ligera, sofisticada, perfecta para el verano.',                                                110.00, NULL,      'Camisa',   ARRAY['/images/camisa-rosa.jpg'],       '100% lino lavado · Cuello italiano · Bordado jaguar · Lavado a mano', 'price_REEMPLAZAR', true, 6)
ON CONFLICT DO NOTHING;
