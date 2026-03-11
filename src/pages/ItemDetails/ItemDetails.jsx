import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Share2, AlertTriangle, ShieldCheck,
  MapPin, Clock, Tag, MessageCircle, Star, Info, ChevronRight, Image as ImageIcon
} from 'lucide-react';
import { mockItems } from '../../data/mockData';
import { formatPrice, conditionBadgeClass, timeAgo, getInitials, trustScoreColor } from '../../utils/helpers';
import ChatModal from '../../components/ChatModal/ChatModal';
import BackButton from '../../components/BackButton/BackButton';

const ItemDetails = () => {
  const { id } = useParams();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // In a real app we would fetch by ID
  const item = mockItems.find((i) => i.id === parseInt(id)) || mockItems[0];

  if (!item) {
    return (
      <div className="page-container pt-24 text-center">
        <h2 className="text-2xl font-bold text-textDark">Item not found</h2>
        <Link to="/dashboard" className="text-primary hover:underline mt-4 inline-block">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container pt-16 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <BackButton />
          <div className="flex gap-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-textMuted hover:text-danger hover:border-danger hover:bg-red-50 transition-colors shadow-sm focus:outline-none"
              title="Add to Wishlist"
            >
              <Heart size={20} className={isWishlisted ? 'fill-danger text-danger' : ''} />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-textMuted hover:text-primary hover:border-primary hover:bg-blue-50 transition-colors shadow-sm focus:outline-none"
              title="Share Item"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* ── Left Column: UI Gallery & Description ── */}
          <div className="lg:col-span-7 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-gray-200 aspect-[4/3] sm:aspect-video relative group"
            >
               {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={64} opacity={0.5} className="mb-4" />
                    <p className="font-semibold text-lg max-w-xs text-center">{item.title}</p>
                  </div>
               )}
               {/* Decorative dots for 'gallery' feel */}
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-white shadow-md"></div>
                 <div className="w-2 h-2 rounded-full bg-white/50 backdrop-blur-sm shadow-md"></div>
                 <div className="w-2 h-2 rounded-full bg-white/50 backdrop-blur-sm shadow-md"></div>
               </div>
            </motion.div>

            {/* Item Description block */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 sm:p-8">
              <h2 className="font-heading font-bold text-xl text-textDark mb-4">Description</h2>
              <p className="text-textDark leading-relaxed whitespace-pre-line text-sm md:text-base">
                {item.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-1">Category</p>
                  <p className="text-textDark font-medium flex items-center gap-1.5"><Tag size={16} className="text-primary"/> {item.category}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-1">Posted</p>
                  <p className="text-textDark font-medium flex items-center gap-1.5"><Clock size={16} className="text-accent"/> {timeAgo(item.postedAt)}</p>
                </div>
              </div>
            </div>
          </div>


          {/* ── Right Column: Info & Seller Card ── */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Price & Title Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm shrink-0 ${conditionBadgeClass(item.condition)}`}>
                  {item.condition}
                </span>
                <span className="text-xs font-bold text-textMuted bg-gray-100 px-3 py-1 rounded-full shrink-0">
                  ID: #{item.id}
                </span>
              </div>
              
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-textDark leading-tight mb-4 pr-4">
                {item.title}
              </h1>
              
              <div className="flex items-end gap-3 mb-6 relative">
                <span className="font-heading font-black text-4xl text-textDark">
                  {formatPrice(item.price)}
                </span>
                {item.price > 1000 && (
                  <span className="text-sm font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-lg mb-1 absolute -top-8 right-0 sm:static sm:mb-2">
                    Good Price
                  </span>
                )}
              </div>

              {/* Safety Banner */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex items-start gap-3">
                <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                  <span className="font-bold">Safety Tip:</span> Meet inside campus for safe transactions. Never pay in advance without checking the item.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsChatOpen(true)}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-md shadow-primary/30 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={22} />
                Contact Seller
              </motion.button>
            </motion.div>

            {/* Seller Info Card */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 group cursor-pointer hover:border-primary/30 transition-colors">
              <h3 className="font-heading font-bold text-base text-textDark mb-4 flex justify-between items-center">
                About the Seller
                <ChevronRight size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
              </h3>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0">
                  {getInitials(item.seller)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-textDark text-lg truncate flex items-center gap-1.5">
                    {item.seller}
                    {item.trustScore > 85 && <ShieldCheck size={16} className="text-primary" title="Verified Student" />}
                  </p>
                  <p className="text-xs text-textMuted flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> Engineering Campus
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="flex items-center gap-1.5 font-bold text-textDark">
                    <Star size={18} className={`fill-current ${trustScoreColor(item.trustScore)}`} />
                    <span className={trustScoreColor(item.trustScore)}>{item.trustScore}%</span>
                  </p>
                  <p className="text-xs text-textMuted mt-0.5">Trust Score</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-right">
                  <p className="font-bold text-textDark">Active</p>
                  <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1 justify-end"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online now</p>
                </div>
              </div>
            </div>

            {/* Report Button */}
            <div className="text-center pt-2">
              <button 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-textMuted hover:text-danger hover:underline transition-colors focus:outline-none"
                title="Report suspicious item"
              >
                <AlertTriangle size={14} /> Report this listing
              </button>
            </div>
            
          </div>
        </div>
      </div>

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        item={item}
      />
    </div>
  );
};

export default ItemDetails;
