import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ApartmentCard from '../components/ApartmentCard'
import { getHistory, clearHistory } from '../utils'

export default function HistoryPage() {
  const navigate = useNavigate()
  const [history, setHistory] = useState(getHistory)

  const handleClear = () => {
    if (confirm('Тарихты тазалайсыз ба?')) {
      clearHistory()
      setHistory([])
    }
  }

  return (
    <div style={{ paddingBottom:80, minHeight:'100vh', background:'#f0f2f5' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)', padding:'20px 20px 24px', position:'sticky', top:0, zIndex:50, boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
            <div>
              <div style={{ color:'#D4AF37', fontWeight:900, fontSize:18 }}>Қаралған пәтерлер</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{history.length} пәтер</div>
            </div>
          </div>
          {history.length > 0 && (
            <button onClick={handleClear} style={{ background:'rgba(235,51,73,0.2)', border:'1px solid rgba(235,51,73,0.4)', color:'#eb3349', borderRadius:12, padding:'7px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              🗑 Тазалау
            </button>
          )}
        </div>
      </div>

      <div style={{ padding:'16px' }}>
        {history.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🕐</div>
            <div style={{ fontWeight:800, fontSize:18, color:'#1a1a1a', marginBottom:8 }}>Тарих бос</div>
            <div style={{ fontSize:14, color:'#aaa', marginBottom:24 }}>Қараған пәтерлеріңіз осында сақталады</div>
            <button onClick={() => navigate('/apartments')} style={{ padding:'14px 28px', borderRadius:16, border:'none', background:'linear-gradient(135deg,#D4AF37,#f0c040)', color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer', boxShadow:'0 6px 20px rgba(212,175,55,0.4)' }}>
              Пәтерлерге өту
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize:13, color:'#888', marginBottom:12, fontWeight:600 }}>
              Соңғы {history.length} қаралған пәтер
            </div>
            {history.map(apt => (
              <ApartmentCard key={apt.id} apt={apt} />
            ))}
          </>
        )}
      </div>
      <Navbar />
    </div>
  )
}
