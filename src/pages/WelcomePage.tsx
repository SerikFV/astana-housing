import { useNavigate } from 'react-router-dom'
import heroImg from '../assets/hero.png'
import logoImg from '../assets/images/logo.png'

const FEATURES = [
  { icon:'📊', title:'Нарық статистикасы', desc:'Аудандар мен бөлмелер бойынша баға талдауы', color:'#EBF5FB', accent:'#3498DB' },
  { icon:'🗺️', title:'Интерактивті карта',  desc:'Пәтерлерді картада қараңыз, маршрут құрыңыз', color:'#EAF9F1', accent:'#2ECC71' },
  { icon:'🤖', title:'ЖИ Кеңесші',          desc:'Баспана ЖИ — нақты деректер негізінде кеңес', color:'#FEF9E7', accent:'#F39C12' },
  { icon:'🔍', title:'Жылдам іздеу',         desc:'18 000+ пәтер ішінен лезде табыңыз', color:'#F5EEF8', accent:'#9B59B6' },
]

export default function WelcomePage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:'100vh', background:'#0a0a14', display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
      <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'-10%', left:'-10%', width:'60vw', height:'60vw', borderRadius:'50%', background:'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)', animation:'blob1 8s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:'-5%', right:'-10%', width:'50vw', height:'50vw', borderRadius:'50%', background:'radial-gradient(circle, rgba(52,152,219,0.08) 0%, transparent 70%)', animation:'blob2 10s ease-in-out infinite' }} />
      </div>
      <div style={{ position:'relative', height:'48vh', minHeight:260, overflow:'hidden' }}>
        <img src={heroImg} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.15 }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(10,10,20,0.1) 0%, rgba(10,10,20,1) 100%)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
          <div style={{ width:120, height:120, borderRadius:'50%', overflow:'hidden', border:'3px solid #D4AF37', boxShadow:'0 0 40px rgba(212,175,55,0.4), 0 0 80px rgba(212,175,55,0.15)', animation:'pulse 3s ease-in-out infinite' }}>
            <img src={logoImg} alt="Астана Баспана" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
          <div style={{ textAlign:'center' }}>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, margin:'0 0 4px', letterSpacing:2, textTransform:'uppercase' }}>Сенің сенімді мекенің</p>
          </div>
        </div>
      </div>
      <div style={{ flex:1, background:'#fff', borderRadius:'32px 32px 0 0', padding:'28px 24px 40px', marginTop:-32, display:'flex', flexDirection:'column', gap:14, boxShadow:'0 -8px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
          {[{v:'18K+',l:'Пәтер',icon:'🏠',grad:'linear-gradient(135deg,#667eea,#764ba2)'},{v:'6',l:'Аудан',icon:'📍',grad:'linear-gradient(135deg,#D4AF37,#f0c040)'},{v:'100%',l:'Тегін',icon:'✅',grad:'linear-gradient(135deg,#11998e,#38ef7d)'}].map(s=>(
            <div key={s.l} style={{ borderRadius:18, padding:'14px 8px', textAlign:'center', background:s.grad, boxShadow:'0 4px 14px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>{s.v}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.75)', marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {FEATURES.map(f=>(
            <div key={f.title} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 14px', borderRadius:18, background:f.color, border:`1px solid ${f.accent}18` }}>
              <div style={{ width:44, height:44, borderRadius:14, flexShrink:0, background:'rgba(255,255,255,0.8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, boxShadow:`0 4px 12px ${f.accent}22` }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight:800, fontSize:14, color:'#1a1a1a' }}>{f.title}</div>
                <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:4 }}>
          <button onClick={()=>navigate('/signup')} style={{ padding:'17px', borderRadius:18, border:'none', background:'linear-gradient(135deg,#D4AF37,#f0c040)', color:'#fff', fontWeight:900, fontSize:16, cursor:'pointer', boxShadow:'0 8px 24px rgba(212,175,55,0.45)' }}>Тіркелу — тегін</button>
          <button onClick={()=>navigate('/signin')} style={{ padding:'16px', borderRadius:18, border:'2px solid #D4AF37', background:'transparent', color:'#D4AF37', fontWeight:800, fontSize:16, cursor:'pointer' }}>Кіру</button>
        </div>
        <div style={{ textAlign:'center', fontSize:11, color:'#ccc' }}>Кіру арқылы сіз пайдалану шарттарымен келісесіз</div>
      </div>
      <style>{`
        @keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(5%,5%) scale(1.05)}}
        @keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-5%,-3%) scale(1.08)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 40px rgba(212,175,55,0.4)}50%{box-shadow:0 0 70px rgba(212,175,55,0.6)}}
      `}</style>
    </div>
  )
}