-- ============================================================
-- Астана Баспана — SQL Queries
-- ============================================================

-- ============================================================
-- 1. АУДАН БОЙЫНША СҮЗГІ
-- ============================================================

-- Есіл ауданындағы барлық пәтерлер (бағасы бойынша өсу)
SELECT id, residential_complex_name, rooms, area, floor, price_usd, address
FROM apartments
WHERE district = 'Есильский р-н'
ORDER BY price_usd ASC;

-- Барлық аудандар бойынша пәтер саны мен орташа баға
SELECT
    district,
    COUNT(*)                        AS apartment_count,
    ROUND(AVG(price_usd), 0)        AS avg_price_usd,
    ROUND(AVG(price_local), 0)      AS avg_price_local,
    ROUND(AVG(price_per_m2), 0)     AS avg_price_per_m2
FROM apartments
WHERE district IS NOT NULL
GROUP BY district
ORDER BY avg_price_usd DESC;

-- ============================================================
-- 2. БАҒ АРАЛЫҒЫ БОЙЫНША СҮЗГІ
-- ============================================================

-- 30 000$ — 80 000$ аралығындағы пәтерлер
SELECT id, residential_complex_name, district, rooms, area, price_usd, address
FROM apartments
WHERE price_usd BETWEEN 30000 AND 80000
ORDER BY price_usd ASC;

-- 50 млн ₸ дейінгі пәтерлер
SELECT id, residential_complex_name, district, rooms, area, price_local, address
FROM apartments
WHERE price_local <= 50000000
ORDER BY price_local ASC;

-- ============================================================
-- 3. БӨЛМЕЛЕР БОЙЫНША СҮЗГІ
-- ============================================================

-- 2 бөлмелі пәтерлер
SELECT id, residential_complex_name, district, area, floor, price_usd, address
FROM apartments
WHERE rooms = 2
ORDER BY price_usd ASC;

-- 3 және одан көп бөлмелі пәтерлер
SELECT id, residential_complex_name, district, rooms, area, price_usd, address
FROM apartments
WHERE rooms >= 3
ORDER BY rooms ASC, price_usd ASC;

-- ============================================================
-- 4. АРАЛАС СҮЗГІЛЕР
-- ============================================================

-- Есіл ауданы, 2 бөлмелі, 100 000$ дейін
SELECT id, residential_complex_name, rooms, area, floor, total_floors, price_usd, address
FROM apartments
WHERE district = 'Есильский р-н'
  AND rooms = 2
  AND price_usd <= 100000
ORDER BY price_usd ASC;

-- Жаңа үйлер (2022+), паркингі бар, 70 000$ дейін
SELECT id, residential_complex_name, district, rooms, area, year_built, price_usd, parking
FROM apartments
WHERE year_built >= 2022
  AND parking IS NOT NULL
  AND price_usd <= 70000
ORDER BY year_built DESC, price_usd ASC;

-- ============================================================
-- 5. ПАЙДАЛАНУШЫЛАР ЖӘНЕ ТАҢДАУЛЫЛАР
-- ============================================================

-- Пайдаланушының таңдаулы пәтерлері (user_id = 3)
SELECT
    a.id, a.residential_complex_name, a.district, a.rooms, a.area, a.price_usd,
    f.created_at AS favorited_at
FROM favorites f
JOIN apartments a ON a.id = f.apartment_id
WHERE f.user_id = 3
ORDER BY f.created_at DESC;

-- Ең көп таңдаулыға қосылған пәтерлер (TOP 5)
SELECT
    a.id, a.residential_complex_name, a.district, a.price_usd,
    COUNT(f.id) AS favorites_count
FROM apartments a
LEFT JOIN favorites f ON f.apartment_id = a.id
GROUP BY a.id, a.residential_complex_name, a.district, a.price_usd
ORDER BY favorites_count DESC
LIMIT 5;

-- ============================================================
-- 6. ПІКІРЛЕР ЖӘНЕ РЕЙТИНГТЕР
-- ============================================================

-- Барлық пікірлер (пайдаланушы email-мен)
SELECT
    u.email,
    a.residential_complex_name AS apartment_name,
    fb.rating,
    fb.comment,
    fb.created_at
FROM feedback fb
JOIN users u ON u.id = fb.user_id
LEFT JOIN apartments a ON a.id = fb.apartment_id
ORDER BY fb.created_at DESC;

-- Орташа рейтинг бойынша пәтерлер (TOP 5)
SELECT
    a.id, a.residential_complex_name, a.district, a.price_usd,
    ROUND(AVG(fb.rating), 2) AS avg_rating,
    COUNT(fb.id)             AS review_count
FROM apartments a
JOIN feedback fb ON fb.apartment_id = a.id
GROUP BY a.id, a.residential_complex_name, a.district, a.price_usd
HAVING COUNT(fb.id) >= 1
ORDER BY avg_rating DESC, review_count DESC
LIMIT 5;

-- ============================================================
-- 7. СТАТИСТИКА СҰРАУЛАРЫ
-- ============================================================

-- Жалпы нарық статистикасы
SELECT
    COUNT(*)                        AS total_apartments,
    ROUND(AVG(price_usd), 0)        AS avg_price_usd,
    MIN(price_usd)                  AS min_price_usd,
    MAX(price_usd)                  AS max_price_usd,
    ROUND(AVG(price_per_m2), 0)     AS avg_price_per_m2
FROM apartments;

-- Бөлмелер бойынша статистика
SELECT
    rooms,
    COUNT(*)                    AS count,
    ROUND(AVG(price_usd), 0)    AS avg_price_usd,
    MIN(price_usd)              AS min_price,
    MAX(price_usd)              AS max_price
FROM apartments
WHERE rooms IS NOT NULL
GROUP BY rooms
ORDER BY rooms ASC;

-- Тіркелген пайдаланушылар саны (рөл бойынша)
SELECT role, COUNT(*) AS count
FROM users
GROUP BY role;

-- Аудан бойынша орташа баға (картаға арналған)
SELECT
    district,
    COUNT(*)                    AS total,
    ROUND(AVG(price_usd), 0)    AS avg_price_usd,
    ROUND(AVG(price_per_m2), 0) AS avg_price_per_m2
FROM apartments
WHERE district IS NOT NULL
GROUP BY district
ORDER BY total DESC;
