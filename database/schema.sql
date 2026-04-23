-- ============================================================
-- Астана Баспана — PostgreSQL Database Schema
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'user'
                  CHECK (role IN ('user', 'admin')),
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ============================================================
-- 2. APARTMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS apartments (
    id                      SERIAL PRIMARY KEY,
    residential_complex_name VARCHAR(255),
    district                VARCHAR(100),
    rooms                   SMALLINT     CHECK (rooms > 0 AND rooms <= 20),
    area                    NUMERIC(8,2) CHECK (area > 0),
    floor                   SMALLINT,
    total_floors            SMALLINT,
    price_usd               NUMERIC(12,2) CHECK (price_usd >= 0),
    price_local             NUMERIC(15,2) CHECK (price_local >= 0),
    price_per_m2            NUMERIC(10,2) CHECK (price_per_m2 >= 0),
    house_type              VARCHAR(100),
    year_built              SMALLINT     CHECK (year_built >= 1900 AND year_built <= 2030),
    condition               VARCHAR(100),
    bathroom                VARCHAR(100),
    balcony                 VARCHAR(100),
    parking                 VARCHAR(100),
    furniture               VARCHAR(100),
    heating                 VARCHAR(100),
    address                 TEXT,
    latitude                NUMERIC(12,9),
    longitude               NUMERIC(12,9),
    url                     TEXT,
    created_at              TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_apartments_district     ON apartments(district);
CREATE INDEX IF NOT EXISTS idx_apartments_price_usd    ON apartments(price_usd);
CREATE INDEX IF NOT EXISTS idx_apartments_price_local  ON apartments(price_local);
CREATE INDEX IF NOT EXISTS idx_apartments_rooms        ON apartments(rooms);
CREATE INDEX IF NOT EXISTS idx_apartments_area         ON apartments(area);
CREATE INDEX IF NOT EXISTS idx_apartments_year_built   ON apartments(year_built);

-- ============================================================
-- 3. FAVORITES
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    apartment_id INTEGER NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, apartment_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id      ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_apartment_id ON favorites(apartment_id);

-- ============================================================
-- 4. FEEDBACK
-- ============================================================
CREATE TABLE IF NOT EXISTS feedback (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    apartment_id INTEGER REFERENCES apartments(id) ON DELETE SET NULL,
    rating       SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment      TEXT,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_user_id      ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_apartment_id ON feedback(apartment_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating       ON feedback(rating);
