import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaCheckCircle, FaComments, FaHandshake } from 'react-icons/fa';

const Step = ({ icon, title, description, number, isActive }) => {
  return (
    <div className="flex flex-col items-center text-center relative">
      <motion.div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 ${
          isActive ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
        viewport={{ once: true }}
      >
        {number}
      </motion.div>
      
      <motion.div
        className="text-3xl text-blue-600 mb-3"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeInOut", delay: 0.1 }}
        viewport={{ once: true }}
      >
        {icon}
      </motion.div>
      
      <motion.h3
        className="text-lg font-semibold text-gray-800 mb-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeInOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className="text-gray-600"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeInOut", delay: 0.3 }}
        viewport={{ once: true }}
      >
        {description}
      </motion.p>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaEdit />,
      title: "Post Your Item",
      description: "Create a listing in under 60 seconds"
    },
    {
      icon: <FaCheckCircle />,
      title: "Admin Approval",
      description: "Our team reviews and approves your listing"
    },
    {
      icon: <FaComments />,
      title: "Chat with Buyers",
      description: "Connect with interested students"
    },
    {
      icon: <FaHandshake />,
      title: "Meet & Exchange",
      description: "Complete the transaction safely on campus"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to buy or sell on Campus Exchange
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Step
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              number={index + 1}
              isActive={true}
            />
          ))}
        </div>
        
        {/* Connection Lines for Desktop */}
        <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
          <div className="flex justify-between px-8">
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className="h-1 w-16 bg-blue-200 self-center"
                initial={{ width: 0 }}
                whileInView={{ width: '4rem' }}
                transition={{ duration: 0.18, ease: "easeInOut", delay: index * 0.2 }}
                viewport={{ once: true }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;