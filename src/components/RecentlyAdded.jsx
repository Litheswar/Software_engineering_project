import ItemCard from './ItemCard'
import { Sparkles, ChevronRight } from 'lucide-react'

export default function RecentlyAdded({ items, loading }) {
  if (!loading && items.length === 0) return null

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={20} color="#7C3AED" />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: 0 }}>Recently Added</h2>
        </div>
        <button 
           style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          View More <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: 16, 
        overflowX: 'auto', 
        paddingBottom: 16, 
        paddingLeft: 4,
        paddingTop: 4,
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ minWidth: 240, height: 340, borderRadius: 16 }} />
          ))
        ) : (
          items.map(item => (
            <div key={item.id} style={{ minWidth: 240 }}>
              <ItemCard item={item} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
