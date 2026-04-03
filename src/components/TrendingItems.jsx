import { useNavigate } from 'react-router-dom'
import { TrendingUp, Eye, ChevronRight } from 'lucide-react'

export default function TrendingItems({ items, loading }) {
  const navigate = useNavigate()

  if (!loading && items.length === 0) return null

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={20} color="#F59E0B" />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: 0 }}>Trending Items</h2>
        </div>
        <button 
           style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          See All <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: 16, 
        overflowX: 'auto', 
        paddingBottom: 12, 
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ minWidth: 260, height: 100, borderRadius: 16 }} />
          ))
        ) : (
          items.map(item => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/items/${item.id}`)} 
              style={{
                minWidth: 260, 
                background: '#fff', 
                borderRadius: 16, 
                border: '1px solid #F1F5F9',
                padding: '12px', 
                display: 'flex', 
                gap: 12, 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'
              }}
            >
              <img 
                src={item.image_url} 
                alt={item.title}
                style={{ width: 76, height: 76, borderRadius: 12, objectFit: 'cover' }}
                loading="lazy"
              />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#2563EB' }}>₹{item.price?.toLocaleString()}</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Eye size={12} /> {item.views}
                  </span>
                </div>
                <div style={{ marginTop: 6 }}>
                   <span style={{ fontSize: 10, fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                     {item.category}
                   </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
