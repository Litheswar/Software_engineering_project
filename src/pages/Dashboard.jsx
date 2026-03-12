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

const ITEMS_PER_PAGE = 8

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
    fetchItems
  } = useMarketplace()

  const [displayItems, setDisplayItems] = useState([])
  const [search, setSearch]     = useState(searchParams.get('q') || '')
  const [filters, setFilters]   = useState({ category:'', condition:'', minPrice:'', maxPrice:'', sort:'newest' })
  const [page, setPage]         = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Initial data load
  useEffect(() => {
    fetchCategories()
    fetchTrending()
    fetchRecentItems()
  }, [fetchCategories, fetchTrending, fetchRecentItems])

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

        {!search && !filters.category && (
          <>
            <ErrorBoundary>
              <TrendingSection items={trending} loading={loading.trending} />
            </ErrorBoundary>

            <ErrorBoundary>
              <CategoryExplorer 
                categories={categories} 
                onSelect={cat => { setFilters(p => ({ ...p, category: cat })); setPage(1) }}
                activeCategory={filters.category}
              />
            </ErrorBoundary>

            <ErrorBoundary>
              <RecentlyViewedSection items={recentViewed} loading={loading.recent} />
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
