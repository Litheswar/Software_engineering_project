import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (error) {
        console.warn("Profile fetch error:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing Auth...");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session fetch error:", error.message);
        }

        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          console.log("Session found for user:", initialSession.user.id);
          const prof = await fetchProfile(initialSession.user.id);
          setProfile(prof);
        } else {
          console.log("No active session found.");
        }
      } catch (error) {
        console.error("Unexpected error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`Auth state changed: ${event}`, currentSession?.user?.id);
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        const prof = await fetchProfile(currentSession.user.id);
        setProfile(prof);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    console.log("Attempting login for:", email);
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      console.error("Login failed:", result.error.message);
    } else {
      console.log("Login successful:", result.data.user.id);
    }
    return result;
  };

  const logout = async () => {
    console.log("Logging out...");
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const register = async (email, password, metadata) => {
    console.log("Attempting register for:", email);
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    if (result.error) {
      console.error("Registration failed:", result.error.message);
    } else {
      console.log("Registration successful:", result.data.user?.id);
    }
    return result;
  };

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { data: null, error };
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
