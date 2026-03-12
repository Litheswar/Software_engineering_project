import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import GoBack from '../components/GoBack'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { Camera, Tag, Clock, Package, Save, Trash2, ArrowLeft } from 'lucide-react'

export default function EditItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    condition: '',
    image_url: ''
  })

  useEffect(() => {
    async function init() {
      // Fetch categories
      const { data: catData } = await supabase.from('categories').select('*').order('name')
      if (catData) setCategories(catData)

      // Fetch item
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error || !data) {
        toast.error('Item not found')
        navigate('/activity')
        return
      }

      if (data.seller_id !== user?.id) {
        toast.error('Unauthorized')
        navigate('/activity')
        return
      }

      setFormData({
        title: data.title,
        price: data.price,
        description: data.description,
        category: data.category,
        condition: data.condition,
        image_url: data.image_url
      })
      setLoading(false)
    }
    if (user) init()
  }, [id, user, navigate])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    const { error } = await supabase
      .from('items')
      .update({
        ...formData,
        price: Number(formData.price),
        updated_at: new Date()
      })
      .eq('id', id)
    
    if (!error) {
      toast.success('Listing updated! ✨')
      navigate('/activity')
    } else {
      toast.error('Failed to update: ' + error.message)
    }
    setSaving(false)
  }

  if (loading) return (
    <PageWrapper>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '100px auto', textAlign: 'center' }}>
        <p>Loading your listing...</p>
      </div>
    </PageWrapper>
  )

  return (
    <PageWrapper>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 24px 80px' }}>
        <GoBack />
        <div style={{ background: '#fff', borderRadius: 24, padding: 40, border: '1px solid #F1F5F9', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1F2937', marginBottom: 8 }}>Edit Listing</h1>
          <p style={{ color: '#6B7280', marginBottom: 32 }}>Update your item details or price.</p>

          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Title */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', paddingBottom: 8, fontSize: 13, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>Item Title</label>
              <input 
                required
                value={formData.title} 
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="What are you selling?"
                className="input-field"
              />
            </div>

            {/* Price */}
            <div>
              <label style={{ display: 'block', paddingBottom: 8, fontSize: 13, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>Price (₹)</label>
              <input 
                required
                type="number"
                value={formData.price} 
                onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                placeholder="0.00"
                className="input-field"
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', paddingBottom: 8, fontSize: 13, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                className="input-field"
              >
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label style={{ display: 'block', paddingBottom: 8, fontSize: 13, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>Condition</label>
              <select 
                value={formData.condition} 
                onChange={e => setFormData(p => ({ ...p, condition: e.target.value }))}
                className="input-field"
              >
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            {/* Image Preview */}
            <div style={{ gridRow: 'span 2' }}>
              <label style={{ display: 'block', paddingBottom: 8, fontSize: 13, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>Item Image</label>
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '2px dashed #E2E8F0', aspectRatio: '1/1', background: '#F8FAFC' }}>
                <img src={formData.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                   <button type="button" className="btn-secondary" style={{ padding: '8px 16px' }}><Camera size={16}/> Change</button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', paddingBottom: 8, fontSize: 13, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>Description</label>
              <textarea 
                required
                value={formData.description} 
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe your item... (Min 20 chars)"
                rows={5}
                className="input-field"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 16, marginTop: 12 }}>
              <button type="button" onClick={() => navigate('/activity')} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                <Save size={18}/> {saving ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}
