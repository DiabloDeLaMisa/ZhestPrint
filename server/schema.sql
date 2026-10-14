CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), login VARCHAR(40) NOT NULL UNIQUE,
 email VARCHAR(254) NOT NULL UNIQUE, password_hash TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS designs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title VARCHAR(120) NOT NULL DEFAULT 'Мой принт', text VARCHAR(15) NOT NULL DEFAULT '',
 canvas_json JSONB NOT NULL DEFAULT '{}'::jsonb, garment_type VARCHAR(24) NOT NULL DEFAULT 'tshirt',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS designs_user_updated_idx ON designs(user_id, updated_at DESC);
CREATE TABLE IF NOT EXISTS signs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), letter VARCHAR(8) NOT NULL UNIQUE,
 svg_path TEXT, description TEXT
);
CREATE TABLE IF NOT EXISTS orders (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 design_id UUID REFERENCES designs(id) ON DELETE SET NULL,
 status VARCHAR(24) NOT NULL DEFAULT 'draft', created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
