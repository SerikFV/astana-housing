import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import TopBar from '../components/TopBar'
import { getCurrentUser } from '../utils'
import img1k from '../assets/images/1k.png'
import img2k from '../assets/images/2k.png'
import img3k from '../assets/images/3k.png'
import img4k from '../assets/images/4k.png'
import homeImg from '../assets/images/home.png'
import leafImg from '../assets/images/leaf.png'

const CATEGORIES = [
  { label:'1 бөлмелі', sub:'20–35 млн ₸', img:img1k, rooms:'1', color:'#EBF5FB', accent:'#3498DB' },
  { label:'2 бөлмелі', sub:'33–55 млн ₸', img:img2k, rooms:'2', color:'#EAF9F1', accent:'#2ECC71' },
  { label:'3 бөлмелі', sub:'52–90 млн ₸', img:img3k, rooms:'3', color:'#FEF9E7', accent:'#F39C12' },
  { label:'4+ бөлмелі', sub:'90 млн ₸+',  img:img4k, rooms:'4', color:'#FDEDEC', accent:'#E74C3C' },
]

const DISTRICTS = [
  { name:'Есіл р-н',    count:'5 121', price:'59.7 млн', color:'#3498DB' },
  { name:'Нура р-н',    count:'4 123', price:'41.9 млн', color:'#2ECC71' },
  { name:'Алматы р-н',  count:'3 894', price:'38 млн',   color:'#E67E22' },
  { name:'Сарыарка р-н',count:'2 104', price:'28.3 млн', color:'#9B59B6' },
  { name:'Сарайшық р-н',count:'1 467', price:'37.7 млн', color:'#1ABC9C' },
  { name:'р-н Байконур',count:'901',   price:'32.7 млн', color:'#E74C3C' },
]

const MARKET = [
  { icon:'📈', label:'Нарық тенденциясы', sub:'Баға өсімі +12%/жыл', color:'#EBF5FB', accent:'#3498DB' },
  { icon:'🗺️', label:'Аудандар картасы',  sub:'6 аудан, 18 388 пәтер', color:'#EAF9F1', accent:'#2ECC71' },
  { icon:'🏗️', label:'Жаңа үйлер',        sub:'2024–2025 жылғы',       color:'#FEF9E7', accent:'#F39C12' },
  { icon:'💰', label:'Баға талдауы',       sub:'1м² = 583 000 ₸',       color:'#FDEDEC', accent:'#E74C3C' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const email = getCurrentUser()
  const name = email ? email.split('@')[0] : 'Қонақ'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Қайырлы таң' : hour < 18 ? 'Қайырлы күн' : 'Қайырлы кеш'

  return (
    <div style={{ paddingBottom:90, minHeight:'100vh', background:'#f0f2f5' }}>
      <TopBar showMenu />

      {/* Hero banner */}
      <div style={{
        margin:'14px 16px', borderRadius:28,
        background:'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding:'24px 22px', position:'relative', overflow:'hidden',
        boxShadow:'0 12px 40px rgba(15,52,96,0.4)',
      }}>
        {/* Decorative blobs */}
        <div style={{ position:'absolute', right:-30, top:-30, width:160, height:160, borderRadius:'50%', background:'rgba(212,175,55,0.1)' }} />
        <div style={{ position:'absolute', right:30, bottom:-50, width:120, height:120, borderRadius:'50%', background:'rgba(212,175,55,0.06)' }} />
        <div style={{ position:'absolute', left:-20, bottom:-20, width:100, height:100, borderRadius:'50%', background:'rgba(52,152,219,0.08)' }} />

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div style={{ flex:1 }}>
            <div style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:4 }}>{greeting}, {name} 👋</div>
            <div style={{ color:'#fff', fontWeight:900, fontSize:22, lineHeight:1.25, marginBottom:8 }}>
              Армандаған үйіңізді<br />
              <span style={{ color:'#D4AF37' }}>бірге табайық</span>
            </div>
            <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginBottom:18 }}>
              18 388 пәтер · Астана қаласы
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => navigate('/apartments')} style={{
                padding:'11px 22px', borderRadius:22, border:'none',
                background:'linear-gradient(135deg,#D4AF37,#f0c040)',
                color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer',
                boxShadow:'0 6px 20px rgba(212,175,55,0.45)',
                display:'inline-flex', alignItems:'center', gap:6,
              }}>
                <span>🏠</span> Пәтерлер
              </button>
              <button onClick={() => navigate('/search')} style={{
                padding:'11px 18px', borderRadius:22, border:'1.5px solid rgba(255,255,255,0.2)',
                background:'rgba(255,255,255,0.08)', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer',
                display:'inline-flex', alignItems:'center', gap:6,
              }}>
                <span>🔍</span> Іздеу
              </button>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end' }}>
            <button onClick={() => navigate('/notifications')} style={{
              width:40, height:40, borderRadius:12, border:'none',
              background:'rgba(255,255,255,0.1)', color:'#fff', cursor:'pointer', fontSize:18,
              display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
            }}>
              🔔
              <div style={{ position:'absolute', top:6, right:6, width:8, height:8, borderRadius:'50%', background:'#E74C3C' }} />
            </button>
            <div style={{
              width:64, height:64, borderRadius:20, flexShrink:0,
              background:'rgba(212,175,55,0.15)',
              border:'1.5px solid rgba(212,175,55,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <img src={homeImg} alt="" style={{ width:38, height:38, objectFit:'contain' }} />
            </div>
          </div>
        </div>

        {/* Mini stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:20 }}>
          {[
            { v:'18 388', l:'Пәтер' },
            { v:'44 млн', l:'Орт. баға ₸' },
            { v:'6', l:'Аудан' },
          ].map(s => (
            <div key={s.l} style={{
              background:'rgba(255,255,255,0.07)', borderRadius:14, padding:'10px 8px', textAlign:'center',
              border:'1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ color:'#D4AF37', fontWeight:900, fontSize:15 }}>{s.v}</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10, marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding:'0 16px', marginBottom:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <button onClick={() => navigate('/map')} style={{
            padding:'16px', borderRadius:20, border:'none',
            background:'linear-gradient(135deg,#11998e,#38ef7d)',
            color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer',
            display:'flex', alignItems:'center', gap:10,
            boxShadow:'0 6px 20px rgba(17,153,142,0.35)',
          }}>
            <img src={leafImg} alt="" style={{ width:24, height:24, objectFit:'contain' }} />
            <div style={{ textAlign:'left' }}>
              <div>Картада қарау</div>
              <div style={{ fontSize:11, opacity:0.8, fontWeight:500 }}>Интерактивті карта</div>
            </div>
          </button>
          <button onClick={() => navigate('/chat')} style={{
            padding:'16px', borderRadius:20, border:'none',
            background:'linear-gradient(135deg,#667eea,#764ba2)',
            color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer',
            display:'flex', alignItems:'center', gap:10,
            boxShadow:'0 6px 20px rgba(102,126,234,0.35)',
          }}>
            <span style={{ fontSize:24 }}>🤖</span>
            <div style={{ textAlign:'left' }}>
              <div>ЖИ Кеңесші</div>
              <div style={{ fontSize:11, opacity:0.8, fontWeight:500 }}>Баспана ЖИ</div>
            </div>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding:'0 16px', marginBottom:20 }}>
        <SectionHeader title="Санаттар" onMore={() => navigate('/apartments')} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.rooms} onClick={() => navigate(`/apartments?rooms=${cat.rooms}`)} style={{
              padding:'16px', borderRadius:20, border:`1.5px solid ${cat.accent}22`,
              background:cat.color, cursor:'pointer', textAlign:'left',
              display:'flex', alignItems:'center', gap:12,
              boxShadow:`0 4px 14px ${cat.accent}18`,
              transition:'transform 0.15s',
            }}>
              <div style={{
                width:52, height:52, borderRadius:14, overflow:'hidden', flexShrink:0,
                boxShadow:`0 4px 12px ${cat.accent}33`,
              }}>
                <img src={cat.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:'#1a1a1a' }}>{cat.label}</div>
                <div style={{ fontSize:11, color:cat.accent, fontWeight:600, marginTop:2 }}>{cat.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Districts */}
      <div style={{ padding:'0 16px', marginBottom:20 }}>
        <SectionHeader title="Аудандар" onMore={() => navigate('/apartments')} />
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {DISTRICTS.map((d, i) => (
            <button key={d.name} onClick={() => navigate('/apartments')} style={{
              padding:'14px 16px', borderRadius:16, border:`1.5px solid ${d.color}22`,
              background:'#fff', cursor:'pointer', textAlign:'left',
              display:'flex', alignItems:'center', gap:12,
              boxShadow:'0 2px 10px rgba(0,0,0,0.04)',
              transition:'all 0.15s',
            }}>
              <div style={{
                width:36, height:36, borderRadius:12, flexShrink:0,
                background:`linear-gradient(135deg, ${d.color}, ${d.color}99)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff', fontWeight:900, fontSize:14,
              }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#1a1a1a' }}>{d.name}</div>
                <div style={{ fontSize:11, color:'#aaa', marginTop:1 }}>{d.count} пәтер</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:13, fontWeight:800, color:d.color }}>{d.price} ₸</div>
                <div style={{ fontSize:10, color:'#bbb' }}>орт. баға</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Market info */}
      <div style={{ padding:'0 16px', marginBottom:20 }}>
        <SectionHeader title="Нарықтық ақпарат" onMore={() => navigate('/statistics')} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {MARKET.map(item => (
            <button key={item.label} onClick={() => navigate('/statistics')} style={{
              padding:'18px 16px', borderRadius:20, border:`1.5px solid ${item.accent}22`,
              background:item.color, cursor:'pointer', textAlign:'left',
              boxShadow:`0 4px 14px ${item.accent}15`,
            }}>
              <div style={{ fontSize:30, marginBottom:10 }}>{item.icon}</div>
              <div style={{ fontSize:13, fontWeight:800, color:'#1a1a1a', lineHeight:1.3 }}>{item.label}</div>
              <div style={{ fontSize:11, color:item.accent, fontWeight:600, marginTop:4 }}>{item.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA banner */}
      <div style={{ margin:'0 16px 20px', borderRadius:24, overflow:'hidden',
        background:'linear-gradient(135deg,#D4AF37,#f0c040)',
        padding:'22px 24px', position:'relative',
        boxShadow:'0 8px 28px rgba(212,175,55,0.4)',
      }}>
        <div style={{ position:'absolute', right:-20, top:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.1)' }} />
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)', marginBottom:4 }}>Ипотека калькуляторы</div>
        <div style={{ fontSize:18, fontWeight:900, color:'#fff', marginBottom:12 }}>
          Ай сайынғы төлемді есептеңіз
        </div>
        <button onClick={() => navigate('/chat')} style={{
          padding:'10px 20px', borderRadius:16, border:'none',
          background:'rgba(255,255,255,0.25)', color:'#fff',
          fontWeight:800, fontSize:13, cursor:'pointer',
          backdropFilter:'blur(8px)',
        }}>ЖИ-ға сұрау →</button>
      </div>

      {/* Footer links */}
      <div style={{ margin:'0 16px 20px', display:'flex', gap:10 }}>
        <button onClick={() => navigate('/faq')} style={{ flex:1, padding:'14px', borderRadius:16, border:'1.5px solid #e0e0e0', background:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, color:'#555', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          ❓ FAQ
        </button>
        <button onClick={() => navigate('/contact')} style={{ flex:1, padding:'14px', borderRadius:16, border:'1.5px solid #e0e0e0', background:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, color:'#555', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          📞 Байланыс
        </button>
        <button onClick={() => navigate('/notifications')} style={{ flex:1, padding:'14px', borderRadius:16, border:'1.5px solid #e0e0e0', background:'#fff', cursor:'pointer', fontWeight:700, fontSize:13, color:'#555', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          🔔 Хабарлар
        </button>
      </div>

      <Navbar />
    </div>
  )
}

function SectionHeader({ title, onMore }: { title:string; onMore:()=>void }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
      <span style={{ fontSize:17, fontWeight:900, color:'#1a1a1a' }}>{title}</span>
      <button onClick={onMore} style={{
        background:'none', border:'none', color:'#D4AF37',
        fontSize:13, fontWeight:700, cursor:'pointer',
      }}>Барлығы →</button>
    </div>
  )
}
