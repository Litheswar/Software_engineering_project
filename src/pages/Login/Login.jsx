import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/helpers';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }

    setIsLoading(true);

    try {
      const { error } = await login(form.email, form.password);
      
      if (error) {
        setLoginError(error.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }
      
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setLoginError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-h2 text-textDark">Welcome back</h1>
            <p className="text-textMuted mt-1">Sign in to your EECShop account</p>
          </motion.div>

          {/* Form card */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-danger text-sm rounded-xl px-4 py-3 mb-5"
              >
                <AlertCircle size={16} />
                {loginError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-textDark mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@eec.edu"
                    value={form.email}
                    onChange={handleChange('email')}
                    className={`input-field pl-10 ${errors.email ? 'border-danger ring-2 ring-danger/20' : ''}`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-danger text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />{errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="login-password" className="text-sm font-medium text-textDark">
                    Password
                  </label>
                  <span className="text-xs text-primary cursor-pointer hover:underline">Forgot password?</span>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange('password')}
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-danger ring-2 ring-danger/20' : ''}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-primary transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-danger text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />{errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Register link */}
          <motion.p variants={fadeUp} className="text-center text-sm text-textMuted mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one free
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
