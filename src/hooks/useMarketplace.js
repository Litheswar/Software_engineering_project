import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export function useMarketplace() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [recentViewed, setRecentViewed] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState({
    items: false,
    categories: false,
    recent: false,
    trending: false
  })

  const fetchCategories = useCallback(async () => {
    setLoading(prev => ({ ...prev, categories: true }))
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(prev => ({ ...prev, categories: false }))
    }
  }, [])

  const fetchTrending = useCallback(async () => {
    setLoading(prev => ({ ...prev, trending: true }))
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*, seller:users(name, trust_score, college)')
        .eq('status', 'approved')
        .order('views', { ascending: false })
        .limit(12)
      
      console.log("[Marketplace] Fetched trending items:", data)
      if (error) {
        console.error("[Marketplace] Error fetching trending:", error)
        throw error
      }
      setTrending(data || [])
    } catch (err) {
      console.error('Error fetching trending items:', err)
    } finally {
      setLoading(prev => ({ ...prev, trending: false }))
    }
  }, [])

  const fetchRecentItems = useCallback(async () => {
    const rawStoredIds = JSON.parse(localStorage.getItem('recent_views') || '[]')
    
    // Filter for valid UUIDs to prevent invalid input syntax error for type uuid: "6"
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const storedIds = rawStoredIds.filter(id => typeof id === 'string' && uuidRegex.test(id))

    if (storedIds.length === 0) {
      setRecentViewed([])
      return
    }

    setLoading(prev => ({ ...prev, recent: true }))
    try {
      console.log("[Marketplace] Fetching recent items for IDs:", storedIds.slice(0, 6))
      const { data, error } = await supabase
        .from('items')
        .select('*, seller:users(name, trust_score, college)')
        .in('id', storedIds.slice(0, 6))
      
      if (error) {
        console.error("[Marketplace] Error fetching recent items:", error)
        throw error
      }
      
      console.log("[Marketplace] Fetched recent items:", data)

      // Sort to match original access order
      const sorted = storedIds
        .map(id => data?.find(item => item.id === id))
        .filter(Boolean)
      
      setRecentViewed(sorted)
    } catch (err) {
      console.error('Error fetching recent items:', err)
    } finally {
      setLoading(prev => ({ ...prev, recent: false }))
    }
  }, [])

  const fetchLatestItems = useCallback(async () => {
    setLoading(prev => ({ ...prev, items: true }))
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*, seller:users(name, trust_score, college)')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(12)
      
      console.log("[Marketplace] Fetched latest items:", data)
      if (error) {
        console.error("[Marketplace] Error fetching latest:", error)
        throw error
      }
      return data || []
    } catch (err) {
      console.error('Error fetching latest items:', err)
      return []
    } finally {
      setLoading(prev => ({ ...prev, items: false }))
    }
  }, [])

  const fetchItems = useCallback(async (options = {}) => {
    const {
      search = '',
      category = '',
      condition = '',
      minPrice = '',
      maxPrice = '',
      sort = 'newest',
      page = 1,
      perPage = 8
    } = options

    setLoading(prev => ({ ...prev, items: true }))
    try {
      let query = supabase
        .from('items')
        .select('*, seller:users(name, trust_score, college)', { count: 'exact' })
        .eq('status', 'approved')

      if (search) query = query.ilike('title', `%${search}%`)
      if (category) query = query.eq('category', category)
      if (condition) query = query.eq('condition', condition)
      if (minPrice) query = query.gte('price', Number(minPrice))
      if (maxPrice) query = query.lte('price', Number(maxPrice))

      switch (sort) {
        case 'price_asc':  query = query.order('price', { ascending: true }); break
        case 'price_desc': query = query.order('price', { ascending: false }); break
        case 'popular':    query = query.order('views', { ascending: false }); break
        default:           query = query.order('created_at', { ascending: false })
      }

      const from = (page - 1) * perPage
      const to = from + perPage - 1
      query = query.range(from, to)

      const { data, count, error } = await query
      
      console.log(`[Marketplace] Fetched items (page ${page}):`, data)
      if (error) {
        console.error("[Marketplace] Error fetching items:", error)
        throw error
      }
      
      return { data: data || [], count: count || 0 }
    } catch (err) {
      toast.error('Failed to load items')
      console.error('Error fetching items:', err)
      return { data: [], count: 0 }
    } finally {
      setLoading(prev => ({ ...prev, items: false }))
    }
  }, [])

  return {
    items,
    categories,
    recentViewed,
    trending,
    loading,
    fetchCategories,
    fetchTrending,
    fetchRecentItems,
    fetchLatestItems,
    fetchItems
  }
}
