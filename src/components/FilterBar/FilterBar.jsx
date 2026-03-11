import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { mockCategories, mockConditions } from '../../data/mockData';

const FilterBar = ({ filters, onChange, onReset }) => {
  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.condition !== 'all' ||
    filters.sort !== 'newest' ||
    filters.maxPrice;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Header */}
        <div className="flex items-center gap-2 text-textMuted mr-1">
          <SlidersHorizontal size={16} />
          <span className="text-sm font-medium">Filters</span>
        </div>

        {/* Category */}
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        >
          {mockCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Condition */}
        <select
          id="filter-condition"
          value={filters.condition}
          onChange={(e) => onChange({ ...filters, condition: e.target.value })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        >
          <option value="all">All Conditions</option>
          {mockConditions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Max Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-textMuted">Max ₹</span>
          <input
            id="filter-max-price"
            type="number"
            placeholder="Any"
            value={filters.maxPrice}
            min={0}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: e.target.value })
            }
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all w-24"
          />
        </div>

        {/* Sort */}
        <select
          id="filter-sort"
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="trust">Highest Rated Seller</option>
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onReset}
            className="flex items-center gap-1.5 text-sm text-danger border border-danger/30 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-2 transition-all"
          >
            <X size={14} />
            Reset
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
