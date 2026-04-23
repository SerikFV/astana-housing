import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import ApartmentCard from '../components/ApartmentCard'
import { getCurrentUser, getFavorites, getAllFeedbacks, isAdmin } from '../utils'
import userImg from '../assets/images/user.jpg'
import heartImg from '../assets/images/heart.png'

export default function ProfilePage() {
  const navigate = useNavigate()
  const email = getCurrentUser()
  const [favOpen, setFavOpen] = useState(false)
  const [fbOpen, setFbOpen] = useState(false)
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
  }

  return (
    <div style={{ paddingBottom: 90, minHeight: '100vh', background: '#f7f8fa' }}>
      <TopBar title="Профиль" showMenu />

      {/* Profile header */}
      <div style={{
        margin: '16px 20px', borderRadius: 24,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
        padding: '24px', overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120,
          borderRadius: '50%', background: 'rgba(212,175,55,0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', overflow: 'hidden',
            border: '3px solid #D4AF37', flexShrink: 0,
          }}>
            <img src={userImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>{email.split('@')[0]}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>{email}</div>
            <div style={{
              display: 'inline-block', marginTop: 8,
              background: isAdmin(email) ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)',
              color: isAdmin(email) ? '#D4AF37' : 'rgba(255,255,255,0.8)',
              borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600,
            }}>
              {isAdmin(email) ? '👑 Администратор' : '👤 Қолданушы'}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 20 }}>
          {[
            { label: 'Таңдаулы', value: favorites.length, icon: '❤️' },
            { label: 'Пікірлер', value: myFeedbacks.length, icon: '💬' },
            { label: 'Рейтинг', value: avgRating, icon: '⭐' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 20, marginTop: 4 }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Favorites */}
        <Accordion
          title="Таңдаулылар"
          count={favorites.length}
          icon={<img src={heartImg} alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />}
          open={favOpen}
          onToggle={() => setFavOpen(!favOpen)}
        >
          {favorites.length === 0
            ? <EmptyState text="Таңдаулылар жоқ" />
            : favorites.map(apt => <ApartmentCard key={apt.id} apt={apt} onFavChange={() => forceUpdate(n => n + 1)} />)
          }
        </Accordion>

        {/* Feedbacks */}
        <Accordion
          title="Менің пікірлерім"
          count={myFeedbacks.length}
          icon={<span style={{ fontSize: 18 }}>💬</span>}
          open={fbOpen}
          onToggle={() => setFbOpen(!fbOpen)}
        >
          {myFeedbacks.length === 0
            ? <EmptyState text="Пікірлер жоқ" />
            : myFeedbacks.map((f, i) => (
              <div key={i} style={{
                padding: '14px', borderRadius: 14, background: '#fafafa',
                border: '1px solid #f0f0f0', marginBottom: 10,
              }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ fontSize: 14, opacity: s <= f.rating ? 1 : 0.2 }}>⭐</span>
                  ))}
                </div>
                <div style={{ fontSize: 14, color: '#1a1a1a' }}>{f.feedback}</div>
                <div style={{ fontSize: 11, color: '#bbb', marginTop: 6 }}>
                  {new Date(f.created_at).toLocaleDateString('kk-KZ')}
                </div>
              </div>
            ))
          }
        </Accordion>

        {/* Feedback form */}
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #f0f0f0',
          padding: '20px', marginBottom: 14,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#1a1a1a' }}>✍️ Пікір қалдыру</div>
          <form onSubmit={handleFeedback} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => setRating(s)} style={{
                  fontSize: 28, background: 'none', border: 'none', cursor: 'pointer',
                  opacity: s <= rating ? 1 : 0.25, transition: 'opacity 0.2s',
                }}>⭐</button>
              ))}
            </div>
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
              placeholder="Пікіріңізді жазыңыз..."
              style={{
                padding: '14px', borderRadius: 14, border: '1.5px solid #e8e8e8',
                fontSize: 14, resize: 'none', height: 100, background: '#fafafa', outline: 'none',
              }} />
            <button type="submit" style={{
              padding: '14px', borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, #D4AF37, #f0c040)',
              color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
            }}>Жіберу</button>
          </form>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          width: '100%', padding: '15px', borderRadius: 16,
          border: '1.5px solid #FFD0D0', background: '#FFF5F5',
          color: '#E74C3C', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 16,
        }}>🚪 Шығу</button>
      </div>
      <Navbar />
    </div>
  )
}

function Accordion({ title, count, icon, open, onToggle, children }: {
  title: string; count: number; icon: React.ReactNode;
  open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden', border: '1px solid #f0f0f0',
      marginBottom: 14, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      <button onClick={onToggle} style={{
        width: '100%', padding: '16px 20px', background: '#fff',
        border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {icon}
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{title}</span>
          <span style={{
            background: '#D4AF3720', color: '#D4AF37', borderRadius: 20,
            padding: '2px 10px', fontSize: 12, fontWeight: 700,
          }}>{count}</span>
        </div>
        <span style={{ color: '#D4AF37', fontSize: 16 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div style={{ padding: '0 20px 16px', borderTop: '1px solid #f5f5f5' }}>{children}</div>}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ padding: '24px 0', textAlign: 'center', color: '#bbb', fontSize: 14 }}>
      {text}
    </div>
  )
}
