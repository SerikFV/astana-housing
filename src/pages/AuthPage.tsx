import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiSignIn, apiSignUp } from '../hooks/useApartments'
import { getRegisteredUsers, isAdmin } from '../utils'

// Түстер — сайттың өз палитрасы
const PRIMARY = '#1a1a2e'
const PRIMARY_DARK = '#0f3460'
const GOLD = '#D4AF37'
const GOLD_LIGHT = '#f0c040'

export default function AuthPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState(false) // false=кіру, true=тіркелу

  // Кіру
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Тіркелу
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regPass2, setRegPass2] = useState('')
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    // Admin hardcode кіру
    if ((email === 'admin@baspan.kz' && pass === 'Admin2025!') ||
        (email === 'admin' && pass === 'admin123')) {
      localStorage.setItem('user_email', email)
      localStorage.setItem('user_role', 'admin')
      navigate('/home')
      setLoginLoading(false)
      return
    }

    try {
      const user = await apiSignIn(email, pass)
      localStorage.setItem('user_email', user.email)
      localStorage.setItem('user_id', String(user.id))
      localStorage.setItem('user_role', user.role)
      navigate('/home')
    } catch {
      const users = getRegisteredUsers()
      const user = users.find(u => u.email === email && u.password === pass)
      if (!user) { setLoginError('Email немесе құпиясөз қате'); setLoginLoading(false); return }
      localStorage.setItem('user_email', email)
      localStorage.setItem('user_role', isAdmin(email) ? 'admin' : 'user')
      navigate('/home')
    }
    setLoginLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    if (!regEmail || !regPass) return setRegError('Барлық өрістерді толтырыңыз')
    if (regPass.length < 6) return setRegError('Құпиясөз кемінде 6 символ')
    if (regPass !== regPass2) return setRegError('Құпиясөздер сәйкес келмейді')
    setRegLoading(true)
    try {
      const user = await apiSignUp(regEmail, regPass)
      localStorage.setItem('user_email', user.email)
      localStorage.setItem('user_id', String(user.id))
      localStorage.setItem('user_role', user.role)
      navigate('/home')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Қате'
      if (msg.includes('тіркелген')) { setRegError(msg); setRegLoading(false); return }
      const users = getRegisteredUsers()
      if (users.find(u => u.email === regEmail)) { setRegError('Бұл email тіркелген'); setRegLoading(false); return }
      users.push({ email: regEmail, password: regPass })
      localStorage.setItem('registered_users', JSON.stringify(users))
      localStorage.setItem('user_email', regEmail)
      localStorage.setItem('user_role', isAdmin(regEmail) ? 'admin' : 'user')
      navigate('/home')
    }
    setRegLoading(false)
  }

  return (
    <div style={styles.body}>
      <style>{css}</style>
      <div className={`auth-container${active ? ' active' : ''}`}>

        {/* Кіру формасы */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Кіру</h1>
            <div className="input-box">
              <input type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)} required />
              <i>✉</i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Құпиясөз" value={pass}
                onChange={e => setPass(e.target.value)} required />
              <i>🔒</i>
            </div>
            {loginError && <div className="error-msg">{loginError}</div>}
            <button type="submit" className="btn" disabled={loginLoading}>
              {loginLoading ? 'Кіруде...' : 'Кіру'}
            </button>
          </form>
        </div>

        {/* Тіркелу формасы */}
        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Тіркелу</h1>
            <div className="input-box">
              <input type="email" placeholder="Email" value={regEmail}
                onChange={e => setRegEmail(e.target.value)} required />
              <i>✉</i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Құпиясөз (кемінде 6)" value={regPass}
                onChange={e => setRegPass(e.target.value)} required />
              <i>🔒</i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Құпиясөзді растау" value={regPass2}
                onChange={e => setRegPass2(e.target.value)} required />
              <i>🔒</i>
            </div>
            {regError && <div className="error-msg">{regError}</div>}
            <button type="submit" className="btn" disabled={regLoading}>
              {regLoading ? 'Тіркелуде...' : 'Тіркелу'}
            </button>
          </form>
        </div>

        {/* Toggle панель */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Қош келдіңіз!</h1>
            <p>Аккаунтыңыз жоқ па?</p>
            <button className="btn outline-btn" onClick={() => setActive(true)}>
              Тіркелу
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Қайта оралдыңыз!</h1>
            <p>Аккаунтыңыз бар ма?</p>
            <button className="btn outline-btn" onClick={() => setActive(false)}>
              Кіру
            </button>
          </div>
        </div>

      </div>
    </div>
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function styles_unused() { return { PRIMARY, PRIMARY_DARK, GOLD, GOLD_LIGHT } }
}

const styles = {
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  } as React.CSSProperties,
}

const css = `
.auth-container {
  position: relative;
  width: 820px;
  min-height: 520px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  overflow: hidden;
  border: 2px solid ${GOLD};
}

.form-box {
  position: absolute;
  right: 0;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fff;
  transition: 0.6s ease-in-out 0.2s;
  z-index: 1;
}

.form-box.register {
  visibility: hidden;
  opacity: 0;
}

.auth-container.active .form-box.login {
  opacity: 0;
  visibility: hidden;
}

.auth-container.active .form-box.register {
  visibility: visible;
  opacity: 1;
}

.auth-container.active .form-box {
  right: 50%;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

form h1 {
  font-size: 30px;
  font-weight: 800;
  color: ${PRIMARY};
  margin-bottom: 24px;
  text-align: center;
}

.input-box {
  position: relative;
  width: 100%;
  margin-bottom: 16px;
}

.input-box input {
  width: 100%;
  padding: 13px 44px 13px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  background: #fafafa;
  color: #1a1a1a;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.input-box input:focus {
  border-color: ${GOLD};
  background: #fff;
}

.input-box i {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-style: normal;
  font-size: 16px;
  color: ${GOLD};
}

.btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT});
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: 0.2s;
  box-shadow: 0 4px 16px rgba(212,175,55,0.35);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212,175,55,0.45);
}

.btn:disabled {
  opacity: 0.7;
  cursor: default;
  transform: none;
}

.outline-btn {
  background: rgba(255,255,255,0.15) !important;
  border: 2px solid #fff !important;
  box-shadow: none !important;
  width: 180px !important;
}

.outline-btn:hover {
  background: #fff !important;
  color: ${PRIMARY} !important;
}

.error-msg {
  width: 100%;
  padding: 10px 14px;
  background: #FFF0F0;
  border: 1px solid #FFD0D0;
  border-radius: 10px;
  color: #E74C3C;
  font-size: 13px;
  margin-bottom: 10px;
  text-align: center;
}

/* Toggle панель */
.toggle-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%);
  z-index: 2;
  transition: 0.6s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.auth-container.active .toggle-box {
  left: 50%;
}

.toggle-panel {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #fff;
  transition: 0.6s ease-in-out;
}

.toggle-panel h1 {
  font-size: 30px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
}

.toggle-panel p {
  font-size: 15px;
  color: rgba(255,255,255,0.85);
  margin-bottom: 24px;
}

.toggle-left { left: 0; }
.toggle-right { right: 0; transform: translateX(100%); }

.auth-container.active .toggle-right { transform: translateX(0); }
.auth-container.active .toggle-left { transform: translateX(-100%); }

/* Алтын жарқыл эффект */
.toggle-box::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%);
  top: 10%;
  right: 10%;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .auth-container { width: 95%; min-height: auto; }
  .toggle-box { display: none; }
  .form-box { width: 100%; position: relative; right: 0 !important; }
  .form-box.register { visibility: visible; opacity: 1; display: none; }
  .auth-container.active .form-box.login { display: none; }
  .auth-container.active .form-box.register { display: flex; }
}
`
