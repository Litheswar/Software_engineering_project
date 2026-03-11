import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, conditionBadgeClass, trustScoreColor, truncate } from '../../utils/helpers';
import ChatModal from '../ChatModal/ChatModal';

const ItemCard = ({ item, wishlisted = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(wishlisted);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  const toggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const openChat = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsChatOpen(true);
  };

  const handleCardClick = () => {
    navigate(`/item/${item.id}`);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        onClick={handleCardClick}
        className="bg-white rounded-2xl shadow-card hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden cursor-pointer group flex flex-col h-full"
      >
        {/* Image Section */}
        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
          <img 
            src={item.image || 'https://images.unsplash.com/photo-1512820790803-83ca734da794'} 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1512820790803-83ca734da794'; }}
            alt={item.title} 
            className="w-full h-full object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
          />

          {/* Condition Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm border ${conditionBadgeClass(item.condition)}`}>
              {item.condition}
            </span>
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-sm transition-all focus:outline-none z-10 ${
              isWishlisted ? 'bg-white text-danger' : 'bg-white/70 text-gray-500 hover:bg-white hover:text-danger'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isWishlisted ? 'filled' : 'outline'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category & Date */}
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-xs font-semibold tracking-wide text-secondary/80 uppercase">
              {item.category}
            </p>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-base text-textDark leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h3>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Seller Info */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-600">
              {item.seller.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-textDark font-medium truncate flex items-center gap-1">
                {item.seller}
                {item.trustScore > 85 && <CheckCircle size={10} className="text-primary" />}
              </p>
            </div>
            <div className={`flex items-center gap-0.5 text-xs font-bold ${trustScoreColor(item.trustScore)}`}>
              <Star size={10} className="fill-current" />
              {item.trustScore}
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between mt-4">
            <span className="font-heading font-black text-xl text-textDark">
              {formatPrice(item.price)}
            </span>
            <button
              onClick={openChat}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </motion.div>

      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        item={item} 
      />
    </>
  );
};

export default ItemCard;
