import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCurrentUser, getRegisteredUsers, getAllFeedbacks, isAdmin, formatPrice } from '../utils'
import { useApartments } from '../hooks/useApartments'

type Tab = 'dashboard' | 'apartments' | 'feedbacks' | 'accounts'

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key:'dashboard',  icon:'📊', label:'Дашборд'   },
  { key:'apartments', icon:'🏠', label:'Пәтерлер'  },
  { key:'feedbacks',  icon:'💬', label:'Пікірлер'  },
  { key:'accounts',   icon:'👥', label:'Аккаунттар'},
]

export default function AdminPage() {
  const navigate = useNavigate()
  const email = getCurrentUser()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [search, setSearch] = useState('')
  const [fbFilter, setFbFilter] = useState<number|'all'>('all')
  const [deletedFbs, setDeletedFbs] = useState<number[]>([])
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('blocked_users') || '[]')
  )
  const [newApt, setNewApt] = useState({ name:'', address:'', price:'', rooms:'', area:'', district:'' })
  const [aptMsg, setAptMsg] = useState('')

  const { apartments } = useApartments()
  const feedbacks = getAllFeedbacks()
  const accounts = getRegisteredUsers()

  if (!isAdmin(email || '')) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:20, background:'#f0f2f5' }}>
      <div style={{ fontSize:64 }}>🔒</div>
      <div style={{ fontWeight:800, color:'#E74C3C', fontSize:22 }}>Рұқсат жоқ</div>
      <div style={{ fontSize:14, color:'#888' }}>Тек администраторларға рұқсат берілген</div>
      <button onClick={() => navigate('/home')} style={{ padding:'13px 32px', borderRadius:14, background:'linear-gradient(135deg,#D4AF37,#f0c040)', color:'#fff', border:'none', cursor:'pointer', fontWeight:800, fontSize:15, boxShadow:'0 6px 20px rgba(212,175,55,0.4)' }}>
        Басты бетке
      </button>
    </div>
  )

  // Dashboard stats
  const totalApts = apartments.length
  const avgPrice = apartments.length ? Math.round(apartments.reduce((s,a) => s + (a.price_local || (a.price_usd||0)*470), 0) / apartments.length) : 0
  const totalFbs = feedbacks.length
  const avgRating = feedbacks.length ? (feedbacks.reduce((s,f) => s+f.rating, 0) / feedbacks.length).toFixed(1) : '—'

  // Filtered apartments
  const filteredApts = useMemo(() => {
    if (!search) return apartments.slice(0, 50)
    const q = search.toLowerCase()
    return apartments.filter(a =>
      a.residential_complex_name?.toLowerCase().includes(q) ||
      a.address?.toLowerCase().includes(q) ||
      a.district?.toLowerCase().includes(q)
    ).slice(0, 50)
  }, [apartments, search])

  // Filtered feedbacks
  const visibleFbs = feedbacks.filter((_, i) => !deletedFbs.includes(i))
    .filter(f => fbFilter === 'all' || f.rating === fbFilter)

  const handleDeleteFb = (idx: number) => setDeletedFbs(prev => [...prev, idx])

  const handleBlockUser = (u: string) => {
    const updated = blockedUsers.includes(u)
      ? blockedUsers.filter(x => x !== u)
      : [...blockedUsers, u]
    setBlockedUsers(updated)
    localStorage.setItem('blocked_users', JSON.stringify(updated))
  }

  const handleAddApt = (e: React.FormEvent) => {
    e.preventDefault()
    setAptMsg('✅ Пәтер сәтті қосылды (демо режим)')
    setNewApt({ name:'', address:'', price:'', rooms:'', area:'', district:'' })
    setTimeout(() => setAptMsg(''), 3000)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#f0f2f5', paddingBottom:80 }}>

      {/* Header */}
      <div style={{
        background:'linear-gradient(135deg,#1a1a2e,#0f3460)',
        padding:'20px 20px 0', position:'sticky', top:0, zIndex:100,
        boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => navigate('/home')} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
            <div>
              <div style={{ color:'#D4AF37', fontWeight:900, fontSize:18 }}>Админ панелі</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{email}</div>
            </div>
          </div>
          <div style={{ background:'rgba(212,175,55,0.2)', border:'1px solid rgba(212,175,55,0.4)', borderRadius:12, padding:'6px 14px' }}>
            <span style={{ color:'#D4AF37', fontSize:12, fontWeight:700 }}>👑 Администратор</span>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display:'flex', gap:2 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex:1, padding:'10px 4px', border:'none', cursor:'pointer',
              background: tab===t.key ? 'rgba(212,175,55,0.2)' : 'transparent',
              borderBottom: tab===t.key ? '2px solid #D4AF37' : '2px solid transparent',
              color: tab===t.key ? '#D4AF37' : 'rgba(255,255,255,0.4)',
              fontWeight: tab===t.key ? 800 : 500, fontSize:12,
              display:'flex', flexDirection:'column', alignItems:'center', gap:3,
              transition:'all 0.2s',
            }}>
              <span style={{ fontSize:18 }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:'16px' }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              {[
                { icon:'🏢', label:'Барлық пәтер', value:totalApts.toLocaleString(), grad:'linear-gradient(135deg,#667eea,#764ba2)' },
                { icon:'💰', label:'Орт. баға',    value:`${(avgPrice/1e6).toFixed(1)}млн`, grad:'linear-gradient(135deg,#D4AF37,#f0c040)' },
                { icon:'💬', label:'Пікірлер',     value:totalFbs.toString(), grad:'linear-gradient(135deg,#11998e,#38ef7d)' },
                { icon:'⭐', label:'Орт. рейтинг', value:avgRating.toString(), grad:'linear-gradient(135deg,#eb3349,#f45c43)' },
                { icon:'👥', label:'Аккаунттар',   value:accounts.length.toString(), grad:'linear-gradient(135deg,#4776e6,#8e54e9)' },
                { icon:'🚫', label:'Блокталған',   value:blockedUsers.length.toString(), grad:'linear-gradient(135deg,#373b44,#4286f4)' },
              ].map(s => (
                <div key={s.label} style={{ borderRadius:20, padding:'18px 16px', background:s.grad, boxShadow:'0 6px 20px rgba(0,0,0,0.12)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', right:-10, top:-10, fontSize:48, opacity:0.15 }}>{s.icon}</div>
                  <div style={{ fontSize:26, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{s.value}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', marginTop:3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent feedbacks */}
            <div style={{ background:'#fff', borderRadius:20, padding:'20px', boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:14 }}>Соңғы пікірлер</div>
              {feedbacks.slice(-5).reverse().map((f, i) => (
                <div key={i} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom: i<4 ? '1px solid #f5f5f5' : 'none' }}>
                  <div style={{ width:36, height:36, borderRadius:12, background:'linear-gradient(135deg,#667eea,#764ba2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14, flexShrink:0 }}>
                    {f.user_email[0].toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontSize:13, fontWeight:700 }}>{f.user_email.split('@')[0]}</span>
                      <span style={{ fontSize:12 }}>{'⭐'.repeat(f.rating)}</span>
                    </div>
                    <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{f.feedback}</div>
                  </div>
                </div>
              ))}
              {feedbacks.length === 0 && <div style={{ color:'#bbb', fontSize:14, textAlign:'center', padding:'20px 0' }}>Пікірлер жоқ</div>}
            </div>
          </div>
        )}

        {/* APARTMENTS */}
        {tab === 'apartments' && (
          <div>
            {/* Add form */}
            <div style={{ background:'#fff', borderRadius:20, padding:'20px', marginBottom:16, boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>➕ Жаңа пәтер қосу</div>
              {aptMsg && <div style={{ background:'#EAF9F1', border:'1px solid #2ECC71', borderRadius:12, padding:'12px 16px', marginBottom:14, color:'#27AE60', fontWeight:700, fontSize:14 }}>{aptMsg}</div>}
              <form onSubmit={handleAddApt} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[
                  { key:'name',     ph:'ЖК атауы',    full:false },
                  { key:'address',  ph:'Мекен-жайы',  full:false },
                  { key:'district', ph:'Аудан',        full:false },
                  { key:'price',    ph:'Баға (₸)',     full:false },
                  { key:'rooms',    ph:'Бөлме саны',   full:false },
                  { key:'area',     ph:'Ауданы (м²)',  full:false },
                ].map(f => (
                  <input key={f.key} placeholder={f.ph}
                    value={newApt[f.key as keyof typeof newApt]}
                    onChange={e => setNewApt({ ...newApt, [f.key]: e.target.value })}
                    style={{ padding:'12px 14px', borderRadius:12, border:'1.5px solid #e8e8e8', fontSize:13, outline:'none', background:'#fafafa' }} />
                ))}
                <button type="submit" style={{ gridColumn:'1/-1', padding:'14px', borderRadius:14, border:'none', background:'linear-gradient(135deg,#D4AF37,#f0c040)', color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'0 6px 20px rgba(212,175,55,0.35)' }}>
                  Қосу
                </button>
              </form>
            </div>

            {/* Search + list */}
            <div style={{ background:'#fff', borderRadius:20, padding:'20px', boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <div style={{ fontWeight:800, fontSize:16 }}>Пәтерлер тізімі</div>
                <span style={{ background:'#D4AF3720', color:'#D4AF37', borderRadius:10, padding:'3px 12px', fontSize:12, fontWeight:700 }}>{totalApts.toLocaleString()}</span>
              </div>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="🔍 Іздеу: атауы, мекен-жайы, аудан..."
                style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1.5px solid #e8e8e8', fontSize:13, marginBottom:14, outline:'none', boxSizing:'border-box', background:'#fafafa' }} />
              <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:400, overflowY:'auto' }}>
                {filteredApts.map(a => (
                  <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:14, background:'#fafafa', border:'1px solid #f0f0f0' }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#D4AF37,#f0c040)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:14, flexShrink:0 }}>
                      {a.rooms || '?'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {a.residential_complex_name || `Пәтер #${a.id}`}
                      </div>
                      <div style={{ fontSize:11, color:'#aaa' }}>{a.district} · {a.address}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:'#D4AF37' }}>
                        {formatPrice(a.price_local || (a.price_usd||0)*470)}
                      </div>
                      <div style={{ fontSize:10, color:'#bbb' }}>{a.area}м²</div>
                    </div>
                  </div>
                ))}
              </div>
              {search && filteredApts.length === 0 && <div style={{ textAlign:'center', color:'#bbb', padding:'20px 0' }}>Нәтиже табылмады</div>}
            </div>
          </div>
        )}

        {/* FEEDBACKS */}
        {tab === 'feedbacks' && (
          <div>
            <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
              {(['all',1,2,3,4,5] as const).map(r => (
                <button key={r} onClick={() => setFbFilter(r)} style={{
                  padding:'7px 16px', borderRadius:20, border:'none', cursor:'pointer', fontWeight:700, fontSize:12,
                  background: fbFilter===r ? 'linear-gradient(135deg,#D4AF37,#f0c040)' : '#fff',
                  color: fbFilter===r ? '#fff' : '#666',
                  boxShadow: fbFilter===r ? '0 4px 12px rgba(212,175,55,0.35)' : '0 2px 8px rgba(0,0,0,0.06)',
                }}>{r==='all' ? 'Барлығы' : `${'⭐'.repeat(r)}`}</button>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {visibleFbs.length === 0
                ? <div style={{ textAlign:'center', padding:'40px', color:'#bbb', fontSize:14 }}>Пікірлер жоқ</div>
                : visibleFbs.map((f, i) => (
                  <div key={i} style={{ background:'#fff', borderRadius:18, padding:'16px 18px', boxShadow:'0 4px 14px rgba(0,0,0,0.06)', border:'1px solid #efefef' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:12, background:'linear-gradient(135deg,#667eea,#764ba2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14 }}>
                          {f.user_email[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700 }}>{f.user_email.split('@')[0]}</div>
                          <div style={{ fontSize:11, color:'#bbb' }}>{new Date(f.created_at).toLocaleDateString('kk-KZ')}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:14 }}>{'⭐'.repeat(f.rating)}</span>
                        <button onClick={() => handleDeleteFb(feedbacks.indexOf(f))} style={{ background:'#FFF0F0', border:'none', color:'#E74C3C', borderRadius:8, padding:'4px 10px', fontSize:12, cursor:'pointer', fontWeight:700 }}>
                          🗑 Жою
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize:14, color:'#1a1a1a', lineHeight:1.6 }}>{f.feedback}</div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* ACCOUNTS */}
        {tab === 'accounts' && (
          <div>
            <div style={{ background:'#fff', borderRadius:20, padding:'16px 20px', marginBottom:14, boxShadow:'0 4px 16px rgba(0,0,0,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontWeight:800, fontSize:16 }}>Аккаунттар</span>
              <span style={{ background:'#D4AF3720', color:'#D4AF37', borderRadius:10, padding:'3px 12px', fontSize:12, fontWeight:700 }}>{accounts.length}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {accounts.length === 0
                ? <div style={{ textAlign:'center', padding:'40px', color:'#bbb', fontSize:14 }}>Аккаунттар жоқ</div>
                : accounts.map((u, i) => {
                  const blocked = blockedUsers.includes(u.email)
                  const admin = isAdmin(u.email)
                  return (
                    <div key={i} style={{ background:'#fff', borderRadius:18, padding:'16px 18px', boxShadow:'0 4px 14px rgba(0,0,0,0.06)', border: blocked ? '1.5px solid #FFD0D0' : '1px solid #efefef', opacity: blocked ? 0.7 : 1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{
                          width:46, height:46, borderRadius:14, flexShrink:0,
                          background: admin ? 'linear-gradient(135deg,#D4AF37,#f0c040)' : 'linear-gradient(135deg,#667eea,#764ba2)',
                          display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:18,
                        }}>{u.email[0].toUpperCase()}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>{u.email}</div>
                          <div style={{ display:'flex', gap:6, marginTop:4 }}>
                            <span style={{
                              fontSize:11, fontWeight:700, borderRadius:8, padding:'2px 8px',
                              background: admin ? 'rgba(212,175,55,0.15)' : 'rgba(102,126,234,0.12)',
                              color: admin ? '#D4AF37' : '#667eea',
                            }}>{admin ? '👑 Администратор' : '👤 Қолданушы'}</span>
                            {blocked && <span style={{ fontSize:11, fontWeight:700, borderRadius:8, padding:'2px 8px', background:'#FFF0F0', color:'#E74C3C' }}>🚫 Блокталған</span>}
                          </div>
                        </div>
                        {!admin && (
                          <button onClick={() => handleBlockUser(u.email)} style={{
                            padding:'8px 14px', borderRadius:12, border:'none', cursor:'pointer', fontWeight:700, fontSize:12,
                            background: blocked ? '#EAF9F1' : '#FFF0F0',
                            color: blocked ? '#27AE60' : '#E74C3C',
                          }}>{blocked ? '✅ Ашу' : '🚫 Блок'}</button>
                        )}
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  )
}
