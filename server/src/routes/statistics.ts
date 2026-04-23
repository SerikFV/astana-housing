import { Router, Request, Response } from 'express'
import { pool } from '../db'

const router = Router()

// GET /api/statistics
router.get('/', async (_req: Request, res: Response) => {
  try {
    const [general, byDistrict, byRooms] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*)::int                   AS total,
          ROUND(AVG(price_usd))::int      AS avg_price,
          MIN(price_usd)::int             AS min_price,
          MAX(price_usd)::int             AS max_price,
          ROUND(AVG(price_per_m2))::int   AS avg_price_per_m2
        FROM apartments
      `),
      pool.query(`
        SELECT district, COUNT(*)::int AS count, ROUND(AVG(price_usd))::int AS avg_price
        FROM apartments
        WHERE district IS NOT NULL
        GROUP BY district
        ORDER BY count DESC
      `),
      pool.query(`
        SELECT rooms, COUNT(*)::int AS count, ROUND(AVG(price_usd))::int AS avg_price
        FROM apartments
        WHERE rooms IS NOT NULL
        GROUP BY rooms
        ORDER BY rooms ASC
      `),
    ])

    res.json({
      general:    general.rows[0],
      byDistrict: byDistrict.rows,
      byRooms:    byRooms.rows,
    })
  } catch {
    res.status(500).json({ error: 'Сервер қатесі' })
  }
})

export default router
