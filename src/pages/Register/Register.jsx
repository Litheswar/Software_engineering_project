import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ShoppingBag, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { isValidEmail } from '../../utils/helpers';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }

    setIsLoading(true);

    try {
      console.log("Submitting registration form...");
      // 1. Register with Supabase
      const { data, error } = await register(form.email, form.password, {
        name: form.name.trim()
      });

      if (error) {
        console.error("Signup error details:", error);
        
        // Handle specific error codes if available
        if (error.status === 400 && error.message.includes('grant_type')) {
          setErrors({ ...errors, general: 'Invalid request. Please check your credentials.' });
        } else if (error.message.toLowerCase().includes('already registered') || error.status === 422) {
          setErrors({ ...errors, email: 'Email already registered' });
        } else if (error.message.toLowerCase().includes('password')) {
          setErrors({ ...errors, password: error.message });
        } else if (error.message.toLowerCase().includes('confirm your email')) {
          setErrors({ ...errors, general: 'Please confirm your email address before logging in.' });
        } else {
          setErrors({ ...errors, general: error.message || 'Signup failed' });
        }
        setIsLoading(false);
        return;
      }

      console.log("Signup successful, user data:", data.user);

      // No manual profile insertion needed anymore - done via DB trigger
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);

    } catch (err) {
      console.error("Registration catch block:", err);
      setErrors({ ...errors, general: 'Network error occurred. Please try again.' });
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return { level: 'Weak', color: 'bg-danger', width: 'w-1/3' };
    if (p.length < 10) return { level: 'Fair', color: 'bg-accent', width: 'w-2/3' };
    return { level: 'Strong', color: 'bg-secondary', width: 'w-full' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 pt-16 pb-10">
      <div className="w-full max-w-md">
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-h2 text-textDark">Join EECShop</h1>
            <p className="text-textMuted mt-1">Create your free student account</p>
          </motion.div>

          {/* Form card */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 gap-3 text-center"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                  <CheckCircle size={36} className="text-secondary" />
                </div>
                <p className="font-heading font-bold text-lg text-textDark">Account Created!</p>
                <p className="text-textMuted text-sm">Redirecting to your dashboard...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="reg-name" className="block text-sm font-medium text-textDark mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                    <input
                      id="reg-name"
                      type="text"
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={handleChange('name')}
                      className={`input-field pl-10 ${errors.name ? 'border-danger ring-2 ring-danger/20' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-textDark mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="you@eec.edu"
                      value={form.email}
                      onChange={handleChange('email')}
                      className={`input-field pl-10 ${errors.email ? 'border-danger ring-2 ring-danger/20' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-textDark mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={handleChange('password')}
                      className={`input-field pl-10 pr-10 ${errors.password ? 'border-danger ring-2 ring-danger/20' : ''}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-primary" aria-label="Toggle password">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {strength && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: strength.width }}
                          className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                        />
                      </div>
                      <p className="text-xs text-textMuted mt-1">Strength: <span className="font-medium">{strength.level}</span></p>
                    </div>
                  )}
                  {errors.password && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="reg-confirm" className="block text-sm font-medium text-textDark mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                    <input
                      id="reg-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-danger ring-2 ring-danger/20' : ''}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-primary" aria-label="Toggle confirm password">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.confirmPassword}</p>}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-secondary flex items-center justify-center gap-2 py-3 disabled:opacity-70"
                >
                  {isLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</>
                  ) : 'Create Account'}
                </motion.button>

                <p className="text-xs text-textMuted text-center">
                  By registering you agree to our{' '}
                  <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
                </p>
              </form>
            )}
          </motion.div>

          <motion.p variants={fadeUp} className="text-center text-sm text-textMuted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
