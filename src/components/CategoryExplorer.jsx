import { Tag } from 'lucide-react'

export default function CategoryExplorer({ categories, onSelect, activeCategory }) {
  if (categories.length === 0) return null

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1F2937', marginBottom: 16 }}>Category Explorer</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
        {categories.slice(0, 8).map(cat => (
          <button 
            key={cat.id} 
            onClick={() => onSelect(cat.name)} 
            style={{
              background: activeCategory === cat.name ? '#EFF6FF' : '#fff',
              border: '1px solid',
              borderColor: activeCategory === cat.name ? '#2563EB' : '#E2E8F0',
              borderRadius: 12,
              padding: '16px 12px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transform: activeCategory === cat.name ? 'translateY(-2px)' : 'none'
            }}
            onMouseEnter={e => {
              if (activeCategory !== cat.name) {
                e.currentTarget.style.borderColor = '#2563EB'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={e => {
              if (activeCategory !== cat.name) {
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: activeCategory === cat.name ? '#2563EB' : '#EFF6FF',
              color: activeCategory === cat.name ? '#fff' : '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px'
            }}>
              <Tag size={18} />
            </div>
            <span style={{ 
              fontSize: 13, 
              fontWeight: 600, 
              color: activeCategory === cat.name ? '#1D4ED8' : '#374151' 
            }}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
