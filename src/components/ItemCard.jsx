import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, MapPin, Star, Eye } from 'lucide-react'

const conditionColors = {
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

export default function ItemCard({ item, showStatus = false, onContact }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [popAnim, setPopAnim] = useState(false)

  function toggleLike(e) {
    e.stopPropagation()
    setLiked(p => !p)
    setPopAnim(true)
    setTimeout(() => setPopAnim(false), 350)
  }

  const cond = conditionColors[item.condition] || { bg:'#F3F4F6', color:'#6B7280' }
  const statusInfo = statusColors[item.status] || statusColors['approved']
  const isSold = item.status === 'sold'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(37,99,235,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => navigate(`/item/${item.id}`)}
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
        cursor: 'pointer',
        transition: 'box-shadow 0.25s',
        position: 'relative',
        border: '1px solid #F1F5F9',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '65%', overflow: 'hidden', background: '#F8FAFC' }}>
        <img
          src={item.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=250&fit=crop'}
          alt={item.title}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover', transition: 'transform 0.4s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />

        {isSold && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              background:'#9CA3AF', color:'#fff', padding:'6px 18px',
              borderRadius: 999, fontWeight: 700, fontSize: 14, letterSpacing: '0.05em',
            }}>SOLD</span>
          </div>
        )}

        {/* Condition badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: cond.bg, color: cond.color,
          padding: '3px 10px', borderRadius: 999,
          fontSize: 11, fontWeight: 700,
        }}>{item.condition}</div>

        {/* Status badge (admin view) */}
        {showStatus && (
          <div style={{
            position: 'absolute', top: 10, right: 46,
            background: statusInfo.bg, color: statusInfo.color,
            padding: '3px 10px', borderRadius: 999,
            fontSize: 11, fontWeight: 700,
          }}>{statusInfo.label}</div>
        )}

        {/* Wishlist heart */}
        <button
          onClick={toggleLike}
          className={popAnim ? 'heart-pop' : ''}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s, background 0.2s',
          }}
          title={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={liked ? '#EF4444' : 'none'}
            color={liked ? '#EF4444' : '#6B7280'} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px' }}>
        {/* Category & Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#2563EB',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>{item.category}</span>
          <div style={{ display: 'flex', gap: 8, color: '#9CA3AF', fontSize: 11, fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }} title="Views"><Eye size={12} /> {item.views || 0}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }} title="Wishlist additions"><Heart size={12} fill={item.wishlistCount>0?'#9CA3AF':'none'} /> {item.wishlistCount || 0}</span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 15, fontWeight: 600, color: '#1F2937',
          margin: '4px 0 6px', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{item.title}</h3>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>
            ₹{item.price?.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Seller Info */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 10, borderTop: '1px solid #F1F5F9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#fff', fontWeight: 700,
            }}>
              {(item.seller_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>{item.seller_name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <div style={{ display:'flex', alignItems:'center', gap:2, background:'#FFFBEB', color:'#B45309', padding:'2px 6px', borderRadius:6, border:'1px solid #FEF3C7', fontSize:11, fontWeight:700 }}>
                  <Star size={10} fill="#F59E0B" color="#F59E0B" />
                  <span>{item.seller_trust}</span>
                </div>
                {item.seller_trust >= 4.5 && (
                  <span style={{ background:'#DCFCE7', color:'#15803D', padding:'2px 6px', borderRadius:6, fontSize:10, fontWeight:700 }}>Trusted</span>
                )}
              </div>
            </div>
          </div>

          {!isSold && (
            <button
              onClick={e => { e.stopPropagation(); onContact ? onContact(item) : navigate(`/item/${item.id}`) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', background: '#EFF6FF',
                color: '#2563EB', borderRadius: 8, fontSize: 12,
                fontWeight: 600, border: 'none', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='#2563EB'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='#EFF6FF'; e.currentTarget.style.color='#2563EB' }}
            >
              <MessageCircle size={13} /> Contact
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
