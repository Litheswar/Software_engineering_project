import { History } from 'lucide-react'
import ItemCard from './ItemCard'

export default function RecentlyViewedSection({ items, loading }) {
  if (loading && items.length === 0) return null
  if (items.length === 0) return null

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <History size={20} color="#6B7280" />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1F2937' }}>Recently Viewed</h2>
      </div>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
        {items.map(item => (
          <div key={item.id} style={{ minWidth: 240 }}>
            <ItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}
