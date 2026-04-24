import { createContext, useContext, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'
interface ToastItem { id: number; message: string; type: ToastType }

interface ToastCtx { show: (message: string, type?: ToastType) => void }
const ToastContext = createContext<ToastCtx>({ show: () => {} })

export function useToast() { return useContext(ToastContext) }

const ICONS: Record<ToastType, string> = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' }
const COLORS: Record<ToastType, { bg: string; border: string; color: string }> = {
  success: { bg:'#F0FFF4', border:'#2ECC71', color:'#27AE60' },
  error:   { bg:'#FFF5F5', border:'#E74C3C', color:'#C0392B' },
  info:    { bg:'#EBF5FB', border:'#3498DB', color:'#2980B9' },
  warning: { bg:'#FFFBEB', border:'#F39C12', color:'#D68910' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  let nextId = 0

  const show = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:9999, display:'flex', flexDirection:'column', gap:8, pointerEvents:'none', width:'calc(100% - 32px)', maxWidth:400 }}>
        {toasts.map(t => {
          const c = COLORS[t.type]
          return (
            <div key={t.id} onClick={() => remove(t.id)} style={{
              background:c.bg, border:`1.5px solid ${c.border}`,
              borderRadius:16, padding:'12px 16px',
              display:'flex', alignItems:'center', gap:10,
              boxShadow:'0 8px 24px rgba(0,0,0,0.12)',
              pointerEvents:'all', cursor:'pointer',
              animation:'slideDown 0.3s ease',
            }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{ICONS[t.type]}</span>
              <span style={{ fontSize:14, fontWeight:600, color:c.color, flex:1 }}>{t.message}</span>
              <span style={{ fontSize:16, color:c.border, opacity:0.6 }}>×</span>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </ToastContext.Provider>
  )
}
