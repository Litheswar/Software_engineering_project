import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import FilterPanel from '../components/FilterPanel'
import PageWrapper from '../components/PageWrapper'
import GoBack from '../components/GoBack'
import ErrorBoundary from '../components/ErrorBoundary'
import TrendingSection from '../components/TrendingSection'
import RecentlyViewedSection from '../components/RecentlyViewedSection'
import CategoryExplorer from '../components/CategoryExplorer'
import MarketplaceGrid from '../components/MarketplaceGrid'
import { useMarketplace } from '../hooks/useMarketplace'

const ITEMS_PER_PAGE = 20

export default function Dashboard() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [searchParams] = useSearchParams()
  
  const {
    items,
    categories,
    recentViewed,
    trending,
    loading,
    fetchCategories,
    fetchTrending,
    fetchRecentItems,
    fetchLatestItems,
    fetchItems
  } = useMarketplace()

  const [displayItems, setDisplayItems] = useState([])
  const [search, setSearch]     = useState(searchParams.get('q') || '')
  const [filters, setFilters]   = useState({ category:'', condition:'', minPrice:'', maxPrice:'', sort:'newest' })
  const [page, setPage]         = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [latestItems, setLatestItems] = useState([])

  // Initial data load
  useEffect(() => {
    fetchCategories()
    fetchTrending()
    fetchRecentItems()
    fetchLatestItems().then(setLatestItems)
  }, [fetchCategories, fetchTrending, fetchRecentItems, fetchLatestItems])

  // Fetch filtered items
  useEffect(() => {
    async function loadItems() {
      const result = await fetchItems({
        search,
        category: filters.category,
        condition: filters.condition,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
        page,
        perPage: ITEMS_PER_PAGE
      })
      if (result) {
        setDisplayItems(result.data)
        setTotalCount(result.count)
      }
    }
    loadItems()
  }, [search, filters, page, fetchItems])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const clearFilters = () => {
    setFilters({ category:'', condition:'', minPrice:'', maxPrice:'', sort:'newest' })
    setSearch('')
    setPage(1)
  }

  return (
    <PageWrapper>
      <Navbar onSearch={q => { setSearch(q); setPage(1) }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 60px' }}>
        <GoBack />

        {/* Welcome Banner */}
        <div style={{ 
          background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', 
          borderRadius: 24, 
          padding: '40px 32px', 
          marginBottom: 32,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Welcome back, {user?.name || 'Student'}! 👋</h1>
            <p style={{ fontSize: 18, opacity: 0.9 }}>Looking for something special today? Check out the latest listings on campus.</p>
          </div>
          <div style={{ 
            position: 'absolute', right: -20, top: -20, width: 200, height: 200, 
            background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' 
          }} />
        </div>

        {!search && !filters.category && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
              <ErrorBoundary>
                <TrendingSection items={trending} loading={loading.trending} />
              </ErrorBoundary>
              
              <div style={{ background: '#F8FAFC', borderRadius: 20, padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🏃 Fresh Arrivals</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {latestItems.map(item => (
                    <div key={item.id} onClick={() => navigate(`/item/${item.id}`)} style={{ 
                      display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer',
                      padding: 8, borderRadius: 12, transition: 'background 0.2s'
                    }} className="hover:bg-white hover:shadow-sm">
                      <img src={item.image_url} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                        <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 13 }}>₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ErrorBoundary>
              <CategoryExplorer 
                categories={categories} 
                onSelect={cat => { setFilters(p => ({ ...p, category: cat })); setPage(1) }}
                activeCategory={filters.category}
              />
            </ErrorBoundary>

            <ErrorBoundary>
              <RecentlyViewedSection items={recentViewed || []} loading={loading.recent} />
            </ErrorBoundary>
          </>
        )}

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <aside style={{ width: 280, position: 'sticky', top: 100 }} className="nav-desktop">
            <FilterPanel 
              categories={categories.map(c => c.name)} 
              filters={filters} 
              onChange={f => { setFilters(f); setPage(1) }} 
            />
          </aside>

          <ErrorBoundary>
            <MarketplaceGrid 
              items={displayItems} 
              loading={loading.items} 
              totalCount={totalCount} 
              onClearFilters={clearFilters}
            />
          </ErrorBoundary>
        </div>

        {/* Pagination */}
        {!loading.items && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              style={{
                padding: '8px 18px', borderRadius: 10, border: '2px solid #E2E8F0', background: '#fff',
                cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#9CA3AF' : '#374151', fontWeight: 600, fontSize: 14
              }}
            >← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button 
                key={p} 
                onClick={() => setPage(p)}
                style={{
                  width: 40, height: 40, borderRadius: 10, border: '2px solid',
                  borderColor: p === page ? '#2563EB' : '#E2E8F0',
                  background: p === page ? '#2563EB' : '#fff',
                  color: p === page ? '#fff' : '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer'
                }}
              >{p}</button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages}
              style={{
                padding: '8px 18px', borderRadius: 10, border: '2px solid #E2E8F0', background: '#fff',
                cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#9CA3AF' : '#374151', fontWeight: 600, fontSize: 14
              }}
            >Next →</button>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
