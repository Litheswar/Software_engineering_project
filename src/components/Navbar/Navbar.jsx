import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, LogOut, Menu, X, User,
  List, MessageCircle, Heart, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { mockNotifications } from '../../data/mockData';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadNotifs = mockNotifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', auth: true },
    { name: 'How it works', path: '/#how-it-works', auth: false },
    { name: 'Categories', path: '/#categories', auth: false },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo & Search */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center text-white font-heading font-black text-lg shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5">
                E
              </div>
              <span className="font-heading font-bold text-xl text-textDark tracking-tight">
                EEC<span className="text-primary">Shop</span>
              </span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex relative group w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="w-full bg-gray-100/80 border border-transparent rounded-full pl-9 pr-4 py-1.5 text-sm focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                />
              </div>
            )}
          </div>

          {/* Desktop Right Nav */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/post">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] transition-all"
                  >
                    <Plus size={16} /> Post Item
                  </motion.button>
                </Link>

                {/* Notifications Bell */}
                <Link to="/notifications" className="relative p-2 text-textMuted hover:bg-gray-100 rounded-full transition-colors ml-2">
                  <Bell size={20} />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full ring-2 ring-white" />
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative ml-2" ref={dropdownRef}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-transparent transition-all hover:ring-primary/30">
                      {getInitials(user?.name)}
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-[260px] bg-white rounded-xl shadow-lg border border-gray-200 py-2 origin-top-right z-50 overflow-hidden"
                      >
                        {/* User Info Section */}
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                            {getInitials(user?.name)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-textDark truncate">{user?.name || 'Test User'}</span>
                            <a href={`mailto:${user?.email || 'test@eec.edu'}`} className="text-xs text-textMuted hover:text-primary transition-colors truncate">
                              {user?.email || 'test@eec.edu'}
                            </a>
                          </div>
                        </div>

                        {/* Profile Navigation Section */}
                        <div className="px-2 py-1 space-y-1">
                          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-150 rounded-md cursor-pointer">
                            <Search className="w-5 h-5 text-gray-500 shrink-0" />
                            <span className="text-sm font-medium text-textDark">Marketplace</span>
                          </Link>
                          <Link to="/activity" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-150 rounded-md cursor-pointer">
                            <List className="w-5 h-5 text-gray-500 shrink-0" />
                            <span className="text-sm font-medium text-textDark">My Activity</span>
                          </Link>
                          <Link to="/chat" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-150 rounded-md cursor-pointer">
                            <MessageCircle className="w-5 h-5 text-gray-500 shrink-0" />
                            <span className="text-sm font-medium text-textDark">Messages</span>
                          </Link>
                          <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-150 rounded-md cursor-pointer">
                            <User className="w-5 h-5 text-gray-500 shrink-0" />
                            <span className="text-sm font-medium text-textDark">Profile</span>
                          </Link>
                          <Link to="/notifications" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-150 rounded-md cursor-pointer">
                            <Bell className="w-5 h-5 text-gray-500 shrink-0" />
                            <span className="text-sm font-medium text-textDark">Notifications</span>
                          </Link>
                        </div>

                        {/* Logout Section */}
                        <div className="border-t border-gray-200 mt-2 pt-2 px-2">
                          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors duration-150 rounded-md cursor-pointer">
                            <LogOut className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-medium">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              // Public Desktop Nav
              <>
                <div className="flex items-center gap-6 mr-4">
                  {navLinks.filter(l => !l.auth).map(link => (
                    <a key={link.name} href={link.path} className="text-sm font-medium text-textMuted hover:text-primary transition-colors">
                      {link.name}
                    </a>
                  ))}
                </div>
                <Link to="/login" className="text-sm font-semibold text-textDark hover:text-primary transition-colors px-3 py-2">
                  Log in
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                  >
                    Sign up free
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            {isAuthenticated && (
              <Link to="/notifications" className="relative p-2 text-textMuted">
                <Bell size={20} />
                {unreadNotifs > 0 && <span className="absolute top-1 right-2 w-2 h-2 bg-danger rounded-full" />}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-textDark p-2 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {getInitials(user?.name)}
                    </div>
                    <div>
                      <p className="font-bold text-textDark text-sm">{user?.name}</p>
                      <p className="text-xs text-textMuted">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Link to="/post" className="flex items-center justify-center gap-2 w-full bg-primary text-white px-4 py-3 rounded-xl text-sm font-bold shadow-md shadow-primary/20">
                    <Plus size={18} /> Post an Item
                  </Link>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link to="/dashboard" className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gray-50 rounded-xl text-textDark hover:bg-gray-100 text-sm font-semibold">
                      <Search size={18} className="text-primary" /> Marketplace
                    </Link>
                    <Link to="/activity" className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gray-50 rounded-xl text-textDark hover:bg-gray-100 text-sm font-semibold">
                      <List size={18} className="text-accent" /> My Activity
                    </Link>
                    <Link to="/chat" className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gray-50 rounded-xl text-textDark hover:bg-gray-100 text-sm font-semibold relative">
                      <MessageCircle size={18} className="text-secondary" /> Messages
                    </Link>
                    <Link to="/profile" className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gray-50 rounded-xl text-textDark hover:bg-gray-100 text-sm font-semibold">
                      <User size={18} className="text-green-500" /> Profile
                    </Link>
                  </div>
                  
                  <button onClick={logout} className="flex items-center justify-center gap-2 w-full border border-red-100 text-danger bg-red-50 hover:bg-red-100 px-4 py-3 rounded-xl text-sm font-bold mt-2 transition-colors">
                    <LogOut size={16} /> Log out
                  </button>
                </>
              ) : (
                <>
                  {navLinks.filter(l => !l.auth).map(link => (
                    <a key={link.name} href={link.path} className="block px-3 py-2 text-base font-semibold text-textDark">
                      {link.name}
                    </a>
                  ))}
                  <div className="pt-4 flex flex-col gap-3">
                    <Link to="/login" className="w-full text-center font-bold text-primary py-3 rounded-xl bg-blue-50">
                      Log in
                    </Link>
                    <Link to="/register" className="w-full text-center font-bold text-white py-3 rounded-xl bg-primary shadow-md shadow-primary/20">
                      Sign up free
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
