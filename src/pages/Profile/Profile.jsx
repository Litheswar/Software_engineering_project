import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit2, Star, ShieldCheck, CheckCircle,
  Package, MapPin, Calendar, Clock, Settings,
  Save, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockItems } from '../../data/mockData';
import { getInitials, trustScoreColor, formatPrice } from '../../utils/helpers';
import BackButton from '../../components/BackButton/BackButton';

const TABS = [
  { id: 'listings', label: 'Active Listings', icon: Package },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Account Settings', icon: Settings },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Profile = () => {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [editing, setEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Local state for editing - sync with profile once profile is loaded
  const [name, setName] = useState('');
  
  React.useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
  }, [profile]);

  const userListings = mockItems.filter((i) => i.sellerId === 1);

  const handleSave = async () => {
    if (name.trim().length < 3) return;
    setIsUpdating(true);
    try {
      const { error } = await updateProfile({ name: name.trim() });
      if (!error) {
        setEditing(false);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="page-container pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* ── Top Section: Seller Profile Card ── */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden mb-8 relative">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary to-blue-800 relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
          </div>

          <div className="px-6 pb-6 relative">
            {/* Avatar & Edit Button */}
            <div className="flex justify-between items-end -mt-12 mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-700 rounded-2xl border-4 border-white flex items-center justify-center text-white font-bold text-3xl shadow-lg relative z-10">
                {getInitials(profile?.name || user?.email)}
              </div>
              
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 border border-gray-200 text-textDark bg-white hover:border-primary hover:text-primary px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
                >
                  <Edit2 size={16} /> Edit Profile
                </button>
              ) : (
                 <div className="flex gap-2">
                    <button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-1.5 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-secondary-600 transition-colors disabled:opacity-50">
                      {isUpdating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                      Save
                    </button>
                    <button onClick={() => { setName(profile?.name || ''); setEditing(false); }} className="flex items-center gap-1.5 border border-gray-200 bg-white text-textMuted px-3 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm">
                      <X size={16} />
                    </button>
                  </div>
              )}
            </div>

            {/* User Info */}
            <div className="mb-6">
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-xl font-bold mb-2 max-w-sm"
                  autoFocus
                />
              ) : (
                <h1 className="font-heading font-black text-2xl text-textDark mb-1 flex items-center gap-2">
                  {profile?.name || 'User'}
                  {profile?.verified && <ShieldCheck size={20} className="text-primary mt-1" title="Verified Student" />}
                </h1>
              )}
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-textMuted mt-2 font-medium">
                <span className="flex items-center gap-1"><MapPin size={16} className="text-gray-400" /> {profile?.college || 'Engineering Campus'}</span>
                <span className="flex items-center gap-1"><Calendar size={16} className="text-gray-400" /> Member since {profile?.created_at ? new Date(profile.created_at).getFullYear() : '2024'}</span>
              </div>
            </div>

            {/* Trust Stats Grid */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 pt-6">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1.5 mb-1 text-textMuted">
                  < Star size={18} className={trustScoreColor(profile?.trust_score || 85)} />
                  <p className="text-xs font-semibold uppercase tracking-wide">Trust Score</p>
                </div>
                <p className={`font-heading font-black text-3xl ${trustScoreColor(profile?.trust_score || 85)}`}>
                  {profile?.trust_score || 85}<span className="text-lg text-gray-400 font-bold">%</span>
                </p>
              </div>
              
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1.5 mb-1 text-textMuted">
                  <CheckCircle size={18} className="text-green-500" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Deals Done</p>
                </div>
                <p className="font-heading font-black text-3xl text-textDark">
                  {user?.dealsCompleted || 12}
                </p>
              </div>

              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1.5 mb-1 text-textMuted">
                  <Package size={18} className="text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Listings</p>
                </div>
                <p className="font-heading font-black text-3xl text-textDark">
                  {userListings.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Section: Tabs ── */}
        <div className="flex gap-2 mb-6 border-b border-gray-100 pb-px overflow-x-auto custom-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-textMuted hover:text-textDark hover:border-gray-300'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-primary' : 'text-gray-400'} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={fadeUp} initial="hidden" animate="visible" className="min-h-[300px]">
            
            {/* Active Listings Tab */}
            {activeTab === 'listings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {userListings.map(item => (
                   <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-primary/30 transition-colors shadow-sm cursor-pointer">
                      <div className="h-40 w-full bg-gray-100">
                        {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-textDark text-sm line-clamp-2">{item.title}</h3>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                           <p className="text-secondary font-bold">{formatPrice(item.price)}</p>
                           <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                             ACTIVE
                           </span>
                        </div>
                      </div>
                   </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-2xl mx-auto shadow-sm">
                <Star size={48} className="text-gray-200 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl text-textDark mb-2">No reviews yet</h3>
                <p className="text-textMuted text-sm">After you complete a transaction, buyers can leave reviews here.</p>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm max-w-2xl">
                <h3 className="font-heading font-bold text-lg text-textDark mb-6">Account Settings</h3>
                
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-1.5">Email Address</label>
                    <input type="email" value={user?.email || 'test@eec.edu'} disabled className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-textMuted text-sm cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-1.5">Phone Number</label>
                    <input type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-2.5 bg-white border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-textDark text-sm transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-textDark mb-1.5">College / Department</label>
                    <select className="w-full px-4 py-2.5 bg-white border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-textDark text-sm transition-all outline-none">
                      <option>Engineering Campus</option>
                      <option>Science Block</option>
                      <option>Business School</option>
                      <option>Architecture Dept</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end gap-3">
                    <button className="px-5 py-2.5 text-sm font-semibold text-textMuted hover:bg-gray-50 rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button className="px-5 py-2.5 text-sm font-semibold bg-primary text-white hover:bg-primary-600 rounded-xl shadow-md shadow-primary/20 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
