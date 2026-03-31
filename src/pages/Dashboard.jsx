import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import FilterPanel from '../components/FilterPanel'
import PageWrapper from '../components/PageWrapper'
import ErrorBoundary from '../components/ErrorBoundary'
import WelcomeHeader from '../components/WelcomeHeader'
import CategoryExplorer from '../components/CategoryExplorer'
import TrendingItems from '../components/TrendingItems'
import RecentlyAdded from '../components/RecentlyAdded'
import MarketplaceGrid from '../components/MarketplaceGrid'
import { useMarketplace } from '../hooks/useMarketplace'

const ITEMS_PER_PAGE = 20

export default function Dashboard() {
  const [searchParams] = useSearchParams()
  
  const {
    categories,
    trending,
    loading,
    fetchCategories,
    fetchTrending,
    fetchLatestItems,
    fetchItems
  } = useMarketplace()

  const [displayItems, setDisplayItems] = useState([])
  const [latestItems, setLatestItems] = useState([])
  const [search, setSearch]     = useState(searchParams.get('q') || '')
  const [filters, setFilters]   = useState({ category:'', condition:'', minPrice:'', maxPrice:'', sort:'newest' })
  const [page, setPage]         = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Initial data load for discovery sections
  useEffect(() => {
    fetchCategories()
    fetchTrending(6)
    fetchLatestItems(8).then(setLatestItems)
  }, [fetchCategories, fetchTrending, fetchLatestItems])

  // Fetch filtered items for the main grid
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

  const isDiscoveryView = !search && !filters.category

  return (
    <PageWrapper>
      <Navbar onSearch={q => { setSearch(q); setPage(1) }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 60px' }}>
        
        {/* Module 1: Welcome & Quick Actions */}
        <WelcomeHeader />

        {/* Module 2: Category Chips */}
        <ErrorBoundary>
          <CategoryExplorer 
            categories={categories} 
            onSelect={cat => { setFilters(p => ({ ...p, category: cat })); setPage(1) }}
            activeCategory={filters.category}
          />
        </ErrorBoundary>

        {/* Discovery Sections (Only visible on "Home" view) */}
        {isDiscoveryView && (
          <>
            <ErrorBoundary>
              <TrendingItems items={trending} loading={loading.trending} />
            </ErrorBoundary>

            <ErrorBoundary>
              <RecentlyAdded items={latestItems} loading={loading.items} />
            </ErrorBoundary>
          </>
        )}

        {/* Main Marketplace Section */}
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            {/* Sidebar Filters */}
            <aside style={{ width: 260, position: 'sticky', top: 100 }} className="nav-desktop">
              <FilterPanel 
                categories={categories.map(c => c.name)} 
                filters={filters} 
                onChange={f => { setFilters(f); setPage(1) }} 
              />
            </aside>

            {/* Main Grid */}
            <div style={{ flex: 1 }}>
              <ErrorBoundary>
                <MarketplaceGrid 
                  items={displayItems} 
                  loading={loading.items} 
                  totalCount={totalCount} 
                  onClearFilters={clearFilters}
                />
              </ErrorBoundary>

              {/* Pagination */}
              {!loading.items && totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    disabled={page === 1}
                    style={{
                      padding: '10px 20px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff',
                      cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#94A3B8' : '#1E293B', 
                      fontWeight: 700, fontSize: 14, transition: 'all 0.2s'
                    }}
                  >Previous</button>
                  
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let p = i + 1
                      if (totalPages > 5 && page > 3) p = page - 2 + i
                      if (p > totalPages) return null
                      return (
                        <button 
                          key={p} 
                          onClick={() => setPage(p)}
                          style={{
                            width: 40, height: 40, borderRadius: 12, border: 'none',
                            background: p === page ? '#2563EB' : '#fff',
                            color: p === page ? '#fff' : '#64748B', 
                            fontWeight: 700, fontSize: 14, cursor: 'pointer',
                            boxShadow: p === page ? '0 4px 10px rgba(37,99,235,0.2)' : 'none'
                          }}
                        >{p}</button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                    disabled={page === totalPages}
                    style={{
                      padding: '10px 20px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#fff',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#94A3B8' : '#1E293B', 
                      fontWeight: 700, fontSize: 14, transition: 'all 0.2s'
                    }}
                  >Next</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
