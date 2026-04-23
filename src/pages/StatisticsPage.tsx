import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import { useStatistics } from '../hooks/useApartments'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { DISTRICT_COLORS, DISTRICT_COLORS_FALLBACK } from '../utils'

export default function StatisticsPage() {
  const { stats, loading } = useStatistics()

  if (loading || !stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ color: '#D4AF37', fontWeight: 600, fontSize: 18 }}>Жүктелуде...</div>
    </div>
  )

  const { general, byDistrict, byRooms } = stats
  const maxRoomCount = Math.max(...byRooms.map(r => r.count))

  const summaryCards = [
    { label: 'Барлық пәтерлер', value: general.total.toLocaleString(), icon: '🏢' },
    { label: 'Орташа баға ($)', value: `$${general.avg_price.toLocaleString()}`, icon: '💵' },
    { label: 'Ең арзан', value: `$${general.min_price.toLocaleString()}`, icon: '📉' },
    { label: 'Ең қымбат', value: `$${general.max_price.toLocaleString()}`, icon: '📈' },
  ]

  return (
    <div style={{ paddingBottom: 80, minHeight: '100vh', background: '#f8f8f8' }}>
      <TopBar title="Статистика" />
      <div style={{ padding: '24px 32px' }}>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
          {summaryCards.map(c => (
            <div key={c.label} style={{
              background: '#fff', borderRadius: 16, padding: '20px 16px',
              border: '1px solid #e0e0e0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#D4AF37' }}>{c.value}</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e0e0e0' }}>
            <SectionTitle>Аудандар бойынша пәтерлер</SectionTitle>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={byDistrict} dataKey="count" nameKey="district" cx="50%" cy="50%" outerRadius={110}
                  label={({ district, percent }) => `${(percent * 100).toFixed(0)}%`}>
                  {byDistrict.map((entry, i) => (
                    <Cell key={entry.district} fill={DISTRICT_COLORS[entry.district] || DISTRICT_COLORS_FALLBACK[i % DISTRICT_COLORS_FALLBACK.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v} пәтер`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {byDistrict.map((d, i) => (
                <div key={d.district} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: DISTRICT_COLORS[d.district] || DISTRICT_COLORS_FALLBACK[i % DISTRICT_COLORS_FALLBACK.length] }} />
                  <span style={{ color: '#666' }}>{d.district}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e0e0e0' }}>
            <SectionTitle>Аудандар бойынша орташа баға ($)</SectionTitle>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byDistrict} layout="vertical" margin={{ left: 10, right: 30 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="district" tick={{ fontSize: 11 }} width={100} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Орташа баға']} />
                <Bar dataKey="avg_price" radius={[0, 6, 6, 0]}>
                  {byDistrict.map((entry, i) => (
                    <Cell key={entry.district} fill={DISTRICT_COLORS[entry.district] || DISTRICT_COLORS_FALLBACK[i % DISTRICT_COLORS_FALLBACK.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e0e0e0' }}>
            <SectionTitle>Бөлмелер бойынша бөлініс</SectionTitle>
            {byRooms.map(r => (
              <div key={r.rooms} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 14, color: '#1a1a1a' }}>{r.rooms} бөлмелі</span>
                  <span style={{ fontSize: 13, color: '#666' }}>{r.count.toLocaleString()} пәтер</span>
                </div>
                <div style={{ background: '#f0f0f0', borderRadius: 6, height: 10 }}>
                  <div style={{
                    background: '#D4AF37', borderRadius: 6, height: 10,
                    width: `${(r.count / maxRoomCount) * 100}%`
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#D4AF3710', borderRadius: 16, padding: '20px', border: '1px solid #D4AF3740' }}>
            <SectionTitle>Нарықтық талдау</SectionTitle>
            {[
              { label: 'Жалпы ұсыныс', value: `${general.total.toLocaleString()} пәтер` },
              { label: 'Орташа баға', value: `$${general.avg_price.toLocaleString()}` },
              { label: '1 м² бағасы', value: `$${general.avg_price_per_m2.toLocaleString()}` },
              { label: 'Ең арзан', value: `$${general.min_price.toLocaleString()}` },
              { label: 'Ең қымбат', value: `$${general.max_price.toLocaleString()}` },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #D4AF3730' }}>
                <span style={{ fontSize: 14, color: '#666' }}>{item.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#D4AF37' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 14px' }}>{children}</h3>
}
