import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import GoBack from '../components/GoBack'
import AvatarUploader from '../components/AvatarUploader'
import { MOCK_USER } from '../lib/mockData'
import { 
  Star, CheckCircle, Package, Shield, 
  Trash2, Bell, Mail, BookOpen, 
  Award, TrendingUp, Info, ArrowUpRight,
  Clock, Heart, ShoppingBag, Plus
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user, profile, updateProfile, isAdmin } = useAuth()
  const displayUser = profile || MOCK_USER
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [editForm, setEditForm] = useState({
    name: '',
    college: '',
    bio: ''
  })

  useEffect(() => {
    if (displayUser) {
      setEditForm({
        name: displayUser.name || '',
        college: displayUser.college || '',
        bio: displayUser.bio || ''
      })
    }
  }, [displayUser])

  const toggleEdit = () => setIsEditing(!isEditing)

  const handleSave = async () => {
    setIsSaving(true)
    const { error } = await updateProfile(editForm)
    setIsSaving(false)
    if (!error) {
      toast.success('Profile updated successfully! ✨')
      setIsEditing(false)
    } else {
      toast.error(error.message || 'Failed to update profile')
    }
  }

  const handleAvatarUpload = async (url) => {
    await updateProfile({ avatar_url: url })
  }

  const [stats, setStats] = useState({ listings: 0, sold: 0 })
  
  useEffect(() => {
    async function fetchStats() {
      if (!user) return
      const { count: listings } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('seller_id', user.id).neq('status', 'sold')
      const { count: sold } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('seller_id', user.id).eq('status', 'sold')
      setStats({ listings: listings || 0, sold: sold || 0 })
    }
    fetchStats()
  }, [user])

  // Calculate completion percentage
  const fields = [displayUser.name, displayUser.college, displayUser.bio, displayUser.avatar_url]
  const completedFields = fields.filter(f => f && f.length > 0).length
  const completionPercent = Math.round((completedFields / fields.length) * 100)

  // Reputation Progress
  const repProgress = Math.min(100, (displayUser.trust_score / 5) * 100)

  return (
    <PageWrapper>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 24px 80px' }}>
        <GoBack />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
          
          {/* 1. Profile Hero Section */}
          <div style={{
            background: '#fff', 
            borderRadius: 24, 
            padding: 40, 
            border: '1px solid #F1F5F9',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            flexWrap: 'wrap',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Accent */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: 200, height: 200,
              background: 'radial-gradient(circle at 100% 0%, rgba(37,99,235,0.05) 0%, transparent 70%)',
              zIndex: 0
            }} />

            <AvatarUploader 
              url={displayUser.avatar_url} 
              onUpload={handleAvatarUpload}
              size={120}
            />

            <div style={{ flex: 1, minWidth: 280, zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, justifyContent: 'space-between' }}>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                   <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1F2937', margin: 0 }}>{displayUser.name}</h1>
                   {displayUser.trust_score >= 4 && (
                     <span title="Highly Trusted Seller" style={{ color: '#F59E0B' }}><Award size={24} fill="#FDE68A"/></span>
                   )}
                </div>
                
                <button 
                  onClick={isEditing ? handleSave : toggleEdit}
                  disabled={isSaving}
                  className={isEditing ? "btn-primary" : "btn-secondary"}
                  style={{ padding: '8px 20px', fontSize: 14 }}
                >
                  {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap:'wrap' }}>
                <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={14}/> Verified Student
                </span>
                <span style={{ background: '#FEF9C3', color: '#854D0E', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={14}/> Member since {new Date(displayUser.created_at || Date.now()).getFullYear()}
                </span>
                {isAdmin && (
                  <span style={{ background: '#DBEAFE', color: '#1D4ED8', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>Admin Account</span>
                )}
              </div>

              {isEditing ? (
                <textarea 
                  value={editForm.bio}
                  onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell students about what you sell or your year/major..."
                  style={{ width: '100%', minHeight: 80, borderRadius: 12, padding: '12px 16px', border: '2px solid #E2E8F0', fontSize: 14, fontFamily:'inherit', marginBottom: 12 }}
                />
              ) : (
                <p style={{ fontSize: 15, color: '#6B7280', margin: '0 0 20px', maxWidth: 600 }}>
                  {displayUser.bio || "No bio yet. Add a bio to help other students trust you more!"}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '16px 20px', background: '#F8FAFC', borderRadius: 16, border: '1px solid #F1F5F9' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#4B5563', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Shield size={14} color="#F59E0B" /> Trust Reputation
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1F2937' }}>{displayUser.trust_score}/5.0</span>
                  </div>
                  <div style={{ height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${repProgress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #FDE68A, #F59E0B)', borderRadius: 999 }} 
                    />
                  </div>
                </div>
                <div style={{ borderLeft: '1px solid #E2E8F0', height: 40, paddingPadding: 24 }} />
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: 20, fontWeight: 800, color: '#1F2937' }}>{stats.sold}</span>
                  <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>Deals</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            
            {/* 2. Personal Information */}
            <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Info size={20} color="#2563EB"/> Personal Info
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.025em', display: 'block', marginBottom: 8 }}>Full Name</label>
                  {isEditing ? (
                    <input 
                      value={editForm.name}
                      onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                      className="input-field"
                    />
                  ) : (
                    <p style={{ fontSize: 16, fontWeight: 600, color: '#1F2937', margin: 0 }}>{displayUser.name}</p>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.025em', display: 'block', marginBottom: 8 }}>College / University</label>
                  {isEditing ? (
                    <input 
                      value={editForm.college}
                      onChange={e => setEditForm(p => ({ ...p, college: e.target.value }))}
                      className="input-field"
                    />
                  ) : (
                    <p style={{ fontSize: 16, fontWeight: 600, color: '#1F2937', margin: 0 }}>🎓 {displayUser.college}</p>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.025em', display: 'block', marginBottom: 8 }}>Email Address</label>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#6B7280', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Mail size={16}/> {displayUser.email || user?.email}
                  </p>
                </div>

                <div style={{ marginTop: 8, padding: '16px', background: '#F0F9FF', borderRadius: 16, border: '1px solid #E0F2FE' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                     <span style={{ fontSize: 14, fontWeight: 700, color: '#0369A1' }}>Profile Completion</span>
                     <span style={{ fontSize: 14, fontWeight: 800, color: '#0369A1' }}>{completionPercent}%</span>
                   </div>
                   <div style={{ height: 8, background: '#D1FAE5', borderRadius: 999, overflow: 'hidden' }}>
                      <motion.div initial={{width:0}} animate={{width:`${completionPercent}%`}} style={{height:'100%', background:'#22C55E'}} />
                   </div>
                   <p style={{ fontSize: 12, color: '#0EA5E9', marginTop: 10, fontWeight: 500 }}>
                     Complete your profile to unlock "Top Seller" status!
                   </p>
                </div>
              </div>
            </div>

            {/* 3. Marketplace Stats & Activity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TrendingUp size={20} color="#10B981"/> Marketplace Stats
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 20, textAlign: 'center', border: '1px solid #F1F5F9' }}>
                    <Package size={24} color="#2563EB" style={{ margin: '0 auto 12px' }} />
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', display: 'block' }}>{stats.listings}</span>
                    <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Active Listings</span>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 20, textAlign: 'center', border: '1px solid #F1F5F9' }}>
                    <Heart size={24} color="#EF4444" style={{ margin: '0 auto 12px' }} />
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', display: 'block' }}>{stats.sold}</span>
                    <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Items Sold</span>
                  </div>
                </div>

                <div style={{ marginTop: 24, marginBottom: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#6B7280', marginBottom: 16, textTransform: 'uppercase' }}>Community Badges</h4>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {[
                      { icon: <Award size={16}/>, label: 'Fast Responder', color: '#7C3AED', bg: '#F5F3FF' },
                      { icon: <Shield size={16}/>, label: 'Fair Trader', color: '#10B981', bg: '#ECFDF5' },
                      { icon: <CheckCircle size={16}/>, label: 'Email Verified', color: '#2563EB', bg: '#EFF6FF' }
                    ].map((badge, i) => (
                      <div key={i} style={{ 
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', 
                        background: badge.bg, color: badge.color, borderRadius: 12, fontSize: 12, fontWeight: 700
                      }}>
                        {badge.icon} {badge.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#6B7280', marginBottom: 16, textTransform: 'uppercase' }}>Recent Activity</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { icon: <Plus size={14}/>, text: 'Posted "Engineering Kit"', time: '2h ago', color: '#2563EB' },
                      { icon: <ShoppingBag size={14}/>, text: 'Item "Calculator" sold', time: '1d ago', color: '#10B981' },
                    ].map((act, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#F8FAFC', borderRadius: 12 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: act.color, shadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                          {act.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#374151' }}>{act.text}</p>
                          <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{act.time}</p>
                        </div>
                        <ArrowUpRight size={14} color="#CBD5E1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>System Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button className="btn-secondary" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
                    <Bell size={16}/> Notification Preferences
                  </button>
                  <button className="btn-secondary" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
                    <Shield size={16}/> Privacy & Security
                  </button>
                  
                  <div style={{ marginTop: 12, paddingTop: 20, borderTop: '1px solid #F1F5F9' }}>
                    {!deleteConfirm ? (
                      <button onClick={() => setDeleteConfirm(true)} style={{ color: '#EF4444', fontSize: 14, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Trash2 size={16}/> Delete Account
                      </button>
                    ) : (
                      <div style={{ background: '#FEF2F2', padding: 16, borderRadius: 16, border: '1px solid #FECACA' }}>
                        <p style={{ fontSize: 13, color: '#991B1B', marginBottom: 16, fontWeight: 600 }}>Permanent Action: This will remove all your listings and data.</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => setDeleteConfirm(false)} className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: 12, color: '#991B1B', borderColor: '#FECACA' }}>Cancel</button>
                          <button className="btn-danger" style={{ flex: 1, padding: '8px', fontSize: 12 }}>Confirm Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
