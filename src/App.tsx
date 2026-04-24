import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import ApartmentsPage from './pages/ApartmentsPage'
import ApartmentDetailPage from './pages/ApartmentDetailPage'
import StatisticsPage from './pages/StatisticsPage'
import MapPage from './pages/MapPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import ChatPage from './pages/ChatPage'
import SearchPage from './pages/SearchPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import NotificationsPage from './pages/NotificationsPage'
import ComparePage from './pages/ComparePage'
import HistoryPage from './pages/HistoryPage'
import { getCurrentUser } from './utils'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return getCurrentUser() ? <>{children}</> : <Navigate to="/signin" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#fff', position: 'relative' }}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/apartments" element={<PrivateRoute><ApartmentsPage /></PrivateRoute>} />
          <Route path="/apartments/:id" element={<PrivateRoute><ApartmentDetailPage /></PrivateRoute>} />
          <Route path="/statistics" element={<PrivateRoute><StatisticsPage /></PrivateRoute>} />
          <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
          <Route path="/faq" element={<PrivateRoute><FAQPage /></PrivateRoute>} />
          <Route path="/contact" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/compare" element={<PrivateRoute><ComparePage /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* {getCurrentUser() && <AiChat />} */}
      </div>
    </BrowserRouter>
  )
}
