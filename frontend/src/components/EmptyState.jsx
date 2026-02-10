import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter } from 'react-icons/fa';

const EmptyState = ({ 
  type = 'search', 
  searchTerm = '', 
  onClearFilters,
  title,
  description,
  actionButton
}) => {
  const emptyStates = {
    search: {
      title: searchTerm 
        ? `No items found for "${searchTerm}"` 
        : "No items match your search",
      description: "Try adjusting your search terms or browse all items",
      icon: <FaSearch className="text-5xl text-gray-300 mb-4" />
    },
    filters: {
      title: "No items match your filters",
      description: "Try adjusting your filters or clear them to see more items",
      icon: <FaFilter className="text-5xl text-gray-300 mb-4" />
    },
    wishlist: {
      title: "Your wishlist is empty",
      description: "Start adding items you're interested in by clicking the heart icon",
      icon: <div className="text-5xl text-gray-300 mb-4">🤍</div>
    },
    category: {
      title: "No items in this category",
      description: "Check back later or browse other categories",
      icon: <div className="text-5xl text-gray-300 mb-4">📦</div>
    }
  };

  const currentState = emptyStates[type] || emptyStates.search;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="text-center py-16"
    >
      {currentState.icon}
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {title || currentState.title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description || currentState.description}
      </p>
      
      {type === 'filters' && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Clear All Filters
        </button>
      )}
      
      {actionButton && (
        <div className="mt-4">
          {actionButton}
        </div>
      )}
      
      {/* Helpful Tips */}
      {type === 'search' && (
        <div className="mt-8 max-w-md mx-auto">
          <h4 className="font-medium text-gray-700 mb-3">Search Tips:</h4>
          <div className="text-left text-sm text-gray-500 space-y-1">
            <p>• Try using broader terms like "laptop" instead of "MacBook Pro"</p>
            <p>• Search by category: "textbooks", "electronics", "clothing"</p>
            <p>• Check spelling or try similar keywords</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;