import React from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaTag } from 'react-icons/fa';
import { categoryPriceRanges } from '../data/postItemData';

const PriceGuide = ({ category, price, onPriceSuggestion }) => {
  const priceRange = categoryPriceRanges[category] || categoryPriceRanges.Textbooks;
  
  // Determine if price is good
  const isGoodPrice = price > 0 && price < priceRange.average;
  const isHighPrice = price > priceRange.average * 1.5;
  
  const getPriceStatus = () => {
    if (price <= 0) return { status: 'neutral', text: 'Enter a price to see insights' };
    if (isGoodPrice) return { status: 'good', text: 'Good Price!', color: 'text-green-600' };
    if (isHighPrice) return { status: 'high', text: 'Price seems high', color: 'text-orange-600' };
    return { status: 'average', text: 'Average Price', color: 'text-blue-600' };
  };
  
  const priceStatus = getPriceStatus();

  return (
    <motion.div
      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="flex items-center mb-3">
        <FaInfoCircle className="text-blue-500 mr-2" />
        <h3 className="font-semibold text-gray-800">Price Insights</h3>
      </div>
      
      <div className="space-y-3">
        {/* Price Status */}
        {price > 0 && (
          <div className={`flex items-center p-2 rounded ${
            priceStatus.status === 'good' ? 'bg-green-100' :
            priceStatus.status === 'high' ? 'bg-orange-100' : 'bg-blue-100'
          }`}>
            <FaTag className={`mr-2 ${
              priceStatus.status === 'good' ? 'text-green-600' :
              priceStatus.status === 'high' ? 'text-orange-600' : 'text-blue-600'
            }`} />
            <span className={`font-medium ${priceStatus.color}`}>
              {priceStatus.text}
            </span>
          </div>
        )}
        
        {/* Price Ranges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white p-2 rounded border">
            <div className="text-xs text-gray-500 mb-1">Low Range</div>
            <div className="font-semibold text-green-600">₹{priceRange.low}</div>
          </div>
          <div className="bg-white p-2 rounded border">
            <div className="text-xs text-gray-500 mb-1">Average</div>
            <div className="font-semibold text-blue-600">₹{priceRange.average}</div>
          </div>
          <div className="bg-white p-2 rounded border">
            <div className="text-xs text-gray-500 mb-1">High Range</div>
            <div className="font-semibold text-orange-600">₹{priceRange.high}</div>
          </div>
        </div>
        
        {/* Common Range */}
        <div className="text-center p-2 bg-white rounded border">
          <div className="text-sm text-gray-600 mb-1">Most items sell between</div>
          <div className="font-semibold text-gray-800">{priceRange.commonRange}</div>
        </div>
        
        {/* Suggestions */}
        <div className="space-y-2">
          <button
            onClick={() => onPriceSuggestion(priceRange.low + 50)}
            className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Suggest low price (₹{priceRange.low + 50})
          </button>
          <button
            onClick={() => onPriceSuggestion(priceRange.average)}
            className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Suggest average price (₹{priceRange.average})
          </button>
          <button
            onClick={() => onPriceSuggestion(priceRange.average + 200)}
            className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Suggest high price (₹{priceRange.average + 200})
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceGuide;