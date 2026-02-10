import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import StrengthBar from './StrengthBar';

// Validation schema
const registerSchema = yup.object({
  fullName: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required')
    .test('college-email', 'Please use your college email for faster approval', (value) => {
      if (!value) return true;
      return value.includes('edu') || value.includes('university') || value.includes('college');
    }),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  acceptGuidelines: yup
    .boolean()
    .oneOf([true], 'You must accept the community guidelines')
    .required('You must accept the community guidelines')
}).required();

const RegisterForm = ({ onSwitchToLogin, onSubmitSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptGuidelines: false
    }
  });

  const password = watch('password', '');
  const email = watch('email', '');

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success response
      toast.success('Account created successfully! Welcome to Campus Exchange!');
      
      // Show success animation
      setTimeout(() => {
        onSubmitSuccess('/dashboard');
      }, 1500);
      
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    
    return Math.min(strength, 4);
  };

  const strength = getPasswordStrength(password);
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <motion.p 
            className="mt-1 text-sm text-red-600 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaExclamationTriangle className="mr-1" /> {errors.fullName.message}
          </motion.p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="your.email@university.edu"
        />
        {email && !email.includes('edu') && !email.includes('university') && !email.includes('college') && (
          <motion.p 
            className="mt-1 text-sm text-yellow-600 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaExclamationTriangle className="mr-1" /> Using college email helps with faster approval
          </motion.p>
        )}
        {errors.email && (
          <motion.p 
            className="mt-1 text-sm text-red-600 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaExclamationTriangle className="mr-1" /> {errors.email.message}
          </motion.p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
            ) : (
              <FaEye className="text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        
        {password && (
          <div className="mt-2">
            <StrengthBar strength={strength} />
            <p className={`text-xs mt-1 ${
              strength < 2 ? 'text-red-600' : 
              strength < 4 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {strengthText} password
            </p>
          </div>
        )}
        
        {errors.password && (
          <motion.p 
            className="mt-1 text-sm text-red-600 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaExclamationTriangle className="mr-1" /> {errors.password.message}
          </motion.p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
            ) : (
              <FaEye className="text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <motion.p 
            className="mt-1 text-sm text-red-600 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaExclamationTriangle className="mr-1" /> {errors.confirmPassword.message}
          </motion.p>
        )}
      </div>

      {/* Guidelines Checkbox */}
      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            {...register('acceptGuidelines')}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">
            I accept the <a href="#" className="text-blue-600 hover:text-blue-500">Community Guidelines</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
          </span>
        </label>
        {errors.acceptGuidelines && (
          <motion.p 
            className="mt-1 text-sm text-red-600 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaExclamationTriangle className="mr-1" /> {errors.acceptGuidelines.message}
          </motion.p>
        )}
      </div>

      {/* Register Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-180 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
        }`}
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            Creating Account...
          </span>
        ) : (
          'Create Account'
        )}
      </motion.button>

      {/* Switch to Login */}
      <div className="text-center pt-4">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Login here
          </button>
        </p>
      </div>
    </motion.form>
  );
};

export default RegisterForm;