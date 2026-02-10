import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa';
import StrengthBar from './StrengthBar';

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  rememberMe: yup.boolean()
}).required();

const LoginForm = ({ onSwitchToRegister, onSubmitSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);

    // Mock API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock success response
      if (data.email === 'demo@student.com' && data.password === 'password123') {
        toast.success('Welcome back! Redirecting to dashboard...');
        setTimeout(() => {
          onSubmitSuccess('/dashboard');
        }, 1000);
      } else if (submitAttempts >= 2) {
        // Rate limiting simulation
        setError('root', {
          message: 'Too many failed attempts. Please try again later.'
        });
        toast.error('Account temporarily locked. Please try again in a few minutes.');
      } else {
        setError('root', {
          message: 'Invalid email or password. Please try again.'
        });
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    if (isSubmitting) return;
    
    toast('Logging in as demo student...', { icon: '🎓' });
    setTimeout(() => {
      onSubmitSuccess('/dashboard');
    }, 1500);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
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

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
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

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          onClick={() => toast('Password reset link sent to your email!', { icon: '📧' })}
        >
          Forgot password?
        </button>
      </div>

      {/* Error Message */}
      {errors.root && (
        <motion.div
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <p className="text-sm text-red-700 flex items-center">
            <FaExclamationTriangle className="mr-2" /> {errors.root.message}
          </p>
        </motion.div>
      )}

      {/* Login Button */}
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
            Logging in...
          </span>
        ) : (
          'Login to Your Account'
        )}
      </motion.button>

      {/* Demo Login */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={handleDemoLogin}
        disabled={isSubmitting}
        className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-180"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Login as Demo Student
      </motion.button>

      {/* Switch to Register */}
      <div className="text-center pt-4">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Register now
          </button>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          You need to login to contact sellers
        </p>
      </div>
    </motion.form>
  );
};

export default LoginForm;