import React from 'react';
import { motion } from 'framer-motion';
import { FaBan, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const TrustSafety = () => {
  const features = [
    {
      icon: <FaBan className="text-red-500" />,
      title: "No Advance Payment",
      description: "Never pay before meeting the seller in person on campus"
    },
    {
      icon: <FaExclamationTriangle className="text-yellow-500" />,
      title: "Report Misuse",
      description: "Flag suspicious listings or users with our reporting system"
    },
    {
      icon: <FaSearch className="text-blue-500" />,
      title: "Admin Reviewed Posts",
      description: "Every listing is checked by our team before going live"
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Your Safety is Our Priority
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built with trust and security at the core
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-180"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut", delay: index * 0.1 }}
              whileHover={{ y: -3 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Additional Safety Tips */}
        <motion.div 
          className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut", delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Safety Tips for Campus Exchange
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-700">Always meet on campus during daylight hours</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-700">Bring a friend when meeting strangers</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-700">Check item condition before finalizing deal</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-700">Use cash or secure payment methods only</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSafety;