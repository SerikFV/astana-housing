export interface Apartment {
  id: number
  residential_complex_name?: string
  rooms?: number
  area?: number
  floor?: number
  total_floors?: number
  price_usd?: number
  price_local?: number
  price_per_m2?: number
  house_type?: string
  year_built?: number
  condition?: string
  bathroom?: string
  balcony?: string
  parking?: string
  furniture?: string
  heating?: string
  address?: string
  district?: string
  latitude?: number
  longitude?: number
  url?: string
}

export interface User {
  email: string
  password: string
}

export interface Feedback {
  user_email: string
  feedback: string
  rating: number
  created_at: string
}

export interface Statistics {
  general: {
    total: number
    avg_price: number
    min_price: number
    max_price: number
    avg_price_per_m2: number
  }
  byDistrict: { district: string; count: number; avg_price: number }[]
  byRooms: { rooms: number; count: number; avg_price: number }[]
}
