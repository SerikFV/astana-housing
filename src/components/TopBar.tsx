import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getCurrentRole, isAdmin } from '../utils'
import userImg from '../assets/images/user.jpg'
import menuImg from '../assets/images/menu.png'
import arrowImg from '../assets/images/arrow.png'
import logoImg from '../assets/images/logo.png'

interface TopBarProps {
  title?: string
  showBack?: boolean
  showMenu?: boolean
}

export default function TopBar({ title, showBack, showMenu }: TopBarProps) {
  const navigate = useNavigate()
  const email = getCurrentUser()
  const role = getCurrentRole()
  const isAdminUser = isAdmin(email || '') || role === 'admin'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 20px', background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      {/* Left */}
      <div style={{ width: 40, display: 'flex', alignItems: 'center' }}>
        {showBack && (
          <button onClick={() => navigate(-1)} style={{ background:'#f5f5f5', border:'none', width:36, height:36, borderRadius:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <img src={arrowImg} alt="back" style={{ width:18, height:18, objectFit:'contain', transform:'rotate(180deg)' }} />
          </button>
        )}
        {showMenu && isAdminUser && (
          <button onClick={() => navigate('/admin')} style={{ background:'#f5f5f5', border:'none', width:36, height:36, borderRadius:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <img src={menuImg} alt="menu" style={{ width:18, height:18, objectFit:'contain' }} />
          </button>
        )}
      </div>

      {/* Center — logo */}
      <button onClick={() => navigate('/home')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8, padding:0 }}>
        <img src={logoImg} alt="Астана Баспана" style={{ width:40, height:40, objectFit:'contain', borderRadius:'50%' }} />
        {title && <span style={{ fontWeight:800, fontSize:16, color:'#1a1a1a' }}>{title}</span>}
      </button>

      {/* Right — profile */}
      <button onClick={() => navigate('/profile')} style={{ width:38, height:38, borderRadius:'50%', overflow:'hidden', border:'2px solid #D4AF37', cursor:'pointer', padding:0, background:'none' }}>
        <img src={userImg} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
      </button>
    </div>
  )
}
