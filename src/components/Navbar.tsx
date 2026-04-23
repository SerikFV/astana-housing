import { useLocation, useNavigate } from 'react-router-dom'
import homeImg from '../assets/images/home.png'
import leafImg from '../assets/images/leaf.png'
import menuImg from '../assets/images/menu.png'
import userImg from '../assets/images/user.jpg'

const tabs = [
  { img: homeImg, label: 'Басты', path: '/home' },
  { icon: '📊', label: 'Статистика', path: '/statistics' },
  { icon: '🤖', label: 'ЖИ', path: '/chat' },
  { img: leafImg, label: 'Карта', path: '/map' },
  { img: menuImg, label: 'Пәтерлер', path: '/apartments' },
  { img: userImg, label: 'Профиль', path: '/profile' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: '1px solid #efefef',
      display: 'flex', zIndex: 1000,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
    }}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path ||
          (tab.path === '/apartments' && location.pathname.startsWith('/apartments'))
        return (
          <button key={tab.path} onClick={() => navigate(tab.path)}
            style={{
              flex: 1, padding: '10px 4px 10px', border: 'none',
              background: active ? '#FFF9E6' : 'none',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4, transition: 'background 0.2s',
            }}>
            <div style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8,
            }}>
              {'img' in tab ? (
                <img src={tab.img} alt="" style={{
                  width: tab.path === '/profile' ? 26 : 22,
                  height: tab.path === '/profile' ? 26 : 22,
                  objectFit: 'cover',
                  borderRadius: tab.path === '/profile' ? '50%' : 0,
                  filter: active ? 'none' : 'grayscale(60%) opacity(0.6)',
                }} />
              ) : (
                <span style={{ fontSize: 20, filter: active ? 'none' : 'grayscale(60%) opacity(0.7)' }}>
                  {tab.icon}
                </span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? '#D4AF37' : '#999' }}>
              {tab.label}
            </span>
            {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D4AF37' }} />}
          </button>
        )
      })}
    </nav>
  )
}
