import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import { getCurrentUser, getRegisteredUsers, getAllFeedbacks, ADMIN_EMAIL, isAdmin } from '../utils'

export default function AdminPage() {
  const navigate = useNavigate()
  const email = getCurrentUser()
  const [tab, setTab] = useState<'apartments' | 'feedbacks' | 'accounts'>('apartments')
  const [newApt, setNewApt] = useState({ name: '', address: '', price: '', rooms: '', area: '' })

  if (!isAdmin(email || '')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 64 }}>🔒</div>
        <div style={{ fontWeight: 700, color: '#E74C3C', fontSize: 20 }}>Рұқсат жоқ</div>
        <button onClick={() => navigate('/home')} style={{ padding: '12px 32px', borderRadius: 12, background: '#D4AF37', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
          Басты бетке
        </button>
      </div>
    )
  }

  const feedbacks = getAllFeedbacks()
  const accounts = getRegisteredUsers()

  const handleAddApt = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Пәтер қосылды (демо режим)')
    setNewApt({ name: '', address: '', price: '', rooms: '', area: '' })
  }

  return (
    <div style={{ paddingBottom: 80, minHeight: '100vh', background: '#f8f8f8' }}>
      <TopBar title="Админ панелі" showBack />
      <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', background: '#fff' }}>
        {(['apartments', 'feedbacks', 'accounts'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '16px 4px', border: 'none', background: 'none',
            borderBottom: tab === t ? '3px solid #D4AF37' : '3px solid transparent',
            color: tab === t ? '#D4AF37' : '#666', fontWeight: tab === t ? 700 : 400,
            fontSize: 14, cursor: 'pointer'
          }}>
            {t === 'apartments' ? 'Пәтерлер' : t === 'feedbacks' ? 'Пікірлер' : 'Аккаунттар'}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px 32px' }}>
        {tab === 'apartments' && (
          <div style={{ maxWidth: 600 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 18px' }}>Жаңа пәтер қосу</h3>
            <form onSubmit={handleAddApt} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'name', placeholder: 'ЖК атауы' },
                { key: 'address', placeholder: 'Мекен-жайы' },
                { key: 'price', placeholder: 'Баға (₸)' },
                { key: 'rooms', placeholder: 'Бөлме саны' },
                { key: 'area', placeholder: 'Ауданы (м²)' },
              ].map(f => (
                <input key={f.key} placeholder={f.placeholder}
                  value={newApt[f.key as keyof typeof newApt]}
                  onChange={e => setNewApt({ ...newApt, [f.key]: e.target.value })}
                  style={{ padding: '13px 16px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14 }} />
              ))}
              <button type="submit" style={{ padding: '13px', borderRadius: 12, background: '#D4AF37', color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                Қосу
              </button>
            </form>
          </div>
        )}

        {tab === 'feedbacks' && (
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 18px' }}>Барлық пікірлер ({feedbacks.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
              {feedbacks.length === 0
                ? <div style={{ color: '#666', fontSize: 14 }}>Пікірлер жоқ</div>
                : feedbacks.map((f, i) => (
                  <div key={i} style={{ padding: '16px', borderRadius: 14, border: '1px solid #e0e0e0', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#666' }}>{f.user_email}</span>
                      <span>{'⭐'.repeat(f.rating)}</span>
                    </div>
                    <div style={{ fontSize: 14 }}>{f.feedback}</div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>{new Date(f.created_at).toLocaleDateString('kk-KZ')}</div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {tab === 'accounts' && (
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 18px' }}>Аккаунттар ({accounts.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {accounts.map((u, i) => (
                <div key={i} style={{ padding: '14px 18px', borderRadius: 14, border: '1px solid #e0e0e0', background: '#fff', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                    {u.email[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{u.email}</div>
                    <div style={{ fontSize: 12, color: isAdmin(u.email) ? '#D4AF37' : '#666', marginTop: 2 }}>
                      {isAdmin(u.email) ? 'Администратор' : 'Қолданушы'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  )
}
