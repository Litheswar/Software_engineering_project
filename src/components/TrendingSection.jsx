import { useNavigate } from 'react-router-dom'
import { TrendingUp, Eye } from 'lucide-react'

export default function TrendingSection({ items, loading }) {
  const navigate = useNavigate()

  if (!loading && items.length === 0) return null

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <TrendingUp size={20} color="#F59E0B" />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1F2937' }}>Trending Today</h2>
      </div>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ minWidth: 280, height: 86, borderRadius: 12 }} />
          ))
        ) : (
          items.map(item => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/item/${item.id}`)} 
              style={{
                minWidth: 280, background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
                padding: 12, display: 'flex', gap: 12, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
              }}
            >
              <img 
                src={item.image_url} 
                alt={item.title}
                style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#2563EB' }}>₹{item.price}</span>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={12} /> {item.views}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
