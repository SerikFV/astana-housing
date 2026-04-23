import { Router, Request, Response } from 'express'
import { pool } from '../db'

const router = Router()

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email және құпиясөз міндетті' })
  if (password.length < 6)  return res.status(400).json({ error: 'Құпиясөз кемінде 6 символ' })

  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (exists.rows.length) return res.status(409).json({ error: 'Бұл email тіркелген' })

    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, crypt($2, gen_salt('bf')), 'user')
       RETURNING id, email, role`,
      [email, password]
    )
    res.status(201).json(rows[0])
  } catch {
    res.status(500).json({ error: 'Сервер қатесі' })
  }
})

// POST /api/auth/signin
router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email және құпиясөз міндетті' })

  try {
    const { rows } = await pool.query(
      `SELECT id, email, role FROM users
       WHERE email = $1 AND password_hash = crypt($2, password_hash)`,
      [email, password]
    )
    if (!rows.length) return res.status(401).json({ error: 'Email немесе құпиясөз қате' })
    res.json(rows[0])
  } catch {
    res.status(500).json({ error: 'Сервер қатесі' })
  }
})

export default router
