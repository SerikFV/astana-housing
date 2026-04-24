import { useNavigate } from 'react-router-dom'
import type { Apartment } from '../types'
import { getPrice, formatPrice, getCurrentUser, isFavorite, toggleFavorite } from '../utils'
import { useState } from 'react'
import { useToast } from './Toast'
import img0k from '../assets/images/0k.png'
import img1k from '../assets/images/1k.png'
import img2k from '../assets/images/2k.png'
import img3k from '../assets/images/3k.png'
import img4k from '../assets/images/4k.png'

function getRoomImage(rooms?: number) {
  if (!rooms) return img0k
  if (rooms === 1) return img1k
  if (rooms === 2) return img2k
  if (rooms === 3) return img3k
  return img4k
}

const ROOM_COLORS: Record<number, { bg: string; accent: string }> = {
  1: { bg: '#EBF5FB', accent: '#3498DB' },
  2: { bg: '#EAF9F1', accent: '#2ECC71' },
  3: { bg: '#FEF9E7', accent: '#F39C12' },
  4: { bg: '#FDEDEC', accent: '#E74C3C' },
}

interface Props { apt: Apartment; onFavChange?: () => void }

export default function ApartmentCard({ apt, onFavChange }: Props) {
  const navigate = useNavigate()
  const email = getCurrentUser()
  const { show } = useToast()
  const [fav, setFav] = useState(email ? isFavorite(email, apt.id) : false)
  const [hovered, setHovered] = useState(false)

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!email) return
    toggleFavorite(email, apt)
    const next = !fav
    setFav(next)
    show(next ? '❤️ Таңдаулыға қосылды' : '🤍 Таңдаулыдан алынды', next ? 'success' : 'info')
    onFavChange?.()
  }

  const price = getPrice(apt)
  const theme = ROOM_COLORS[apt.rooms || 0] || { bg: '#F5F5F5', accent: '#888' }
  const isNew = apt.year_built && apt.year_built >= 2024

  return (
    <div
      onClick={() => navigate(`/apartments/${apt.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20, overflow: 'hidden', cursor: 'pointer', marginBottom: 12,
        background: '#fff',
        border: hovered ? `1.5px solid ${theme.accent}` : '1.5px solid #f0f0f0',
        boxShadow: hovered ? `0 10px 32px ${theme.accent}28` : '0 2px 12px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'all 0.22s cubic-bezier(.4,0,.2,1)',
      }}
    >
      {/* Image strip */}
      <div style={{ position: 'relative', height: 130, background: theme.bg, overflow: 'hidden' }}>
        <img src={getRoomImage(apt.rooms)} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85,
            transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.4s ease' }} />

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)` }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          {isNew && (
            <span style={{
              background: 'linear-gradient(135deg,#D4AF37,#f0c040)',
              color: '#fff', borderRadius: 8, padding: '3px 9px', fontSize: 10, fontWeight: 800,
              boxShadow: '0 2px 8px rgba(212,175,55,0.5)',
            }}>✨ ЖАҢА</span>
          )}
          {apt.rooms && (
            <span style={{
              background: theme.accent, color: '#fff',
              borderRadius: 8, padding: '3px 9px', fontSize: 10, fontWeight: 800,
            }}>{apt.rooms} бөл.</span>
          )}
        </div>

        {/* Fav button */}
        <button onClick={handleFav} style={{
          position: 'absolute', top: 8, right: 8,
          width: 32, height: 32, borderRadius: 10, border: 'none',
          background: fav ? 'rgba(235,51,73,0.9)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer', fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.2s',
        }}>{fav ? '❤️' : '🤍'}</button>

        {/* Price on image */}
        <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 16, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            {formatPrice(price)}
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#1a1a1a', marginBottom: 4,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {apt.residential_complex_name || `Пәтер #${apt.id}`}
        </div>
        <div style={{ fontSize: 12, color: '#aaa', marginBottom: 10,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          📍 {apt.address || apt.district || '—'}
        </div>

        {/* Chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {apt.area && (
            <span style={{ background: theme.bg, color: theme.accent, borderRadius: 8, padding: '4px 9px', fontSize: 11, fontWeight: 700 }}>
              📐 {apt.area} м²
            </span>
          )}
          {apt.floor && apt.total_floors && (
            <span style={{ background: '#f5f5f5', color: '#666', borderRadius: 8, padding: '4px 9px', fontSize: 11, fontWeight: 600 }}>
              🏢 {apt.floor}/{apt.total_floors}
            </span>
          )}
          {apt.year_built && (
            <span style={{ background: '#f5f5f5', color: '#666', borderRadius: 8, padding: '4px 9px', fontSize: 11, fontWeight: 600 }}>
              📅 {apt.year_built}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
