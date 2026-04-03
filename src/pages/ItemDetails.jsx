import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import ModalDialog from '../components/ModalDialog'
import GoBack from '../components/GoBack'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { 
  Heart, MessageCircle, Flag, Shield, 
  CheckCircle, Star, Calendar, Tag, Eye
} from 'lucide-react'
import { createNotification, increaseTrustScore, decreaseTrustScore } from '../lib/notifications'

const conditionColors = {
  'New': { bg: '#DCFCE7', color: '#15803D' },
  'Like New': { bg: '#DBEAFE', color: '#1D4ED8' },
  'Good': { bg: '#FEF9C3', color: '#854D0E' },
  'Fair': { bg: '#FFEDD5', color: '#9A3412' }
}

export default function ItemDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [item, setItem]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [liked, setLiked]     = useState(false)
  const [mainImage, setMainImage] = useState(null)
  const [pop, setPop]         = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [pricePulse, setPricePulse] = useState(false)
  const [similarItems, setSimilarItems] = useState([])

  useEffect(() => {
    async function fetchItemDetails() {
      setLoading(true)
      const { data, error } = await supabase
        .from('items')
        .select('*, seller:users(name, college, trust_score, avatar_url)')
        .eq('id', id)
        .eq('status', 'approved')
        .single()
      
      if (data && !error) {
        setItem(data)
        setMainImage(data.image_url)

        // Increment views
        await supabase
          .from('items')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id)
        
        // Fetch similar items
        const { data: similar } = await supabase
          .from('items')
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(4)
        setSimilarItems(similar || [])

        // Store in recently viewed
        try {
          let stored = JSON.parse(localStorage.getItem('recent_views') || '[]')
          stored = stored.filter(vid => vid !== data.id)
          stored.unshift(data.id)
          if (stored.length > 15) stored.pop()
          localStorage.setItem('recent_views', JSON.stringify(stored))
        } catch(e) {}

        // Check if liked
        if (user) {
          const { data: wish } = await supabase
            .from('wishlist')
            .select('id')
            .eq('user_id', user.id)
            .eq('item_id', data.id)
            .maybeSingle()
          if (wish) setLiked(true)
        }
      }
      setLoading(false)
    }

    fetchItemDetails()
    setTimeout(() => setPricePulse(true), 800)
    setTimeout(() => setPricePulse(false), 6000)
  }, [id, user])

  if (loading) return (
    <PageWrapper>
      <Navbar />
      <div style={{maxWidth:1280,margin:'80px auto',padding:'0 24px',textAlign:'center'}}>
        <p>Loading item details...</p>
      </div>
    </PageWrapper>
  )

  if (!item) return (
    <PageWrapper>
      <Navbar />
      <div style={{maxWidth:1280,margin:'80px auto',padding:'0 24px',textAlign:'center'}}>
        <div style={{fontSize:64,marginBottom:16}}>😕</div>
        <h2 style={{fontSize:24,fontWeight:700,color:'#1F2937',marginBottom:8}}>Item Not Found</h2>
        <p style={{color:'#6B7280',fontSize:15,marginBottom:24}}>This listing may have been removed or sold.</p>
        <button className="btn-primary" onClick={()=>navigate('/dashboard')}>Browse Marketplace</button>
      </div>
    </PageWrapper>
  )

  const images = item.images?.length ? item.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop']
  const cond   = conditionColors[item.condition] || { bg:'#F3F4F6', color:'#6B7280' }

  function handleContact() {
    if (!user) { navigate('/login'); return }
    setContactOpen(true)
  }

  async function toggleLike() {
    if (!user) { navigate('/login'); return }
    if (actionLoading) return
    
    setActionLoading(true)
    const newLiked = !liked
    setLiked(newLiked)
    setPop(true)
    setTimeout(()=>setPop(false),350)
    
    try {
      if (newLiked) {
        await supabase.from('wishlist').insert({ user_id: user.id, item_id: item.id })
        toast.success('Added to wishlist ❤️')
        
        if (item.seller_id !== user.id) {
          const { data: sender } = await supabase
            .from("users")
            .select("name")
            .eq("id", user.id)
            .single()

          await createNotification(
            item.seller_id, 
            'wishlist', 
            'Item saved ❤️', 
            `${sender?.name || 'Someone'} added your item "${item.title}" to their wishlist`, 
            item.id
          )
          await increaseTrustScore(item.seller_id, 1)
        }
      } else {
        await supabase.from('wishlist').delete().eq('user_id', user.id).eq('item_id', item.id)
        toast.success('Removed from wishlist')
      }
    } catch (e) {
      toast.error('Failed to update wishlist')
      setLiked(!newLiked) // Revert state on error
    }
    setActionLoading(false)
  }

  async function sendMessage() {
    if (!message.trim() || actionLoading) return
    setActionLoading(true)
    // Simple message simulation for now as requested
    toast.success("Message sent! Seller will respond soon.")
    
    if (item.seller_id !== user.id) {
      const { data: sender } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single()

      await createNotification(
        item.seller_id,
        'message',
        'New Message 💬',
        `${sender?.name || 'Someone'} sent you a message regarding "${item.title}"`,
        item.id
      )
    }

    setMessage('')
    setContactOpen(false)
    setActionLoading(false)
  }

  async function report(reason) {
    if (!user) { navigate('/login'); return }
    if (actionLoading) return
    setActionLoading(true)
    try {
      const { data: existing } = await supabase
        .from('reports')
        .select('id')
        .eq('item_id', item.id)
        .eq('reporter_id', user.id)
        .maybeSingle()

      if (existing) {
        toast.error('You already reported this item')
        setReportOpen(false)
        setActionLoading(false)
        return
      }

      const { error } = await supabase.from('reports').insert({
        item_id: item.id,
        reporter_id: user.id,
        reason: reason
      })
      if (error) throw error
      toast.success('Report submitted. Our team will review this listing.')

      if (item.seller_id !== user.id) {
        const { data: sender } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single()

        await createNotification(
          item.seller_id,
          'report',
          'Item reported ⚠️',
          `${sender?.name || 'Someone'} reported your item "${item.title}"`,
          item.id
        )
        await decreaseTrustScore(item.seller_id, 5)
      }
    } catch (e) {
      toast.error('Failed to submit report')
    }
    setReportOpen(false)
    setActionLoading(false)
  }

  return (
    <PageWrapper>
      <Navbar />
      <div style={{maxWidth:1280,margin:'0 auto',padding:'24px 24px 60px'}}>
        <GoBack />
        {/* Breadcrumb */}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:24,color:'#6B7280',fontSize:14}}>
          <span style={{color:'#1F2937',fontWeight:500}}>{item.category}</span>
          <span>/</span><span style={{color:'#6B7280'}}>{item.title.slice(0,40)}...</span>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,alignItems:'start'}} className="item-grid">
          {/* LEFT: Image Gallery */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{position:'relative',borderRadius:20,overflow:'hidden',background:'#F8FAFC',aspectRatio:'4/3',cursor:'zoom-in'}}>
              <motion.img
                initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}
                src={mainImage || item.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop'}
                alt={item.title}
                style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.4s ease'}}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.15)'}
                onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
              />
            </div>
            
            {/* Thumbnail strip */}
            {(item.images && item.images.length > 0) ? (
              <div style={{display:'flex',gap:12,overflowX:'auto',paddingBottom:8,scrollbarWidth:'none'}}>
                {item.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(img)}
                    style={{
                      width: 80, height: 80, borderRadius: 12, flexShrink: 0, 
                      padding: 0, border: mainImage === img ? '3px solid #2563EB' : '2px solid transparent',
                      overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', background: '#F8FAFC'
                    }}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} style={{width:'100%',height:'100%',objectFit:'cover',opacity: mainImage === img ? 1 : 0.6}} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* RIGHT: Item Info */}
          <div>
            {/* Category + Status */}
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <span style={{background:'#DBEAFE',color:'#1D4ED8',padding:'3px 10px',borderRadius:999,fontSize:12,fontWeight:600}}>{item.category}</span>
              <span style={{background:conditionColors[item.condition]?.bg || '#F3F4F6',color:conditionColors[item.condition]?.color || '#6B7280',padding:'3px 10px',borderRadius:999,fontSize:12,fontWeight:600}}>{item.condition}</span>
              {item.status==='approved' && (
                <span style={{display:'flex',alignItems:'center',gap:4,background:'#DCFCE7',color:'#15803D',padding:'3px 10px',borderRadius:999,fontSize:12,fontWeight:600}}>
                  <CheckCircle size={12}/> Verified
                </span>
              )}
            </div>

            <h1 style={{fontSize:26,fontWeight:800,color:'#1F2937',lineHeight:1.25,marginBottom:12}}>{item.title}</h1>

            {/* Price */}
            <div style={{marginBottom:20}}>
              <span className={pricePulse?'price-pulse':''} style={{fontSize:36,fontWeight:900,color:'#2563EB',transition:'color 0.5s'}}>
                ₹{item.price?.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Description */}
            <p style={{color:'#374151',lineHeight:1.75,fontSize:15,marginBottom:24}}>{item.description}</p>

            {/* Meta */}
            <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24,padding:16,background:'#F8FAFC',borderRadius:14,border:'1px solid #F1F5F9'}}>
              {[
                { icon:<Calendar size={15}/>, label:'Posted', value: new Date(item.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) },
                { icon:<Tag size={15}/>, label:'Condition', value: item.condition },
                { icon:<Shield size={15}/>, label:'Status', value: item.status.charAt(0).toUpperCase()+item.status.slice(1) },
                { icon:<Eye size={15}/>, label:'Views', value: (item.views || 0) + 1 },
              ].map(m => (
                <div key={m.label} style={{display:'flex',alignItems:'center',gap:10,color:'#6B7280',fontSize:14}}>
                  {m.icon}
                  <span style={{fontWeight:600,color:'#374151',minWidth:80}}>{m.label}:</span>
                  <span>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:20}}>
              {item.status !== 'sold' ? (
                <button onClick={handleContact} className="btn-primary" style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:16}}>
                  <MessageCircle size={18}/> Contact Seller
                </button>
              ) : (
                <div style={{padding:14,background:'#F3F4F6',borderRadius:12,textAlign:'center',color:'#6B7280',fontWeight:600}}>This item has been sold</div>
              )}
              <div style={{display:'flex',gap:10}}>
                <button disabled={actionLoading} onClick={toggleLike} className={pop?'heart-pop':''} style={{
                  flex:1,padding:'11px',borderRadius:12,border:'2px solid',
                  borderColor:liked?'#EF4444':'#E2E8F0',
                  background:liked?'#FEF2F2':'#fff',
                  color:liked?'#EF4444':'#6B7280',
                  display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                  fontWeight:600,fontSize:14,cursor:'pointer',transition:'all 0.2s',
                }}>
                  <Heart size={16} fill={liked?'#EF4444':'none'} color={liked?'#EF4444':'#6B7280'}/> 
                  {liked?'Saved':'Save'}
                </button>
                <button onClick={()=>setReportOpen(true)} style={{
                  flex:1,padding:'11px',borderRadius:12,border:'2px solid #E2E8F0',
                  background:'#fff',color:'#6B7280',
                  display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                  fontWeight:600,fontSize:14,cursor:'pointer',transition:'all 0.2s',
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#EF4444';e.currentTarget.style.color='#EF4444'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.color='#6B7280'}}
                >
                  <Flag size={16}/> Report
                </button>
              </div>
            </div>

            {/* Seller Box */}
            <div style={{background:'#fff',borderRadius:16,padding:20,border:'2px solid #E2E8F0',boxShadow:'0 4px 12px rgba(0,0,0,0.06)', marginBottom: 24}}>
              <p style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'#6B7280',marginBottom:14}}>Seller Information</p>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:46,height:46,borderRadius:'50%',background:'linear-gradient(135deg,#2563EB,#1D4ED8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:'#fff',fontWeight:700,flexShrink:0}}>
                  {(item.seller?.name || 'U').charAt(0)}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,fontSize:16,margin:'0 0 3px'}}>{item.seller?.name || 'Anonymous'}</p>
                  <p style={{color:'#6B7280',fontSize:13,margin:0}}>{item.seller?.college || 'Unknown College'}</p>
                </div>
              </div>
              <div style={{display:'flex',gap:16,marginTop:16,paddingTop:14,borderTop:'1px solid #F1F5F9'}}>
                <div style={{textAlign:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:4,justifyContent:'center'}}>
                    <Star size={16} fill="#F59E0B" color="#F59E0B"/>
                    <span style={{fontWeight:700,fontSize:17,color:'#1F2937'}}>{item.seller?.trust_score || 0}</span>
                  </div>
                  <p style={{fontSize:12,color:'#6B7280',margin:0}}>Trust Score</p>
                </div>
                <div style={{width:1,background:'#F1F5F9'}}/>
                <div style={{textAlign:'center'}}>
                  <span style={{fontWeight:700,fontSize:17,color:'#1F2937',display:'block'}}>{item.seller?.listings_count || 0}</span>
                  <p style={{fontSize:12,color:'#6B7280',margin:0}}>Listings</p>
                </div>
                <div style={{width:1,background:'#F1F5F9'}}/>
                <div style={{textAlign:'center'}}>
                  <CheckCircle size={20} color="#10B981" style={{margin:'0 auto 2px'}}/>
                  <p style={{fontSize:12,color:'#6B7280',margin:0}}>{(item.seller?.trust_score || 0) >= 4 ? 'Verified' : 'New'}</p>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div style={{ background: '#F0F9FF', border: '1px solid #E0F2FE', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#0369A1' }}>
                <Shield size={18} />
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Campus Safety Tips</h3>
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#0C4A6E', lineHeight: 1.6 }}>
                <li>Meet in public areas like the library or student center.</li>
                <li>Inspect the item thoroughly before paying.</li>
                <li>Use digital payments for record-keeping.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Items */}
        {similarItems.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1F2937', marginBottom: 20 }}>Similar Items</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {similarItems.map(sItem => (
                <div key={sItem.id} onClick={() => navigate(`/items/${sItem.id}`)} style={{ 
                  background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #F1F5F9',
                  cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <img src={sItem.image_url} alt="" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  <div style={{ padding: 12 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', color: '#1F2937' }}>{sItem.title}</h4>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#2563EB', margin: 0 }}>₹{sItem.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <ModalDialog isOpen={contactOpen} onClose={()=>setContactOpen(false)} title={`Contact ${item.seller?.name || 'Seller'}`}>
        <p style={{color:'#6B7280',fontSize:14,marginBottom:16}}>Send a message about "<strong>{item.title}</strong>"</p>
        <textarea
          value={message} onChange={e=>setMessage(e.target.value)}
          placeholder="Hi! I'm interested in this item. Is it still available?"
          rows={4}
          className="input-field"
          style={{resize:'vertical',lineHeight:1.6}}
        />
        <div style={{display:'flex',gap:10,marginTop:16}}>
          <button className="btn-secondary" onClick={()=>setContactOpen(false)} style={{flex:1,justifyContent:'center'}} disabled={actionLoading}>Cancel</button>
          <button className="btn-primary" onClick={sendMessage} style={{flex:2,justifyContent:'center'}} disabled={!message.trim() || actionLoading}>
            <MessageCircle size={16}/> Send Message
          </button>
        </div>
      </ModalDialog>

      {/* Report Modal */}
      <ModalDialog isOpen={reportOpen} onClose={()=>setReportOpen(false)} title="Report This Listing">
        <p style={{color:'#6B7280',fontSize:14,marginBottom:16}}>Why are you reporting this item?</p>
        {['Fake or misleading listing','Wrong/false information','Prohibited item','Spam or duplicate','Other'].map(r=>(
          <button key={r} onClick={()=>report(r)} disabled={actionLoading} style={{
            display:'block',width:'100%',textAlign:'left',padding:'12px 16px',
            marginBottom:8,border:'2px solid #E2E8F0',borderRadius:12,
            background:'#fff',cursor:'pointer',fontSize:14,color:'#374151',
            transition:'all 0.15s',
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='#EF4444';e.currentTarget.style.background='#FFF5F5'}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.background='#fff'}}
          >{r}</button>
        ))}
      </ModalDialog>

      <style>{`@media (max-width:768px) { .item-grid { grid-template-columns: 1fr !important; } }`}</style>
    </PageWrapper>
  )
}
