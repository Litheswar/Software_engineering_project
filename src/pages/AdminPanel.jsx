import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import ModalDialog from '../components/ModalDialog'
import GoBack from '../components/GoBack'
import { MOCK_ITEMS, CATEGORIES } from '../lib/mockData'
import { CheckCircle, XCircle, Flag, Search, Users, Package, TrendingUp, AlertTriangle, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_REPORTS = [
  { id:'r1', item: MOCK_ITEMS[0], reason:'Misleading photos', reporter:'Karan L.', time:'2h ago' },
  { id:'r2', item: MOCK_ITEMS[2], reason:'Price too high / scam suspected', reporter:'Anjali S.', time:'1d ago' },
]

const MOCK_USERS = [
  { id:'u1', name:'Arjun M.', email:'arjun@nit.ac.in', college:'NIT Trichy', listings:12, trust:4.8, status:'active' },
  { id:'u2', name:'Priya K.', email:'priya@iit.ac.in', college:'IIT Madras', listings:5, trust:4.5, status:'active' },
  { id:'u3', name:'Dev P.', email:'dev@bits.ac.in', college:'BITS Pilani', listings:6, trust:4.7, status:'active' },
  { id:'u4', name:'Anjali R.', email:'anjali@manipal.ac.in', college:'Manipal', listings:2, trust:3.2, status:'flagged' },
]

const ADMIN_TABS = [
  { id:'listings', label:'All Listings', icon:<Package size={16}/> },
  { id:'reports',  label:'Reports', icon:<Flag size={16}/> },
  { id:'users',    label:'Users', icon:<Users size={16}/> },
]

export default function AdminPanel() {
  const [tab, setTab] = useState('listings')
  const [items, setItems]     = useState(MOCK_ITEMS)
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [users,   setUsers]   = useState(MOCK_USERS)
  const [search, setSearch]   = useState('')
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')

  const stats = [
    { label:'Total Users', value: users.length, color:'#10B981', icon:<Users size={20}/> },
    { label:'Total Listings', value: items.length, color:'#2563EB', icon:<TrendingUp size={20}/> },
    { label:'Reports Pending', value: reports.length, color:'#EF4444', icon:<Flag size={20}/> },
    { label:'Pending Review', value: items.filter(i=>i.status==='pending').length, color:'#F59E0B', icon:<Package size={20}/> },
  ]

  function approve(id) {
    setItems(p => p.map(i => i.id === id ? {...i, status:'approved'} : i))
    toast.success('Item approved and now live in marketplace!')
  }

  function reject(id) {
    setRejectModal(id)
  }

  function confirmReject() {
    setItems(p => p.filter(i => i.id !== rejectModal))
    toast.error('Item rejected.')
    setRejectModal(null)
    setRejectReason('')
  }

  function resolveReport(rid) {
    setReports(p => p.filter(r => r.id !== rid))
    toast.success('Report resolved.')
  }

  function removeReportedItem(rid) {
    setReports(p => p.filter(r => r.id !== rid))
    toast.success('Item removed from marketplace.')
  }

  function toggleUserStatus(uid) {
    setUsers(p => p.map(u => u.id===uid ? {...u, status:u.status==='active'?'suspended':'active'} : u))
    toast.success('User status updated.')
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const filteredListings = items.filter(i => {
    if (filterStatus !== 'All' && filterStatus.toLowerCase() !== i.status) return false
    if (filterCategory !== 'All' && filterCategory !== i.category) return false
    return true
  })

  return (
    <PageWrapper>
      <Navbar />
      <div style={{maxWidth:1200,margin:'0 auto',padding:'24px 24px 60px'}}>
        <GoBack />
        {/* Header */}
        <div style={{marginBottom:28}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <div style={{background:'linear-gradient(135deg,#2563EB,#1D4ED8)',width:38,height:38,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <AlertTriangle size={20} color="#fff"/>
            </div>
            <h1 style={{fontSize:24,fontWeight:800,color:'#1F2937',margin:0}}>Admin Moderation Panel</h1>
          </div>
          <p style={{color:'#6B7280',fontSize:14}}>Manage listings, reports, and users across EECShop</p>
        </div>

        {/* Stats cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16,marginBottom:28}}>
          {stats.map(s => (
            <div key={s.label} style={{background:'#fff',borderRadius:16,padding:'18px 20px',border:'1px solid #F1F5F9',boxShadow:'0 4px 12px rgba(0,0,0,0.06)',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:`${s.color}18`,display:'flex',alignItems:'center',justifyContent:'center',color:s.color}}>
                {s.icon}
              </div>
              <div>
                <span style={{fontSize:26,fontWeight:800,color:'#1F2937',display:'block'}}>{s.value}</span>
                <span style={{fontSize:13,color:'#6B7280'}}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,borderBottom:'2px solid #E2E8F0',marginBottom:24,overflowX:'auto'}}>
          {ADMIN_TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              display:'flex',alignItems:'center',gap:7,padding:'10px 20px',border:'none',cursor:'pointer',
              background:'transparent',fontSize:14,fontWeight:tab===t.id?700:500,
              color:tab===t.id?'#2563EB':'#6B7280',
              borderBottom:`3px solid ${tab===t.id?'#2563EB':'transparent'}`,
              marginBottom:-2,transition:'all 0.2s',whiteSpace:'nowrap',
            }}>{t.icon} {t.label}
              {t.id==='listings' && items.filter(i=>i.status==='pending').length>0 && (
                <span style={{background:'#F59E0B',color:'#fff',borderRadius:999,fontSize:11,fontWeight:700,padding:'1px 7px'}}>{items.filter(i=>i.status==='pending').length}</span>
              )}
              {t.id==='reports' && reports.length>0 && (
                <span style={{background:'#EF4444',color:'#fff',borderRadius:999,fontSize:11,fontWeight:700,padding:'1px 7px'}}>{reports.length}</span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ---- LISTINGS ITEMS ---- */}
          {tab === 'listings' && (
            <motion.div key="listings" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.2}}>
              
              <div style={{display:'flex',gap:16,marginBottom:20,flexWrap:'wrap'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <Filter size={16} color="#6B7280"/>
                  <span style={{fontSize:14,fontWeight:600,color:'#374151'}}>Filter by Status:</span>
                  <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="input-field" style={{padding:'6px 12px',minWidth:120}}>
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:14,fontWeight:600,color:'#374151'}}>Category:</span>
                  <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)} className="input-field" style={{padding:'6px 12px',minWidth:140}}>
                    <option value="All">All Categories</option>
                    {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {filteredListings.length === 0 ? (
                <div style={{textAlign:'center',padding:'60px 0',background:'#fff',borderRadius:20,border:'1px solid #F1F5F9'}}>
                  <CheckCircle size={48} color="#10B981" style={{margin:'0 auto 14px'}}/>
                  <h3 style={{fontSize:18,fontWeight:700,color:'#1F2937'}}>All clear!</h3>
                  <p style={{color:'#6B7280'}}>No listings found.</p>
                </div>
              ) : filteredListings.map(item => (
                <motion.div key={item.id}
                  layout
                  exit={{opacity:0,scale:0.95,height:0}}
                  style={{
                    display:'flex',alignItems:'center',gap:16,padding:16,
                    background:'#fff',borderRadius:16,marginBottom:12,
                    border:'2px solid #FEF3C7',boxShadow:'0 4px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  <img src={item.images?.[0]} alt="" style={{width:80,height:80,borderRadius:12,objectFit:'cover',flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                      <span style={{
                        background:item.status==='approved'?'#DCFCE7':item.status==='sold'?'#F3F4F6':'#FEF3C7',
                        color:item.status==='approved'?'#15803D':item.status==='sold'?'#6B7280':'#92400E',
                        padding:'2px 8px',borderRadius:999,fontSize:11,fontWeight:700,textTransform:'capitalize'
                      }}>
                        {item.status==='pending'?'⏳ ':''}{item.status}
                      </span>
                      <span style={{background:'#F3F4F6',color:'#6B7280',padding:'2px 8px',borderRadius:999,fontSize:11,fontWeight:600}}>{item.category}</span>
                    </div>
                    <p style={{fontWeight:700,fontSize:15,margin:'0 0 2px',color:'#1F2937'}}>{item.title}</p>
                    <p style={{color:'#6B7280',fontSize:13,margin:'0 0 4px'}}>₹{item.price?.toLocaleString('en-IN')} · {item.condition} · by {item.seller_name} · {item.college}</p>
                    <p style={{color:'#374151',fontSize:13,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:380}}>{item.description}</p>
                  </div>
                  <div style={{display:'flex',gap:8,flexShrink:0}}>
                    {item.status === 'pending' && (
                      <motion.button onClick={()=>approve(item.id)} className="btn-success"
                        whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                        style={{padding:'9px 18px',fontSize:14}}
                      >
                        <CheckCircle size={15}/> Approve
                      </motion.button>
                    )}
                    <motion.button onClick={()=>reject(item.id)} className="btn-danger"
                      whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                      style={{padding:'9px 18px',fontSize:14}}
                    >
                      <XCircle size={15}/> {item.status==='pending'?'Reject':'Remove'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ---- REPORTS ---- */}
          {tab === 'reports' && (
            <motion.div key="reports" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.2}}>
              {reports.length === 0 ? (
                <div style={{textAlign:'center',padding:'60px 0',background:'#fff',borderRadius:20,border:'1px solid #F1F5F9'}}>
                  <Flag size={48} color="#D1D5DB" style={{margin:'0 auto 14px'}}/>
                  <h3 style={{color:'#6B7280',fontWeight:600}}>No open reports</h3>
                </div>
              ) : reports.map(r => (
                <div key={r.id} style={{padding:20,background:'#fff',borderRadius:16,marginBottom:12,border:'2px solid #FEE2E2',boxShadow:'0 4px 12px rgba(0,0,0,0.06)'}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
                    <img src={r.item.images?.[0]} alt="" style={{width:70,height:70,borderRadius:12,objectFit:'cover',flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <p style={{fontWeight:700,fontSize:15,margin:'0 0 4px',color:'#1F2937'}}>{r.item.title}</p>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                        <span style={{background:'#FEE2E2',color:'#B91C1C',padding:'2px 8px',borderRadius:999,fontSize:11,fontWeight:700}}>⚠️ {r.reason}</span>
                      </div>
                      <p style={{color:'#6B7280',fontSize:13,margin:0}}>Reported by <strong>{r.reporter}</strong> · {r.time}</p>
                    </div>
                    <div style={{display:'flex',gap:8,flexShrink:0,flexWrap:'wrap'}}>
                      <button onClick={()=>resolveReport(r.id)} className="btn-success" style={{padding:'8px 14px',fontSize:13}}>
                        <CheckCircle size={13}/> Dismiss
                      </button>
                      <button onClick={()=>removeReportedItem(r.id)} className="btn-danger" style={{padding:'8px 14px',fontSize:13}}>
                        <XCircle size={13}/> Remove Item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ---- USERS ---- */}
          {tab === 'users' && (
            <motion.div key="users" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:0.2}}>
              <div style={{position:'relative',marginBottom:20}}>
                <Search size={17} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#9CA3AF'}}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..."
                  className="input-field" style={{paddingLeft:44}}/>
              </div>
              <div style={{background:'#fff',borderRadius:20,overflow:'hidden',border:'1px solid #F1F5F9',boxShadow:'0 4px 16px rgba(0,0,0,0.07)'}}>
                <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr',gap:0,padding:'12px 20px',background:'#F8FAFC',borderBottom:'1px solid #E2E8F0'}}>
                  {['Name','College','Listings','Trust','Action'].map(h=>(
                    <span key={h} style={{fontSize:12,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</span>
                  ))}
                </div>
                {filteredUsers.map(u => (
                  <div key={u.id} style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr',gap:0,padding:'14px 20px',borderBottom:'1px solid #F8FAFC',alignItems:'center',transition:'background 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                    onMouseLeave={e=>e.currentTarget.style.background='#fff'}
                  >
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:34,height:34,borderRadius:'50%',background:u.status==='flagged'?'linear-gradient(135deg,#EF4444,#DC2626)':'linear-gradient(135deg,#2563EB,#1D4ED8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'#fff',fontWeight:700,flexShrink:0}}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{fontWeight:600,fontSize:14,margin:0}}>{u.name}</p>
                        <p style={{fontSize:12,color:'#9CA3AF',margin:0}}>{u.email}</p>
                      </div>
                    </div>
                    <span style={{fontSize:14,color:'#374151'}}>{u.college}</span>
                    <span style={{fontSize:14,color:'#374151',textAlign:'center'}}>{u.listings}</span>
                    <div style={{display:'flex',alignItems:'center',gap:4}}>
                      <span style={{fontSize:14,fontWeight:600,color:'#F59E0B'}}>★</span>
                      <span style={{fontSize:14}}>{u.trust}</span>
                    </div>
                    <div style={{display:'flex',gap:6,alignItems:'center'}}>
                      <span style={{
                        padding:'3px 8px',borderRadius:999,fontSize:11,fontWeight:700,
                        background:u.status==='active'?'#DCFCE7':u.status==='suspended'?'#FEE2E2':'#FEF3C7',
                        color:u.status==='active'?'#15803D':u.status==='suspended'?'#B91C1C':'#92400E',
                      }}>{u.status}</span>
                      <button onClick={()=>toggleUserStatus(u.id)} style={{
                        padding:'4px 10px',borderRadius:8,border:'1px solid #E2E8F0',
                        background:'#fff',fontSize:12,cursor:'pointer',color:'#374151',
                        transition:'all 0.15s',
                      }}
                        onMouseEnter={e=>{e.currentTarget.style.background='#F3F4F6'}}
                        onMouseLeave={e=>{e.currentTarget.style.background='#fff'}}
                      >
                        {u.status==='active'?'Suspend':'Restore'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reject modal */}
      <ModalDialog isOpen={!!rejectModal} onClose={()=>setRejectModal(null)} title="Reject This Listing">
        <p style={{color:'#6B7280',fontSize:14,marginBottom:14}}>Provide a reason for rejection (optional):</p>
        <select value={rejectReason} onChange={e=>setRejectReason(e.target.value)} className="input-field" style={{marginBottom:16}}>
          <option value="">Select reason...</option>
          <option value="prohibited">Prohibited item</option>
          <option value="misleading">Misleading information</option>
          <option value="low_quality">Low quality images</option>
          <option value="duplicate">Duplicate listing</option>
          <option value="other">Other</option>
        </select>
        <div style={{display:'flex',gap:10}}>
          <button className="btn-secondary" onClick={()=>setRejectModal(null)} style={{flex:1,justifyContent:'center'}}>Cancel</button>
          <button className="btn-danger" onClick={confirmReject} style={{flex:1,justifyContent:'center'}}><XCircle size={15}/> Reject Listing</button>
        </div>
      </ModalDialog>
    </PageWrapper>
  )
}
