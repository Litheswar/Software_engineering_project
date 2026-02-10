import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaCheck, FaStar, FaComment } from 'react-icons/fa';
import useWishlistStore from '../store/wishlistStore';

const ItemCard = ({ item, index, isLoggedIn = false }) => {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  
  const isWishlisted = isInWishlist(item.id);
  
  // Calculate if it's a good deal
  const categoryAverages = {
    Textbooks: 250,
    Electronics: 15000,
    Clothing: 600,
    Furniture: 500
  };
  
  const isGoodDeal = item.price < (categoryAverages[item.category] * 0.8);
  
  // Trust score color
  const getTrustColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.ceil(diffDays / 7)} weeks ago`;
  };
  
  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(item);
  };
  
  const handleContactSeller = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert('Please login to contact sellers');
      return;
    }
    // In real app: open chat or contact modal
    alert(`Contacting ${item.seller} about ${item.title}`);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut", delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      {/* Image Placeholder */}
      <div className="relative bg-gray-100 h-48 flex items-center justify-center">
        <span className="text-5xl">{item.image}</span>
        
        {/* Admin Approved Badge */}
        {item.isApproved && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center shadow-sm">
            <FaCheck className="mr-1" size={10} />
            Approved
          </div>
        )}
        
        {/* Good Deal Badge */}
        {isGoodDeal && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            Good Deal
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold shadow-lg">
          ₹{item.price.toLocaleString()}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500" size={18} />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-red-500" size={18} />
          )}
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {item.category}
          </span>
          <span className="text-sm text-gray-500">{item.condition}</span>
        </div>
        
        {/* Trust Score */}
        <div className="flex items-center mb-4">
          <FaStar className="text-yellow-400 mr-1" />
          <span className={`text-sm font-medium ${getTrustColor(item.trustScore)}`}>
            {item.trustScore}
          </span>
          <span className="text-xs text-gray-500 ml-2">({item.seller})</span>
        </div>
        
        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Posted {formatDate(item.postedDate)}</span>
          <span>{item.views} views</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleContactSeller}
            disabled={!isLoggedIn}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
              isLoggedIn
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FaComment className="inline mr-1" />
            {isLoggedIn ? 'Contact Seller' : 'Login to Contact'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;