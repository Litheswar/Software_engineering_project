import { Link, useLocation } from 'react-router-dom'
import { Home, PlusCircle, Activity, User } from 'lucide-react'

export default function MobileNav() {
  const location = useLocation()
  
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <Home size={22} /> },
    { name: 'Sell', path: '/sell', icon: <PlusCircle size={22} /> },
    { name: 'Activity', path: '/activity', icon: <Activity size={22} /> },
    { name: 'Profile', path: '/profile', icon: <User size={22} /> },
  ]

  return (
    <div className="mobile-nav" style={{
      display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: '1px solid #E2E8F0', padding: '10px 16px',
      justifyContent: 'space-around', alignItems: 'center', zIndex: 50,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
    }}>
      {navItems.map(item => {
        const isActive = location.pathname.startsWith(item.path)
        return (
          <Link key={item.name} to={item.path} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            textDecoration: 'none', color: isActive ? '#2563EB' : '#9CA3AF',
            transition: 'color 0.2s', width: 64
          }}>
            {item.icon}
            <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 500 }}>{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
