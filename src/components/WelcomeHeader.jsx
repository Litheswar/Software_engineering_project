import { useAuth } from '../contexts/AuthContext'
import { PlusCircle, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function WelcomeHeader() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ padding: '24px 0', borderBottom: '1px solid #F1F5F9', marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            👋 Hello, {user?.name || 'Student'}
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', marginTop: 4 }}>
            Find great deals posted by students on campus.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => navigate('/wishlist')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', 
              background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
              fontSize: 14, fontWeight: 600, color: '#4B5563', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#2563EB'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
          >
            <Heart size={18} /> My Wishlist
          </button>
          <button 
            onClick={() => navigate('/sell')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', 
              background: '#2563EB', border: 'none', borderRadius: 12,
              fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.2)', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <PlusCircle size={18} /> Sell Item
          </button>
        </div>
      </div>
    </div>
  )
}
