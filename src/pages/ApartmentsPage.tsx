import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import ApartmentCard from '../components/ApartmentCard'
import { useApartments } from '../hooks/useApartments'
import { getPrice, DISTRICT_COLORS, DISTRICT_COLORS_FALLBACK, formatPrice } from '../utils'

const DISTRICTS = ['Есильский р-н', 'Нура р-н', 'Алматы р-н', 'Сарыарка р-н', 'Сарайшык р-н', 'р-н Байконур']
const ROOM_OPTS = ['all', '1', '2', '3', '4']
const PAGE_SIZE = 50

export default function ApartmentsPage() {
  const { apartments, loading } = useApartments()
  const [searchParams] = useSearchParams()
  const [showFilter, setShowFilter] = useState(false)
  const [district, setDistrict] = useState('all')
  const [rooms, setRooms] = useState(searchParams.get('rooms') || 'all')
  const [maxPrice, setMaxPrice] = useState(500_000_000)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => apartments.filter(a => {
    if (district !== 'all' && a.district !== district) return false
    if (rooms !== 'all') {
      const r = parseInt(rooms)
      if (r === 4) { if (!a.rooms || a.rooms < 4) return false }
      else { if (a.rooms !== r) return false }
    }
    if (getPrice(a) > maxPrice) return false
    return true
  }), [apartments, district, rooms, maxPrice])

  const grouped = useMemo(() => {
    const limited = filtered.slice(0, page * PAGE_SIZE)
    const map: Record<string, typeof limited> = {}
    limited.forEach(a => {
      const d = a.district || 'Белгісіз'
      if (!map[d]) map[d] = []
      map[d].push(a)
    })
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length)
  }, [filtered, page])

  const hasMore = filtered.length > page * PAGE_SIZE
  const reset = () => { setDistrict('all'); setRooms('all'); setMaxPrice(500_000_000); setPage(1) }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:16, background:'#f0f2f5' }}>
      <div style={{ fontSize:56, animation:'spin 2s linear infinite' }}>🏠</div>
      <div style={{ color:'#D4AF37', fontWeight:800, fontSize:18 }}>Пәтерлер жүктелуде...</div>
      <style>{`@keyframes spin{0%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}100%{transform:rotate(-10deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ paddingBottom:80, minHeight:'100vh', background:'#f0f2f5' }}>
      <TopBar title="Пәтерлер" showBack />

      {/* Sticky filter bar */}
      <div style={{
        position:'sticky', top:0, zIndex:50,
        background:'rgba(255,255,255,0.95)', backdropFilter:'blur(12px)',
        borderBottom:'1px solid #efefef',
        boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
      }}>
        <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              background:'linear-gradient(135deg,#D4AF37,#f0c040)',
              borderRadius:10, padding:'4px 12px', fontSize:13, fontWeight:800, color:'#fff',
              boxShadow:'0 2px 8px rgba(212,175,55,0.35)',
            }}>
              {Math.min(filtered.length, 500)}
            </div>
            <span style={{ fontSize:13, color:'#888' }}>пәтер табылды</span>
          </div>
          <button onClick={() => setShowFilter(!showFilter)} style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'9px 18px', borderRadius:22,
            border: showFilter ? 'none' : '1.5px solid #D4AF37',
            background: showFilter ? 'linear-gradient(135deg,#D4AF37,#f0c040)' : '#fff',
            color: showFilter ? '#fff' : '#D4AF37',
            fontWeight:700, fontSize:13, cursor:'pointer',
            boxShadow: showFilter ? '0 4px 14px rgba(212,175,55,0.35)' : 'none',
            transition:'all 0.2s',
          }}>
            <span>⚙</span> Фильтр
          </button>
        </div>

        {showFilter && (
          <div style={{ padding:'16px 20px 20px', borderTop:'1px solid #f5f5f5', background:'#fafafa' }}>
            {/* Room buttons */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, color:'#999', fontWeight:600, marginBottom:8 }}>БӨЛМЕ САНЫ</div>
              <div style={{ display:'flex', gap:8 }}>
                {ROOM_OPTS.map(r => (
                  <button key={r} onClick={() => setRooms(r)} style={{
                    padding:'8px 16px', borderRadius:22,
                    border: rooms===r ? 'none' : '1.5px solid #e0e0e0',
                    background: rooms===r ? 'linear-gradient(135deg,#1a1a2e,#0f3460)' : '#fff',
                    color: rooms===r ? '#D4AF37' : '#666',
                    fontWeight:700, fontSize:13, cursor:'pointer',
                    boxShadow: rooms===r ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                    transition:'all 0.2s',
                  }}>{r==='all' ? 'Барлығы' : r==='4' ? '4+' : r}</button>
                ))}
              </div>
            </div>

            {/* District chips */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, color:'#999', fontWeight:600, marginBottom:8 }}>АУДАН</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['all', ...DISTRICTS].map((d, i) => {
                  const color = d==='all' ? '#888' : (DISTRICT_COLORS[d] || DISTRICT_COLORS_FALLBACK[i % DISTRICT_COLORS_FALLBACK.length])
                  const active = district===d
                  return (
                    <button key={d} onClick={() => setDistrict(d)} style={{
                      padding:'7px 14px', borderRadius:22, fontSize:12, fontWeight:700, cursor:'pointer',
                      border: active ? 'none' : `1.5px solid ${color}33`,
                      background: active ? color : `${color}15`,
                      color: active ? '#fff' : color,
                      transition:'all 0.2s',
                      boxShadow: active ? `0 4px 12px ${color}55` : 'none',
                    }}>{d==='all' ? '🌍 Барлығы' : d}</button>
                  )
                })}
              </div>
            </div>

            {/* Price slider */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:12, color:'#999', fontWeight:600 }}>МАКС. БАҒА</span>
                <span style={{ fontSize:13, fontWeight:800, color:'#D4AF37' }}>{formatPrice(maxPrice)}</span>
              </div>
              <input type="range" min={0} max={500_000_000} step={1_000_000}
                value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width:'100%', accentColor:'#D4AF37', height:4 }} />
            </div>

            <button onClick={reset} style={{
              marginTop:14, padding:'10px 20px', borderRadius:12,
              border:'1.5px solid #e0e0e0', background:'#fff',
              color:'#888', fontSize:13, cursor:'pointer',
            }}>↺ Қалпына келтіру</button>
          </div>
        )}
      </div>

      {/* Grouped apartments */}
      <div style={{ padding:'16px 16px 0' }}>
        {grouped.map(([dist, apts], idx) => {
          const color = DISTRICT_COLORS[dist] || DISTRICT_COLORS_FALLBACK[idx % DISTRICT_COLORS_FALLBACK.length]
          const avgPrice = Math.round(apts.reduce((s, a) => s + getPrice(a), 0) / apts.length)
          return (
            <div key={dist} style={{ marginBottom:20 }}>
              {/* District header */}
              <div style={{
                borderRadius:'18px 18px 0 0', padding:'14px 20px',
                background:`linear-gradient(135deg, ${color}, ${color}cc)`,
                display:'flex', justifyContent:'space-between', alignItems:'center',
                boxShadow:`0 4px 16px ${color}44`,
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:'rgba(255,255,255,0.6)' }} />
                  <span style={{ color:'#fff', fontWeight:800, fontSize:15 }}>{dist}</span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ color:'#fff', fontSize:13, fontWeight:700 }}>{apts.length} пәтер</div>
                  <div style={{ color:'rgba(255,255,255,0.75)', fontSize:11 }}>орт. {formatPrice(avgPrice)}</div>
                </div>
              </div>

              {/* Cards grid */}
              <div style={{
                background:'#fff', borderRadius:'0 0 18px 18px',
                border:`1.5px solid ${color}33`, borderTop:'none',
                padding:'12px', boxShadow:`0 6px 20px ${color}18`,
                display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:4,
              }}>
                {apts.map(apt => <ApartmentCard key={apt.id} apt={apt} />)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Load more */}
      {hasMore && (
        <div style={{ padding:'16px', textAlign:'center' }}>
          <button onClick={() => setPage(p => p + 1)} style={{
            padding:'14px 32px', borderRadius:20, border:'none',
            background:'linear-gradient(135deg,#D4AF37,#f0c040)',
            color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer',
            boxShadow:'0 6px 20px rgba(212,175,55,0.4)',
          }}>
            Тағы жүктеу ({filtered.length - page * PAGE_SIZE} қалды)
          </button>
        </div>
      )}
      <Navbar />
    </div>
  )
}
