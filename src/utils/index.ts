import type { Apartment } from '../types'

export const ADMIN_EMAIL = 'toilybai.amina.2019@gmail.com'
export const ADMIN_EMAILS = ['toilybai.amina.2019@gmail.com', 'admin', 'admin@baspan.kz']

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email)
}

export const DISTRICT_COLORS: Record<string, string> = {
  'Есіл р-н': '#3498DB',
  'Есильский р-н': '#3498DB',
  'Сарыарка р-н': '#2ECC71',
  'Алматы р-н': '#E67E22',
  'Байқоңыр р-н': '#9B59B6',
  'Байконурский р-н': '#9B59B6',
  'р-н Байконур': '#9B59B6',
  'Нура р-н': '#E74C3C',
  'Сарайшык р-н': '#1ABC9C',
}

export const DISTRICT_COLORS_FALLBACK = [
  '#3498DB','#2ECC71','#E67E22','#9B59B6','#E74C3C','#1ABC9C','#F39C12','#8E44AD'
]

export function getPrice(apt: Apartment): number {
  if (apt.price_local && apt.price_local > 0) return apt.price_local
  return (apt.price_usd || 0) * 470
}

export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₸'
}

export function translateCondition(condition: string | undefined): string {
  if (!condition) return '—'
  const map: Record<string, string> = {
    'свежий ремонт': 'Жаңа жөндеу',
    'евроремонт': 'Евро жөндеу',
    'черновая отделка': 'Қара жөндеу',
    'дизайнерский': 'Дизайнерлік',
    'косметический': 'Косметикалық',
    'требует ремонта': 'Жөндеу қажет',
    'не новый, но аккуратный ремонт': 'Ұқыпты жөндеу',
    'свободная планировка': 'Еркін жоспар',
  }
  return map[condition] || condition
}

// Auth helpers
export function getRegisteredUsers(): { email: string; password: string }[] {
  return JSON.parse(localStorage.getItem('registered_users') || '[]')
}

export function getCurrentUser(): string | null {
  return localStorage.getItem('user_email')
}

export function getCurrentRole(): string | null {
  return localStorage.getItem('user_role')
}

export function getFavorites(email: string): Apartment[] {
  return JSON.parse(localStorage.getItem(`favorites_${email}`) || '[]')
}

export function setFavorites(email: string, favs: Apartment[]): void {
  localStorage.setItem(`favorites_${email}`, JSON.stringify(favs))
}

export function isFavorite(email: string, id: number): boolean {
  return getFavorites(email).some(a => a.id === id)
}

export function toggleFavorite(email: string, apt: Apartment): void {
  const favs = getFavorites(email)
  const idx = favs.findIndex(a => a.id === apt.id)
  if (idx >= 0) favs.splice(idx, 1)
  else favs.push(apt)
  setFavorites(email, favs)
}

export function getAllFeedbacks(): import('../types').Feedback[] {
  return JSON.parse(localStorage.getItem('all_feedbacks') || '[]')
}

// ─── Соңғы қаралған пәтерлер ───────────────────────────────
const HISTORY_KEY = 'viewed_apartments'
const HISTORY_MAX = 20

export function addToHistory(apt: Apartment): void {
  const history: Apartment[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  const filtered = history.filter(a => a.id !== apt.id)
  filtered.unshift(apt)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, HISTORY_MAX)))
}

export function getHistory(): Apartment[] {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}

// ─── Пәтер салыстыру ───────────────────────────────────────
const COMPARE_KEY = 'compare_apartments'
const COMPARE_MAX = 3

export function getCompare(): Apartment[] {
  return JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]')
}

export function addToCompare(apt: Apartment): boolean {
  const list = getCompare()
  if (list.find(a => a.id === apt.id)) return true
  if (list.length >= COMPARE_MAX) return false
  list.push(apt)
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list))
  return true
}

export function removeFromCompare(id: number): void {
  const list = getCompare().filter(a => a.id !== id)
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list))
}

export function isInCompare(id: number): boolean {
  return getCompare().some(a => a.id === id)
}

export function clearCompare(): void {
  localStorage.removeItem(COMPARE_KEY)
}
