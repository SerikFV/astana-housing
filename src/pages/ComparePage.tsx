import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCompare, removeFromCompare, clearCompare, formatPrice, getPrice } from '../utils'
import img0k from '../assets/images/0k.png'
import img1k from '../assets/images/1k.png'
import img2k from '../assets/images/2k.png'
import img3k from '../assets/images/3k.png'
import img4k from '../assets/images/4k.png'
import type { Apartment } from '../types'

function roomImg(r?: number) {
  if (!r) return img0k
  if (r === 1) return img1k
  if (r === 2) return img2k
  if (r === 3) return img3k
  return img4k
}

const ROWS: { key: keyof Apartment | 'price'; label: string; icon: string; fmt?: (v: unknown, apt: Apartment) => string }[] = [
  { key:'price',        label:'Баға',          icon:'💰', fmt:(_,a) => formatPrice(getPrice(a)) },
  { key:'rooms',        label:'Бөлме',         icon:'🛏', fmt:(v) => v ? `${v} бөл.` : '—' },
  { key:'area',         label:'Ауданы',        icon:'📐', fmt:(v) => v ? `${v} м²` : '—' },
  { key:'floor',        label:'Қабат',         icon:'🏢', fmt:(_,a) => a.floor && a.total_floors ? `${a.floor}/${a.total_floors}` : a.floor ? `${a.floor}` : '—' },
  { key:'year_built',   label:'Салынған жыл',  icon:'📅', fmt:(v) => v ? `${v}` : '—' },
  { key:'district',     label:'Аудан',         icon:'📍', fmt:(v) => `${v || '—'}` },
  { key:'house_type',   label:'Үй түрі',       icon:'🏗️', fmt:(v) => `${v || '—'}` },
  { key:'condition',    label:'Жөндеу',        icon:'🔨', fmt:(v) => `${v || '—'}` },
  { key:'bathroom',     label:'Санузел',       icon:'🚿', fmt:(v) => `${v || '—'}` },
  { key:'balcony',      label:'Балкон',        icon:'🌿', fmt:(v) => `${v || '—'}` },
  { key:'parking',      label:'Тұрақ',         icon:'🚗', fmt:(v) => `${v || '—'}` },
  { key:'furniture',    label:'Жиһаз',         icon:'🛋️', fmt:(v) => `${v || '—'}` },
  { key:'heating',      label:'Жылыту',        icon:'🔥', fmt:(v) => `${v || '—'}` },
]

const ACCENT = ['#3498DB', '#2ECC71', '#E67E22']

export default function ComparePage() {
  const navigate = useNavigate()
  const [apts, setApts] = useState<Apartment[]>(getCompare)

  const remove = (id: number) => {
    removeFromCompare(id)
    setApts(getCompare())
  }

  const clear = () => { clearCompare(); setApts([]) }

  if (apts.length === 0) return (
    <div style={{ paddingBottom:80, minHeight:'100vh', background:'#f0f2f5' }}>
      <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)', padding:'20px 20px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div style={{ color:'#D4AF37', fontWeight:900, fontSize:18 }}>Пәтер салыстыру</div>
        </div>
      </div>
      <div style={{ textAlign:'center', padding:'80px 20px' }}>
        <div style={{ fontSize:56, marginBottom:16 }}>⚖️</div>
        <div style={{ fontWeight:800, fontSize:18, color:'#1a1a1a', marginBottom:8 }}>Салыстыру тізімі бос</div>
        <div style={{ fontSize:14, color:'#aaa', marginBottom:24 }}>Пәтер бетінде ⚖️ батырмасын басыңыз</div>
        <button onClick={() => navigate('/apartments')} style={{ padding:'14px 28px', borderRadius:16, border:'none', background:'linear-gradient(135deg,#D4AF37,#f0c040)', color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer', boxShadow:'0 6px 20px rgba(212,175,55,0.4)' }}>
          Пәтерлерге өту
        </button>
      </div>
      <Navbar />
    </div>
  )

  return (
    <div style={{ paddingBottom:80, minHeight:'100vh', background:'#f0f2f5' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)', padding:'20px 20px 0', position:'sticky', top:0, zIndex:50, boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
            <div>
              <div style={{ color:'#D4AF37', fontWeight:900, fontSize:18 }}>Салыстыру</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{apts.length} пәтер</div>
            </div>
          </div>
          <button onClick={clear} style={{ background:'rgba(235,51,73,0.2)', border:'1px solid rgba(235,51,73,0.4)', color:'#eb3349', borderRadius:12, padding:'7px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            🗑 Тазалау
          </button>
        </div>

        {/* Apartment headers */}
        <div style={{ display:'grid', gridTemplateColumns:`repeat(${apts.length}, 1fr)`, gap:8, paddingBottom:16 }}>
          {apts.map((apt, i) => (
            <div key={apt.id} style={{ background:'rgba(255,255,255,0.08)', borderRadius:16, padding:'12px 10px', position:'relative', border:`1.5px solid ${ACCENT[i]}44` }}>
              <button onClick={() => remove(apt.id)} style={{ position:'absolute', top:6, right:6, background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.6)', width:22, height:22, borderRadius:6, cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
              <img src={roomImg(apt.rooms)} alt="" style={{ width:'100%', height:70, objectFit:'cover', borderRadius:10, marginBottom:8 }} />
              <div style={{ fontSize:11, fontWeight:800, color:'#fff', lineHeight:1.3, marginBottom:4 }}>
                {apt.residential_complex_name || `Пәтер #${apt.id}`}
              </div>
              <div style={{ fontSize:12, fontWeight:900, color:ACCENT[i] }}>{formatPrice(getPrice(apt))}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison rows */}
      <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:8 }}>
        {ROWS.map((row, ri) => {
          const values = apts.map(a => row.fmt ? row.fmt(a[row.key as keyof Apartment], a) : String(a[row.key as keyof Apartment] ?? '—'))
          const allSame = values.every(v => v === values[0])

          // Баға үшін ең арзанды белгілеу
          let bestIdx = -1
          if (row.key === 'price') {
            const prices = apts.map(a => getPrice(a))
            bestIdx = prices.indexOf(Math.min(...prices))
          }
          if (row.key === 'area') {
            const areas = apts.map(a => a.area || 0)
            bestIdx = areas.indexOf(Math.max(...areas))
          }

          return (
            <div key={row.key} style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
              {/* Row label */}
              <div style={{ padding:'10px 14px', background:'#fafafa', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>{row.icon}</span>
                <span style={{ fontSize:13, fontWeight:700, color:'#1a1a1a' }}>{row.label}</span>
                {!allSame && <span style={{ fontSize:10, color:'#E74C3C', fontWeight:700, marginLeft:'auto' }}>● Айырмашылық бар</span>}
              </div>
              {/* Values */}
              <div style={{ display:'grid', gridTemplateColumns:`repeat(${apts.length}, 1fr)` }}>
                {values.map((val, vi) => {
                  const isBest = bestIdx === vi
                  return (
                    <div key={vi} style={{
                      padding:'12px 14px', textAlign:'center',
                      borderRight: vi < apts.length - 1 ? '1px solid #f5f5f5' : 'none',
                      background: isBest ? `${ACCENT[vi]}10` : allSame ? '#fff' : `${ACCENT[vi]}06`,
                    }}>
                      <div style={{ fontSize:13, fontWeight: isBest || !allSame ? 800 : 500, color: isBest ? ACCENT[vi] : '#1a1a1a' }}>
                        {val}
                      </div>
                      {isBest && <div style={{ fontSize:10, color:ACCENT[vi], fontWeight:700, marginTop:2 }}>✓ Үздік</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Go to detail buttons */}
        <div style={{ display:'grid', gridTemplateColumns:`repeat(${apts.length}, 1fr)`, gap:8, marginTop:8 }}>
          {apts.map((apt, i) => (
            <button key={apt.id} onClick={() => navigate(`/apartments/${apt.id}`)} style={{
              padding:'13px', borderRadius:14, border:'none',
              background:`linear-gradient(135deg, ${ACCENT[i]}, ${ACCENT[i]}cc)`,
              color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer',
              boxShadow:`0 4px 14px ${ACCENT[i]}44`,
            }}>Толығырақ →</button>
          ))}
        </div>
      </div>
      <Navbar />
    </div>
  )
}
