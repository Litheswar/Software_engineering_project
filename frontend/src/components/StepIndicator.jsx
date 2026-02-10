import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const StepIndicator = ({ currentStep, steps, onStepClick }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 transform -translate-y-1/2">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          />
        </div>
        
        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = stepNumber <= currentStep;
          
          return (
            <motion.div
              key={index}
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut", delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-180 ${
                  isCompleted
                    ? 'bg-green-500 text-white border-2 border-green-500'
                    : isCurrent
                    ? 'bg-blue-600 text-white border-2 border-blue-600 shadow-lg'
                    : 'bg-white text-gray-400 border-2 border-gray-300'
                }`}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                {isCompleted ? (
                  <FaCheck size={16} />
                ) : (
                  stepNumber
                )}
              </motion.button>
              <span className={`mt-2 text-sm font-medium ${
                isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;