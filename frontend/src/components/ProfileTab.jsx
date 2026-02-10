import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaStar, FaChartLine, FaCalendar, FaRupeeSign, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useActivityStore from '../store/activityStore';
import { topPerformingItem } from '../data/activityData';

const ProfileTab = () => {
  const { profile } = useActivityStore();

  const getTrustColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResponseRateColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleEditProfile = () => {
    toast.success('Edit profile feature coming soon!');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    // In a real app, you would clear auth state here
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FaUser size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-blue-100">{profile.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Trust Score and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trust Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Trust Score</h3>
            <FaStar className="text-yellow-400" />
          </div>
          <div className={`text-3xl font-bold ${getTrustColor(profile.trustScore)}`}>
            {profile.trustScore}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div 
              className="bg-yellow-500 h-2 rounded-full" 
              style={{ width: `${profile.trustScore * 20}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Items Posted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Items Posted</h3>
            <FaChartLine className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600">{profile.itemsPosted}</div>
          <p className="text-sm text-gray-500 mt-1">Total listings</p>
        </motion.div>

        {/* Items Sold */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Items Sold</h3>
            <FaRupeeSign className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600">{profile.itemsSold}</div>
          <p className="text-sm text-gray-500 mt-1">Successful sales</p>
        </motion.div>

        {/* Response Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Response Rate</h3>
            <FaChartLine className="text-purple-500" />
          </div>
          <div className={`text-3xl font-bold ${getResponseRateColor(profile.responseRate)}`}>
            {profile.responseRate}%
          </div>
          <p className="text-sm text-gray-500 mt-1">Quick responses</p>
        </motion.div>
      </div>

      {/* Top Performing Item */}
      {topPerformingItem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <FaStar className="text-yellow-500 mr-2" />
            Top Performing Item
          </h3>
          <div className="flex items-center gap-4">
            <img
              src={topPerformingItem.image}
              alt={topPerformingItem.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{topPerformingItem.title}</h4>
              <p className="text-gray-600">{topPerformingItem.category}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">₹{topPerformingItem.price}</div>
              <div className="text-sm text-gray-500">{topPerformingItem.views} views</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Member Since */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaCalendar className="text-gray-500 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-800">Member Since</h3>
              <p className="text-gray-600">{new Date(profile.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              <FaRupeeSign className="inline" />
              {profile.totalEarnings.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">Total Earnings</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Account Actions</h3>
        <div className="flex gap-4">
          <button
            onClick={handleEditProfile}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </motion.div>

      {/* Risk Warning */}
      {profile.trustScore < 3.5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-start">
            <div className="text-red-500 mr-3 mt-1">⚠️</div>
            <div>
              <h4 className="font-semibold text-red-800 mb-1">Account Notice</h4>
              <p className="text-red-700 text-sm">
                Your trust score is below average. Please ensure all transactions are completed 
                honestly and communicate professionally with buyers to improve your rating.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileTab;