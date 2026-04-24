import { useParams, useNavigate } from 'react-router-dom'
import { useApartments } from '../hooks/useApartments'
import { getPrice, formatPrice, translateCondition, getCurrentUser, isFavorite, toggleFavorite, addToHistory, addToCompare, isInCompare, removeFromCompare } from '../utils'
import { useState } from 'react'
import MapModal from '../components/MapModal'
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

const ROOM_ACCENT: Record<number, string> = { 1:'#3498DB', 2:'#2ECC71', 3:'#F39C12', 4:'#E74C3C' }

export default function ApartmentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { apartments, loading } = useApartments()
  const apt = apartments.find(a => a.id === Number(id))
  const email = getCurrentUser()
  const [fav, setFav] = useState(email && apt ? isFavorite(email, apt.id) : false)
  const [showMap, setShowMap] = useState(false)
  const [inCompare, setInCompare] = useState(apt ? isInCompare(apt.id) : false)

  // Тарихқа қосу
  useState(() => { if (apt) addToHistory(apt) })

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:16, background:'#f0f2f5' }}>
      <div style={{ fontSize:48 }}>🏠</div>
      <div style={{ color:'#D4AF37', fontWeight:700 }}>Жүктелуде...</div>
    </div>
  )
  if (!apt) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:48 }}>😕</div>
      <div style={{ fontWeight:700, fontSize:18 }}>Пәтер табылмады</div>
      <button onClick={() => navigate(-1)} style={{ padding:'12px 24px', borderRadius:14, background:'#D4AF37', color:'#fff', border:'none', fontWeight:700, cursor:'pointer' }}>Артқа</button>
    </div>
  )

  const price = getPrice(apt)
  const accent = ROOM_ACCENT[apt.rooms || 0] || '#D4AF37'
  const isNew = apt.year_built && apt.year_built >= 2024

  const handleFav = () => { if (!email) return; toggleFavorite(email, apt); setFav(!fav) }

  const handleCompare = () => {
    if (inCompare) { removeFromCompare(apt.id); setInCompare(false); return }
    const ok = addToCompare(apt)
    if (ok) setInCompare(true)
    else alert('Максимум 3 пәтер салыстыруға болады')
  }

  const details = [
    { icon:'🏗️', label:'Үй түрі',      value: apt.house_type || '—' },
    { icon:'📅', label:'Салынған жыл', value: apt.year_built?.toString() || '—' },
    { icon:'🔨', label:'Жөндеу',       value: translateCondition(apt.condition) },
    { icon:'🚿', label:'Санузел',      value: apt.bathroom || '—' },
    { icon:'🌿', label:'Балкон',       value: apt.balcony || '—' },
    { icon:'🚗', label:'Тұрақ',        value: apt.parking || '—' },
    { icon:'🛋️', label:'Жиһаз',       value: apt.furniture || '—' },
    { icon:'🔥', label:'Жылыту',       value: apt.heating || '—' },
    { icon:'🗺️', label:'Аудан',        value: apt.district || '—' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#f0f2f5', paddingBottom:40 }}>

      {/* Sticky header */}
      <div style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(255,255,255,0.95)', backdropFilter:'blur(12px)',
        borderBottom:'1px solid #efefef', boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
        padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <button onClick={() => navigate(-1)} style={{
          width:38, height:38, borderRadius:12, border:'none',
          background:'#f5f5f5', cursor:'pointer', fontSize:18,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>←</button>
        <span style={{ fontWeight:800, fontSize:16, color:'#1a1a1a' }}>Пәтер мәліметі</span>
        <button onClick={handleFav} style={{
          width:38, height:38, borderRadius:12, border:'none',
          background: fav ? '#FFF0F0' : '#f5f5f5',
          cursor:'pointer', fontSize:18,
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all 0.2s',
        }}>{fav ? '❤️' : '🤍'}</button>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'20px 16px' }}>

        {/* Hero image */}
        <div style={{ borderRadius:24, overflow:'hidden', position:'relative', height:280, marginBottom:20, boxShadow:`0 12px 40px ${accent}30` }}>
          <img src={getRoomImage(apt.rooms)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />

          {/* Badges */}
          <div style={{ position:'absolute', top:16, left:16, display:'flex', gap:8 }}>
            {isNew && (
              <span style={{ background:'linear-gradient(135deg,#D4AF37,#f0c040)', color:'#fff', borderRadius:10, padding:'5px 12px', fontSize:12, fontWeight:800, boxShadow:'0 4px 12px rgba(212,175,55,0.5)' }}>✨ ЖАҢА</span>
            )}
            {apt.rooms && (
              <span style={{ background:accent, color:'#fff', borderRadius:10, padding:'5px 12px', fontSize:12, fontWeight:800 }}>{apt.rooms} бөлмелі</span>
            )}
          </div>

          {/* Bottom info on image */}
          <div style={{ position:'absolute', bottom:20, left:20, right:20 }}>
            <div style={{ color:'#fff', fontWeight:900, fontSize:26, textShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>
              {formatPrice(price)}
            </div>
            <div style={{ color:'rgba(255,255,255,0.8)', fontSize:13, marginTop:4 }}>
              📍 {apt.address || apt.district || '—'}
            </div>
          </div>
        </div>

        {/* Title + key stats */}
        <div style={{ background:'#fff', borderRadius:20, padding:'20px', marginBottom:16, boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight:900, fontSize:20, color:'#1a1a1a', marginBottom:4 }}>
            {apt.residential_complex_name || `Пәтер #${apt.id}`}
          </div>
          <div style={{ fontSize:13, color:'#aaa', marginBottom:18 }}>{apt.district}</div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { icon:'🛏', label:'Бөлме', value: apt.rooms ? `${apt.rooms}` : '—', unit:'бөл.' },
              { icon:'📐', label:'Ауданы', value: apt.area ? `${apt.area}` : '—', unit:'м²' },
              { icon:'🏢', label:'Қабат', value: apt.floor && apt.total_floors ? `${apt.floor}/${apt.total_floors}` : apt.floor ? `${apt.floor}` : '—', unit:'' },
            ].map(s => (
              <div key={s.label} style={{
                background:`${accent}12`, borderRadius:16, padding:'16px 10px', textAlign:'center',
                border:`1.5px solid ${accent}22`,
              }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontWeight:900, fontSize:20, color:accent, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:11, color:'#888', marginTop:4 }}>{s.unit || s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Details table */}
        <div style={{ background:'#fff', borderRadius:20, padding:'20px', marginBottom:16, boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight:800, fontSize:16, color:'#1a1a1a', marginBottom:16 }}>Толық мәліметтер</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {details.map(d => (
              <div key={d.label} style={{
                display:'flex', alignItems:'center', gap:10,
                background:'#fafafa', borderRadius:14, padding:'12px 14px',
                border:'1px solid #f0f0f0',
              }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{d.icon}</span>
                <div>
                  <div style={{ fontSize:11, color:'#aaa', fontWeight:600 }}>{d.label}</div>
                  <div style={{ fontSize:13, color:'#1a1a1a', fontWeight:700, marginTop:2 }}>{d.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div style={{
          borderRadius:20, padding:'20px', marginBottom:16,
          background:`linear-gradient(135deg, ${accent}15, ${accent}08)`,
          border:`1.5px solid ${accent}30`,
          boxShadow:`0 4px 20px ${accent}15`,
        }}>
          <div style={{ fontWeight:800, fontSize:16, color:'#1a1a1a', marginBottom:14 }}>💰 Баға мәліметі</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:14, color:'#666' }}>Жалпы баға</span>
              <span style={{ fontSize:20, fontWeight:900, color:accent }}>{formatPrice(price)}</span>
            </div>
            {apt.area && price > 0 && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'#888' }}>1 м² бағасы</span>
                <span style={{ fontSize:14, fontWeight:700, color:'#666' }}>{formatPrice(Math.round(price / apt.area))}</span>
              </div>
            )}
            {apt.price_usd && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'#888' }}>Долларда</span>
                <span style={{ fontSize:14, fontWeight:700, color:'#888' }}>${apt.price_usd.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {apt.latitude && apt.longitude && (
            <button onClick={() => setShowMap(true)} style={{
              padding:'16px', borderRadius:16, border:'none',
              background:`linear-gradient(135deg, ${accent}, ${accent}cc)`,
              color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer',
              boxShadow:`0 6px 20px ${accent}44`,
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}>🗺️ Картада көру</button>
          )}
          {apt.url && (
            <a href={apt.url} target="_blank" rel="noopener noreferrer" style={{
              padding:'16px', borderRadius:16,
              border:`2px solid ${accent}`,
              background:'#fff', color:accent, fontWeight:800, fontSize:15, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              textDecoration:'none', boxSizing:'border-box',
            }}>🔗 Krisha.kz-де қарау</a>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <button onClick={handleFav} style={{
              padding:'14px', borderRadius:16, border:'none',
              background: fav ? 'linear-gradient(135deg,#eb3349,#f45c43)' : '#f5f5f5',
              color: fav ? '#fff' : '#666',
              fontWeight:800, fontSize:14, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              transition:'all 0.2s',
            }}>{fav ? '❤️ Таңдаулыда' : '🤍 Таңдаулыға'}</button>
            <button onClick={handleCompare} style={{
              padding:'14px', borderRadius:16, border:'none',
              background: inCompare ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f5f5f5',
              color: inCompare ? '#fff' : '#666',
              fontWeight:800, fontSize:14, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              transition:'all 0.2s',
            }}>{inCompare ? '⚖️ Салыстыруда' : '⚖️ Салыстыру'}</button>
          </div>
          {inCompare && (
            <button onClick={() => navigate('/compare')} style={{
              padding:'14px', borderRadius:16, border:'none',
              background:'linear-gradient(135deg,#1a1a2e,#0f3460)',
              color:'#D4AF37', fontWeight:800, fontSize:14, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            }}>📊 Салыстыруға өту →</button>
          )}
        </div>
      </div>

      {showMap && apt.latitude && apt.longitude && (
        <MapModal lat={apt.latitude} lng={apt.longitude} title={apt.residential_complex_name || apt.address || ''} onClose={() => setShowMap(false)} />
      )}
    </div>
  )
}
