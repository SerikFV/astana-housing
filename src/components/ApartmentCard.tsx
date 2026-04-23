import { useNavigate } from 'react-router-dom'
import type { Apartment } from '../types'
import { getPrice, formatPrice, getCurrentUser, isFavorite, toggleFavorite } from '../utils'
import { useState } from 'react'
import img0k from '../assets/images/0k.png'
import img1k from '../assets/images/1k.png'
import img2k from '../assets/images/2k.png'
import img3k from '../assets/images/3k.png'
import img4k from '../assets/images/4k.png'

function getRoomImage(rooms?: number): string {
  if (!rooms) return img0k
  if (rooms === 1) return img1k
  if (rooms === 2) return img2k
  if (rooms === 3) return img3k
  return img4k
}

interface Props {
  apt: Apartment
  onFavChange?: () => void
}

export default function ApartmentCard({ apt, onFavChange }: Props) {
  const navigate = useNavigate()
  const email = getCurrentUser()
  const [fav, setFav] = useState(email ? isFavorite(email, apt.id) : false)
  const [hovered, setHovered] = useState(false)

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!email) return
    toggleFavorite(email, apt)
    setFav(!fav)
    onFavChange?.()
  }

  const price = getPrice(apt)
  const priceUsd = apt.price_usd

  return (
    <div
      onClick={() => navigate(`/apartments/${apt.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', gap: 0, cursor: 'pointer',
        borderRadius: 18, overflow: 'hidden',
        background: '#fff',
        border: hovered ? '1.5px solid #D4AF37' : '1.5px solid #f0f0f0',
        boxShadow: hovered ? '0 8px 28px rgba(212,175,55,0.18)' : '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        marginBottom: 12,
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}>

      {/* Image */}
      <div style={{ width: 110, minHeight: 110, position: 'relative', flexShrink: 0, background: '#f5f5f5' }}>
        <img src={getRoomImage(apt.rooms)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {apt.year_built && apt.year_built >= 2024 && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            background: 'linear-gradient(135deg, #D4AF37, #f0c040)',
            borderRadius: 6, padding: '2px 7px', fontSize: 10, color: '#fff', fontWeight: 700,
          }}>ЖАҢА</div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: '12px 14px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {apt.residential_complex_name || `Пәтер #${apt.id}`}
          </div>
          <div style={{
            fontSize: 12, color: '#aaa', marginBottom: 10,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            📍 {apt.address || apt.district || '—'}
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {apt.rooms    && <Chip icon="🛏">{apt.rooms} бөл.</Chip>}
            {apt.area     && <Chip icon="📐">{apt.area} м²</Chip>}
            {apt.floor && apt.total_floors && <Chip icon="🏢">{apt.floor}/{apt.total_floors}</Chip>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#D4AF37', lineHeight: 1 }}>
              {formatPrice(price)}
            </div>
            {priceUsd && (
              <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>
                ${priceUsd.toLocaleString()}
              </div>
            )}
          </div>
          <button onClick={handleFav} style={{
            width: 34, height: 34, borderRadius: 10, border: 'none',
            background: fav ? '#FFF0F0' : '#f7f7f7',
            cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            {fav ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Chip({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <span style={{
      background: '#f7f7f7', borderRadius: 8, padding: '3px 8px',
      fontSize: 11, color: '#555', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3,
    }}>
      {icon && <span style={{ fontSize: 10 }}>{icon}</span>}
      {children}
    </span>
  )
}
