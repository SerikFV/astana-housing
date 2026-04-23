import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import ApartmentCard from '../components/ApartmentCard'
import { useApartments } from '../hooks/useApartments'
import { getPrice, DISTRICT_COLORS, DISTRICT_COLORS_FALLBACK, formatPrice } from '../utils'

const DISTRICTS = ['Есильский р-н', 'Нура р-н', 'Алматы р-н', 'Сарыарка р-н', 'Байқоңыр р-н', 'Сарайшык р-н']

export default function ApartmentsPage() {
  const { apartments, loading } = useApartments()
  const [searchParams] = useSearchParams()
  const initRooms = searchParams.get('rooms') || 'all'

  const [showFilter, setShowFilter] = useState(false)
  const [district, setDistrict] = useState('all')
  const [rooms, setRooms] = useState(initRooms)
  const [maxPrice, setMaxPrice] = useState(500_000_000)

  const filtered = useMemo(() => {
    return apartments.filter(a => {
      if (district !== 'all' && a.district !== district) return false
      if (rooms !== 'all') {
        const r = parseInt(rooms)
        if (r === 4) { if (!a.rooms || a.rooms < 4) return false }
        else { if (a.rooms !== r) return false }
      }
      const p = getPrice(a)
      if (p > maxPrice) return false
      return true
    })
  }, [apartments, district, rooms, maxPrice])

  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {}
    filtered.forEach(a => {
      const d = a.district || 'Белгісіз'
      if (!map[d]) map[d] = []
      map[d].push(a)
    })
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length)
  }, [filtered])

  const reset = () => { setDistrict('all'); setRooms('all'); setMaxPrice(500_000_000) }

  if (loading) return <LoadingScreen />

  return (
    <div style={{ paddingBottom: 80, minHeight: '100vh', background: '#f8f8f8' }}>
      <TopBar title="Пәтерлер" showBack />

      {/* Filter bar */}
      <div style={{
        padding: '12px 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #e0e0e0'
      }}>
        <span style={{ fontSize: 14, color: '#666' }}>{filtered.length} пәтер табылды</span>
        <button onClick={() => setShowFilter(!showFilter)} style={{
          padding: '8px 20px', borderRadius: 20, border: '1px solid #D4AF37',
          background: showFilter ? '#D4AF37' : '#fff', color: showFilter ? '#fff' : '#D4AF37',
          fontWeight: 600, fontSize: 14, cursor: 'pointer'
        }}>⚙ Фильтр</button>
      </div>

      {showFilter && (
        <div style={{ padding: '20px 32px', background: '#fafafa', borderBottom: '1px solid #e0e0e0', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 8 }}>Аудан</label>
            <select value={district} onChange={e => setDistrict(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14 }}>
              <option value="all">Барлық аудандар</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 8 }}>Бөлме саны</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', '1', '2', '3', '4'].map(r => (
                <button key={r} onClick={() => setRooms(r)} style={{
                  padding: '8px 16px', borderRadius: 20, border: '1px solid #e0e0e0',
                  background: rooms === r ? '#D4AF37' : '#fff',
                  color: rooms === r ? '#fff' : '#666',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer'
                }}>{r === 'all' ? 'Барлығы' : r === '4' ? '4+' : r}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: '2 1 300px' }}>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 8 }}>
              Макс. баға: {formatPrice(maxPrice)}
            </label>
            <input type="range" min={0} max={500_000_000} step={1_000_000}
              value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#D4AF37' }} />
          </div>
          <button onClick={reset} style={{
            padding: '10px 20px', borderRadius: 10, border: '1px solid #e0e0e0',
            background: '#fff', color: '#666', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap'
          }}>Қалпына келтіру</button>
        </div>
      )}

      <div style={{ padding: '0 32px' }}>
        {grouped.map(([dist, apts], idx) => {
          const color = DISTRICT_COLORS[dist] || DISTRICT_COLORS_FALLBACK[idx % DISTRICT_COLORS_FALLBACK.length]
          const avgPrice = Math.round(apts.reduce((s, a) => s + getPrice(a), 0) / apts.length)
          return (
            <div key={dist} style={{ marginTop: 20 }}>
              <div style={{
                background: color, borderRadius: '14px 14px 0 0',
                padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{dist}</span>
                <span style={{ color: '#fff', fontSize: 13, opacity: 0.9 }}>
                  {apts.length} пәтер · орт. {formatPrice(avgPrice)}
                </span>
              </div>
              <div style={{
                border: `1px solid ${color}`, borderTop: 'none',
                borderRadius: '0 0 14px 14px', padding: '0 16px',
                background: '#fff',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
              }}>
                {apts.slice(0, 30).map(apt => <ApartmentCard key={apt.id} apt={apt} />)}
                {apts.length > 30 && (
                  <div style={{ padding: '12px 0', textAlign: 'center', color: '#666', fontSize: 13, gridColumn: '1 / -1' }}>
                    + {apts.length - 30} пәтер...
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <Navbar />
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🏠</div>
      <div style={{ color: '#D4AF37', fontWeight: 600, fontSize: 18 }}>Деректер жүктелуде...</div>
    </div>
  )
}
