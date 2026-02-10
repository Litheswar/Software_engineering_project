import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaTag, FaBell } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useWishlistStore from '../store/wishlistStore';

const WishlistTab = () => {
  const { wishlist, removeFromWishlist } = useWishlistStore();

  // Mock price drop detection
  const getPriceDropStatus = (item) => {
    // Randomly show price drop for demo
    const hasDrop = Math.random() > 0.7;
    if (hasDrop) {
      const dropAmount = Math.floor(Math.random() * 200) + 50;
      return {
        dropped: true,
        originalPrice: item.price + dropAmount,
        dropAmount: dropAmount
      };
    }
    return { dropped: false };
  };

  const handleRemoveItem = (itemId) => {
    removeFromWishlist(itemId);
    toast.success('Item removed from wishlist!');
  };

  if (wishlist.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-4">🤍</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-600 mb-6">Start adding items you're interested in</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Browse Items
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
      >
        <h3 className="font-semibold text-gray-800">Wishlist ({wishlist.length} items)</h3>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item, index) => {
          const priceDrop = getPriceDropStatus(item);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Price Drop Badge */}
                {priceDrop.dropped && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                    <FaBell className="inline mr-1" />
                    Price Dropped!
                  </div>
                )}
                
                {/* Price */}
                <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold">
                  ₹{item.price}
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-500">{item.condition}</span>
                </div>

                {/* Price Drop Info */}
                {priceDrop.dropped && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex items-center text-red-700 text-sm">
                      <FaTag className="mr-1" />
                      <span>Was ₹{priceDrop.originalPrice} - Save ₹{priceDrop.dropAmount}!</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Item
                  </button>
                  <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    Contact Seller
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistTab;