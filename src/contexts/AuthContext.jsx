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
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
  }

  async function register({ name, email, password, college }) {
    if (useMock) {
      const mockU = { ...MOCK_USER, name, email, college, id: Date.now().toString() }
      setUser(mockU)
      setProfile(mockU)
      return { error: null }
    }
    const { data, error } = await supabase.auth.signUp({ email, password,
      options: { data: { name, college } }
    })
    if (!error && data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, name, college, email,
        trust_score: 0, listings_count: 0,
      })
    }
    return { error }
  }

  async function login({ email, password }) {
    if (useMock) {
      const mockU = { ...MOCK_USER, email }
      setUser(mockU)
      setProfile(mockU)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function logout() {
    if (useMock) { setUser(null); setProfile(null); return }
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const value = { user, profile, loading, useMock, register, login, logout,
    isAdmin: profile?.role === 'admin' || user?.email === 'admin@eecshop.com'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
