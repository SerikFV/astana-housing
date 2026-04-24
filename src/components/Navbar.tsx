import { useLocation, useNavigate } from 'react-router-dom'
import homeImg from '../assets/images/home.png'
import leafImg from '../assets/images/leaf.png'
import userImg from '../assets/images/user.jpg'

const tabs = [
  { icon:'🏠', img: homeImg,  label:'Басты',      path:'/home' },
  { icon:'📊',               label:'Статистика',  path:'/statistics' },
  { icon:'🔍',               label:'Іздеу',       path:'/search' },
  { icon:'🤖',               label:'ЖИ',          path:'/chat' },
  { icon:'🗺️', img: leafImg, label:'Карта',       path:'/map' },
  { icon:'👤', img: userImg,  label:'Профиль',     path:'/profile' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:1000,
      background:'rgba(255,255,255,0.97)', backdropFilter:'blur(16px)',
      borderTop:'1px solid #efefef',
      boxShadow:'0 -4px 24px rgba(0,0,0,0.08)',
      display:'flex',
    }}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path ||
          (tab.path === '/search' && location.pathname === '/search')
        return (
          <button key={tab.path} onClick={() => navigate(tab.path)} style={{
            flex:1, padding:'8px 2px 10px', border:'none', background:'none',
            cursor:'pointer', display:'flex', flexDirection:'column',
            alignItems:'center', gap:3, position:'relative',
            transition:'all 0.2s',
          }}>
            {/* Active indicator */}
            {active && (
              <div style={{
                position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
                width:28, height:3, borderRadius:'0 0 4px 4px',
                background:'linear-gradient(90deg,#D4AF37,#f0c040)',
              }} />
            )}

            {/* Icon */}
            <div style={{
              width:32, height:32, borderRadius:10,
              background: active ? 'linear-gradient(135deg,#D4AF37,#f0c040)' : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.2s',
              boxShadow: active ? '0 4px 12px rgba(212,175,55,0.4)' : 'none',
            }}>
              {'img' in tab && tab.img ? (
                <img src={tab.img} alt="" style={{
                  width: tab.path==='/profile' ? 22 : 18,
                  height: tab.path==='/profile' ? 22 : 18,
                  objectFit:'cover',
                  borderRadius: tab.path==='/profile' ? '50%' : 0,
                  filter: active ? 'brightness(10)' : 'grayscale(60%) opacity(0.55)',
                }} />
              ) : (
                <span style={{ fontSize:17, filter: active ? 'brightness(10)' : 'grayscale(50%) opacity(0.6)' }}>
                  {tab.icon}
                </span>
              )}
            </div>

            <span style={{ fontSize:9, fontWeight: active ? 800 : 500, color: active ? '#D4AF37' : '#bbb', letterSpacing:0.2 }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
