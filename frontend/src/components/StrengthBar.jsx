import React from 'react';
import { motion } from 'framer-motion';

const StrengthBar = ({ strength }) => {
  const strengthLevels = [
    { label: 'Very Weak', color: 'bg-red-500', width: '20%' },
    { label: 'Weak', color: 'bg-orange-500', width: '40%' },
    { label: 'Fair', color: 'bg-yellow-500', width: '60%' },
    { label: 'Good', color: 'bg-blue-500', width: '80%' },
    { label: 'Strong', color: 'bg-green-500', width: '100%' }
  ];

  const currentLevel = strengthLevels[strength] || strengthLevels[0];

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Password Strength</span>
        <span>{currentLevel.label}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${currentLevel.color}`}
          initial={{ width: 0 }}
          animate={{ width: currentLevel.width }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <div className="flex space-x-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full ${
              index <= strength ? currentLevel.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StrengthBar;