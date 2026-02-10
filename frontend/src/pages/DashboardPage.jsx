import React, { useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ItemCard from '../components/ItemCard';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { mockItems } from '../data/mockData';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    approval: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const itemsPerPage = 8;
  
  // Filter and search logic
  const filteredItems = useMemo(() => {
    let result = [...mockItems];
    
    // Search filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.seller.toLowerCase().includes(searchLower)
      );
    }
    
    // Category filter
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }
    
    // Condition filter
    if (filters.condition) {
      result = result.filter(item => item.condition === filters.condition);
    }
    
    // Approval filter
    if (filters.approval === 'Approved Only') {
      result = result.filter(item => item.isApproved);
    }
    
    // Price range filter
    if (filters.minPrice) {
      result = result.filter(item => item.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(item => item.price <= parseFloat(filters.maxPrice));
    }
    
    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      default:
        break;
    }
    
    return result;
  }, [searchTerm, filters, sortBy]);
  
  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handlers
  const handleSearch = useCallback(debounce((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 300), []);
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  
  const handleClearFilters = () => {
    setFilters({
      category: '',
      condition: '',
      approval: '',
      minPrice: '',
      maxPrice: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm;
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 w-full lg:w-auto">
              <SearchBar 
                onSearch={handleSearch}
                searchTerm={searchTerm}
                onClear={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex gap-3">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Textbooks">Textbooks</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Furniture">Furniture</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <FilterPanel
                  isMobile={true}
                  isOpen={isMobileFilterOpen}
                  onToggleMobile={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
                
                <button
                  onClick={() => navigate('/post')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                >
                  Post Item
                </button>
              </div>
            </div>
          </div>
          
          {/* Results Info */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-gray-600">
              Showing {paginatedItems.length} of {filteredItems.length} items
              {hasActiveFilters && (
                <span className="ml-2">
                  (filtered from {mockItems.length} total)
                </span>
              )}
            </p>
            
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar (Desktop) */}
          <div className="hidden lg:block w-80">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Item Grid */}
            {paginatedItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedItems.map((item, index) => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      index={index}
                      isLoggedIn={true} // For demo purposes
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-8">
                <EmptyState
                  type={hasActiveFilters ? 'filters' : 'search'}
                  searchTerm={searchTerm}
                  onClearFilters={handleClearFilters}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;