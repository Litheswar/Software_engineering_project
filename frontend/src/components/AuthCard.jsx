import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaShieldAlt, FaUserFriends } from 'react-icons/fa';

const AuthCard = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Illustration */}
          <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex flex-col justify-center text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut", delay: 0.1 }}
            >
              <div className="flex items-center mb-8">
                <FaGraduationCap className="text-4xl mr-3" />
                <h1 className="text-3xl font-bold">Campus Exchange</h1>
              </div>
              
              <h2 className="text-2xl font-semibold mb-6">Secure Student Marketplace</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaShieldAlt className="text-xl mr-3 text-blue-200" />
                  <span>Verified student community</span>
                </div>
                <div className="flex items-center">
                  <FaUserFriends className="text-xl mr-3 text-blue-200" />
                  <span>Safe on-campus exchanges</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-blue-500/20 rounded-lg backdrop-blur-sm">
                <p className="text-blue-100 text-sm">
                  <span className="font-medium">Tip:</span> Use your college email for faster approval
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Right Side - Auth Form */}
          <div className="lg:w-3/5 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
                <motion.button
                  className={`flex-1 py-3 px-4 rounded-md text-center font-medium transition-all duration-180 ${
                    activeTab === 'login' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('login')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Login
                </motion.button>
                <motion.button
                  className={`flex-1 py-3 px-4 rounded-md text-center font-medium transition-all duration-180 ${
                    activeTab === 'register' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('register')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register
                </motion.button>
              </div>
              
              {children}
              
              {/* Security Notice */}
              <motion.div 
                className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-start">
                  <FaShieldAlt className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Your privacy matters:</span> 
                    {' '}All your data is visible only to admins and used solely for verification purposes.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCard;