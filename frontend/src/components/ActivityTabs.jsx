import React from 'react';
import { motion } from 'framer-motion';
import { FaList, FaComments, FaHeart, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useActivityStore from '../store/activityStore';
import MyListings from './MyListings';
import ChatPanel from './ChatPanel';
import WishlistTab from './WishlistTab';
import ProfileTab from './ProfileTab';

const ActivityTabs = () => {
  const { activeTab, setActiveTab } = useActivityStore();

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: FaList },
    { id: 'chats', label: 'Chats', icon: FaComments },
    { id: 'wishlist', label: 'Wishlist', icon: FaHeart },
    { id: 'profile', label: 'Profile', icon: FaUser }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'listings':
        return <MyListings />;
      case 'chats':
        return <ChatPanel />;
      case 'wishlist':
        return <WishlistTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <MyListings />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Activity Center</h1>
        <p className="text-gray-600">Manage your listings, chats, wishlist and profile</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-2 mb-8 border border-gray-200"
      >
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-medium transition-all duration-180 flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
      >
        {renderTabContent()}
      </motion.div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <Link to="/post">
          <button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-180 flex items-center justify-center">
            <span className="text-2xl">+</span>
          </button>
        </Link>
        <div className="absolute -top-10 -left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Post New Item
        </div>
      </motion.div>
    </div>
  );
};

export default ActivityTabs;