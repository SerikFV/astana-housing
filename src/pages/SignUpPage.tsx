import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiSignUp } from '../hooks/useApartments'
import { getRegisteredUsers, isAdmin } from '../utils'
import homeImg from '../assets/images/home.png'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [pass2, setPass2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !pass) return setError('Барлық өрістерді толтырыңыз')
    if (pass.length < 6) return setError('Құпиясөз кемінде 6 символ болуы керек')
    if (pass !== pass2)  return setError('Құпиясөздер сәйкес келмейді')
    setLoading(true)
    try {
      // API арқылы тіркелу
      const user = await apiSignUp(email, pass)
      localStorage.setItem('user_email', user.email)
      localStorage.setItem('user_id', String(user.id))
      localStorage.setItem('user_role', user.role)
      navigate('/home')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Қате'
      // fallback: localStorage
      if (msg.includes('тіркелген')) { setError(msg); setLoading(false); return }
      const users = getRegisteredUsers()
      if (users.find(u => u.email === email)) { setError('Бұл email тіркелген'); setLoading(false); return }
      users.push({ email, password: pass })
      localStorage.setItem('registered_users', JSON.stringify(users))
      localStorage.setItem('user_email', email)
      localStorage.setItem('user_role', isAdmin(email) ? 'admin' : 'user')
      navigate('/home')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
        padding: '48px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'radial-gradient(circle at 70% 50%, #D4AF37 0%, transparent 60%)' }} />
        <div style={{
          width: 72, height: 72, borderRadius: 22, background: 'rgba(212,175,55,0.2)',
          border: '2px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <img src={homeImg} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
        </div>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 24 }}>Тіркелу</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 6 }}>Жаңа аккаунт жасаңыз</div>
        <div style={{
          position: 'absolute', bottom: -2, left: 0, right: 0, height: 40,
          background: '#fff', borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
        }} />
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '32px 28px 40px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}>Email</label>
            <input type="email" placeholder="example@mail.com" value={email}
              onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}>Құпиясөз</label>
            <input type="password" placeholder="Кемінде 6 символ" value={pass}
              onChange={e => setPass(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}>Құпиясөзді қайталаңыз</label>
            <input type="password" placeholder="••••••••" value={pass2}
              onChange={e => setPass2(e.target.value)} style={inputStyle} />
          </div>
          {error && (
            <div style={{
              background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 10,
              padding: '10px 14px', color: '#E74C3C', fontSize: 13,
            }}>⚠️ {error}</div>
          )}
          <button type="submit" disabled={loading} style={{
            padding: '16px', borderRadius: 16, border: 'none', marginTop: 4,
            background: loading ? '#e0c96a' : 'linear-gradient(135deg, #D4AF37, #f0c040)',
            color: '#fff', fontWeight: 800, fontSize: 16, cursor: loading ? 'default' : 'pointer',
            boxShadow: '0 4px 16px rgba(212,175,55,0.35)',
          }}>
            {loading ? 'Тіркелуде...' : 'Тіркелу'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 14, color: '#888', marginTop: 24 }}>
          Аккаунтыңыз бар ма?{' '}
          <Link to="/signin" style={{ color: '#D4AF37', fontWeight: 700, textDecoration: 'none' }}>Кіру</Link>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '14px 16px', borderRadius: 14, border: '1.5px solid #e8e8e8',
  fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box',
  background: '#fafafa',
}
