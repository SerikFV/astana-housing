import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useToast } from '../components/Toast'

export default function ContactPage() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { show('Барлық өрістерді толтырыңыз', 'warning'); return }
    setSent(true)
    show('Хабарламаңыз жіберілді! Жақын арада жауап береміз.', 'success')
  }

  const contacts = [
    { icon:'📧', label:'Email', value:'support@baspan.kz', href:'mailto:support@baspan.kz' },
    { icon:'📱', label:'Telegram', value:'@astana_baspan', href:'https://t.me/astana_baspan' },
    { icon:'🌐', label:'Сайт', value:'baspan.kz', href:'https://baspan.kz' },
  ]

  return (
    <div style={{ paddingBottom:80, minHeight:'100vh', background:'#f0f2f5' }}>
      <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)', padding:'20px 20px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div>
            <div style={{ color:'#D4AF37', fontWeight:900, fontSize:18 }}>Байланыс</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>Бізбен хабарласыңыз</div>
          </div>
        </div>
      </div>

      <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:14 }}>
        {/* Contact cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
          {contacts.map(c => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{
              background:'#fff', borderRadius:18, padding:'16px 10px', textAlign:'center',
              boxShadow:'0 4px 14px rgba(0,0,0,0.06)', border:'1px solid #efefef', textDecoration:'none',
            }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{c.icon}</div>
              <div style={{ fontSize:11, fontWeight:800, color:'#1a1a1a' }}>{c.label}</div>
              <div style={{ fontSize:10, color:'#D4AF37', marginTop:3, fontWeight:600 }}>{c.value}</div>
            </a>
          ))}
        </div>

        {/* Form */}
        {!sent ? (
          <div style={{ background:'#fff', borderRadius:20, padding:'20px', boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>✉️ Хабарлама жіберу</div>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { key:'name',    ph:'Атыңыз',       type:'text' },
                { key:'email',   ph:'Email',         type:'email' },
                { key:'subject', ph:'Тақырып',       type:'text' },
              ].map(f => (
                <input key={f.key} type={f.type} placeholder={f.ph}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                  style={{ padding:'13px 14px', borderRadius:14, border:'1.5px solid #e8e8e8', fontSize:14, outline:'none', background:'#fafafa' }} />
              ))}
              <textarea placeholder="Хабарламаңыз..." value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                style={{ padding:'13px 14px', borderRadius:14, border:'1.5px solid #e8e8e8', fontSize:14, outline:'none', background:'#fafafa', resize:'none', height:110, fontFamily:'inherit' }} />
              <button type="submit" style={{ padding:'15px', borderRadius:14, border:'none', background:'linear-gradient(135deg,#D4AF37,#f0c040)', color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:'0 6px 20px rgba(212,175,55,0.4)' }}>
                Жіберу
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background:'#F0FFF4', borderRadius:20, padding:'32px 20px', textAlign:'center', border:'1.5px solid #2ECC71' }}>
            <div style={{ fontSize:52, marginBottom:12 }}>✅</div>
            <div style={{ fontWeight:800, fontSize:18, color:'#27AE60', marginBottom:6 }}>Жіберілді!</div>
            <div style={{ fontSize:14, color:'#555' }}>Хабарламаңыз алынды. Жақын арада жауап береміз.</div>
            <button onClick={() => setSent(false)} style={{ marginTop:16, padding:'12px 24px', borderRadius:14, border:'none', background:'#2ECC71', color:'#fff', fontWeight:700, cursor:'pointer' }}>Тағы жіберу</button>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  )
}
