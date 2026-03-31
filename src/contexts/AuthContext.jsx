import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MOCK_USER } from '../lib/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [useMock, setUseMock] = useState(false)

  useEffect(() => {
    // Try Supabase first; fall back to mock if misconfigured
    const url = import.meta.env.VITE_SUPABASE_URL
    if (!url || url.includes('placeholder')) {
      setUseMock(true)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) { setUseMock(true); setLoading(false); return }
      if (session) {
        setUser(session.user)
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
    return { data, error }
  }

  async function updateProfile(updates) {
    if (useMock) {
      setProfile(p => ({ ...p, ...updates }))
      return { error: null }
    }
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (!error && data) {
      setProfile(data)
      return { data, error: null }
    }
    return { error }
  }

  async function register({ name, email, password, college, role = 'student' }) {
    if (useMock) {
      const mockU = { ...MOCK_USER, name, email, college, role, id: Date.now().toString() }
      setUser(mockU)
      setProfile(mockU)
      return { error: null }
    }
    const { data, error } = await supabase.auth.signUp({ email, password,
      options: { 
        data: { name, college, role },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    })
    
    // Note: We no longer manually insert here as the database trigger 
    // handled by on_auth_user_created will take care of it atomically.
    
    return { error, data }
  }

  async function login({ email, password }) {
    if (useMock) {
      const mockU = { ...MOCK_USER, email }
      setUser(mockU)
      setProfile(mockU)
      return { error: null }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error }
    
    // If we have a user but no profile, try to fetch it again
    if (data.user && !profile) {
      await fetchProfile(data.user.id)
    }
    
    return { data, error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    localStorage.removeItem('supabase.auth.token') // Clear potential stale tokens
  }

  const value = {
    user,
    profile,
    loading,
    login,
    register,
    signOut,
    updateProfile,
    fetchProfile,
    isAdmin: profile?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
