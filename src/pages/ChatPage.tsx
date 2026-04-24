import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCurrentUser, formatPrice } from '../utils'
import { useApartments } from '../hooks/useApartments'
import type { Apartment } from '../types'

interface Message {
  role: 'user' | 'assistant'
  content: string
  time: string
  apartments?: Apartment[]
}

// Сұрақтан район мен бөлме санын анықтау
function extractFilters(text: string): { district?: string; rooms?: number; maxPrice?: number } {
  const t = text.toLowerCase()
  const result: { district?: string; rooms?: number; maxPrice?: number } = {}

  // Аудан анықтау — қазақша, орысша, ағылшынша нұсқалар
  if (t.includes('есіл') || t.includes('есил') || t.includes('ишим') || t.includes('ishim') || t.includes('есільск')) result.district = 'Есіл р-н'
  else if (t.includes('нура') || t.includes('нұра') || t.includes('nura')) result.district = 'Нура р-н'
  else if (t.includes('алматы') || t.includes('almaty')) result.district = 'Алматы р-н'
  else if (t.includes('сарыарка') || t.includes('saryarka')) result.district = 'Сарыарка р-н'
  else if (t.includes('сарайшық') || t.includes('сарайшык') || t.includes('saraishyk')) result.district = 'Сарайшық р-н'
  else if (t.includes('байқоңыр') || t.includes('байконур') || t.includes('байкон') || t.includes('baikonur')) result.district = 'р-н Байконур'

  // Бөлме саны
  const roomMatch = t.match(/(\d)\s*бөлм/) || t.match(/(\d)\s*комнат/) || t.match(/(\d)к\b/) || t.match(/(\d)-бөлм/)
  if (roomMatch) result.rooms = parseInt(roomMatch[1])

  // Баға шегі
  const priceMatch = t.match(/(\d+)\s*млн/) || t.match(/(\d+)\s*million/)
  if (priceMatch) result.maxPrice = parseInt(priceMatch[1]) * 1_000_000

  return result
}

// Сұрақ пәтер іздеуге қатысты ма?
function isApartmentSearch(text: string): boolean {
  const t = text.toLowerCase()
  const hasApartmentWord = (
    t.includes('пәтер') || t.includes('үй') || t.includes('квартир') ||
    t.includes('бөлмелі') || t.includes('бөлме') || t.includes('комнат') ||
    t.includes('іздеп') || t.includes('керек') || t.includes('табу') ||
    t.includes('нұсқа') || t.includes('ұсын') || t.includes('қарау') ||
    t.includes('адрес') || t.includes('мекен') || t.includes('тұрғын') ||
    t.includes('жалға') || t.includes('сатып') || t.includes('алу')
  )
  const hasDistrict = (
    t.includes('есіл') || t.includes('есил') || t.includes('нура') || t.includes('нұра') ||
    t.includes('алматы') || t.includes('сарыарка') || t.includes('сарайшық') ||
    t.includes('сарайшык') || t.includes('байқоңыр') || t.includes('байконур') ||
    t.includes('аудан') || t.includes('район') || t.includes('р-н')
  )
  // Аудан аталса немесе пәтер сөзі болса — іздеу жасайды
  return hasApartmentWord || hasDistrict
}

const SYSTEM_PROMPT = `Сен "Астана Баспана" платформасының жасанды интеллект кеңесшісісің. Атың — Баспана ЖИ.

МІНДЕТТІ ЕРЕЖЕЛЕР:
- Тек қазақ тілінде жауап бер
- Нақты, қысқа, пайдалы жауап бер
- Пәтер іздеу сұрағында: қысқаша кеңес бер, нақты пәтерлер тізімі автоматты қосылады

АСТАНА НАРЫҒЫ (2024-2025):
Жалпы: 18 388 пәтер | Орт. баға: 44 млн ₸ | 1м²: 583 000 ₸

АУДАНДАР (тек теңгемен жаз):
• Есіл р-н — орт. 59.7 млн ₸ — ең престижді, іскери орталық
• Нура р-н — орт. 41.9 млн ₸ — жаңа кешендер, заманауи
• Алматы р-н — орт. 38 млн ₸ — орталыққа жақын
• Сарыарка р-н — орт. 28.3 млн ₸ — ең қолжетімді
• Сарайшық р-н — орт. 37.7 млн ₸ — дамып келе жатқан
• р-н Байконур — орт. 32.7 млн ₸ — тыныш аудан

БӨЛМЕЛЕР: 1бөл=20.9 млн ₸ | 2бөл=33 млн ₸ | 3бөл=52.8 млн ₸ | 4бөл=91.2 млн ₸

ИПОТЕКА: Баспана-1(5%) | 7-20-25(7%) | Нарықтық(14-18%) | Нұрлы жер(2-5%)

ИНВЕСТИЦИЯ: Жалға беру 6-9%/жыл | Баға өсімі 8-12%/жыл | Ең тиімді: Есіл р-н 1-2 бөлмелі

МАҢЫЗДЫ: Барлық бағаларды тек теңгемен (₸) жаз. Долларды ($) ешқашан қолданба, айырбастау есебін де жазба.
Пәтер іздеу сұрағында жауапты қысқа жаз (2-3 сөйлем), нақты пәтерлер тізімі автоматты көрсетіледі.`

const SUGGESTIONS = [
  { icon: '🏠', text: 'Есіл ауданынан 2 бөлмелі пәтер керек' },
  { icon: '🏢', text: 'Нура ауданынан 3 бөлмелі үй іздеп жатырмын' },
  { icon: '💰', text: '30 млн ₸ бюджетке қандай пәтер алуға болады?' },
  { icon: '🏆', text: 'Қай аудан ең тиімді инвестиция үшін?' },
  { icon: '🏦', text: 'Ипотека алу шарттары қандай?' },
  { icon: '📊', text: 'Сарыарқадан арзан пәтер бар ма?' },
]

const STORAGE_KEY = 'zhi_chat_history'
function getTime() {
  return new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const navigate = useNavigate()
  const email = getCurrentUser()
  const storageKey = `${STORAGE_KEY}_${email || 'guest'}`
  const { apartments: allApartments } = useApartments()

  const [messages, setMessages] = useState<Message[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(messages)) }, [messages, storageKey])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const clearHistory = () => {
    if (confirm('Чат тарихын тазалайсыз ба?')) { setMessages([]); localStorage.removeItem(storageKey) }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    setError('')
    const userMsg: Message = { role: 'user', content: text.trim(), time: getTime() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    // Нақты пәтерлерді іздеу
    let matchedApts: Apartment[] = []
    if (isApartmentSearch(text) && allApartments.length > 0) {
      const filters = extractFilters(text)
      const getLocalPrice = (a: Apartment) => a.price_local || (a.price_usd || 0) * 470

      const filtered = allApartments.filter(a => {
        if (filters.district && a.district !== filters.district) return false
        if (filters.rooms && a.rooms !== filters.rooms) return false
        if (filters.maxPrice && getLocalPrice(a) > filters.maxPrice) return false
        return true
      })

      if (filtered.length > 0) {
        // Бағаға қарай сұрыпта
        const sorted = [...filtered].sort((a, b) => getLocalPrice(a) - getLocalPrice(b))
        // Арзан, орта-арзан, орта, орта-қымбат, қымбат — 5 түрлі нұсқа
        const len = sorted.length
        const indices = [
          0,
          Math.floor(len * 0.25),
          Math.floor(len * 0.5),
          Math.floor(len * 0.75),
          len - 1,
        ]
        matchedApts = [...new Set(indices)].map(i => sorted[i]).filter(Boolean).slice(0, 5)
      }
    }

    try {
      let aiReply = ''

      // Тікелей Groq API
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.4, max_tokens: 1000,
        }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err?.error?.message || `Қате: ${res.status}`) }
      const data = await res.json()
      aiReply = data.choices?.[0]?.message?.content || 'Жауап алынбады'

      // n8n-ге логтау үшін фондық жіберу (жауапты күтпейміз)
      fetch('http://localhost:5678/webhook/astana-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), reply: aiReply }),
      }).catch(() => {})

      setMessages(prev => [...prev, {
        role: 'assistant', content: aiReply, time: getTime(),
        apartments: matchedApts.length > 0 ? matchedApts : undefined,
      }])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Белгісіз қате')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f7f8fa' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', background: '#fff', borderBottom: '1px solid #f0f0f0',
        position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ width: 40 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#1a1a1a', lineHeight: 1.2 }}>Баспана ЖИ</div>
            <div style={{ fontSize: 11, color: '#2ECC71', fontWeight: 600 }}>● Онлайн</div>
          </div>
        </div>
        <button onClick={clearHistory} style={{ background: '#f5f5f5', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑️</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderRadius: 24, background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(212,175,55,0.12)' }} />
              <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 20, marginBottom: 6 }}>Баспана ЖИ</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6 }}>
                Астана тұрғын үй нарығы бойынша кеңесші. Аудан мен бөлме санын айтсаңыз — нақты пәтерлерді табамын.
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                {['Пәтер іздеу', 'Баға талдауы', 'Ипотека', 'Инвестиция'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>Жиі қойылатын сұрақтар:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {SUGGESTIONS.map(s => (
                <button key={s.text} onClick={() => sendMessage(s.text)} style={{
                  padding: '12px 14px', borderRadius: 16, border: '1.5px solid #efefef',
                  background: '#fff', color: '#1a1a1a', fontSize: 12, cursor: 'pointer',
                  textAlign: 'left', fontWeight: 500, lineHeight: 1.4,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 34, height: 34, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
            )}
            <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #D4AF37, #f0c040)' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#1a1a1a',
                fontSize: 14, lineHeight: 1.7, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>

              {/* Нақты пәтер карточкалары */}
              {msg.apartments && msg.apartments.length > 0 && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 12, color: '#888', fontWeight: 600, paddingLeft: 4 }}>
                    🏠 {msg.apartments.length} нақты пәтер табылды:
                  </div>
                  {msg.apartments.map(apt => (
                    <div key={apt.id} onClick={() => navigate(`/apartments/${apt.id}`)}
                      style={{
                        background: '#fff', borderRadius: 16, padding: '14px 16px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', cursor: 'pointer',
                        border: '1.5px solid #f0f0f0', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#D4AF37')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#f0f0f0')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 4 }}>
                            {apt.rooms} бөлмелі · {apt.area} м²
                            {apt.floor && apt.total_floors ? ` · ${apt.floor}/${apt.total_floors} қабат` : ''}
                          </div>
                          {apt.address && (
                            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                              📍 {apt.address}
                            </div>
                          )}
                          <div style={{ fontSize: 11, color: '#999' }}>
                            {apt.district} {apt.residential_complex_name ? `· ${apt.residential_complex_name}` : ''}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 14, color: '#D4AF37' }}>
                            {apt.price_local
                              ? formatPrice(apt.price_local)
                              : apt.price_usd
                              ? formatPrice(apt.price_usd * 470)
                              : '—'}
                          </div>
                          {apt.price_per_m2 && (
                            <div style={{ fontSize: 11, color: '#999' }}>{formatPrice(apt.price_per_m2 * 470)}/м²</div>
                          )}
                        </div>
                      </div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                        <button onClick={e => { e.stopPropagation(); navigate(`/apartments/${apt.id}`) }}
                          style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #D4AF37, #f0c040)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          Толығырақ →
                        </button>
                        {apt.url && (
                          <button onClick={e => { e.stopPropagation(); window.open(apt.url, '_blank') }}
                            style={{ padding: '8px 12px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#666', fontSize: 12, cursor: 'pointer' }}>
                            Krisha.kz
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ fontSize: 11, color: '#bbb', paddingLeft: 4, paddingRight: 4 }}>{msg.time}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 12, background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
            <div style={{ padding: '14px 18px', borderRadius: '18px 18px 18px 4px', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4AF37', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 14, background: '#FFF0F0', border: '1px solid #FFD0D0', color: '#E74C3C', fontSize: 13 }}>⚠️ {error}</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 20px 100px', background: '#fff', borderTop: '1px solid #f0f0f0', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea ref={textareaRef} value={input} onChange={handleInput} onKeyDown={handleKeyDown}
            placeholder="Мысалы: Есіл ауданынан 2 бөлмелі пәтер керек..."
            rows={1} disabled={loading}
            style={{ flex: 1, padding: '13px 16px', borderRadius: 18, border: '1.5px solid #e8e8e8', fontSize: 14, resize: 'none', outline: 'none', background: '#fafafa', lineHeight: 1.5, overflowY: 'hidden' }}
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            style={{
              width: 48, height: 48, borderRadius: 16, border: 'none',
              background: input.trim() && !loading ? 'linear-gradient(135deg, #D4AF37, #f0c040)' : '#f0f0f0',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
              boxShadow: input.trim() && !loading ? '0 4px 14px rgba(212,175,55,0.45)' : 'none',
            }}>➤</button>
        </div>
        <div style={{ fontSize: 11, color: '#ccc', marginTop: 8, textAlign: 'center' }}>
          Enter — жіберу · Shift+Enter — жаңа жол · {messages.length} хабарлама
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-7px)} }`}</style>
      <Navbar />
    </div>
  )
}
