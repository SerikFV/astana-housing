import { Router, Request, Response } from 'express'
import { pool } from '../db'

const router = Router()

// GET /api/favorites?user_id=3
router.get('/', async (req: Request, res: Response) => {
  const { user_id } = req.query
  if (!user_id) return res.status(400).json({ error: 'user_id міндетті' })

  try {
    const { rows } = await pool.query(
      `SELECT a.* FROM favorites f
       JOIN apartments a ON a.id = f.apartment_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [user_id]
    )
    res.json(rows)
  } catch {
    res.status(500).json({ error: 'Сервер қатесі' })
  }
})

// POST /api/favorites
router.post('/', async (req: Request, res: Response) => {
  const { user_id, apartment_id } = req.body
  if (!user_id || !apartment_id) return res.status(400).json({ error: 'user_id және apartment_id міндетті' })

  try {
    await pool.query(
      `INSERT INTO favorites (user_id, apartment_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [user_id, apartment_id]
    )
    res.status(201).json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Сервер қатесі' })
  }
})

// DELETE /api/favorites
router.delete('/', async (req: Request, res: Response) => {
  const { user_id, apartment_id } = req.body
  if (!user_id || !apartment_id) return res.status(400).json({ error: 'user_id және apartment_id міндетті' })

  try {
    await pool.query(
      `DELETE FROM favorites WHERE user_id = $1 AND apartment_id = $2`,
      [user_id, apartment_id]
    )
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Сервер қатесі' })
  }
})

export default router
