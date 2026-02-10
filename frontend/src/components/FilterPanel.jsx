import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTimes } from 'react-icons/fa';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  isMobile = false,
  isOpen = false,
  onToggleMobile 
}) => {
  const categories = ['All', 'Textbooks', 'Electronics', 'Clothing', 'Furniture'];
  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];
  
  const filterSections = [
    {
      title: 'Category',
      key: 'category',
      options: categories
    },
    {
      title: 'Condition',
      key: 'condition',
      options: conditions
    },
    {
      title: 'Approval Status',
      key: 'approval',
      options: ['All Items', 'Approved Only']
    }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange(key, value === 'All' || value === 'All Items' ? '' : value);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Filter Button */}
        <button
          onClick={onToggleMobile}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FaFilter className="mr-2" />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </button>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onToggleMobile}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    <button
                      onClick={onToggleMobile}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {filterSections.map((section) => (
                      <div key={section.key}>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          {section.title}
                        </h3>
                        <div className="space-y-2">
                          {section.options.map((option) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="radio"
                                name={section.key}
                                checked={
                                  filters[section.key] === option || 
                                  (option === 'All' && !filters[section.key]) ||
                                  (option === 'All Items' && !filters[section.key])
                                }
                                onChange={() => handleFilterChange(section.key, option)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-3 text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Min (₹)</label>
                          <input
                            type="number"
                            value={filters.minPrice || ''}
                            onChange={(e) => onFilterChange('minPrice', e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Max (₹)</label>
                          <input
                            type="number"
                            value={filters.maxPrice || ''}
                            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                            placeholder="Any"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={onClearFilters}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Filter Panel
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow p-6 sticky top-6 h-fit"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {filterSections.map((section) => (
          <div key={section.key}>
            <h3 className="font-semibold text-gray-900 mb-3">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.options.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name={section.key}
                    checked={
                      filters[section.key] === option || 
                      (option === 'All' && !filters[section.key]) ||
                      (option === 'All Items' && !filters[section.key])
                    }
                    onChange={() => handleFilterChange(section.key, option)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Minimum Price (₹)</label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Maximum Price (₹)</label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                placeholder="No limit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;