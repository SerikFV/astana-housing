import { useParams, useNavigate } from 'react-router-dom'
import { useApartments } from '../hooks/useApartments'
import { getPrice, formatPrice, translateCondition, getCurrentUser, isFavorite, toggleFavorite } from '../utils'
import { useState } from 'react'
import MapModal from '../components/MapModal'
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

export default function ApartmentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { apartments, loading } = useApartments()
  const apt = apartments.find(a => a.id === Number(id))
  const email = getCurrentUser()
  const [fav, setFav] = useState(email && apt ? isFavorite(email, apt.id) : false)
  const [showMap, setShowMap] = useState(false)

  if (loading) return <div style={{ padding: 24, textAlign: 'center' }}>Жүктелуде...</div>
  if (!apt) return <div style={{ padding: 24, textAlign: 'center' }}>Пәтер табылмады</div>

  const price = getPrice(apt)

  const handleFav = () => {
    if (!email) return
    toggleFavorite(email, apt)
    setFav(!fav)
  }

  const details = [
    { label: 'Үй түрі', value: apt.house_type || '—' },
    { label: 'Салынған жыл', value: apt.year_built?.toString() || '—' },
    { label: 'Жөндеу', value: translateCondition(apt.condition) },
    { label: 'Санузел', value: apt.bathroom || '—' },
    { label: 'Балкон', value: apt.balcony || '—' },
    { label: 'Тұрақ', value: apt.parking || '—' },
    { label: 'Жиһаз', value: apt.furniture || '—' },
    { label: 'Жылыту', value: apt.heating || '—' },
    { label: 'Аудан', value: apt.district || '—' },
  ]

  return (
    <div style={{ paddingBottom: 32, minHeight: '100vh', background: '#f8f8f8' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', background: '#fff', borderBottom: '1px solid #e0e0e0',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>←</button>
        <span style={{ fontWeight: 700, fontSize: 17 }}>Пәтер мәліметі</span>
        <button onClick={handleFav} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>
          {fav ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Left column */}
        <div>
          <div style={{
            height: 300, borderRadius: 20, overflow: 'hidden', marginBottom: 20
          }}>
            <img src={getRoomImage(apt.rooms)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: '0 0 6px' }}>
            {apt.residential_complex_name || `Пәтер #${apt.id}`}
          </h1>
          <p style={{ fontSize: 14, color: '#666', margin: '0 0 14px' }}>{apt.address || '—'}</p>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#D4AF37', marginBottom: 20 }}>
            {formatPrice(price)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Бөлме', value: apt.rooms ? `${apt.rooms} бөл.` : '—' },
              { label: 'Ауданы', value: apt.area ? `${apt.area} м²` : '—' },
              { label: 'Қабат', value: apt.floor && apt.total_floors ? `${apt.floor}/${apt.total_floors}` : apt.floor ? `${apt.floor}` : '—' },
            ].map(item => (
              <div key={item.label} style={{
                background: '#D4AF3715', borderRadius: 14, padding: '16px 10px', textAlign: 'center'
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#D4AF37' }}>{item.value}</div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {apt.latitude && apt.longitude && (
              <button onClick={() => setShowMap(true)} style={goldBtn}>
                🗺️ Картада көру
              </button>
            )}
            {apt.url && (
              <a href={apt.url} target="_blank" rel="noopener noreferrer" style={{
                ...goldBtn, display: 'block', textAlign: 'center', textDecoration: 'none',
                background: '#fff', color: '#D4AF37', border: '2px solid #D4AF37'
              }}>
                🔗 Бастапқы хабарландыру
              </a>
            )}
          </div>
        </div>

        {/* Right column */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px' }}>Толық мәліметтер</h3>
          <div style={{ borderRadius: 16, border: '1px solid #e0e0e0', overflow: 'hidden', background: '#fff' }}>
            {details.map((d, i) => (
              <div key={d.label} style={{
                display: 'flex', justifyContent: 'space-between', padding: '14px 18px',
                background: i % 2 === 0 ? '#fafafa' : '#fff',
                borderBottom: i < details.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <span style={{ fontSize: 14, color: '#666' }}>{d.label}</span>
                <span style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 500 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showMap && apt.latitude && apt.longitude && (
        <MapModal lat={apt.latitude} lng={apt.longitude} title={apt.residential_complex_name || apt.address || ''} onClose={() => setShowMap(false)} />
      )}
    </div>
  )
}

const goldBtn: React.CSSProperties = {
  width: '100%', padding: '14px', borderRadius: 14, border: 'none',
  background: '#D4AF37', color: '#fff', fontWeight: 700, fontSize: 15,
  cursor: 'pointer', boxSizing: 'border-box'
}
