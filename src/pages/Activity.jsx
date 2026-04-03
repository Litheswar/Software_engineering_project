import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import ModalDialog from '../components/ModalDialog'
import GoBack from '../components/GoBack'
import {
  Package, Heart, MessageCircle, Star, Edit3, Trash2,
  CheckCircle, XCircle, Phone, Activity as ActivityIcon, ThumbsUp, AlertTriangle, Bell
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

import { supabase } from '../lib/supabase'
import { increaseTrustScore } from '../lib/notifications'

const TABS = [
  { id: 'timeline',  label: 'Activity Feed',  icon: <ActivityIcon size={16}/> },
  { id: 'listings',  label: 'My Listings',    icon: <Package size={16}/> },
  { id: 'chats',     label: 'Chat Requests',  icon: <MessageCircle size={16}/> },
  { id: 'wishlist',  label: 'Wishlist',       icon: <Heart size={16}/> },
]

function StatusBadge({ status }) {
  const map = { 
    approved: { bg:'#DCFCE7', color:'#15803D', label:'Approved' }, 
    pending: { bg:'#FEF3C7', color:'#92400E', label:'Pending' }, 
    sold: { bg:'#F3F4F6', color:'#6B7280', label:'Sold' },
    rejected: { bg:'#FEE2E2', color:'#991B1B', label:'Rejected' }
  }
  const s = map[status] || map.pending
  return <span style={{background:s.bg,color:s.color,padding:'3px 10px',borderRadius:999,fontSize:12,fontWeight:600}}>{s.label}</span>
}

export default function Activity() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('timeline')
  const [myListings, setMyListings] = useState([])
  const [myWishlist, setMyWishlist] = useState([])
  const [chatRequests, setChatRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState(null)
  const [replyModal, setReplyModal]   = useState(null)
  const [reply, setReply]         = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [timelineList, setTimelineList] = useState([])

  useEffect(() => {
    if (!user) return
    fetchUserActivity()
  }, [user])

  async function fetchUserActivity() {
    setLoading(true)
    
    // Fetch user's listings
    const { data: listings } = await supabase
      .from('items')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
      
    // Fetch notifications related to user
    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    // Fetch user's wishlist (joined with items)
    const { data: wishlistData } = await supabase
      .from('wishlist')
      .select('*, item:items(*)')
      .eq('user_id', user.id)

    if (listings) setMyListings(listings)
    if (wishlistData) setMyWishlist(wishlistData.map(w => w.item).filter(i => i !== null))

    // Build unified timeline
    let timeline = []

    if (listings) {
      listings.forEach(item => {
        timeline.push({
          id: `item_posted_${item.id}`,
          type: 'posted',
          content: `You posted "${item.title}"`,
          created_at: item.created_at
        })
        if (item.status === 'sold') {
          timeline.push({
            id: `item_sold_${item.id}`,
            type: 'sold',
            content: `Your item "${item.title}" was marked as sold`,
            created_at: item.updated_at || item.created_at
          })
        }
      })
    }

    if (notifications) {
      notifications.forEach(n => {
        let typeStr
        if (n.type === 'item_approved' || n.type === 'approved') typeStr = 'approved'
        else if (n.type === 'item_rejected' || n.type === 'rejected') typeStr = 'rejected'
        else if (n.type === 'wishlist') typeStr = 'wishlist'
        else if (n.type === 'report') typeStr = 'report'
        else if (n.type === 'message') typeStr = 'message'
        else typeStr = 'bell'

        timeline.push({
          id: `notif_${n.id}`,
          type: typeStr,
          content: n.message || n.title,
          created_at: n.created_at
        })
      })
    }

    // Sort descending
    timeline.sort((a, b) => {
      const dateA = new Date(a.created_at?.endsWith('Z') || a.created_at?.includes('+') ? a.created_at : a.created_at + 'Z')
      const dateB = new Date(b.created_at?.endsWith('Z') || b.created_at?.includes('+') ? b.created_at : b.created_at + 'Z')
      return dateB - dateA
    })
    setTimelineList(timeline)

    setLoading(false)
  }

  async function markSold(id) {
    try {
      const { error } = await supabase
        .from('items')
        .update({ status: 'sold' })
        .eq('id', id)
      
      if (error) throw error
      
      setMyListings(p => p.map(i => i.id === id ? { ...i, status: 'sold' } : i))
      toast.success('Congratulations! Your item has been marked as sold.')
      
      // Increase trust score by 5 for a successful sale
      await increaseTrustScore(user.id, 5)
      
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    } catch (e) {
      toast.error('Failed to update status')
    }
  }

  async function deleteItem() {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', deleteModal)
      
      if (error) throw error
      
      setMyListings(p => p.filter(i => i.id !== deleteModal))
      toast.success('Listing deleted')
      setDeleteModal(null)
    } catch (e) {
      toast.error('Failed to delete listing')
    }
  }

  function sendReply() {
    toast.success('Reply sent!')
    setReply('')
    setReplyModal(null)
  }

  return (
    <PageWrapper>
      <Navbar />
      
      {/* Confetti Overlay */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} 
            style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:9999,overflow:'hidden'}}>
            {Array.from({length: 50}).map((_, i) => (
              <div key={i} style={{
                position:'absolute',
                left: `${Math.random() * 100}%`,
                top: -20,
                width: Math.random() > 0.5 ? 10 : 8,
                height: Math.random() > 0.5 ? 20 : 8,
                background: ['#2563EB','#10B981','#F59E0B','#EF4444','#8B5CF6'][Math.floor(Math.random()*5)],
                borderRadius: Math.random() > 0.5 ? '50%' : 2,
                animation: `confetti-fall ${1.5 + Math.random()*2}s ease-out forwards`,
                animationDelay: `${Math.random()*0.5}s`,
              }}/>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'24px 24px 60px'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, marginTop: 8 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1F2937', margin: 0 }}>My Activity</h1>
            <p style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>Manage your listings, chat requests, and wishlist.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: '#F0F9FF', padding: '12px 20px', borderRadius: 16, border: '1px solid #E0F2FE', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: 20, fontWeight: 800, color: '#0369A1' }}>{myListings.length}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0EA5E9', textTransform: 'uppercase' }}>Listings</span>
            </div>
            <div style={{ background: '#F0FDF4', padding: '12px 20px', borderRadius: 16, border: '1px solid #DCFCE7', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: 20, fontWeight: 800, color: '#15803D' }}>{myListings.filter(i => i.status === 'sold').length}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' }}>Sold</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,borderBottom:'2px solid #E2E8F0',marginBottom:28,overflowX:'auto',paddingBottom:0}}>
          {TABS.map(tab => (
            <button key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 20px', border: 'none', cursor: 'pointer',
                background: 'transparent', fontSize: 14, fontWeight: activeTab===tab.id?700:500,
                color: activeTab===tab.id?'#2563EB':'#6B7280',
                borderBottom: `3px solid ${activeTab===tab.id?'#2563EB':'transparent'}`,
                marginBottom: -2, transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >{tab.icon} {tab.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ---- ACTIVITY TIMELINE ---- */}
          {activeTab === 'timeline' && (
            <motion.div key="timeline" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.2}}>
              <div style={{background:'#fff',borderRadius:16,padding:'24px',border:'1px solid #F1F5F9',boxShadow:'0 2px 8px rgba(0,0,0,0.03)'}}>
                <div style={{position:'relative',paddingLeft:24}}>
                  <div style={{position:'absolute',left:0,top:10,bottom:10,width:2,background:'#E2E8F0',borderRadius:2}}></div>
                  {timelineList.length === 0 && !loading && (
                    <p style={{color:'#6B7280',fontSize:14,margin:0,padding:'20px 0',textAlign:'center'}}>No activity found yet.</p>
                  )}
                  {timelineList.map((act, i) => {
                    let displayIcon = <ActivityIcon size={12} color="#6B7280"/>
                    let color = '#6B7280'
                    let borderCol = '#E2E8F0'
                    
                    if (act.type === 'posted') { displayIcon = <Package size={12} color="#3B82F6"/>; color='#3B82F6'; borderCol = '#BFDBFE' }
                    if (act.type === 'sold') { displayIcon = <CheckCircle size={12} color="#10B981"/>; color='#10B981'; borderCol = '#A7F3D0' }
                    if (act.type === 'approved') { displayIcon = <CheckCircle size={12} color="#F59E0B"/>; color='#F59E0B'; borderCol = '#FDE68A' }
                    if (act.type === 'rejected' || act.type === 'report') { displayIcon = <AlertTriangle size={12} color="#EF4444"/>; color='#EF4444'; borderCol = '#FECACA' }
                    if (act.type === 'wishlist') { displayIcon = <Heart size={12} color="#EC4899"/>; color='#EC4899'; borderCol = '#FBCFE8' }
                    if (act.type === 'message') { displayIcon = <MessageCircle size={12} color="#8B5CF6"/>; color='#8B5CF6'; borderCol = '#DDD6FE' }
                    if (act.type === 'bell') { displayIcon = <Bell size={12} color="#6B7280"/>; color='#6B7280'; borderCol = '#E2E8F0' }

                    return (
                      <div key={act.id} style={{position:'relative',marginBottom:i===timelineList.length-1?0:28}}>
                        <div style={{position:'absolute',left:-34,top:0,width:20,height:20,borderRadius:'50%',background:'#fff',border:`2px solid ${borderCol}`,display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}>
                          {displayIcon}
                        </div>
                        <p style={{fontSize:15,fontWeight:600,color:'#1F2937',margin:'0 0 4px',lineHeight:1.4}}>{act.content}</p>
                        <span style={{fontSize:13,color:'#9CA3AF',fontWeight:500}}>
                          {act.created_at ? formatDistanceToNow(new Date(act.created_at.endsWith('Z') || act.created_at.includes('+') ? act.created_at : act.created_at + 'Z'), { addSuffix: true }) : 'Just now'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ---- MY LISTINGS ---- */}
          {activeTab === 'listings' && (
            <motion.div key="listings" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.2}}>
              {loading ? (
                <div style={{textAlign:'center',padding:'40px 0'}}><p>Loading listings...</p></div>
              ) : myListings.length === 0 ? (
                <div style={{textAlign:'center',padding:'60px 0'}}>
                  <Package size={48} color="#D1D5DB" style={{margin:'0 auto 12px'}}/>
                  <h3 style={{color:'#6B7280',fontWeight:600}}>No listings yet</h3>
                </div>
              ) : myListings.map(item => (
                <motion.div key={item.id}
                  layout exit={{opacity:0,height:0}}
                  style={{
                    display:'flex',alignItems:'center',gap:16,padding:16,
                    background:'#fff',borderRadius:16,marginBottom:12,
                    border:'1px solid #F1F5F9',boxShadow:'0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <img src={item.image_url||''} alt="" style={{width:72,height:72,borderRadius:12,objectFit:'cover',flexShrink:0,background:'#F8FAFC'}} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                      <p style={{fontWeight:700,fontSize:15,margin:0,color:'#1F2937',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:250}}>{item.title}</p>
                      <StatusBadge status={item.status}/>
                    </div>
                    <p style={{color:'#2563EB',fontWeight:700,fontSize:17,margin:'0 0 4px'}}>₹{item.price?.toLocaleString('en-IN')}</p>
                    <p style={{color:'#9CA3AF',fontSize:12,margin:0}}>{item.category} · {item.condition}</p>
                  </div>
                  <div style={{display:'flex',gap:8,flexShrink:0}}>
                    {item.status !== 'sold' && (
                      <button onClick={()=>markSold(item.id)} className="btn-success" style={{padding:'7px 14px',fontSize:12}}>
                        <CheckCircle size={13}/> Mark Sold
                      </button>
                    )}
                    <button onClick={() => navigate(`/edit-item/${item.id}`)} style={{width:36,height:36,borderRadius:10,border:'2px solid #E2E8F0',background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='#2563EB'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0'}}
                    >
                      <Edit3 size={15} color="#6B7280"/>
                    </button>
                    <button onClick={()=>setDeleteModal(item.id)} style={{width:36,height:36,borderRadius:10,border:'2px solid #E2E8F0',background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='#EF4444';e.currentTarget.style.background='#FFF5F5'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.background='#fff'}}
                    >
                      <Trash2 size={15} color="#EF4444"/>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ---- CHAT REQUESTS ---- */}
          {activeTab === 'chats' && (
            <motion.div key="chats" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.2}}>
              {chatRequests.length === 0 ? (
                <div style={{textAlign:'center',padding:'60px 0'}}>
                  <MessageCircle size={48} color="#D1D5DB" style={{margin:'0 auto 12px'}}/>
                  <h3 style={{color:'#6B7280',fontWeight:600}}>No messages yet</h3>
                  <p style={{color:'#94A3B8',fontSize:14}}>When students contact you about your items, messages will appear here.</p>
                </div>
              ) : chatRequests.map(chat => (
                <div key={chat.id} style={{padding:20,background:'#fff',borderRadius:16,marginBottom:12,border:`1px solid ${chat.status==='new'?'#BFDBFE':'#F1F5F9'}`,boxShadow:'0 2px 8px rgba(0,0,0,0.05)',position:'relative'}}>
                  {chat.status==='new' && (
                    <span style={{position:'absolute',top:16,right:16,background:'#DBEAFE',color:'#1D4ED8',padding:'2px 8px',borderRadius:999,fontSize:11,fontWeight:700}}>New</span>
                  )}
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#10B981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'#fff',fontWeight:700,flexShrink:0}}>
                      {chat.buyer.charAt(0)}
                    </div>
                    <div>
                      <p style={{fontWeight:700,fontSize:14,margin:0}}>{chat.buyer}</p>
                      <p style={{color:'#6B7280',fontSize:12,margin:0}}>About: <strong>{chat.item}</strong> · {chat.time}</p>
                    </div>
                  </div>
                  <p style={{color:'#374151',fontSize:14,margin:'0 0 14px',background:'#F8FAFC',padding:'10px 14px',borderRadius:10,lineHeight:1.5}}>"{chat.msg}"</p>
                  <button onClick={()=>setReplyModal(chat)} className="btn-primary" style={{padding:'8px 18px',fontSize:13}}>
                    <MessageCircle size={14}/> Reply
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {/* ---- WISHLIST ---- */}
          {activeTab === 'wishlist' && (
            <motion.div key="wishlist" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.2}}>
              {loading ? (
                <div style={{textAlign:'center',padding:'40px 0'}}><p>Loading wishlist...</p></div>
              ) : myWishlist.length === 0 ? (
                <div style={{textAlign:'center',padding:'60px 0'}}>
                  <Heart size={48} color="#D1D5DB" style={{margin:'0 auto 12px'}}/>
                  <h3 style={{color:'#6B7280',fontWeight:600}}>No saved items</h3>
                </div>
              ) : (
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:20}}>
                  {myWishlist.map(item => (
                    <div key={item.id} onClick={() => navigate(`/items/${item.id}`)} style={{background:'#fff',borderRadius:16,overflow:'hidden',border:'1px solid #F1F5F9',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',cursor:'pointer'}}>
                      <img src={item.image_url} alt="" style={{width:'100%',height:160,objectFit:'cover'}}/>
                      <div style={{padding:14}}>
                        <p style={{fontWeight:700,fontSize:14,margin:'0 0 4px'}}>{item.title}</p>
                        <p style={{color:'#2563EB',fontWeight:700,fontSize:17,margin:'0 0 10px'}}>₹{item.price?.toLocaleString('en-IN')}</p>
                        <button className="btn-primary" style={{width:'100%',justifyContent:'center',padding:'8px',fontSize:13}}>View Item</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Delete confirm */}
      <ModalDialog isOpen={!!deleteModal} onClose={()=>setDeleteModal(null)} title="Delete Listing">
        <p style={{color:'#6B7280',fontSize:15,marginBottom:24}}>Are you sure you want to delete this listing? This action cannot be undone.</p>
        <div style={{display:'flex',gap:10}}>
          <button className="btn-secondary" onClick={()=>setDeleteModal(null)} style={{flex:1,justifyContent:'center'}}>Cancel</button>
          <button className="btn-danger" onClick={deleteItem} style={{flex:1,justifyContent:'center'}}><Trash2 size={15}/> Delete</button>
        </div>
      </ModalDialog>

      {/* Reply modal */}
      <ModalDialog isOpen={!!replyModal} onClose={()=>setReplyModal(null)} title={`Reply to ${replyModal?.buyer}`}>
        <p style={{fontSize:14,color:'#6B7280',marginBottom:10}}>Their message: <em>"{replyModal?.msg}"</em></p>
        <textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Type your reply..." rows={4}
          className="input-field" style={{resize:'vertical',lineHeight:1.6,marginBottom:16}} />
        <div style={{display:'flex',gap:10}}>
          <button className="btn-secondary" onClick={()=>setReplyModal(null)} style={{flex:1,justifyContent:'center'}}>Cancel</button>
          <button className="btn-primary" onClick={sendReply} style={{flex:2,justifyContent:'center'}} disabled={!reply.trim()}>
            <MessageCircle size={15}/> Send Reply
          </button>
        </div>
      </ModalDialog>

      <style>{`@media (max-width:640px) { .profile-grid { grid-template-columns: 1fr !important; } }`}</style>
    </PageWrapper>
  )
}
