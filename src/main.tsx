import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Auto-create admin accounts if not exists
const ADMIN_EMAIL = 'toilybai.amina.2019@gmail.com'
const users = JSON.parse(localStorage.getItem('registered_users') || '[]')
const admins = [
  { email: ADMIN_EMAIL, password: 'admin123' },
  { email: 'admin', password: 'admin123' },
]
admins.forEach(a => {
  if (!users.find((u: { email: string }) => u.email === a.email)) {
    users.push(a)
  }
})
localStorage.setItem('registered_users', JSON.stringify(users))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
