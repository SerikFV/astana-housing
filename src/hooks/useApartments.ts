import { useState, useEffect } from 'react'
import type { Apartment, Statistics } from '../types'

const API = 'http://localhost:3001/api'

// Session-level cache (бет жаңартқанда тазаланады)
let aptCache: Apartment[] | null = null
let statsCache: Statistics | null = null

// Бет жаңартқанда кэшті тазалау
window.addEventListener('beforeunload', () => { aptCache = null; statsCache = null })

export function useApartments() {
  const [apartments, setApartments] = useState<Apartment[]>(aptCache || [])
  const [loading, setLoading] = useState(!aptCache)

  useEffect(() => {
    if (aptCache) return
    fetch(`${API}/apartments`)
      .then(r => { if (!r.ok) throw new Error('api error'); return r.json() })
      .then((data: Apartment[]) => {
        aptCache = data
        setApartments(data)
        setLoading(false)
      })
      .catch(() => {
        fetch('/apartments.json')
          .then(r => r.json())
          .then((data: Apartment[]) => { aptCache = data; setApartments(data); setLoading(false) })
          .catch(() => setLoading(false))
      })
  }, [])

  return { apartments, loading }
}

export function useStatistics() {
  const [stats, setStats] = useState<Statistics | null>(statsCache)
  const [loading, setLoading] = useState(!statsCache)

  useEffect(() => {
    if (statsCache) return
    fetch(`${API}/statistics`)
      .then(r => { if (!r.ok) throw new Error('api error'); return r.json() })
      .then((data: Statistics) => {
        statsCache = data
        setStats(data)
        setLoading(false)
      })
      .catch(() => {
        fetch('/statistics.json')
          .then(r => r.json())
          .then((data: Statistics) => {
            statsCache = data
            setStats(data)
            setLoading(false)
          })
          .catch(() => setLoading(false))
      })
  }, [])

  return { stats, loading }
}

// Auth API
export async function apiSignIn(email: string, password: string) {
  const res = await fetch(`${API}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Қате')
  return data as { id: number; email: string; role: string }
}

export async function apiSignUp(email: string, password: string) {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Қате')
  return data as { id: number; email: string; role: string }
}

// Favorites API
export async function apiFavorites(userId: number): Promise<Apartment[]> {
  const res = await fetch(`${API}/favorites?user_id=${userId}`)
  return res.json()
}

export async function apiAddFavorite(userId: number, apartmentId: number) {
  await fetch(`${API}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, apartment_id: apartmentId }),
  })
}

export async function apiRemoveFavorite(userId: number, apartmentId: number) {
  await fetch(`${API}/favorites`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, apartment_id: apartmentId }),
  })
}

// Feedback API
export async function apiFeedback(apartmentId?: number) {
  const url = apartmentId ? `${API}/feedback?apartment_id=${apartmentId}` : `${API}/feedback`
  const res = await fetch(url)
  return res.json()
}

export async function apiAddFeedback(userId: number, rating: number, comment: string, apartmentId?: number) {
  const res = await fetch(`${API}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, apartment_id: apartmentId || null, rating, comment }),
  })
  return res.json()
}
