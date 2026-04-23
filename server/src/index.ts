import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import client from 'prom-client'
dotenv.config({ path: '../.env' })

import apartmentsRouter from './routes/apartments'
import authRouter       from './routes/auth'
import favoritesRouter  from './routes/favorites'
import feedbackRouter   from './routes/feedback'
import statisticsRouter from './routes/statistics'

const app  = express()
const PORT = process.env.PORT || 3001

// Prometheus метрикалары
const register = new client.Registry()
client.collectDefaultMetrics({ register })

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Барлық HTTP сұраулар саны',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
})

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())

// Метрика middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequests.inc({ method: req.method, route: req.path, status: res.statusCode })
  })
  next()
})

app.use('/api/apartments', apartmentsRouter)
app.use('/api/auth',       authRouter)
app.use('/api/favorites',  favoritesRouter)
app.use('/api/feedback',   feedbackRouter)
app.use('/api/statistics', statisticsRouter)

app.get('/api/health',  (_req, res) => res.json({ status: 'ok' }))
app.get('/api/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

app.listen(PORT, () => {
  console.log(`✅ Сервер іске қосылды: http://localhost:${PORT}`)
})
