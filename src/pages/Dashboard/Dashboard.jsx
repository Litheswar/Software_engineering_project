import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, Package } from 'lucide-react';
import { mockItems } from '../../data/mockData';
import ItemCard from '../../components/ItemCard/ItemCard';
import FilterBar from '../../components/FilterBar/FilterBar';
import Pagination from '../../components/Pagination/Pagination';

const ITEMS_PER_PAGE = 8;

const DEFAULT_FILTERS = {
  category: 'all',
  condition: 'all',
  sort: 'newest',
  maxPrice: '',
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-card">
    <div className="skeleton h-44 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="flex justify-between items-center mt-2">
        <div className="skeleton h-5 w-16 rounded" />
        <div className="skeleton h-7 w-20 rounded-lg" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Sync URL search param
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    setSearchParams({});
    setCurrentPage(1);
  };

  const handleWishlist = (id, add) => {
    setWishlist((prev) =>
      add ? [...prev, id] : prev.filter((w) => w !== id)
    );
  };

  // Filter + sort logic
  const filteredItems = useMemo(() => {
    let items = [...mockItems];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.seller.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category !== 'all') {
      items = items.filter((item) => item.category === filters.category);
    }

    // Condition
    if (filters.condition !== 'all') {
      items = items.filter((item) => item.condition === filters.condition);
    }

    // Max price
    if (filters.maxPrice) {
      items = items.filter((item) => item.price <= Number(filters.maxPrice));
    }

    // Sort
    switch (filters.sort) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'trust':
        items.sort((a, b) => b.trustScore - a.trustScore);
        break;
      default:
        items.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    }

    return items;
  }, [searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="page-container pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-h2 text-textDark">Marketplace</h1>
          <p className="text-textMuted mt-1">Discover items from your campus community</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative max-w-xl">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
            <input
              id="dashboard-search"
              type="text"
              placeholder="Search items, categories, sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-11 pr-28"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-4 text-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            filters={filters}
            onChange={handleFiltersChange}
            onReset={handleReset}
          />
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-textMuted">
            {loading ? 'Loading...' : (
              <>
                <span className="font-semibold text-textDark">{filteredItems.length}</span> items found
                {searchQuery && (
                  <> for <span className="font-semibold text-primary">"{searchQuery}"</span></>
                )}
              </>
            )}
          </p>
        </div>

        {/* Item Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package size={36} className="text-textMuted" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-textDark mb-2">No Items Found</h3>
            <p className="text-textMuted text-sm max-w-sm">
              Try adjusting your filters or search query. New items are posted daily!
            </p>
            <button
              onClick={handleReset}
              className="mt-4 btn-outline text-sm"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentPage}-${JSON.stringify(filters)}-${searchQuery}`}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {paginatedItems.map((item, i) => (
                <motion.div key={item.id} custom={i} variants={cardVariants}>
                  <ItemCard
                    item={item}
                    wishlisted={wishlist.includes(item.id)}
                    onWishlist={handleWishlist}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
