import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import ItemCard from '../components/ItemCard'
import FilterPanel from '../components/FilterPanel'
import SkeletonCard from '../components/SkeletonCard'
import PageWrapper from '../components/PageWrapper'
import GoBack from '../components/GoBack'
import { MOCK_ITEMS, CATEGORIES } from '../lib/mockData'
import { Package, TrendingUp, Search as SearchIcon, Eye, Tag, History } from 'lucide-react'

const ITEMS_PER_PAGE = 6

function EmptyState({ message }) {
  return (
    <div style={{gridColumn:'1/-1',textAlign:'center',padding:'80px 20px'}}>
      <div style={{fontSize:64,marginBottom:16}}>🔍</div>
      <h3 style={{fontSize:20,fontWeight:700,color:'#1F2937',marginBottom:8}}>No items found</h3>
      <p style={{color:'#6B7280',fontSize:15,marginBottom:24}}>{message || 'We could not find anything matching your criteria.'}</p>
      <div style={{display:'flex',gap:12,justifyContent:'center'}}>
        <button onClick={()=>window.location.reload()} className="btn-secondary">Clear Filters</button>
        <button onClick={()=>window.location.href='/sell'} className="btn-primary">Post an Item</button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading]   = useState(true)
  const [items, setItems]       = useState([])
  const [search, setSearch]     = useState(searchParams.get('q') || '')
  const [filters, setFilters]   = useState({ category:'', condition:'', minPrice:'', maxPrice:'', sort:'newest' })
  const [page, setPage]         = useState(1)
  const [recentViewed, setRecentViewed] = useState([])

  useEffect(() => {
    // Load recently viewed roughly assuming it's an array of item IDs in local storage
    try {
      const stored = JSON.parse(localStorage.getItem('recent_views') || '[]')
      setRecentViewed(MOCK_ITEMS.filter(i => stored.includes(i.id)))
    } catch(e) {}
    // Simulate API load
    const t = setTimeout(() => {
      setItems(MOCK_ITEMS.filter(i => i.status === 'approved' || i.status === 'sold'))
      setLoading(false)
    }, 1000)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    let arr = [...items]
    if (search) arr = arr.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()))
    if (filters.category) arr = arr.filter(i => i.category === filters.category)
    if (filters.condition) arr = arr.filter(i => i.condition === filters.condition)
    if (filters.minPrice) arr = arr.filter(i => i.price >= Number(filters.minPrice))
    if (filters.maxPrice) arr = arr.filter(i => i.price <= Number(filters.maxPrice))
    switch (filters.sort) {
      case 'price_asc':  arr.sort((a,b) => a.price - b.price); break
      case 'price_desc': arr.sort((a,b) => b.price - a.price); break
      case 'trust':      arr.sort((a,b) => b.seller_trust - a.seller_trust); break
      default:           arr.sort((a,b) => new Date(b.posted_date) - new Date(a.posted_date))
    }
    return arr
  }, [items, search, filters])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const pageItems  = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE)

  function handleSearch(q) {
    setSearch(q)
    setPage(1)
  }

  return (
    <PageWrapper>
      <Navbar onSearch={handleSearch} />

      <div style={{maxWidth:1280,margin:'0 auto',padding:'24px 24px 60px'}}>
        <GoBack />

        {!search && !filters.category && (
          <div style={{marginBottom:32}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
              <TrendingUp size={20} color="#F59E0B"/>
              <h2 style={{fontSize:20,fontWeight:800,color:'#1F2937'}}>Trending Today</h2>
            </div>
            <div style={{display:'flex',gap:16,overflowX:'auto',paddingBottom:12,scrollbarWidth:'none'}}>
              {MOCK_ITEMS.slice(4,8).map(item => (
                <div key={item.id} onClick={()=>navigate(`/item/${item.id}`)} style={{minWidth:280,background:'#fff',borderRadius:12,border:'1px solid #E2E8F0',padding:12,display:'flex',gap:12,cursor:'pointer',boxShadow:'0 4px 6px rgba(0,0,0,0.02)'}}>
                  <img src={item.images[0]} style={{width:60,height:60,borderRadius:8,objectFit:'cover'}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <h4 style={{fontSize:14,fontWeight:600,margin:'0 0 4px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.title}</h4>
                    <span style={{fontSize:15,fontWeight:700,color:'#2563EB'}}>₹{item.price}</span>
                    <div style={{display:'flex',gap:10,marginTop:4}}>
                      <span style={{fontSize:11,color:'#6B7280',display:'flex',alignItems:'center',gap:3}}><Eye size={12}/> {item.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!search && !filters.category && (
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:800,color:'#1F2937',marginBottom:16}}>Category Explorer</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:12}}>
              {CATEGORIES.slice(1,7).map(c => (
                <button key={c} onClick={()=>{setFilters(p=>({...p,category:c}));setPage(1)}} style={{background:'#fff',border:'1px solid #E2E8F0',borderRadius:12,padding:'16px 12px',textAlign:'center',cursor:'pointer',transition:'all 0.2s',boxShadow:'0 2px 4px rgba(0,0,0,0.02)'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='#2563EB';e.currentTarget.style.transform='translateY(-2px)'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='#E2E8F0';e.currentTarget.style.transform='translateY(0)'}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'#EFF6FF',color:'#2563EB',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}}><Tag size={18}/></div>
                  <span style={{fontSize:13,fontWeight:600,color:'#374151'}}>{c}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {recentViewed.length > 0 && !search && !filters.category && (
          <div style={{marginBottom:32}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
              <History size={20} color="#6B7280"/>
              <h2 style={{fontSize:20,fontWeight:800,color:'#1F2937'}}>Recently Viewed</h2>
            </div>
            <div style={{display:'flex',gap:16,overflowX:'auto',paddingBottom:12}}>
              {recentViewed.map(item => (
                <div key={item.id} style={{minWidth:220}}><ItemCard item={item} /></div>
              ))}
            </div>
          </div>
        )}

        {/* Header row */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
          <div>
            <h1 style={{fontSize:24,fontWeight:800,color:'#1F2937',marginBottom:4}}>
              Marketplace {search && <span style={{color:'#2563EB'}}>"{search}"</span>}
            </h1>
            <p style={{color:'#6B7280',fontSize:14}}>
              {loading ? 'Loading items...' : `${filtered.length} item${filtered.length!==1?'s':''} found`}
            </p>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            {/* Quick stats */}
            <div style={{display:'flex',gap:8}}>
              {[{icon:<Package size={16}/>,label:`${items.filter(i=>i.status==='approved').length} Active`},{icon:<TrendingUp size={16}/>,label:'Trending'}].map(s=>(
                <div key={s.label} style={{display:'flex',alignItems:'center',gap:6,padding:'6px 12px',background:'#fff',borderRadius:10,border:'1px solid #E2E8F0',fontSize:13,color:'#374151',fontWeight:500}}>
                  {s.icon} {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{display:'flex',gap:24,alignItems:'flex-start'}}>
          {/* Sidebar filters */}
          <FilterPanel filters={filters} onChange={f => { setFilters(f); setPage(1) }} />

          {/* Main grid */}
          <div style={{flex:1}}>
            {/* Mobile filter btn appears through FilterPanel */}
            <div style={{display:'none',marginBottom:16}} className="mobile-filter-row">
              <FilterPanel filters={filters} onChange={f => { setFilters(f); setPage(1) }} />
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <div key="loading" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:20}}>
                  {Array(6).fill(0).map((_,i) => <SkeletonCard key={i}/>)}
                </div>
              ) : (
                <motion.div key="items"
                  initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:20}}
                >
                  {pageItems.length > 0
                    ? pageItems.map(item => <ItemCard key={item.id} item={item} />)
                    : <EmptyState />
                  }
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:36}}>
                <button
                  onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  style={{padding:'8px 18px',borderRadius:10,border:'2px solid #E2E8F0',background:'#fff',
                    cursor:page===1?'not-allowed':'pointer',color:page===1?'#9CA3AF':'#374151',fontWeight:600,fontSize:14}}
                >← Prev</button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                  <button key={p} onClick={()=>setPage(p)}
                    style={{width:40,height:40,borderRadius:10,border:'2px solid',
                      borderColor:p===page?'#2563EB':'#E2E8F0',
                      background:p===page?'#2563EB':'#fff',
                      color:p===page?'#fff':'#374151',fontWeight:600,fontSize:14,cursor:'pointer'}}
                  >{p}</button>
                ))}
                <button
                  onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  style={{padding:'8px 18px',borderRadius:10,border:'2px solid #E2E8F0',background:'#fff',
                    cursor:page===totalPages?'not-allowed':'pointer',color:page===totalPages?'#9CA3AF':'#374151',fontWeight:600,fontSize:14}}
                >Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
