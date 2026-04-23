import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import { getCurrentUser } from '../utils'
import img1k from '../assets/images/1k.png'
import img2k from '../assets/images/2k.png'
import img3k from '../assets/images/3k.png'
import img4k from '../assets/images/4k.png'
import homeImg from '../assets/images/home.png'
import leafImg from '../assets/images/leaf.png'

const categories = [
  { label: '1 бөлмелі', img: img1k, rooms: '1', color: '#EBF5FB' },
  { label: '2 бөлмелі', img: img2k, rooms: '2', color: '#EAF9F1' },
  { label: '3 бөлмелі', img: img3k, rooms: '3', color: '#FEF9E7' },
  { label: '4+ бөлмелі', img: img4k, rooms: '4', color: '#FDEDEC' },
]

const marketItems = [
  { icon: '📈', label: 'Астана нарығы туралы', color: '#EBF5FB' },
  { icon: '🗺️', label: 'Аудандар бойынша баға', color: '#EAF9F1' },
  { icon: '🏗️', label: 'Жаңа үйлер vs ескі', color: '#FEF9E7' },
  { icon: '💰', label: 'Орташа баға талдауы', color: '#FDEDEC' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const email = getCurrentUser()
  const name = email ? email.split('@')[0] : ''

  return (
    <div style={{ paddingBottom: 90, minHeight: '100vh', background: '#f7f8fa' }}>
      <TopBar showMenu />

      {/* Greeting banner */}
      <div style={{
        margin: '16px 20px', borderRadius: 20,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
        padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', right: -10, top: -10, opacity: 0.08,
          backgroundImage: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
          width: 160, height: 160, borderRadius: '50%' }} />
        <div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Сәлем, {name} 👋</div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, marginTop: 4 }}>Пәтер іздеп жатырсыз ба?</div>
          <div style={{ color: '#D4AF37', fontSize: 13, marginTop: 4 }}>18 000+ ұсыныс дайын</div>
        </div>
        <div style={{
          width: 60, height: 60, borderRadius: 18, background: 'rgba(212,175,55,0.2)',
          border: '1.5px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src={homeImg} alt="" style={{ width: 34, height: 34, objectFit: 'contain' }} />
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#1a1a1a' }}>Санаттар</span>
          <button onClick={() => navigate('/apartments')} style={{
            background: 'none', border: 'none', color: '#D4AF37', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Барлығы →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {categories.map(cat => (
            <button key={cat.rooms} onClick={() => navigate(`/apartments?rooms=${cat.rooms}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px', borderRadius: 18, border: 'none',
                background: cat.color, cursor: 'pointer', textAlign: 'left',
              }}>
              <img src={cat.img} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 12 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/map')} style={{
            flex: 1, padding: '16px', borderRadius: 18, border: 'none',
            background: 'linear-gradient(135deg, #D4AF37, #f0c040)',
            color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 14px rgba(212,175,55,0.35)',
          }}>
            <img src={leafImg} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            Картада қарау
          </button>
          <button onClick={() => navigate('/chat')} style={{
            flex: 1, padding: '16px', borderRadius: 18, border: '2px solid #D4AF37',
            background: '#fff', color: '#D4AF37', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            🤖 ЖИ кеңесші
          </button>
        </div>
      </div>

      {/* Market info */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: '#1a1a1a', marginBottom: 14 }}>Нарықтық ақпарат</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {marketItems.map(item => (
            <button key={item.label} onClick={() => navigate('/statistics')}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '16px', borderRadius: 18, border: 'none',
                background: item.color, cursor: 'pointer', textAlign: 'left',
              }}>
              <span style={{ fontSize: 26, marginBottom: 8 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 600, lineHeight: 1.3 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Navbar />
    </div>
  )
}
