import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('eecshop_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    const userWithDefaults = {
      ...userData,
      trustScore: userData.trustScore || 80,
      dealsCompleted: userData.dealsCompleted || 0,
      verified: userData.verified || false,
    };
    localStorage.setItem('eecshop_user', JSON.stringify(userWithDefaults));
    setUser(userWithDefaults);
  };

  const logout = () => {
    localStorage.removeItem('eecshop_user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
