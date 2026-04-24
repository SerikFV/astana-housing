import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const FAQS = [
  { q:'Сайт тегін бе?', a:'Иә, Астана Баспана толығымен тегін. Тіркелу, іздеу, карта — барлығы ақысыз.' },
  { q:'Пәтерлер деректері қаншалықты жаңа?', a:'Деректер Krisha.kz платформасынан жиналған. 18 000+ пәтер 2024-2025 жылдардағы нарық деректері.' },
  { q:'Баға қалай есептеледі?', a:'Бағалар теңгемен (₸) көрсетіледі. Доллармен берілген бағалар 1$=470₸ бағамымен айналдырылады.' },
  { q:'Таңдаулылар қалай жұмыс істейді?', a:'Пәтер карточкасындағы ❤️ батырмасын басыңыз. Таңдаулылар профиліңізде сақталады.' },
  { q:'ЖИ кеңесші не істей алады?', a:'Баспана ЖИ аудан бойынша пәтер ұсынады, баға талдайды, ипотека есептейді және нарық туралы сұрақтарға жауап береді.' },
  { q:'Картада барлық пәтер шыға ма?', a:'Картада координаттары бар пәтерлер ғана шығады (300-ге дейін). Фильтр арқылы аудан мен бөлме санын таңдай аласыз.' },
  { q:'Ипотека туралы ақпарат қайда?', a:'ЖИ кеңесшіге "ипотека шарттары" деп жазыңыз — Баспана-1, 7-20-25, Нұрлы жер бағдарламалары туралы толық ақпарат береді.' },
  { q:'Пәтер сатып алу үшін не істеу керек?', a:'Пәтер карточкасындағы "Krisha.kz-де қарау" батырмасы арқылы бастапқы хабарландыруға өтіп, сатушымен тікелей байланысыңыз.' },
]

export default function FAQPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ paddingBottom:80, minHeight:'100vh', background:'#f0f2f5' }}>
      <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)', padding:'20px 20px 28px', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div>
            <div style={{ color:'#D4AF37', fontWeight:900, fontSize:18 }}>Жиі қойылатын сұрақтар</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>FAQ</div>
          </div>
        </div>
      </div>

      <div style={{ padding:'16px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 4px 14px rgba(0,0,0,0.06)', border:'1px solid #efefef' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width:'100%', padding:'16px 18px', border:'none', background:'none', cursor:'pointer',
                display:'flex', justifyContent:'space-between', alignItems:'center', gap:12,
              }}>
                <span style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', textAlign:'left' }}>{faq.q}</span>
                <span style={{ fontSize:18, color:'#D4AF37', flexShrink:0, transition:'transform 0.2s', transform: open===i ? 'rotate(180deg)' : 'none' }}>▼</span>
              </button>
              {open === i && (
                <div style={{ padding:'0 18px 16px', fontSize:14, color:'#555', lineHeight:1.7, borderTop:'1px solid #f5f5f5' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Navbar />
    </div>
  )
}
