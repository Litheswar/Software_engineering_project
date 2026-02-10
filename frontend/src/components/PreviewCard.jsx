import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaStar } from 'react-icons/fa';

const PreviewCard = ({ formData, images }) => {
  const { title, category, condition, price, description } = formData;
  
  // Get first image preview or placeholder
  const imagePreview = images.length > 0 
    ? images[0].preview 
    : 'https://placehold.co/400x300?text=No+Image';

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={imagePreview}
          alt="Item preview"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x300?text=No+Image';
          }}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Pending Approval
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold">
          ₹{price || 0}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {title || "Item Title"}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {category || "Category"}
          </span>
          <span className="text-sm text-gray-500">{condition || "Condition"}</span>
        </div>
        
        {/* Trust Score Placeholder */}
        <div className="flex items-center mb-3">
          <FaStar className="text-yellow-400 mr-1" />
          <span className="text-sm font-medium text-gray-700">4.8</span>
          <span className="text-xs text-gray-500 ml-1">(You)</span>
        </div>
        
        {/* Description Preview */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description || "Item description will appear here..."}
        </p>
        
        {/* Action Buttons Preview */}
        <div className="flex gap-2">
          <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed">
            Contact Seller
          </button>
          <button className="p-2 bg-gray-100 text-gray-500 rounded-lg">
            <FaStar />
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Just now</span>
          <div className="flex items-center">
            <FaCheck className="text-green-500 mr-1" size={12} />
            <span>Admin Review Pending</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewCard;