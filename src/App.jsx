import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './contexts/AuthContext'
import Landing    from './pages/Landing'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import ItemDetails from './pages/ItemDetails'
import SellItem   from './pages/SellItem'
import Activity   from './pages/Activity'
import Profile    from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Chat       from './pages/Chat'
import MobileNav  from './components/MobileNav'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <div style={{width:40,height:40,border:'4px solid #E2E8F0',borderTop:'4px solid #2563EB',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<Landing />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/items/:id"  element={<ItemDetails />} />
        <Route path="/sell"      element={<ProtectedRoute><SellItem /></ProtectedRoute>} />
        <Route path="/activity"  element={<ProtectedRoute><Activity /></ProtectedRoute>} />
        <Route path="/chat/:itemId/:otherUserId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin"     element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <div className="app-container" style={{ position: 'relative', minHeight: '100vh', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <AnimatedRoutes />
        <MobileNav />
      </div>
    </BrowserRouter>
  )
}
