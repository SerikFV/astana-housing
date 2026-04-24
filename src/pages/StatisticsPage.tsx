import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import { useStatistics } from '../hooks/useApartments'
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, AreaChart, Area,
} from 'recharts'
import { DISTRICT_COLORS, DISTRICT_COLORS_FALLBACK } from '../utils'

const GOLD = '#D4AF37'
const toKZT = (usd: number) => usd * 470

const summaryConfig = [
  { key: 'total',           label: 'Барлық пәтер',   icon: '🏢', grad: 'linear-gradient(135deg,#667eea,#764ba2)', fmt: (v:number) => v.toLocaleString() },
  { key: 'avg_price',       label: 'Орташа баға',     icon: '💰', grad: 'linear-gradient(135deg,#D4AF37,#f0c040)', fmt: (v:number) => `${(toKZT(v)/1e6).toFixed(1)} млн ₸` },
  { key: 'min_price',       label: 'Ең арзан',        icon: '📉', grad: 'linear-gradient(135deg,#11998e,#38ef7d)', fmt: (v:number) => `${(toKZT(v)/1e6).toFixed(1)} млн ₸` },
  { key: 'max_price',       label: 'Ең қымбат',       icon: '📈', grad: 'linear-gradient(135deg,#eb3349,#f45c43)', fmt: (v:number) => `${(toKZT(v)/1e6).toFixed(0)} млн ₸` },
  { key: 'avg_price_per_m2',label: '1 м² бағасы',     icon: '📐', grad: 'linear-gradient(135deg,#4776e6,#8e54e9)', fmt: (v:number) => `${toKZT(v).toLocaleString()} ₸` },
  { key: 'districts',       label: 'Аудандар',        icon: '🗺️', grad: 'linear-gradient(135deg,#1a1a2e,#0f3460)',  fmt: (v:number) => `${v} аудан` },
]

export default function StatisticsPage() {
  const { stats, loading } = useStatistics()

  if (loading || !stats) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:48 }}>📊</div>
      <div style={{ color:GOLD, fontWeight:700, fontSize:18 }}>Деректер жүктелуде...</div>
    </div>
  )

  const { general, byDistrict, byRooms } = stats
  const maxCount = Math.max(...byRooms.map(r => r.count))

  const areaData = byRooms.slice(0,6).map(r => ({
    name: `${r.rooms}бөл`,
    баға: Math.round(toKZT(r.avg_price) / 1e6),
    саны: r.count,
  }))

  const summaryValues: Record<string, number> = {
    total: general.total,
    avg_price: general.avg_price,
    min_price: general.min_price,
    max_price: general.max_price,
    avg_price_per_m2: general.avg_price_per_m2,
    districts: byDistrict.length,
  }

  return (
    <div style={{ paddingBottom:80, minHeight:'100vh', background:'#f0f2f5' }}>
      <TopBar title="Статистика" />

      <div style={{ padding:'20px 16px 0' }}>

        {/* Hero banner */}
        <div style={{
          borderRadius:24, marginBottom:20, overflow:'hidden',
          background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          padding:'28px 24px', position:'relative',
        }}>
          <div style={{ position:'absolute', right:-30, top:-30, width:180, height:180, borderRadius:'50%', background:'rgba(212,175,55,0.08)' }} />
          <div style={{ position:'absolute', right:40, bottom:-40, width:120, height:120, borderRadius:'50%', background:'rgba(212,175,55,0.05)' }} />
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Астана тұрғын үй нарығы · 2024–2025</div>
          <div style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:4 }}>
            {general.total.toLocaleString()} <span style={{ color:GOLD }}>пәтер</span>
          </div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.6)' }}>
            Орташа баға: <span style={{ color:GOLD, fontWeight:700 }}>{(toKZT(general.avg_price)/1e6).toFixed(1)} млн ₸</span>
            &nbsp;·&nbsp; 1м²: <span style={{ color:GOLD, fontWeight:700 }}>{toKZT(general.avg_price_per_m2).toLocaleString()} ₸</span>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
          {summaryConfig.map(c => (
            <div key={c.key} style={{
              borderRadius:20, padding:'18px 16px', background:c.grad,
              boxShadow:'0 6px 20px rgba(0,0,0,0.12)', position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', right:-10, top:-10, fontSize:48, opacity:0.15 }}>{c.icon}</div>
              <div style={{ fontSize:26, marginBottom:8 }}>{c.icon}</div>
              <div style={{ fontSize:18, fontWeight:900, color:'#fff', lineHeight:1.2 }}>
                {summaryConfig.find(x=>x.key===c.key)!.fmt(summaryValues[c.key])}
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', marginTop:4 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Аудандар бойынша прогресс */}
        <div style={{ ...card, marginBottom:16 }}>
          <SectionTitle icon="🏙️">Аудандар бойынша пәтерлер</SectionTitle>
          {byDistrict.map((d, i) => {
            const color = DISTRICT_COLORS[d.district] || DISTRICT_COLORS_FALLBACK[i % DISTRICT_COLORS_FALLBACK.length]
            const pct = Math.round((d.count / general.total) * 100)
            return (
              <div key={d.district} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:3, background:color }} />
                    <span style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{d.district}</span>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'#1a1a1a' }}>{d.count.toLocaleString()}</span>
                    <span style={{ fontSize:11, color:'#999', marginLeft:6 }}>{pct}%</span>
                    <span style={{ fontSize:11, color:color, marginLeft:8, fontWeight:600 }}>
                      {(toKZT(d.avg_price)/1e6).toFixed(1)} млн ₸
                    </span>
                  </div>
                </div>
                <div style={{ background:'#f0f0f0', borderRadius:8, height:10, overflow:'hidden' }}>
                  <div style={{
                    background:`linear-gradient(90deg, ${color}, ${color}99)`,
                    borderRadius:8, height:10, width:`${pct}%`,
                    boxShadow:`0 2px 6px ${color}66`,
                  }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Pie + Area charts */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
          <div style={card}>
            <SectionTitle icon="🥧">Аудандар үлесі</SectionTitle>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byDistrict} dataKey="count" nameKey="district"
                  cx="50%" cy="50%" outerRadius={90} innerRadius={45}
                  paddingAngle={3}
                  label={({ percent }) => `${(percent*100).toFixed(0)}%`}
                  labelLine={false}>
                  {byDistrict.map((e, i) => (
                    <Cell key={e.district} fill={DISTRICT_COLORS[e.district] || DISTRICT_COLORS_FALLBACK[i % DISTRICT_COLORS_FALLBACK.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v:number) => [`${v.toLocaleString()} пәтер`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
              {byDistrict.map((d,i) => (
                <div key={d.district} style={{ display:'flex', alignItems:'center', gap:4, fontSize:10 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background: DISTRICT_COLORS[d.district] || DISTRICT_COLORS_FALLBACK[i%DISTRICT_COLORS_FALLBACK.length] }} />
                  <span style={{ color:'#666' }}>{d.district}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <SectionTitle icon="📊">Бөлмелер бойынша баға (млн ₸)</SectionTitle>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={areaData} margin={{ left:0, right:10 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="name" tick={{ fontSize:11 }} />
                <YAxis tick={{ fontSize:10 }} tickFormatter={v => `${v}млн`} />
                <Tooltip formatter={(v:number) => [`${v} млн ₸`, 'Орташа баға']} />
                <Area type="monotone" dataKey="баға" stroke={GOLD} strokeWidth={3}
                  fill="url(#goldGrad)" dot={{ fill:GOLD, r:5, strokeWidth:2, stroke:'#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Бөлмелер бойынша горизонталь бар */}
        <div style={{ ...card, marginBottom:16 }}>
          <SectionTitle icon="🏠">Бөлмелер бойынша бөлініс</SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 24px' }}>
            {byRooms.slice(0,8).map((r, i) => {
              const colors = ['#667eea','#D4AF37','#11998e','#eb3349','#4776e6','#f7971e','#1ABC9C','#9B59B6']
              const c = colors[i % colors.length]
              return (
                <div key={r.rooms} style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'#1a1a1a' }}>{r.rooms} бөлмелі</span>
                    <div style={{ textAlign:'right' }}>
                      <span style={{ fontSize:12, color:'#888' }}>{r.count.toLocaleString()} пәтер</span>
                      <span style={{ fontSize:12, fontWeight:700, color:c, marginLeft:8 }}>
                        {(toKZT(r.avg_price)/1e6).toFixed(1)}млн
                      </span>
                    </div>
                  </div>
                  <div style={{ background:'#f0f0f0', borderRadius:8, height:8, overflow:'hidden' }}>
                    <div style={{
                      background:`linear-gradient(90deg, ${c}, ${c}bb)`,
                      borderRadius:8, height:8,
                      width:`${(r.count/maxCount)*100}%`,
                      boxShadow:`0 2px 6px ${c}55`,
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Аудандар бойынша баға Bar + Нарық талдауы */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
          <div style={card}>
            <SectionTitle icon="💹">Аудандар бойынша орташа баға</SectionTitle>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byDistrict} layout="vertical" margin={{ left:0, right:40 }}>
                <XAxis type="number" tick={{ fontSize:9 }} tickFormatter={v => `${(toKZT(v)/1e6).toFixed(0)}млн`} />
                <YAxis type="category" dataKey="district" tick={{ fontSize:9 }} width={85} />
                <Tooltip formatter={(v:number) => [`${(toKZT(v)/1e6).toFixed(1)} млн ₸`, 'Орташа баға']} />
                <Bar dataKey="avg_price" radius={[0,8,8,0]}
                  label={{ position:'right', fontSize:9, formatter:(v:number) => `${(toKZT(v)/1e6).toFixed(0)}млн` }}>
                  {byDistrict.map((e,i) => (
                    <Cell key={e.district} fill={DISTRICT_COLORS[e.district] || DISTRICT_COLORS_FALLBACK[i%DISTRICT_COLORS_FALLBACK.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ borderRadius:20, padding:'20px', background:'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', boxShadow:'0 6px 24px rgba(0,0,0,0.18)' }}>
            <SectionTitle icon="🔍" light>Нарықтық талдау</SectionTitle>
            {[
              { label:'Жалпы ұсыныс',     value:`${general.total.toLocaleString()} пәтер` },
              { label:'Орташа баға',       value:`${(toKZT(general.avg_price)/1e6).toFixed(1)} млн ₸` },
              { label:'1 м² орташа',       value:`${toKZT(general.avg_price_per_m2).toLocaleString()} ₸` },
              { label:'Ең арзан пәтер',    value:`${(toKZT(general.min_price)/1e6).toFixed(1)} млн ₸` },
              { label:'Ең қымбат пәтер',   value:`${(toKZT(general.max_price)/1e6).toFixed(0)} млн ₸` },
              { label:'Аудандар саны',     value:`${byDistrict.length} аудан` },
              { label:'Бөлме категориясы', value:`${byRooms.length} түр` },
            ].map((item, i) => (
              <div key={item.label} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'10px 0',
                borderBottom: i < 6 ? '1px solid rgba(212,175,55,0.15)' : 'none',
              }}>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>{item.label}</span>
                <span style={{ fontSize:14, fontWeight:800, color:GOLD }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line chart — бөлмелер бойынша баға тренді */}
        <div style={{ ...card, marginBottom:16 }}>
          <SectionTitle icon="📈">Бөлмелер санына байланысты баға өсімі</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={areaData} margin={{ left:0, right:20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="name" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:10 }} tickFormatter={v => `${v}млн`} />
              <Tooltip formatter={(v:number) => [`${v} млн ₸`, 'Орташа баға']} />
              <Line type="monotone" dataKey="баға" stroke={GOLD} strokeWidth={3}
                dot={{ fill:GOLD, r:6, strokeWidth:3, stroke:'#fff' }}
                activeDot={{ r:8, fill:GOLD }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
      <Navbar />
    </div>
  )
}

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 20,
  padding: '20px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  border: '1px solid #efefef',
}

function SectionTitle({ children, icon, light }: { children: React.ReactNode; icon?: string; light?: boolean }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
      {icon && <span style={{ fontSize:18 }}>{icon}</span>}
      <h3 style={{ fontSize:15, fontWeight:800, color: light ? '#fff' : '#1a1a1a', margin:0 }}>{children}</h3>
    </div>
  )
}
