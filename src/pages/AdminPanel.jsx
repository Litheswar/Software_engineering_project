import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import ModalDialog from '../components/ModalDialog'
import GoBack from '../components/GoBack'
import { CATEGORIES } from '../lib/mockData'
import { CheckCircle, XCircle, Flag, Search, Users, Package, TrendingUp, AlertTriangle, ShieldCheck, Filter, Loader2, Calendar, User, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

export default function AdminPanel() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmModal, setConfirmModal] = useState(null) // { type: 'approve'|'reject', id: string }
  const [rejectReason, setRejectReason] = useState('')
  
  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          seller:users!items_seller_id_fkey (
            name,
            college
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.error('Error fetching admin items:', err)
      toast.error('Failed to load moderation queue')
    } finally {
      setLoading(false)
    }
  }

  const pendingCount = items.filter(i => i.status === 'pending').length
  const approvedCount = items.filter(i => i.status === 'approved').length
  const rejectedCount = items.filter(i => i.status === 'rejected').length

  const stats = [
    { label: 'Pending Listings', value: pendingCount, color: '#F59E0B', icon: <Package size={20}/> },
    { label: 'Approved Listings', value: approvedCount, color: '#10B981', icon: <CheckCircle size={20}/> },
    { label: 'Rejected Listings', value: rejectedCount, color: '#EF4444', icon: <XCircle size={20}/> },
  ]

  async function handleModeration() {
    const { type, id } = confirmModal
    const newStatus = type === 'approve' ? 'approved' : 'rejected'
    
    console.log(`Admin ${type}ing item:`, id)
    
    try {
      const updates = { status: newStatus }
      if (type === 'reject') updates.moderation_note = rejectReason

      const { error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setItems(prev => prev.map(i => i.id === id ? { ...i, status: newStatus, moderation_note: type === 'reject' ? rejectReason : null } : i))
      toast.success(`Item ${newStatus} successfully!`)
      setConfirmModal(null)
      setRejectReason('')
    } catch (err) {
      console.error('Moderation error:', err)
      toast.error(`Failed to update item status`)
    }
  }

  const pendingItems = items.filter(i => i.status === 'pending')

  return (
    <PageWrapper>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 24px 60px' }}>
        <GoBack />
        
        {/* Header */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} color="#fff"/>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>Admin Moderation Panel</h1>
            </div>
            <p style={{ color: '#6B7280', fontSize: 15, margin: 0 }}>Review and moderate campus marketplace listings.</p>
          </div>
          <button onClick={fetchItems} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
            Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 20, padding: '20px', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </div>
              <div>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#1F2937', display: 'block' }}>{s.value}</span>
                <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Moderation Queue */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: 0 }}>Moderation Queue (Pending Items)</h2>
          <span style={{ background: '#F59E0B', color: '#fff', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
            {pendingItems.length} Waiting
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Loader2 className="animate-spin" size={40} color="#2563EB" style={{ margin: '0 auto 12px' }}/>
            <p style={{ color: '#6B7280', fontWeight: 500 }}>Fetching pending items...</p>
          </div>
        ) : pendingItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: '#F9FAFB', borderRadius: 24, border: '2px dashed #E5E7EB' }}>
            <CheckCircle size={56} color="#10B981" style={{ margin: '0 auto 16px', opacity: 0.8 }}/>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#374151', marginBottom: 8 }}>No items waiting for approval</h3>
            <p style={{ color: '#6B7280', maxWidth: 300, margin: '0 auto' }}>Great job! The marketplace is up to date. New listings will appear here when students post them.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {pendingItems.map(item => (
              <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#fff', borderRadius: 24, padding: 20, border: '1px solid #F1F5F9', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', gap: 20, alignItems: 'flex-start' }}
              >
                <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                  <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', borderRadius: 16, objectFit: 'cover' }}/>
                  <div style={{ position: 'absolute', top: -8, right: -8, background: '#F59E0B', color: '#fff', padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 800, border: '2px solid #fff' }}>PENDING</div>
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>{item.title}</h3>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#2563EB' }}>₹{item.price?.toLocaleString()}</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13 }}>
                      <ShoppingBag size={14}/> <span style={{ fontWeight: 600 }}>{item.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13 }}>
                      <Package size={14}/> <span style={{ fontWeight: 600 }}>{item.condition}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13 }}>
                      <User size={14}/> <span>Seller: <strong>{item.seller?.name || 'Unknown'}</strong> ({item.seller?.college || 'No College'})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13 }}>
                      <Calendar size={14}/> <span>Posted: {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <p style={{ color: '#4B5563', fontSize: 14, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setConfirmModal({ type: 'approve', id: item.id })} className="btn-success" style={{ flex: 1, padding: '10px', fontSize: 14 }}>
                      <CheckCircle size={16}/> Approve Listing
                    </button>
                    <button onClick={() => setConfirmModal({ type: 'reject', id: item.id })} className="btn-danger" style={{ flex: 1, padding: '10px', fontSize: 14 }}>
                      <XCircle size={16}/> Reject Listing
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      <ModalDialog 
        isOpen={!!confirmModal} 
        onClose={() => setConfirmModal(null)} 
        title={confirmModal?.type === 'approve' ? 'Approve This Item?' : 'Reject This Item?'}
      >
        <div style={{ padding: '0 0 10px' }}>
          <p style={{ color: '#4B5563', fontSize: 15, lineHeight: 1.5, marginBottom: 20 }}>
            {confirmModal?.type === 'approve' 
              ? 'Are you sure you want to approve this listing? It will immediately become visible to all students in the marketplace.' 
              : 'Are you sure you want to reject this listing? The seller will be notified that their item was not approved.'
            }
          </p>
          
          {confirmModal?.type === 'reject' && (
            <div style={{ marginBottom: 20 }}>
               <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>Rejection Reason (Optional)</label>
               <textarea 
                 value={rejectReason} 
                 onChange={e => setRejectReason(e.target.value)}
                 placeholder="e.g. Inappropriate images, incorrect price, prohibited item..."
                 className="input-field"
                 style={{ height: 80, resize: 'none', padding: '12px' }}
               />
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-secondary" onClick={() => setConfirmModal(null)} style={{ flex: 1 }}>
              Cancel
            </button>
            <button 
              className={confirmModal?.type === 'approve' ? "btn-success" : "btn-danger"} 
              onClick={handleModeration} 
              style={{ flex: 1 }}
            >
              Confirm {confirmModal?.type === 'approve' ? 'Approval' : 'Rejection'}
            </button>
          </div>
        </div>
      </ModalDialog>
    </PageWrapper>
  )
}
