import { Router, Request, Response } from 'express'
import { pool } from '../db'

const router = Router()

// GET /api/apartments — сүзгімен тізім
router.get('/', async (req: Request, res: Response) => {
  try {
    const { district, rooms, min_price, max_price, min_area, max_area } = req.query

    const conditions: string[] = []
    const values: unknown[] = []
    let i = 1

    if (district)   { conditions.push(`district = $${i++}`);                values.push(district) }
    if (rooms)      { conditions.push(`rooms = $${i++}`);                   values.push(Number(rooms)) }
    if (min_price)  { conditions.push(`price_usd >= $${i++}`);              values.push(Number(min_price)) }
    if (max_price)  { conditions.push(`price_usd <= $${i++}`);              values.push(Number(max_price)) }
    if (min_area)   { conditions.push(`area >= $${i++}`);                   values.push(Number(min_area)) }
    if (max_area)   { conditions.push(`area <= $${i++}`);                   values.push(Number(max_area)) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const { rows } = await pool.query(
      `SELECT * FROM apartments ${where} ORDER BY id ASC`,
      values
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Сервер қатесі' })
  }
})

// GET /api/apartments/:id — жеке пәтер
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM apartments WHERE id = $1', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Табылмады' })
    res.json(rows[0])
  } catch {
    res.status(500).json({ error: 'Сервер қатесі' })
  }
})

export default router
