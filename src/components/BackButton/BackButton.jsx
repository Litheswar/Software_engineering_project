import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ fallbackPath = '/dashboard', label = 'Back' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // If there is history, go back. Otherwise fallback to dashboard.
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <motion.button
      onClick={handleBack}
      whileHover={{ x: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="inline-flex items-center gap-2 text-blue-600 hover:underline transition-colors text-sm font-medium focus:outline-none cursor-pointer"
    >
      <ArrowLeft size={16} />
      {label}
    </motion.button>
  );
};

export default BackButton;
