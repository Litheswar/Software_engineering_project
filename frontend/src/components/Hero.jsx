import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBook, FaLaptop, FaTshirt } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <motion.div 
            className="flex-1 mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut", delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut", delay: 0.3 }}
            >
              Buy & Sell Within Your Campus
            </motion.h1>
            
            <motion.p 
              className="text-xl text-blue-100 mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut", delay: 0.4 }}
            >
              Verified students • Admin approved • Safe exchange
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut", delay: 0.5 }}
            >
              <Link 
                to="/dashboard"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-center hover:bg-gray-100 transition-all duration-180 hover:scale-103"
              >
                Explore Items
              </Link>
              <Link 
                to="/auth"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-center hover:bg-white hover:text-blue-600 transition-all duration-180 hover:scale-103"
              >
                Login to Sell
              </Link>
            </motion.div>
            
            {/* Sample Prices Banner */}
            <motion.div 
              className="mt-8 p-4 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-300/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut", delay: 0.6 }}
            >
              <p className="text-blue-100 text-center">
                Most books sell between <span className="font-semibold">₹200–₹350</span>
              </p>
            </motion.div>
          </motion.div>
          
          {/* Illustration Placeholder */}
          <motion.div 
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeInOut", delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <FaBook className="text-2xl text-white mx-auto mb-2" />
                  <p className="text-white text-sm">Textbooks</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <FaLaptop className="text-2xl text-white mx-auto mb-2" />
                  <p className="text-white text-sm">Electronics</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <FaTshirt className="text-2xl text-white mx-auto mb-2" />
                  <p className="text-white text-sm">Clothing</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-white font-medium">Campus Marketplace</p>
                <p className="text-blue-100 text-sm mt-1">Safe • Verified • Trusted</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Demo Banner */}
      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
        Demo preview – login to interact
      </div>
    </div>
  );
};

export default Hero;