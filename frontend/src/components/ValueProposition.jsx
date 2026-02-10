import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCheck, FaBolt, FaShieldAlt } from 'react-icons/fa';

const ValueCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-180"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeInOut", delay }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
    >
      <div className="text-blue-600 text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const ValueProposition = () => {
  const cards = [
    {
      icon: <FaUserCheck />,
      title: "Verified Community",
      description: "Only campus students with verified university emails can participate in the marketplace."
    },
    {
      icon: <FaBolt />,
      title: "Fast Posting",
      description: "Post your items for sale in under 60 seconds with our simple listing process."
    },
    {
      icon: <FaShieldAlt />,
      title: "Safe Exchange",
      description: "All exchanges happen within campus premises for your safety and peace of mind."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Campus Exchange?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built specifically for students, by students
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <ValueCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;