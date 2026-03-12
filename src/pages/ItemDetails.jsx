import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import ModalDialog from '../components/ModalDialog'
import GoBack from '../components/GoBack'
import { MOCK_ITEMS } from '../lib/mockData'
import { Heart, MessageCircle, Flag, Star, ChevronLeft, ChevronRight, Shield, Calendar, Tag, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const conditionColors = {
  'Like New': { bg:'#DCFCE7', color:'#15803D' },
  'Good':     { bg:'#DBEAFE', color:'#1D4ED8' },
  'Fair':     { bg:'#FEF3C7', color:'#92400E' },
  'Poor':     { bg:'#FEE2E2', color:'#B91C1C' },
}

export default function ItemDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [item, setItem]       = useState(null)
  const [imgIdx, setImgIdx]   = useState(0)
  const [liked, setLiked]     = useState(false)
  const [pop, setPop]         = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [pricePulse, setPricePulse] = useState(false)

  useEffect(() => {
    const found = MOCK_ITEMS.find(i => i.id === id)
    setItem(found || null)
    setTimeout(() => setPricePulse(true), 800)
    setTimeout(() => setPricePulse(false), 6000)
    
    // Store in recently viewed
    if (found) {
      try {
        let stored = JSON.parse(localStorage.getItem('recent_views') || '[]')
        stored = stored.filter(vid => vid !== found.id) // remove dup
        stored.unshift(found.id) // add front
        if (stored.length > 15) stored.pop()
        localStorage.setItem('recent_views', JSON.stringify(stored))
      } catch(e) {}
    }
  }, [id])

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

  function toggleLike() {
    setLiked(p=>!p)
    setPop(true)
    setTimeout(()=>setPop(false),350)
    toast.success(liked ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  async function sendMessage() {
    if (!message.trim()) return
    toast.success("Message sent! Seller will respond soon.")
    setMessage('')
    setContactOpen(false)
  }

  function report(reason) {
    toast.success('Report submitted. Our team will review this listing.')
    setReportOpen(false)
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
          <div>
            <div style={{position:'relative',borderRadius:20,overflow:'hidden',background:'#F8FAFC',aspectRatio:'4/3'}}>
              <motion.img
                key={imgIdx}
                initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}
                src={images[imgIdx]}
                alt={item.title}
                style={{width:'100%',height:'100%',objectFit:'cover'}}
              />
              {item.status === 'sold' && (
                <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{background:'#9CA3AF',color:'#fff',padding:'8px 24px',borderRadius:999,fontWeight:700,fontSize:18}}>SOLD</span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={()=>setImgIdx(p=>Math.max(0,p-1))} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,0.9)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <ChevronLeft size={18}/>
                  </button>
                  <button onClick={()=>setImgIdx(p=>Math.min(images.length-1,p+1))} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,0.9)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <ChevronRight size={18}/>
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div style={{display:'flex',gap:8,marginTop:12}}>
                {images.map((img,i)=>(
                  <div key={i} onClick={()=>setImgIdx(i)} style={{
                    width:60,height:60,borderRadius:10,overflow:'hidden',cursor:'pointer',
                    border:i===imgIdx?'2px solid #2563EB':'2px solid transparent',
                    transition:'border-color 0.2s',flexShrink:0,
                  }}>
                    <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Item Info */}
          <div>
            {/* Category + Status */}
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <span style={{background:'#DBEAFE',color:'#1D4ED8',padding:'3px 10px',borderRadius:999,fontSize:12,fontWeight:600}}>{item.category}</span>
              <span style={{background:cond.bg,color:cond.color,padding:'3px 10px',borderRadius:999,fontSize:12,fontWeight:600}}>{item.condition}</span>
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
              <span style={{display:'inline-block',marginLeft:12,fontSize:13,color:'#9CA3AF',textDecoration:'line-through'}}>
                {/* suggested market price */}
                ₹{Math.round(item.price * 1.4).toLocaleString('en-IN')} MRP
              </span>
            </div>

            {/* Description */}
            <p style={{color:'#374151',lineHeight:1.75,fontSize:15,marginBottom:24}}>{item.description}</p>

            {/* Meta */}
            <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24,padding:16,background:'#F8FAFC',borderRadius:14,border:'1px solid #F1F5F9'}}>
              {[
                { icon:<Calendar size={15}/>, label:'Posted', value: new Date(item.posted_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) },
                { icon:<Tag size={15}/>, label:'Condition', value: item.condition },
                { icon:<Shield size={15}/>, label:'Status', value: item.status.charAt(0).toUpperCase()+item.status.slice(1) },
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
                <button onClick={toggleLike} className={pop?'heart-pop':''} style={{
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
            <div style={{background:'#fff',borderRadius:16,padding:20,border:'2px solid #E2E8F0',boxShadow:'0 4px 12px rgba(0,0,0,0.06)'}}>
              <p style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'#6B7280',marginBottom:14}}>Seller Information</p>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:46,height:46,borderRadius:'50%',background:'linear-gradient(135deg,#2563EB,#1D4ED8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:'#fff',fontWeight:700,flexShrink:0}}>
                  {(item.seller_name||'U').charAt(0)}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,fontSize:16,margin:'0 0 3px'}}>{item.seller_name}</p>
                  <p style={{color:'#6B7280',fontSize:13,margin:0}}>{item.college}</p>
                </div>
              </div>
              <div style={{display:'flex',gap:16,marginTop:16,paddingTop:14,borderTop:'1px solid #F1F5F9'}}>
                <div style={{textAlign:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:4,justifyContent:'center'}}>
                    <Star size={16} fill="#F59E0B" color="#F59E0B"/>
                    <span style={{fontWeight:700,fontSize:17,color:'#1F2937'}}>{item.seller_trust}</span>
                  </div>
                  <p style={{fontSize:12,color:'#6B7280',margin:0}}>Trust Score</p>
                </div>
                <div style={{width:1,background:'#F1F5F9'}}/>
                <div style={{textAlign:'center'}}>
                  <span style={{fontWeight:700,fontSize:17,color:'#1F2937',display:'block'}}>{item.seller_listings}</span>
                  <p style={{fontSize:12,color:'#6B7280',margin:0}}>Listings</p>
                </div>
                <div style={{width:1,background:'#F1F5F9'}}/>
                <div style={{textAlign:'center'}}>
                  <CheckCircle size={20} color="#10B981" style={{margin:'0 auto 2px'}}/>
                  <p style={{fontSize:12,color:'#6B7280',margin:0}}>Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ModalDialog isOpen={contactOpen} onClose={()=>setContactOpen(false)} title={`Contact ${item.seller_name}`}>
        <p style={{color:'#6B7280',fontSize:14,marginBottom:16}}>Send a message about "<strong>{item.title}</strong>"</p>
        <textarea
          value={message} onChange={e=>setMessage(e.target.value)}
          placeholder="Hi! I'm interested in this item. Is it still available?"
          rows={4}
          className="input-field"
          style={{resize:'vertical',lineHeight:1.6}}
        />
        <div style={{display:'flex',gap:10,marginTop:16}}>
          <button className="btn-secondary" onClick={()=>setContactOpen(false)} style={{flex:1,justifyContent:'center'}}>Cancel</button>
          <button className="btn-primary" onClick={sendMessage} style={{flex:2,justifyContent:'center'}} disabled={!message.trim()}>
            <MessageCircle size={16}/> Send Message
          </button>
        </div>
      </ModalDialog>

      {/* Report Modal */}
      <ModalDialog isOpen={reportOpen} onClose={()=>setReportOpen(false)} title="Report This Listing">
        <p style={{color:'#6B7280',fontSize:14,marginBottom:16}}>Why are you reporting this item?</p>
        {['Fake or misleading listing','Wrong/false information','Prohibited item','Spam or duplicate','Other'].map(r=>(
          <button key={r} onClick={()=>report(r)} style={{
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
