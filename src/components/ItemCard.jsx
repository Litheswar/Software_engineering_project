import { useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Star, Eye, MapPin } from 'lucide-react'

const conditionColors = {
  'New':      { bg:'#DCFCE7', color:'#15803D' },
  'Like New': { bg:'#DCFCE7', color:'#15803D' },
  'Good':     { bg:'#DBEAFE', color:'#1D4ED8' },
  'Fair':     { bg:'#FEF3C7', color:'#92400E' },
  'Poor':     { bg:'#FEE2E2', color:'#B91C1C' },
}

const statusColors = {
  'approved': { bg:'#DCFCE7', color:'#15803D', label:'Approved' },
  'pending':  { bg:'#FEF3C7', color:'#92400E', label:'Pending' },
  'sold':     { bg:'#F3F4F6', color:'#6B7280', label:'Sold' },
}

const ItemCard = memo(({ item, showStatus = false, onContact }) => {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  
  function toggleLike(e) {
    e.stopPropagation()
    setLiked(p => !p)
  }

  const cond = conditionColors[item.condition] || { bg:'#F3F4F6', color:'#6B7280' }
  const isSold = item.status === 'sold'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8, 
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        borderColor: '#3B82F6'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => navigate(`/item/${item.id}`)}
      style={{
        background: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid #F1F5F9',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'border-color 0.2s ease'
      }}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden', background: '#F8FAFC' }}>
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'}
          alt={item.title}
          loading="lazy"
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Condition Badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: cond.bg, color: cond.color,
          padding: '4px 12px', borderRadius: 50,
          fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.025em', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>{item.condition}</div>

        {/* Action Buttons Top Right */}
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={toggleLike}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s'
            }}
          >
            <Heart size={16} fill={liked ? '#EF4444' : 'none'} color={liked ? '#EF4444' : '#64748B'} />
          </button>
        </div>

        {isSold && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10
          }}>
            <span style={{
              background:'#1F2937', color:'#fff', padding:'8px 24px',
              borderRadius: 50, fontWeight: 800, fontSize: 13, letterSpacing: '0.1em',
            }}>SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, color: '#3B82F6',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            background: '#EFF6FF', padding: '2px 8px', borderRadius: 6
          }}>{item.category}</span>
          <div style={{ display: 'flex', gap: 8, color: '#94A3B8', fontSize: 11, fontWeight: 600 }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={12} /> {item.views || 0}</span>
          </div>
        </div>

        <h3 style={{
          fontSize: 15, fontWeight: 700, color: '#1E293B',
          margin: '0 0 8px', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '42px'
        }} title={item.title}>{item.title}</h3>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>₹{item.price?.toLocaleString()}</span>
          </div>
        </div>

        {/* Seller Info */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 16, paddingTop: 12, borderTop: '1px solid #F1F5F9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#fff', fontWeight: 800,
            }}>
              {(item.seller?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#334155', margin: 0 }}>{item.seller?.name || 'Anonymous'}</p>
              {item.seller?.college && (
                <p style={{ fontSize: 10, color: '#94A3B8', margin: '1px 0 0', display:'flex', alignItems:'center', gap:2 }}>
                  <MapPin size={8} /> {item.seller.college}
                </p>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FFFBEB', color: '#B45309', padding: '3px 8px', borderRadius: 8, fontSize: 11, fontWeight: 800 }}>
            <Star size={10} fill="#F59E0B" color="#F59E0B" />
            <span>{item.seller?.trust_score || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

ItemCard.displayName = 'ItemCard'
export default ItemCard
