import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

export const pool = new Pool({
  host:     process.env.DB_HOST     || 'postgres',  // Docker-да service аты
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'astana_housing',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
})
