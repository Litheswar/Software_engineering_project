import { motion, AnimatePresence } from 'framer-motion'
import ItemCard from './ItemCard'
import SkeletonCard from './SkeletonCard'
import { Package, TrendingUp } from 'lucide-react'

function EmptyState({ onClear, totalCount }) {
  return (
    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', marginBottom: 8 }}>No items found</h3>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 24 }}>
        We could not find anything matching your criteria.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyItems: 'center', justifyContent: 'center' }}>
        <button onClick={onClear} className="btn-secondary">Clear Filters</button>
        <button onClick={() => window.location.href = '/sell'} className="btn-primary">Post an Item</button>
      </div>
    </div>
  )
}

export default function MarketplaceGrid({ items, loading, totalCount, onClearFilters }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', marginBottom: 4 }}>Marketplace</h1>
          <p style={{ color: '#6B7280', fontSize: 14 }}>
            {!loading && `${totalCount} item${totalCount !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ icon: <Package size={16} />, label: `Items` }, { icon: <TrendingUp size={16} />, label: 'Trending' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#fff', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, color: '#374151', fontWeight: 500 }}>
                {s.icon} {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div key="loading" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div 
            key="items"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}
          >
            {items.length > 0
              ? items.map(item => <ItemCard key={item.id} item={item} />)
              : <EmptyState onClear={onClearFilters} />
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
