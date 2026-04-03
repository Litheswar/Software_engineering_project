import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { 
  Search, ShoppingBag, Bell, User, ChevronDown, 
  LogOut, Plus, Activity as ActivityIcon, TrendingUp,
  History, Menu, X, Shield, Heart, AlertTriangle, MessageCircle, CheckCircle, XCircle
} from 'lucide-react'

export default function Navbar({ onSearch }) {
  const { user, profile, signOut, isAdmin } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const [menuOpen, setMenuOpen]   = useState(false)
  const [dropOpen, setDropOpen]   = useState(false)
  const [query, setQuery]         = useState('')
  const [notifOpen, setNotifOpen] = useState(false)

  const [searchFocused, setSearchFocused] = useState(false)
  const [trendOpen, setTrendOpen] = useState(false)
  const [trending, setTrending] = useState([])
  const [categories, setCategories] = useState([])

  const isLanding = location.pathname === '/'

  useState(() => {
    async function fetchData() {
      const { data: trend } = await supabase.from('items').select('*').eq('status','approved').order('views',{ascending:false}).limit(3)
      const { data: cats } = await supabase.from('categories').select('name').limit(5)
      if (trend) setTrending(trend)
      if (cats) setCategories(cats.map(c=>c.name))
    }
    fetchData()
  }, [])

  const [notifications, setNotifications] = useState([])
  const unreadCount = notifications.filter(n => !n.is_read).length

  useEffect(() => {
    if (!user) return

    async function fetchNotifications() {
      const { data } = await supabase
        .from('notifications')
        .select(`
          *,
          related_item:items(title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
      if (data) setNotifications(data)
    }

    fetchNotifications()

    // Real-time subscription
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, payload => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => [payload.new, ...prev].slice(0, 20))
          toast.success(payload.new.title, { icon: '🔔' })
        } else if (payload.eventType === 'UPDATE') {
          setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new : n))
        } else if (payload.eventType === 'DELETE') {
          setNotifications(prev => prev.filter(n => n.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user])

  async function markAllRead() {
    if (!user || unreadCount === 0) return
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    }
  }

  async function markAsRead(id, is_read, related_item) {
    if (!is_read) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    }
    if (related_item && (typeof related_item === 'string' || related_item.id)) {
      setNotifOpen(false)
      navigate(`/items/${typeof related_item === 'string' ? related_item : related_item.id}`)
    }
  }

  const getNotifIcon = (type) => {
    switch(type) {
      case 'wishlist': return <Heart size={14} color="#EC4899" />
      case 'report': return <AlertTriangle size={14} color="#EF4444" />
      case 'message': return <MessageCircle size={14} color="#3B82F6" />
      case 'item_approved': return <CheckCircle size={14} color="#10B981" />
      case 'item_rejected': return <XCircle size={14} color="#EF4444" />
      default: return <Bell size={14} color="#6B7280" />
    }
  }

  const suggestions = [
    ...categories.filter(c => c.toLowerCase().includes(query.toLowerCase())).slice(0, 2).map(c => ({ type: 'category', text: c })),
    { type: 'history', text: 'Recent: Engineering Books' }
  ].filter((_, i) => query.length > 0 || i === 1)

  async function handleLogout() {
    await signOut()
    toast.success('Logged out successfully')
    navigate('/login')
    setDropOpen(false)
  }

  function handleSearch(e, forcedQuery) {
    if (e) e.preventDefault()
    const q = forcedQuery || query
    if (onSearch) onSearch(q)
    else navigate(`/dashboard?q=${encodeURIComponent(q)}`)
    setSearchFocused(false)
  }

  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: isLanding ? 'rgba(255,255,255,0.85)' : '#fff',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '0 24px',
        display: 'flex', alignItems: 'center',
        height: 68, gap: 16,
      }}>
        {/* Logo */}
        <Link to="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none',flexShrink:0}}>
          <div style={{
            width:36,height:36,borderRadius:10,
            background:'linear-gradient(135deg,#2563EB,#1D4ED8)',
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <ShoppingBag size={20} color="#fff" />
          </div>
          <span style={{fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:20,color:'#1F2937'}}>
            EEC<span style={{color:'#2563EB'}}>Shop</span>
          </span>
        </Link>

        {/* Search Bar (hide on landing) */}
        {!isLanding && (
          <div style={{flex:1,maxWidth:520,position:'relative'}}>
            <form onSubmit={handleSearch} style={{position:'relative',zIndex:102}}>
              <Search size={18} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#9CA3AF'}} />
              <input
                value={query}
                onChange={e=>setQuery(e.target.value)}
                onFocus={()=>setSearchFocused(true)}
                onBlur={()=>setTimeout(()=>setSearchFocused(false), 200)}
                placeholder="Search items, books, electronics..."
                style={{
                  width:'100%',padding:'10px 16px 10px 44px',
                  border:'2px solid #E2E8F0',borderRadius:12,
                  fontSize:14,fontFamily:'Inter,sans-serif',
                  background:'#F8FAFC',outline:'none',
                  transition:'border-color 0.2s,box-shadow 0.2s',
                  borderColor: searchFocused ? '#2563EB' : '#E2E8F0',
                  boxShadow: searchFocused ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none'
                }}
              />
            </form>
            <AnimatePresence>
              {searchFocused && (
                <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:4}} transition={{duration:0.15}}
                  style={{position:'absolute',top:'100%',left:0,right:0,marginTop:8,background:'#fff',borderRadius:12,boxShadow:'0 10px 25px rgba(0,0,0,0.1)',border:'1px solid #E2E8F0',zIndex:101,overflow:'hidden'}}
                >
                  <p style={{fontSize:11,fontWeight:700,color:'#9CA3AF',padding:'10px 14px 4px',textTransform:'uppercase',letterSpacing:'0.05em',margin:0}}>Suggestions</p>
                  {suggestions.map((s,i) => (
                    <div key={i} onClick={() => { setQuery(s.text); handleSearch(null, s.text) }}
                      style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',cursor:'pointer',borderBottom:i<suggestions.length-1?'1px solid #F1F5F9':'none',transition:'background 0.15s'}}
                      onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'} onMouseLeave={e=>e.currentTarget.style.background='#fff'}
                    >
                      {s.type==='item' ? <Search size={14} color="#6B7280"/> : s.type==='category' ? <ShoppingBag size={14} color="#2563EB"/> : <History size={14} color="#9CA3AF"/>}
                      <span style={{fontSize:14,color:(s.type==='category'||s.type==='item')?'#1F2937':'#6B7280',fontWeight:s.type==='category'?500:400}}>{s.text} {s.type==='category'&&<span style={{color:'#9CA3AF',fontSize:12}}>in Categories</span>}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div style={{flex:1}} />

        {/* Desktop Nav Actions */}
        <div style={{display:'flex',alignItems:'center',gap:12}} className="nav-desktop">
          {user && (
            <div style={{display:'flex',gap:16,marginRight:16,alignItems:'center'}}>
              <Link to="/activity" style={{display:'flex',alignItems:'center',gap:6,color:'#4B5563',fontSize:14,fontWeight:600,textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.color='#2563EB'} onMouseLeave={e=>e.currentTarget.style.color='#4B5563'}>
                <ActivityIcon size={16}/> Activity
              </Link>
              <div style={{position:'relative'}} onMouseLeave={()=>setTimeout(()=>setTrendOpen(false), 200)}>
                <button onMouseEnter={()=>setTrendOpen(true)} style={{display:'flex',alignItems:'center',gap:6,color:'#4B5563',fontSize:14,fontWeight:600,background:'none',border:'none',cursor:'pointer',transition:'color 0.2s'}} onMouseLeave={e=>e.currentTarget.style.color=(trendOpen?'#F59E0B':'#4B5563')}>
                  <TrendingUp size={16}/> Trending
                </button>
                <AnimatePresence>
                  {trendOpen && (
                    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}} transition={{duration:0.15}}
                      style={{position:'absolute',top:24,left:'50%',transform:'translateX(-50%)',width:240,background:'#fff',borderRadius:14,boxShadow:'0 10px 25px rgba(0,0,0,0.1)',border:'1px solid #E2E8F0',zIndex:200,padding:12}}
                    >
                      <p style={{fontSize:11,fontWeight:700,color:'#9CA3AF',padding:'4px 8px 8px',textTransform:'uppercase',letterSpacing:'0.05em',margin:0,borderBottom:'1px solid #F1F5F9',marginBottom:8}}>Popular Today</p>
                      {trending.map(i => (
                        <Link key={i.id} onClick={()=>setTrendOpen(false)} to={`/items/${i.id}`} style={{display:'flex',alignItems:'center',gap:10,padding:8,borderRadius:8,textDecoration:'none',color:'#1F2937',transition:'background 0.15s'}} onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <img src={i.image_url} alt="" style={{width:32,height:32,borderRadius:6,objectFit:'cover'}}/>
                          <div style={{minWidth:0}}>
                            <p style={{fontSize:13,fontWeight:600,margin:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{i.title}</p>
                            <p style={{fontSize:12,color:'#6B7280',margin:0}}>{i.views || 0} views</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {user ? (
            <>
              <Link to="/sell" className="btn-primary" style={{padding:'9px 18px',fontSize:14}}>
                <Plus size={16}/> Sell Item
              </Link>

              {/* Notifications */}
              <div style={{position:'relative'}}>
                <button
                  onClick={()=>setNotifOpen(p=>!p)}
                  style={{width:40,height:40,borderRadius:10,border:'2px solid #E2E8F0',
                    background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',
                    justifyContent:'center',position:'relative',transition:'all 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='#2563EB'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='#E2E8F0'}
                >
                  <Bell size={18} color="#6B7280" />
                  <span style={{
                    position:'absolute',top:-4,right:-4,
                    width:18,height:18,borderRadius:'50%',
                    background:'#EF4444',color:'#fff',
                    fontSize:10,fontWeight:700,
                    display: unreadCount > 0 ? 'flex' : 'none',alignItems:'center',justifyContent:'center',
                  }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                </button>
                <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{opacity:0,y:8,scale:0.95}}
                    animate={{opacity:1,y:0,scale:1}}
                    exit={{opacity:0,y:8,scale:0.95}}
                    transition={{duration:0.15}}
                    style={{
                      position:'absolute',right:0,top:48,width:320,
                      background:'#fff',borderRadius:16,
                      boxShadow:'0 20px 40px rgba(0,0,0,0.15)',
                      border:'1px solid #E2E8F0',zIndex:200,overflow:'hidden',
                      maxHeight: '400px', display: 'flex', flexDirection: 'column'
                    }}
                  >
                    <div style={{padding:'14px 18px',borderBottom:'1px solid #F1F5F9',display:'flex',justifyContent:'space-between',alignItems:'center', flexShrink: 0}}>
                      <span style={{fontWeight:600,fontSize:15}}>Notifications</span>
                      {unreadCount > 0 && <span style={{fontSize:12,color:'#2563EB',cursor:'pointer',fontWeight:500}} onClick={markAllRead}>Mark all read</span>}
                    </div>
                    <div style={{overflowY: 'auto', flex: 1}}>
                      {notifications.length === 0 ? (
                        <div style={{padding:'30px 20px',textAlign:'center',color:'#9CA3AF'}}>
                          <Bell size={32} style={{margin:'0 auto 10px',opacity:0.5}}/>
                          <p style={{margin:0,fontSize:14}}>No notifications yet</p>
                        </div>
                      ) : notifications.map((n) => (
                        <div key={n.id} onClick={() => markAsRead(n.id, n.is_read, n.related_item)}
                          style={{
                            padding:'12px 18px',borderBottom:'1px solid #F8FAFC',cursor:'pointer',transition:'background 0.15s',
                            background: n.is_read ? '#fff' : '#F0F9FF', display: 'flex', gap: 12
                          }}
                          onMouseEnter={e=>e.currentTarget.style.background=n.is_read?'#F8FAFC':'#E0F2FE'}
                          onMouseLeave={e=>e.currentTarget.style.background=n.is_read?'#fff':'#F0F9FF'}
                        >
                          <div style={{width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2}}>
                            {getNotifIcon(n.type)}
                          </div>
                          <div>
                            <p style={{fontSize:13,color:'#1F2937',margin:0,fontWeight:n.is_read?500:600}}>{n.title}</p>
                            <p style={{fontSize:13,color:'#4B5563',margin:'2px 0 0'}}>
                              {n.message}
                              {n.related_item?.title ? `: ${n.related_item.title}` : ''}
                            </p>
                            <p style={{fontSize:11,color:'#9CA3AF',margin:'4px 0 0'}}>{new Date(n.created_at).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div style={{position:'relative'}}>
                <button
                  onClick={()=>setDropOpen(p=>!p)}
                  style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',
                    background:'none',border:'2px solid #E2E8F0',
                    borderRadius:12,padding:'6px 12px 6px 8px',transition:'all 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='#2563EB'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='#E2E8F0'}
                >
                  <div style={{width:30,height:30,borderRadius:'50%',
                    background: isAdmin ? 'linear-gradient(135deg,#DC2626,#991B1B)' : 'linear-gradient(135deg,#2563EB,#1D4ED8)',
                    display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {isAdmin ? <Shield size={16} color="#fff"/> : <User size={16} color="#fff"/>}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
                    <span style={{fontSize:13,fontWeight:700,color:'#1F2937'}}>{displayName}</span>
                    {isAdmin && <span style={{fontSize:10,fontWeight:800,color:'#DC2626',textTransform:'uppercase',letterSpacing:'0.03em'}}>Admin Panel</span>}
                  </div>
                  <ChevronDown size={14} color="#6B7280" style={{transition:'transform 0.2s',transform:dropOpen?'rotate(180deg)':'none'}} />
                </button>

                <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{opacity:0,y:8,scale:0.95}}
                    animate={{opacity:1,y:0,scale:1}}
                    exit={{opacity:0,y:8,scale:0.95}}
                    transition={{duration:0.15}}
                    style={{
                      position:'absolute',right:0,top:52,width:200,
                      background:'#fff',borderRadius:16,
                      boxShadow:'0 20px 40px rgba(0,0,0,0.15)',
                      border:'1px solid #E2E8F0',zIndex:200,overflow:'hidden',
                    }}
                  >
                      <Link to="/activity" onClick={()=>setDropOpen(false)}
                        style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',
                          color:'#1F2937',fontSize:14,textDecoration:'none',transition:'background 0.15s'}}
                        onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                        onMouseLeave={e=>e.currentTarget.style.background='#fff'}
                      >
                        <ActivityIcon size={15}/> My Activity
                      </Link>
                      <Link to="/profile" onClick={()=>setDropOpen(false)}
                        style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',
                          color:'#1F2937',fontSize:14,textDecoration:'none',transition:'background 0.15s'}}
                        onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                        onMouseLeave={e=>e.currentTarget.style.background='#fff'}
                      >
                        <User size={15}/> Profile Settings
                      </Link>
                      {isAdmin && (
                      <Link to="/admin" onClick={()=>setDropOpen(false)}
                        style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',
                          color:'#2563EB',fontSize:14,textDecoration:'none',transition:'background 0.15s'}}
                        onMouseEnter={e=>e.currentTarget.style.background='#EFF6FF'}
                        onMouseLeave={e=>e.currentTarget.style.background='#fff'}
                      >
                        <Shield size={15}/> Admin Panel
                      </Link>
                    )}
                    <div style={{height:1,background:'#F1F5F9',margin:'4px 0'}}/>
                    <button onClick={handleLogout}
                      style={{width:'100%',display:'flex',alignItems:'center',gap:10,
                        padding:'12px 16px',color:'#EF4444',fontSize:14,
                        background:'none',border:'none',cursor:'pointer',transition:'background 0.15s'}}
                      onMouseEnter={e=>e.currentTarget.style.background='#FFF5F5'}
                      onMouseLeave={e=>e.currentTarget.style.background='#fff'}
                    >
                      <LogOut size={15}/> Logout
                    </button>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{padding:'9px 18px',fontSize:14}}>Login</Link>
              <Link to="/register" className="btn-primary" style={{padding:'9px 18px',fontSize:14}}>Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={()=>setMenuOpen(p=>!p)}
          style={{display:'none',padding:8,background:'none',border:'none',cursor:'pointer'}}
          className="nav-mobile-btn"
        >
          {menuOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
          exit={{opacity:0,height:0}} transition={{duration:0.2}}
          style={{background:'#fff',borderTop:'1px solid #E2E8F0',overflow:'hidden'}}
        >
          <div style={{padding:20,display:'flex',flexDirection:'column',gap:12}}>
            {!isLanding && (
              <form onSubmit={handleSearch} style={{position:'relative'}}>
                <Search size={16} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#9CA3AF'}} />
                <input value={query} onChange={e=>setQuery(e.target.value)}
                  placeholder="Search..."
                  style={{width:'100%',padding:'10px 16px 10px 40px',border:'2px solid #E2E8F0',
                    borderRadius:12,fontSize:14,background:'#F8FAFC',outline:'none'}}
                />
              </form>
            )}
            {user ? (
              <>
                <Link to="/sell" className="btn-primary" onClick={()=>setMenuOpen(false)} style={{textAlign:'center'}}>+ Sell Item</Link>
                <Link to="/activity" onClick={()=>setMenuOpen(false)} style={{padding:'10px 0',color:'#1F2937',fontSize:15}}>My Activity</Link>
                {isAdmin && <Link to="/admin" onClick={()=>setMenuOpen(false)} style={{padding:'10px 0',color:'#2563EB',fontSize:15}}>Admin Panel</Link>}
                <button onClick={()=>{handleLogout();setMenuOpen(false)}} style={{textAlign:'left',padding:'10px 0',color:'#EF4444',fontSize:15,background:'none',border:'none',cursor:'pointer'}}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary" onClick={()=>setMenuOpen(false)} style={{textAlign:'center'}}>Login</Link>
                <Link to="/register" className="btn-primary" onClick={()=>setMenuOpen(false)} style={{textAlign:'center'}}>Register</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <style>{`
        @media (max-width:768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
