import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

interface Notif { id:number; icon:string; title:string; body:string; time:string; read:boolean; type:'info'|'success'|'warning' }

const SAMPLE: Notif[] = [
  { id:1, icon:'🏠', title:'Жаңа пәтерлер қосылды', body:'Есіл ауданында 120+ жаңа пәтер пайда болды', time:'Бүгін, 10:30', read:false, type:'info' },
  { id:2, icon:'📉', title:'Баға төмендеді', body:'Сарыарқа ауданында орташа баға 5%-ға төмендеді', time:'Кеше, 18:00', read:false, type:'success' },
  { id:3, icon:'🤖', title:'Баспана ЖИ жаңартылды', body:'ЖИ кеңесші жаңа мүмкіндіктермен толықтырылды', time:'2 күн бұрын', read:true, type:'info' },
  { id:4, icon:'⭐', title:'Пікіріңіз қабылданды', body:'Платформаны жақсарту үшін рахмет!', time:'3 күн бұрын', read:true, type:'success' },
  { id:5, icon:'📊', title:'Нарық есебі дайын', body:'2025 жылдың 1-тоқсаны бойынша статистика жаңартылды', time:'1 апта бұрын', read:true, type:'warning' },
]

const TYPE_COLORS = { info:'#3498DB', success:'#2ECC71', warning:'#F39C12' }

export default function NotificationsPage() {
  const navigate = useNavigate()
  const [notifs, setNotifs] = useState<Notif[]>(SAMPLE)

  const markAll = () => setNotifs(prev => prev.map(n => ({...n, read:true})))
  const markOne = (id:number) => setNotifs(prev => prev.map(n => n.id===id ? {...n, read:true} : n))
  const deleteOne = (id:number) => setNotifs(prev => prev.filter(n => n.id !== id))

  const unread = notifs.filter(n => !n.read).length

  return (
    <div style={{ paddingBottom:80, minHeight:'100vh', background:'#f0f2f5' }}>
      <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)', padding:'20px 20px 24px', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
            <div>
              <div style={{ color:'#D4AF37', fontWeight:900, fontSize:18, display:'flex', alignItems:'center', gap:8 }}>
                Хабарландырулар
                {unread > 0 && <span style={{ background:'#E74C3C', color:'#fff', borderRadius:10, padding:'2px 8px', fontSize:11, fontWeight:800 }}>{unread}</span>}
              </div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{notifs.length} хабарлама</div>
            </div>
          </div>
          {unread > 0 && (
            <button onClick={markAll} style={{ background:'rgba(212,175,55,0.2)', border:'1px solid rgba(212,175,55,0.4)', color:'#D4AF37', borderRadius:12, padding:'7px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              Барлығын оқу
            </button>
          )}
        </div>
      </div>

      <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:10 }}>
        {notifs.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🔔</div>
            <div style={{ fontWeight:800, fontSize:16, color:'#1a1a1a' }}>Хабарландырулар жоқ</div>
          </div>
        )}
        {notifs.map(n => (
          <div key={n.id} onClick={() => markOne(n.id)} style={{
            background: n.read ? '#fff' : `${TYPE_COLORS[n.type]}08`,
            borderRadius:18, padding:'16px 18px',
            boxShadow:'0 4px 14px rgba(0,0,0,0.06)',
            border: n.read ? '1px solid #efefef' : `1.5px solid ${TYPE_COLORS[n.type]}33`,
            cursor:'pointer', display:'flex', gap:14, alignItems:'flex-start',
          }}>
            <div style={{ width:44, height:44, borderRadius:14, flexShrink:0, background:`${TYPE_COLORS[n.type]}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{n.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                <div style={{ fontWeight: n.read ? 600 : 800, fontSize:14, color:'#1a1a1a' }}>{n.title}</div>
                {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:TYPE_COLORS[n.type], flexShrink:0, marginTop:4 }} />}
              </div>
              <div style={{ fontSize:12, color:'#888', marginTop:3, lineHeight:1.5 }}>{n.body}</div>
              <div style={{ fontSize:11, color:'#bbb', marginTop:6 }}>{n.time}</div>
            </div>
            <button onClick={e => { e.stopPropagation(); deleteOne(n.id) }} style={{ background:'none', border:'none', color:'#ddd', fontSize:18, cursor:'pointer', flexShrink:0, padding:0 }}>×</button>
          </div>
        ))}
      </div>
      <Navbar />
    </div>
  )
}
