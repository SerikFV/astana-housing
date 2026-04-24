import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ApartmentCard from '../components/ApartmentCard'
import { useApartments } from '../hooks/useApartments'
import { getPrice, formatPrice } from '../utils'

export default function SearchPage() {
  const navigate = useNavigate()
  const { apartments, loading } = useApartments()
  const [query, setQuery] = useState('')
  const [minP, setMinP] = useState(0)
  const [maxP, setMaxP] = useState(500_000_000)
  const [rooms, setRooms] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const results = useMemo(() => {
    if (!query.trim() && rooms === 'all' && minP === 0 && maxP === 500_000_000) return []
    const q = query.toLowerCase()
    return apartments.filter(a => {
      if (q) {
        const match =
          a.residential_complex_name?.toLowerCase().includes(q) ||
          a.address?.toLowerCase().includes(q) ||
          a.district?.toLowerCase().includes(q) ||
          String(a.id).includes(q)
        if (!match) return false
      }
      if (rooms !== 'all') {
        const r = parseInt(rooms)
        if (r === 4) { if (!a.rooms || a.rooms < 4) return false }
        else if (a.rooms !== r) return false
      }
      const p = getPrice(a)
      if (p < minP || p > maxP) return false
      return true
    }).slice(0, 100)
  }, [apartments, query, rooms, minP, maxP])

  return (
    <div style={{ paddingBottom:80, minHeight:'100vh', background:'#f0f2f5' }}>

      {/* Header */}
      <div style={{
        background:'linear-gradient(135deg,#1a1a2e,#0f3460)',
        padding:'16px 16px 20px', position:'sticky', top:0, zIndex:50,
        boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <span style={{ color:'#fff', fontWeight:800, fontSize:17 }}>Іздеу</span>
        </div>

        {/* Search input */}
        <div style={{ position:'relative' }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:18 }}>🔍</span>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ЖК атауы, мекен-жайы, аудан..."
            style={{
              width:'100%', padding:'13px 44px 13px 44px',
              borderRadius:16, border:'none', fontSize:14,
              background:'rgba(255,255,255,0.12)', color:'#fff',
              outline:'none', boxSizing:'border-box',
              backdropFilter:'blur(8px)',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:18, cursor:'pointer' }}>×</button>
          )}
        </div>

        {/* Filter toggle */}
        <button onClick={() => setShowFilters(!showFilters)} style={{
          marginTop:10, background:'rgba(212,175,55,0.2)', border:'1px solid rgba(212,175,55,0.4)',
          color:'#D4AF37', borderRadius:12, padding:'7px 16px', fontSize:12, fontWeight:700, cursor:'pointer',
        }}>⚙ Фильтрлер {showFilters ? '▲' : '▼'}</button>

        {showFilters && (
          <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', gap:6 }}>
              {['all','1','2','3','4'].map(r => (
                <button key={r} onClick={() => setRooms(r)} style={{
                  padding:'7px 14px', borderRadius:20, border:'none', cursor:'pointer', fontWeight:700, fontSize:12,
                  background: rooms===r ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                  color: rooms===r ? '#fff' : 'rgba(255,255,255,0.6)',
                }}>{r==='all' ? 'Барлығы' : r==='4' ? '4+' : r}</button>
              ))}
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <input type="number" placeholder="Мин ₸" value={minP || ''} onChange={e => setMinP(Number(e.target.value))}
                style={{ flex:1, padding:'9px 12px', borderRadius:10, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:12, outline:'none' }} />
              <span style={{ color:'rgba(255,255,255,0.4)' }}>—</span>
              <input type="number" placeholder="Макс ₸" value={maxP === 500_000_000 ? '' : maxP} onChange={e => setMaxP(e.target.value ? Number(e.target.value) : 500_000_000)}
                style={{ flex:1, padding:'9px 12px', borderRadius:10, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:12, outline:'none' }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ padding:'16px' }}>
        {/* Empty state */}
        {!query && rooms === 'all' && minP === 0 && maxP === 500_000_000 && (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🔍</div>
            <div style={{ fontWeight:800, fontSize:18, color:'#1a1a1a', marginBottom:8 }}>Іздеуді бастаңыз</div>
            <div style={{ fontSize:14, color:'#aaa', marginBottom:24 }}>ЖК атауы, мекен-жайы немесе аудан бойынша іздеңіз</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
              {['Нура', 'Есіл', 'Сарыарка', 'Алматы', 'Байконур'].map(d => (
                <button key={d} onClick={() => setQuery(d)} style={{
                  padding:'8px 16px', borderRadius:20, border:'1.5px solid #D4AF37',
                  background:'#FFF9E6', color:'#D4AF37', fontWeight:700, fontSize:13, cursor:'pointer',
                }}>{d}</button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <>
            <div style={{ fontSize:13, color:'#888', marginBottom:12, fontWeight:600 }}>
              {results.length} нәтиже табылды{results.length === 100 ? ' (алғашқы 100)' : ''}
            </div>
            {results.map(apt => <ApartmentCard key={apt.id} apt={apt} />)}
          </>
        )}

        {/* No results */}
        {query && results.length === 0 && !loading && (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>😕</div>
            <div style={{ fontWeight:800, fontSize:16, color:'#1a1a1a', marginBottom:6 }}>Нәтиже табылмады</div>
            <div style={{ fontSize:13, color:'#aaa' }}>"{query}" бойынша пәтер жоқ</div>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  )
}
