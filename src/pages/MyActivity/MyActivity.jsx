import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  List, MessageCircle, Heart, Clock, Search,
  Package, CheckCircle, Trash2, Edit2
} from 'lucide-react';
import { mockItems, mockChatRequests } from '../../data/mockData';
import ItemCard from '../../components/ItemCard/ItemCard';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getInitials } from '../../utils/helpers';
import BackButton from '../../components/BackButton/BackButton';

const TABS = [
  { id: 'listings', label: 'My Listings', icon: List },
  { id: 'chats', label: 'Chat Requests', icon: MessageCircle },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'history', label: 'Purchase History', icon: Clock },
  { id: 'saved', label: 'Saved Searches', icon: Search },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MyActivity = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [wishlist] = useState([mockItems[0], mockItems[2]]);
  const [history] = useState([mockItems[6], mockItems[8]]);
  const [listings, setListings] = useState(
    mockItems.filter((i) => i.sellerId === 1).map((i) => ({ ...i, status: 'Active' }))
  );

  const updateStatus = (id, newStatus) => {
    setListings((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  const deleteItem = (id) => {
    setListings((prev) => prev.filter((i) => i.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Sold': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="page-container pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-h2 text-textDark">User Dashboard</h1>
          <p className="text-textMuted mt-1">Manage your marketplace activity</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap shrink-0 border ${
                activeTab === tab.id
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                  : 'bg-white text-textMuted border-gray-200 hover:border-primary/50 hover:text-primary'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={fadeUp} initial="hidden" animate="visible" className="min-h-[400px]">

            {/* ── My Listings ── */}
            {activeTab === 'listings' && (
              <div>
                {listings.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Package size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-textDark font-bold text-lg">No active listings</p>
                    <p className="text-textMuted text-sm mt-1">Items you post for sale will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listings.map((item) => (
                      <div
                        key={item.id}
                        className={`bg-white rounded-2xl border ${item.status === 'Sold' ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:border-primary/30'} p-4 flex gap-4 shadow-sm transition-all`}
                      >
                        <div className="w-24 h-24 rounded-bl-none overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-semibold text-textDark text-sm line-clamp-2">{item.title}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getStatusColor(item.status)}`}>
                              {item.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-secondary font-black text-lg mt-1">{formatPrice(item.price)}</p>
                          
                          <div className="flex-1" />

                          {item.status !== 'Sold' && (
                            <div className="flex gap-2 mt-3">
                              {item.status === 'Active' && (
                                <button
                                  onClick={() => updateStatus(item.id, 'Pending')}
                                  className="flex-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 text-xs font-bold py-1.5 rounded-lg transition-colors"
                                >
                                  Mark Pending
                                </button>
                              )}
                              {item.status === 'Pending' && (
                                <button
                                  onClick={() => updateStatus(item.id, 'Active')}
                                  className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold py-1.5 rounded-lg transition-colors"
                                >
                                  Unmark Pending
                                </button>
                              )}
                              <button
                                onClick={() => updateStatus(item.id, 'Sold')}
                                className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 text-xs font-bold py-1.5 rounded-lg transition-colors"
                              >
                                Mark Sold
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Chat Requests ── */}
            {activeTab === 'chats' && (
              <div className="space-y-3 max-w-2xl">
                {mockChatRequests.length === 0 ? (
                   <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-textDark font-bold text-lg">No pending requests</p>
                  </div>
                ) : (
                  mockChatRequests.map((chat) => (
                    <div
                      key={chat.id}
                      className={`bg-white rounded-xl border p-4 flex items-start gap-4 shadow-sm ${!chat.read ? 'border-primary/30 bg-blue-50/50' : 'border-gray-100'}`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {getInitials(chat.from)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-textDark text-sm">{chat.from}</p>
                          <span className="text-xs text-textMuted flex-shrink-0">{chat.time}</span>
                        </div>
                        <p className="text-xs font-medium text-textMuted mt-0.5 truncate">Re: {chat.itemTitle}</p>
                        <p className="text-sm text-textDark mt-1 p-3 bg-gray-50 rounded-xl rounded-tl-none inline-block border border-gray-100">
                          {chat.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── Wishlist ── */}
            {activeTab === 'wishlist' && (
              <div>
                {wishlist.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-textDark font-bold text-lg">Your wishlist is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {wishlist.map((item) => (
                      <ItemCard key={item.id} item={item} wishlisted={true} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── History ── */}
            {activeTab === 'history' && (
              <div>
                {history.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Clock size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-textDark font-bold text-lg">No purchase history</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex gap-4">
                         <div className="w-20 h-20 rounded-bl-none overflow-hidden shrink-0 bg-gray-200">
                           <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale" />
                         </div>
                         <div>
                           <h3 className="font-semibold text-textDark text-sm">{item.title}</h3>
                           <p className="text-xs text-textMuted mt-1">Bought from: {item.seller}</p>
                           <p className="font-bold text-textDark mt-2">{formatPrice(item.price)}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Saved Searches ── */}
            {activeTab === 'saved' && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <Search size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-textDark font-bold text-lg">No saved searches</p>
                <p className="text-textMuted text-sm mt-1">Save your frequent search queries to get notified of new items.</p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyActivity;
