import { useNavigate } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import homeImg from '../assets/images/home.png'

export default function WelcomePage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Hero */}
      <div style={{
        position: 'relative', flex: '0 0 52vh', minHeight: 300,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img src={heroImg} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.25,
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(15,15,26,0.3) 0%, rgba(15,15,26,0.85) 100%)',
        }} />
        {/* Gold glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', padding: '0 28px' }}>
          <div style={{
            width: 76, height: 76, borderRadius: 22,
            background: 'rgba(212,175,55,0.15)',
            border: '1.5px solid rgba(212,175,55,0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 18px',
            boxShadow: '0 0 30px rgba(212,175,55,0.25)',
          }}>
            <img src={homeImg} alt="" style={{ width: 42, height: 42, objectFit: 'contain' }} />
          </div>
          <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 900, margin: '0 0 10px', letterSpacing: -0.5 }}>
            Астана баспана
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, margin: 0 }}>
            18 000+ пәтер · нарықты зерттеңіз
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, background: '#fff', borderRadius: '28px 28px 0 0',
        padding: '28px 24px 36px', display: 'flex', flexDirection: 'column', gap: 14,
        marginTop: -24,
      }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 4 }}>
          {[
            { value: '18K+', label: 'Пәтер', icon: '🏠' },
            { value: '7',    label: 'Аудан',  icon: '📍' },
            { value: '100%', label: 'Тегін',  icon: '✅' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'linear-gradient(135deg, #fffbef, #fff9e0)',
              borderRadius: 16, padding: '14px 8px', textAlign: 'center',
              border: '1px solid #f5e9b0',
            }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#D4AF37' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        {[
          { icon: '📊', title: 'Нарық статистикасы', desc: 'Аудандар мен бөлмелер бойынша баға талдауы', color: '#EBF5FB' },
          { icon: '🗺️', title: 'Интерактивті карта',  desc: 'Пәтерлерді картада қараңыз, маршрут құрыңыз', color: '#EAF9F1' },
          { icon: '🤖', title: 'ИИ кеңесші',          desc: 'Жасанды интеллект арқылы сұрақтарыңызға жауап', color: '#FEF9E7' },
        ].map(f => (
          <div key={f.title} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px', borderRadius: 16,
            background: f.color, border: '1px solid rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: 'rgba(255,255,255,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>{f.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{f.title}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{f.desc}</div>
            </div>
          </div>
        ))}

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <button onClick={() => navigate('/signup')} style={{
            padding: '16px', borderRadius: 16, border: 'none',
            background: 'linear-gradient(135deg, #D4AF37 0%, #f0c040 100%)',
            color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(212,175,55,0.4)',
            letterSpacing: 0.3,
          }}>
            Тіркелу
          </button>
          <button onClick={() => navigate('/signin')} style={{
            padding: '15px', borderRadius: 16,
            border: '2px solid #D4AF37',
            background: 'transparent', color: '#D4AF37',
            fontWeight: 700, fontSize: 16, cursor: 'pointer',
          }}>
            Кіру
          </button>
        </div>
      </div>
    </div>
  )
}
