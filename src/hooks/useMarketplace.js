import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

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
  const [errors, setErrors] = useState({})

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    setLoading(prev => ({ ...prev, categories: true }))
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error("Error fetching categories:", err)
      setErrors(prev => ({ ...prev, categories: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, categories: false }))
    }
  }, [])

  // Fetch Trending Items
  const fetchTrending = useCallback(async (limit = 4) => {
    setLoading(prev => ({ ...prev, trending: true }))
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*, seller:users(name, trust_score)')
        .eq('status', 'approved')
        .order('views', { ascending: false })
        .limit(limit)

      if (error) throw error
      setTrending(data || [])
    } catch (err) {
      console.error("Error fetching trending items:", err)
      setErrors(prev => ({ ...prev, trending: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, trending: false }))
    }
  }, [])

  // Fetch Recently Viewed Items from IDs
  const fetchRecentItems = useCallback(async () => {
    const storedIds = JSON.parse(localStorage.getItem('recent_views') || '[]')
    if (storedIds.length === 0) {
      setRecentViewed([])
      return
    }

    setLoading(prev => ({ ...prev, recent: true }))
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*, seller:users(name, trust_score)')
        .in('id', storedIds.slice(0, 10))
      
      if (error) throw error

      // Sort by the order in storedIds
      const sorted = storedIds
        .map(id => data.find(item => item.id === id))
        .filter(Boolean)

      setRecentViewed(sorted)
    } catch (err) {
      console.error("Error fetching recent items:", err)
      setErrors(prev => ({ ...prev, recent: err.message }))
    } finally {
      setLoading(prev => ({ ...prev, recent: false }))
    }
  }, [])

  // Fetch Filtered Items
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
        .select('*, seller:users(name, trust_score)', { count: 'exact' })
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
      if (error) throw error

      return { data: data || [], count: count || 0 }
    } catch (err) {
      console.error("Error fetching items:", err)
      setErrors(prev => ({ ...prev, items: err.message }))
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
    errors,
    fetchCategories,
    fetchTrending,
    fetchRecentItems,
    fetchItems
  }
}
