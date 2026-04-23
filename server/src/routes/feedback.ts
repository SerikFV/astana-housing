import { Router, Request, Response } from 'express'
import { pool } from '../db'

const router = Router()

// GET /api/feedback?apartment_id=1
router.get('/', async (req: Request, res: Response) => {
  const { apartment_id } = req.query
  try {
    const { rows } = await pool.query(
      `SELECT fb.id, u.email AS user_email, fb.apartment_id, fb.rating, fb.comment, fb.created_at
       FROM feedback fb
       JOIN users u ON u.id = fb.user_id
       ${apartment_id ? 'WHERE fb.apartment_id = $1' : ''}
       ORDER BY fb.created_at DESC`,
      apartment_id ? [apartment_id] : []
    )
    res.json(rows)
  } catch {
    res.status(500).json({ error: 'Сервер қатесі' })
  }
})

// POST /api/feedback
router.post('/', async (req: Request, res: Response) => {
  const { user_id, apartment_id, rating, comment } = req.body
  if (!user_id || !rating) return res.status(400).json({ error: 'user_id және rating міндетті' })
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Рейтинг 1-5 аралығында болуы керек' })

  try {
    const { rows } = await pool.query(
      `INSERT INTO feedback (user_id, apartment_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, apartment_id || null, rating, comment || null]
    )
    res.status(201).json(rows[0])
  } catch {
    res.status(500).json({ error: 'Сервер қатесі' })
  }
})

export default router
