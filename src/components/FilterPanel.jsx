import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { CATEGORIES, CONDITIONS } from '../lib/mockData'

export default function FilterPanel({ filters, onChange, categories = [] }) {
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const displayCats = ['All Categories', ...categories]

  const setFilter = (key, val) => onChange({ ...filters, [key]: val })

  const content = (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      {/* Category */}
      <div>
        <p style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'#6B7280',marginBottom:10}}>Category</p>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {displayCats.map(cat => (
            <button key={cat}
              onClick={() => setFilter('category', cat === 'All Categories' ? '' : cat)}
              style={{
                display:'flex',alignItems:'center',gap:10,padding:'8px 12px',
                borderRadius:10,border:'none',cursor:'pointer',textAlign:'left',
                background: (filters.category === cat || (!filters.category && cat === 'All Categories'))
                  ? '#EFF6FF' : 'transparent',
                color: (filters.category === cat || (!filters.category && cat === 'All Categories'))
                  ? '#2563EB' : '#374151',
                fontWeight: (filters.category === cat || (!filters.category && cat === 'All Categories')) ? 600 : 400,
                fontSize: 14, transition: 'all 0.15s',
              }}
            >
              <span style={{width:8,height:8,borderRadius:'50%',flexShrink:0,
                background:(filters.category === cat || (!filters.category && cat === 'All Categories')) ? '#2563EB' : '#D1D5DB'
              }} />
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{height:1,background:'#F1F5F9'}} />

      {/* Price Range */}
      <div>
        <p style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'#6B7280',marginBottom:10}}>Price Range</p>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <input type="number" placeholder="Min"
            value={filters.minPrice || ''}
            onChange={e => setFilter('minPrice', e.target.value)}
            style={{width:'50%',padding:'8px 12px',border:'2px solid #E2E8F0',borderRadius:10,fontSize:14,
              fontFamily:'Inter,sans-serif',outline:'none',transition:'border-color 0.2s'}}
            onFocus={e=>e.target.style.borderColor='#2563EB'}
            onBlur={e=>e.target.style.borderColor='#E2E8F0'}
          />
          <span style={{color:'#9CA3AF',fontSize:12}}>to</span>
          <input type="number" placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={e => setFilter('maxPrice', e.target.value)}
            style={{width:'50%',padding:'8px 12px',border:'2px solid #E2E8F0',borderRadius:10,fontSize:14,
              fontFamily:'Inter,sans-serif',outline:'none',transition:'border-color 0.2s'}}
            onFocus={e=>e.target.style.borderColor='#2563EB'}
            onBlur={e=>e.target.style.borderColor='#E2E8F0'}
          />
        </div>
      </div>

      <div style={{height:1,background:'#F1F5F9'}} />

      {/* Condition */}
      <div>
        <p style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'#6B7280',marginBottom:10}}>Condition</p>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {CONDITIONS.map(cond => (
            <button key={cond}
              onClick={() => setFilter('condition', cond === 'Any Condition' ? '' : cond)}
              style={{
                display:'flex',alignItems:'center',gap:10,padding:'8px 12px',
                borderRadius:10,border:'none',cursor:'pointer',textAlign:'left',
                background: (filters.condition === cond || (!filters.condition && cond === 'Any Condition'))
                  ? '#EFF6FF' : 'transparent',
                color: (filters.condition === cond || (!filters.condition && cond === 'Any Condition'))
                  ? '#2563EB' : '#374151',
                fontWeight: (filters.condition === cond || (!filters.condition && cond === 'Any Condition')) ? 600 : 400,
                fontSize: 14, transition: 'all 0.15s',
              }}
            >
              <span style={{width:8,height:8,borderRadius:'50%',flexShrink:0,
                background:(filters.condition === cond || (!filters.condition && cond === 'Any Condition')) ? '#2563EB' : '#D1D5DB'
              }} />
              {cond}
            </button>
          ))}
        </div>
      </div>

      <div style={{height:1,background:'#F1F5F9'}} />

      {/* Sort */}
      <div>
        <p style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'#6B7280',marginBottom:10}}>Sort By</p>
        <select
          value={filters.sort || 'newest'}
          onChange={e => setFilter('sort', e.target.value)}
          style={{width:'100%',padding:'9px 12px',border:'2px solid #E2E8F0',borderRadius:10,
            fontSize:14,fontFamily:'Inter,sans-serif',outline:'none',background:'#F8FAFC',
            cursor:'pointer',appearance:'none',
            backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat:'no-repeat',backgroundPosition:'right 12px center',
          }}
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="trust">Seller Trust</option>
        </select>
      </div>

      {/* Reset */}
      {(filters.category || filters.condition || filters.minPrice || filters.maxPrice) && (
        <button onClick={() => onChange({ category:'', condition:'', minPrice:'', maxPrice:'', sort:'newest' })}
          style={{padding:'10px',borderRadius:10,border:'2px solid #EF4444',color:'#EF4444',
            background:'transparent',fontSize:14,fontWeight:600,cursor:'pointer',transition:'all 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='#EF4444';e.currentTarget.style.color='#fff'}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#EF4444'}}
        >
          Reset Filters
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop panel */}
      <div className="filter-desktop" style={{
        background:'#fff',borderRadius:16,padding:20,
        boxShadow:'0 4px 12px rgba(0,0,0,0.06)',
        border:'1px solid #F1F5F9',
        minWidth:220, maxWidth:240,
        position:'sticky', top:88,
      }}>
        <button onClick={()=>setOpen(p=>!p)}
          style={{display:'flex',alignItems:'center',justifyContent:'space-between',
            width:'100%',background:'none',border:'none',cursor:'pointer',marginBottom:open?16:0}}>
          <span style={{display:'flex',alignItems:'center',gap:8,fontWeight:700,fontSize:15,color:'#1F2937'}}>
            <Filter size={16} color="#2563EB"/> Filters
          </span>
          {open ? <ChevronUp size={16} color="#6B7280"/> : <ChevronDown size={16} color="#6B7280"/>}
        </button>
        <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.2}}>
            {content}
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Mobile filter button */}
      <button
        className="filter-mobile-btn"
        onClick={()=>setMobileOpen(true)}
        style={{
          display:'none',alignItems:'center',gap:8,
          padding:'10px 16px',background:'#fff',
          border:'2px solid #E2E8F0',borderRadius:12,
          fontSize:14,fontWeight:600,cursor:'pointer',
        }}
      >
        <SlidersHorizontal size={16}/> Filters
      </button>

      {/* Mobile filter drawer */}
      <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setMobileOpen(false)}
            style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200}}
          />
          <motion.div
            initial={{x:'-100%'}} animate={{x:0}} exit={{x:'-100%'}}
            transition={{type:'tween',duration:0.25}}
            style={{position:'fixed',top:0,left:0,height:'100%',width:300,
              background:'#fff',zIndex:300,overflowY:'auto',padding:24,
            }}
          >
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
              <span style={{fontWeight:700,fontSize:18}}>Filters</span>
              <button onClick={()=>setMobileOpen(false)} style={{background:'none',border:'none',cursor:'pointer',fontSize:24,color:'#6B7280'}}>✕</button>
            </div>
            {content}
            <button onClick={()=>setMobileOpen(false)} className="btn-primary" style={{width:'100%',marginTop:20,justifyContent:'center'}}>Apply Filters</button>
          </motion.div>
        </>
      )}
      </AnimatePresence>

      <style>{`
        @media (max-width:768px) {
          .filter-desktop { display: none !important; }
          .filter-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
