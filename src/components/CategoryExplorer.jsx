import { 
  Monitor, Book, Smartphone, Gamepad, 
  ToyBrick, Sofa, Shirt, Trophy, 
  Music, Camera, Bike, Utensils,
  Tag, Palette
} from 'lucide-react'

const iconMap = {
  'Electronics': <Monitor size={16} />,
  'Books':       <Book size={16} />,
  'Smartphones': <Smartphone size={16} />,
  'Gaming':      <Gamepad size={16} />,
  'Toys':        <ToyBrick size={16} />,
  'Furniture':   <Sofa size={16} />,
  'Clothing':    <Shirt size={16} />,
  'Sports':      <Trophy size={16} />,
  'Music':       <Music size={16} />,
  'Photography': <Camera size={16} />,
  'Bicycles':    <Bike size={16} />,
  'Kitchen':     <Utensils size={16} />,
  'Arts':        <Palette size={16} />,
}

export default function CategoryExplorer({ categories, onSelect, activeCategory }) {
  if (categories.length === 0) return null

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: 0 }}>Browse Categories</h2>
        <button 
          onClick={() => onSelect('')}
          style={{ fontSize: 13, fontWeight: 600, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer' }}
        >View All</button>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: 10, 
        overflowX: 'auto', 
        paddingBottom: 8,
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        
        {categories.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => onSelect(cat.name)} 
            style={{
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: activeCategory === cat.name ? '#2563EB' : '#fff',
              border: '1px solid',
              borderColor: activeCategory === cat.name ? '#2563EB' : '#E2E8F0',
              borderRadius: 50,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              boxShadow: activeCategory === cat.name ? '0 4px 10px rgba(37,99,235,0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
              color: activeCategory === cat.name ? '#fff' : '#4B5563',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {iconMap[cat.name] || <Tag size={16} />}
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
