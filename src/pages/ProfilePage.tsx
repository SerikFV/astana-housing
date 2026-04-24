import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ApartmentCard from '../components/ApartmentCard'
import { getCurrentUser, getFavorites, getAllFeedbacks, isAdmin } from '../utils'
import userImg from '../assets/images/user.jpg'

export default function ProfilePage() {
  const navigate = useNavigate()
  const email = getCurrentUser()
  const [tab, setTab] = useState<'favs'|'reviews'|'write'>('favs')
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [, forceUpdate] = useState(0)

  if (!email) { navigate('/signin'); return null }

  const favorites = getFavorites(email)
  const allFeedbacks = getAllFeedbacks()
  const myFeedbacks = allFeedbacks.filter(f => f.user_email === email)
  const avgRating = myFeedbacks.length
    ? (myFeedbacks.reduce((s, f) => s + f.rating, 0) / myFeedbacks.length).toFixed(1)
    : '—'
  const name = email.split('@')[0]
  const admin = isAdmin(email)

  const handleLogout = () => {
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_role')
    navigate('/')
  }

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) return
    const all = getAllFeedbacks()
    all.push({ user_email: email, feedback, rating, created_at: new Date().toISOString() })
    localStorage.setItem('all_feedbacks', JSON.stringify(all))
    setFeedback('')
    setRating(5)
    forceUpdate(n => n + 1)
    setTab('reviews')
  }

  const TABS = [
    { key:'favs',    label:'Таңдаулы',  icon:'❤️',  count: favorites.length },
    { key:'reviews', label:'Пікірлер',  icon:'💬',  count: myFeedbacks.length },
    { key:'write',   label:'Жазу',      icon:'✍️',  count: null },
  ] as const

  return (
    <div style={{ paddingBottom:90, minHeight:'100vh', background:'#f0f2f5' }}>

      {/* Hero header */}
      <div style={{
        background:'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        padding:'0 0 0 0', position:'relative', overflow:'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', right:-60, top:-60, width:220, height:220, borderRadius:'50%', background:'rgba(212,175,55,0.07)' }} />
        <div style={{ position:'absolute', left:-40, bottom:-40, width:160, height:160, borderRadius:'50%', background:'rgba(212,175,55,0.05)' }} />
        <div style={{ position:'absolute', right:60, bottom:20, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.03)' }} />

        <div style={{ padding:'20px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ color:'rgba(255,255,255,0.5)', fontSize:16, fontWeight:700 }}>Профиль</div>
          {admin && (
            <button onClick={() => navigate('/admin')} style={{
              background:'rgba(212,175,55,0.2)', border:'1px solid rgba(212,175,55,0.4)',
              color:'#D4AF37', borderRadius:12, padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer',
            }}>⚙ Админ</button>
          )}
        </div>

        {/* Avatar + info */}
        <div style={{ padding:'20px 24px 28px', display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{
              width:80, height:80, borderRadius:'50%', overflow:'hidden',
              border:'3px solid #D4AF37',
              boxShadow:'0 0 0 6px rgba(212,175,55,0.15)',
            }}>
              <img src={userImg} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
            {admin && (
              <div style={{
                position:'absolute', bottom:-2, right:-2,
                background:'linear-gradient(135deg,#D4AF37,#f0c040)',
                borderRadius:'50%', width:24, height:24,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:12,
                boxShadow:'0 2px 8px rgba(212,175,55,0.5)',
              }}>👑</div>
            )}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:'#fff', fontWeight:900, fontSize:20, letterSpacing:'-0.3px' }}>{name}</div>
            <div style={{ color:'rgba(255,255,255,0.45)', fontSize:12, marginTop:3 }}>{email}</div>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:6, marginTop:10,
              background: admin ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.08)',
              border: admin ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius:20, padding:'4px 14px',
            }}>
              <span style={{ fontSize:12 }}>{admin ? '👑' : '👤'}</span>
              <span style={{ fontSize:12, fontWeight:700, color: admin ? '#D4AF37' : 'rgba(255,255,255,0.7)' }}>
                {admin ? 'Администратор' : 'Қолданушы'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', margin:'0 20px 0', gap:10 }}>
          {[
            { label:'Таңдаулы', value:favorites.length, icon:'❤️', color:'#eb3349' },
            { label:'Пікірлер', value:myFeedbacks.length, icon:'💬', color:'#3498DB' },
            { label:'Рейтинг', value:avgRating, icon:'⭐', color:'#D4AF37' },
          ].map(s => (
            <div key={s.label} style={{
              background:'rgba(255,255,255,0.06)',
              border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:16, padding:'14px 10px', textAlign:'center',
              backdropFilter:'blur(8px)',
            }}>
              <div style={{ fontSize:22 }}>{s.icon}</div>
              <div style={{ color:s.color, fontWeight:900, fontSize:22, marginTop:4, lineHeight:1 }}>{s.value}</div>
              <div style={{ color:'rgba(255,255,255,0.45)', fontSize:11, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab bar inside header */}
        <div style={{ display:'flex', margin:'20px 20px 0', gap:4, background:'rgba(255,255,255,0.06)', borderRadius:16, padding:4 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex:1, padding:'10px 6px', borderRadius:12, border:'none', cursor:'pointer',
              background: tab===t.key ? 'rgba(212,175,55,0.25)' : 'transparent',
              color: tab===t.key ? '#D4AF37' : 'rgba(255,255,255,0.45)',
              fontWeight:700, fontSize:12, transition:'all 0.2s',
              display:'flex', alignItems:'center', justifyContent:'center', gap:5,
            }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.count !== null && t.count > 0 && (
                <span style={{
                  background:'rgba(212,175,55,0.3)', color:'#D4AF37',
                  borderRadius:10, padding:'1px 7px', fontSize:10, fontWeight:800,
                }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ height:20 }} />
      </div>

      {/* Tab content */}
      <div style={{ padding:'16px 16px 0' }}>

        {tab === 'favs' && (
          favorites.length === 0
            ? <EmptyState icon="❤️" text="Таңдаулылар жоқ" sub="Пәтерлерді таңдаулыға қосыңыз" />
            : <div>{favorites.map(apt => <ApartmentCard key={apt.id} apt={apt} onFavChange={() => forceUpdate(n=>n+1)} />)}</div>
        )}

        {tab === 'reviews' && (
          myFeedbacks.length === 0
            ? <EmptyState icon="💬" text="Пікірлер жоқ" sub="Алғашқы пікіріңізді қалдырыңыз" />
            : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {myFeedbacks.map((f, i) => (
                  <div key={i} style={{
                    background:'#fff', borderRadius:18, padding:'18px',
                    boxShadow:'0 4px 16px rgba(0,0,0,0.06)', border:'1px solid #efefef',
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <div style={{ display:'flex', gap:3 }}>
                        {[1,2,3,4,5].map(s => (
                          <span key={s} style={{ fontSize:16, opacity: s<=f.rating ? 1 : 0.15 }}>⭐</span>
                        ))}
                      </div>
                      <span style={{ fontSize:11, color:'#bbb' }}>{new Date(f.created_at).toLocaleDateString('kk-KZ')}</span>
                    </div>
                    <div style={{ fontSize:14, color:'#1a1a1a', lineHeight:1.6 }}>{f.feedback}</div>
                  </div>
                ))}
              </div>
        )}

        {tab === 'write' && (
          <div style={{ background:'#fff', borderRadius:20, padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid #efefef' }}>
            <div style={{ fontWeight:800, fontSize:17, color:'#1a1a1a', marginBottom:20 }}>Пікір қалдыру</div>
            <form onSubmit={handleFeedback} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <div style={{ fontSize:12, color:'#999', fontWeight:600, marginBottom:10 }}>БАҒАЛАУ</div>
                <div style={{ display:'flex', gap:8 }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setRating(s)} style={{
                      fontSize:32, background:'none', border:'none', cursor:'pointer',
                      opacity: s<=rating ? 1 : 0.2,
                      transform: s<=rating ? 'scale(1.1)' : 'scale(1)',
                      transition:'all 0.15s',
                    }}>⭐</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:12, color:'#999', fontWeight:600, marginBottom:8 }}>ПІКІР</div>
                <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
                  placeholder="Пікіріңізді жазыңыз..."
                  style={{
                    width:'100%', padding:'14px 16px', borderRadius:14,
                    border:'1.5px solid #e8e8e8', fontSize:14, resize:'none',
                    height:110, background:'#fafafa', outline:'none', boxSizing:'border-box',
                    fontFamily:'inherit', lineHeight:1.6,
                  }} />
              </div>
              <button type="submit" style={{
                padding:'15px', borderRadius:14, border:'none',
                background:'linear-gradient(135deg,#D4AF37,#f0c040)',
                color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer',
                boxShadow:'0 6px 20px rgba(212,175,55,0.4)',
                transition:'transform 0.15s',
              }}>Жіберу ✓</button>
            </form>
          </div>
        )}

        {/* Quick links */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:4 }}>
          <button onClick={() => navigate('/history')} style={{ padding:'14px', borderRadius:16, border:'1.5px solid #e0e0e0', background:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, color:'#555', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            🕐 Тарих
          </button>
          <button onClick={() => navigate('/compare')} style={{ padding:'14px', borderRadius:16, border:'1.5px solid #e0e0e0', background:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, color:'#555', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            ⚖️ Салыстыру
          </button>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          width:'100%', marginTop:4, padding:'15px', borderRadius:16,
          border:'none', background:'linear-gradient(135deg,#eb3349,#f45c43)',
          color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer',
          boxShadow:'0 6px 20px rgba(235,51,73,0.3)',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        }}>🚪 Шығу</button>      </div>
      <Navbar />
    </div>
  )
}

function EmptyState({ icon, text, sub }: { icon:string; text:string; sub:string }) {
  return (
    <div style={{ textAlign:'center', padding:'48px 20px' }}>
      <div style={{ fontSize:52, marginBottom:12 }}>{icon}</div>
      <div style={{ fontWeight:800, fontSize:16, color:'#1a1a1a', marginBottom:6 }}>{text}</div>
      <div style={{ fontSize:13, color:'#bbb' }}>{sub}</div>
    </div>
  )
}
