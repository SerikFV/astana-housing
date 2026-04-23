import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getCurrentUser } from '../utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  time: string
}

const SYSTEM_PROMPT = `Сен "Астана Баспана" платформасының жасанды интеллект кеңесшісісің — атың "Баспана ЖИ".

Міндеттерің:
1. Астана қаласының тұрғын үй нарығы бойынша кеңес беру
2. Пәтер іздеуге, бағаны талдауға, аудандарды салыстыруға көмектесу
3. Ипотека, несие, жылжымайтын мүлік заңдары туралы ақпарат беру
4. Инвестиция мақсатында пәтер алу-сату бойынша кеңес беру

Нарық деректері (2024-2025):
- Жалпы ұсыныс: 18 388 пәтер
- Орташа баға: 93 952$ (≈44 млн ₸)
- 1 м² орташа бағасы: 1 240$
- Ең арзан: 7 840$ | Ең қымбат: 2 947 475$

Аудандар бойынша:
- Есіл р-н: 5 121 пәтер, орт. 127 046$ (ең престижді, іскери орталық)
- Нура р-н: 4 123 пәтер, орт. 89 243$ (жаңа тұрғын аудан)
- Алматы р-н: 3 894 пәтер, орт. 80 955$ (орташа баға)
- Сарыарка р-н: 2 104 пәтер, орт. 60 185$ (қолжетімді)
- Сарайшық р-н: 1 467 пәтер, орт. 80 234$
- Байқоңыр р-н: 901 пәтер, орт. 69 668$

Бөлмелер бойынша орташа баға:
- 1 бөлмелі: 44 519$ (4 339 пәтер)
- 2 бөлмелі: 70 234$ (6 581 пәтер) — ең көп ұсыныс
- 3 бөлмелі: 112 259$ (5 334 пәтер)
- 4 бөлмелі: 194 047$ (1 728 пәтер)
- 5+ бөлмелі: 302 037$+

Жауап беру ережелері:
- Әрқашан қазақ тілінде жауап бер
- Нақты сандар мен деректер қолдан
- Жауаптарды құрылымды жаз (тізімдер, бөлімдер)
- Пайдаланушының бюджетіне сай нұсқалар ұсын
- Инвестиция тиімділігін есептеп бер
- Достық, кәсіби тонда сөйле`

const SUGGESTIONS = [
  { icon: '🏆', text: 'Қай аудан ең тиімді инвестиция үшін?' },
  { icon: '💰', text: '50 млн ₸ бюджетке қандай пәтер алуға болады?' },
  { icon: '🏦', text: 'Ипотека алу шарттары қандай?' },
  { icon: '📊', text: 'Нарық тенденциясы қандай — баға өседі ме?' },
  { icon: '🏠', text: '2 бөлмелі пәтер іздеп жатырмын, қайдан бастаймын?' },
  { icon: '🔑', text: 'Жалға беру үшін қай аудан тиімді?' },
]

const STORAGE_KEY = 'zhi_chat_history'

function getTime() {
  return new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const email = getCurrentUser()
  const storageKey = `${STORAGE_KEY}_${email || 'guest'}`

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  // Save to localStorage on every message change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages, storageKey])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const clearHistory = () => {
    if (confirm('Чат тарихын тазалайсыз ба?')) {
      setMessages([])
      localStorage.removeItem(storageKey)
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    setError('')

    const userMsg: Message = { role: 'user', content: text.trim(), time: getTime() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    // Auto-resize textarea
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      // Алдымен n8n webhook арқылы жіберу
      let aiReply = ''
      try {
        const n8nRes = await fetch('http://localhost:5678/webhook/astana-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text.trim() }),
        })
        if (n8nRes.ok) {
          const n8nData = await n8nRes.json()
          aiReply = n8nData.reply || ''
        }
      } catch { /* n8n жоқ болса Groq-қа fallback */ }

      // n8n жауап бермесе тікелей Groq API
      if (!aiReply) {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.error?.message || `Қате: ${res.status}`)
      }

      const data = await res.json()
      aiReply = data.choices?.[0]?.message?.content || 'Жауап алынбады'
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiReply, time: getTime() }])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Белгісіз қате')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f7f8fa' }}>
      {/* TopBar with clear button */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', background: '#fff', borderBottom: '1px solid #f0f0f0',
        position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ width: 40 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🤖</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#1a1a1a', lineHeight: 1.2 }}>Баспана ЖИ</div>
            <div style={{ fontSize: 11, color: '#2ECC71', fontWeight: 600 }}>● Онлайн</div>
          </div>
        </div>
        <button onClick={clearHistory} title="Тарихты тазалау" style={{
          background: '#f5f5f5', border: 'none', width: 36, height: 36,
          borderRadius: 10, cursor: 'pointer', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>🗑️</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Welcome */}
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Hero card */}
            <div style={{
              borderRadius: 24, overflow: 'hidden',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
              padding: '28px 24px', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', right: -20, top: -20, width: 140, height: 140,
                borderRadius: '50%', background: 'rgba(212,175,55,0.12)',
              }} />
              <div style={{
                position: 'absolute', right: 20, bottom: -30, width: 100, height: 100,
                borderRadius: '50%', background: 'rgba(212,175,55,0.07)',
              }} />
              <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 20, marginBottom: 6 }}>
                Баспана ЖИ
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6 }}>
                Астана тұрғын үй нарығы бойынша жасанды интеллект кеңесшісі. 18 000+ пәтер деректері негізінде жауап беремін.
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                {['Нарық талдауы', 'Баға есебі', 'Ипотека', 'Инвестиция'].map(tag => (
                  <span key={tag} style={{
                    background: 'rgba(212,175,55,0.2)', color: '#D4AF37',
                    borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600,
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div style={{ fontSize: 13, color: '#888', fontWeight: 600, marginBottom: 4 }}>
              Жиі қойылатын сұрақтар:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {SUGGESTIONS.map(s => (
                <button key={s.text} onClick={() => sendMessage(s.text)} style={{
                  padding: '12px 14px', borderRadius: 16, border: '1.5px solid #efefef',
                  background: '#fff', color: '#1a1a1a', fontSize: 12, cursor: 'pointer',
                  textAlign: 'left', fontWeight: 500, lineHeight: 1.4,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-end', gap: 8,
          }}>
            {/* Avatar */}
            {msg.role === 'assistant' && (
              <div style={{
                width: 34, height: 34, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>🤖</div>
            )}

            <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 4 }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #D4AF37, #f0c040)'
                  : '#fff',
                color: msg.role === 'user' ? '#fff' : '#1a1a1a',
                fontSize: 14, lineHeight: 1.7,
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>
              <div style={{ fontSize: 11, color: '#bbb', paddingLeft: 4, paddingRight: 4 }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {/* Typing */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 12,
              background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>🤖</div>
            <div style={{
              padding: '14px 18px', borderRadius: '18px 18px 18px 4px',
              background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              display: 'flex', gap: 5, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%', background: '#D4AF37',
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 14,
            background: '#FFF0F0', border: '1px solid #FFD0D0',
            color: '#E74C3C', fontSize: 13,
          }}>⚠️ {error}</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 20px 100px', background: '#fff',
        borderTop: '1px solid #f0f0f0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Сұрағыңызды жазыңыз..."
            rows={1}
            disabled={loading}
            style={{
              flex: 1, padding: '13px 16px', borderRadius: 18,
              border: '1.5px solid #e8e8e8', fontSize: 14, resize: 'none',
              outline: 'none', background: '#fafafa', lineHeight: 1.5,
              overflowY: 'hidden', transition: 'border-color 0.2s',
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={{
              width: 48, height: 48, borderRadius: 16, border: 'none',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #D4AF37, #f0c040)'
                : '#f0f0f0',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
              boxShadow: input.trim() && !loading ? '0 4px 14px rgba(212,175,55,0.45)' : 'none',
              transition: 'all 0.2s',
            }}
          >➤</button>
        </div>
        <div style={{ fontSize: 11, color: '#ccc', marginTop: 8, textAlign: 'center' }}>
          Enter — жіберу · Shift+Enter — жаңа жол · {messages.length} хабарлама сақталған
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-7px); }
        }
      `}</style>
      <Navbar />
    </div>
  )
}
