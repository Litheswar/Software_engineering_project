import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import GoBack from '../components/GoBack'
import { MOCK_USER } from '../lib/mockData'
import { Star, CheckCircle, Package, TrendingUp, Search, Shield, Trash2, Camera, Bell } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, profile } = useAuth()
  const displayUser = profile || MOCK_USER
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const progress = Math.min(100, (displayUser.trust_score / 5) * 100)

  return (
    <PageWrapper>
      <Navbar />
      <div style={{maxWidth:1000,margin:'0 auto',padding:'24px 24px 60px'}}>
        <GoBack />

        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:24}}>
          {/* Header Profile Section */}
          <div style={{background:'#fff',borderRadius:20,padding:32,border:'1px solid #F1F5F9',boxShadow:'0 4px 16px rgba(0,0,0,0.04)',display:'flex',alignItems:'center',gap:24,flexWrap:'wrap'}}>
            <div style={{position:'relative'}}>
              <div style={{width:100,height:100,borderRadius:'50%',background:'linear-gradient(135deg,#2563EB,#1D4ED8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,color:'#fff',fontWeight:700,boxShadow:'0 8px 20px rgba(37,99,235,0.2)'}}>
                {displayUser.name?.charAt(0)||'U'}
              </div>
              <button style={{position:'absolute',bottom:0,right:0,width:32,height:32,borderRadius:'50%',background:'#fff',border:'2px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
                <Camera size={14} color="#6B7280"/>
              </button>
            </div>
            <div style={{flex:1,minWidth:250}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
                <h1 style={{fontSize:28,fontWeight:800,color:'#1F2937',margin:0}}>{displayUser.name}</h1>
                <span style={{background:'#DCFCE7',color:'#15803D',padding:'4px 10px',borderRadius:999,fontSize:12,fontWeight:700,display:'flex',alignItems:'center',gap:4}}>
                  <CheckCircle size={14}/> Verified Student
                </span>
              </div>
              <p style={{fontSize:16,color:'#6B7280',margin:'0 0 16px'}}>🎓 {displayUser.college} • Joined {new Date(displayUser.joined_date).getFullYear()}</p>
              
              <div style={{maxWidth:300}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                  <span style={{fontSize:13,fontWeight:600,color:'#4B5563',display:'flex',alignItems:'center',gap:6}}><Shield size={14} color="#F59E0B"/> Trust Score</span>
                  <span style={{fontSize:14,fontWeight:800,color:'#1F2937'}}>⭐ {displayUser.trust_score}</span>
                </div>
                <div style={{height:8,background:'#F1F5F9',borderRadius:999,overflow:'hidden'}}>
                  <div style={{height:'100%',background:'linear-gradient(90deg,#FDE68A,#F59E0B)',width:`${progress}%`,borderRadius:999}}/>
                </div>
              </div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24,alignItems:'start'}}>
            {/* Seller Stats */}
            <div style={{background:'#fff',borderRadius:20,padding:28,border:'1px solid #F1F5F9',boxShadow:'0 4px 16px rgba(0,0,0,0.04)'}}>
              <h3 style={{fontSize:18,fontWeight:700,color:'#1F2937',marginBottom:20}}>Seller Stats</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div style={{background:'#F8FAFC',padding:16,borderRadius:16,textAlign:'center'}}>
                  <Package size={24} color="#2563EB" style={{margin:'0 auto 8px'}}/>
                  <span style={{fontSize:24,fontWeight:800,color:'#1F2937',display:'block'}}>{displayUser.listings_count}</span>
                  <span style={{fontSize:13,color:'#6B7280',fontWeight:500}}>Active Items</span>
                </div>
                <div style={{background:'#F8FAFC',padding:16,borderRadius:16,textAlign:'center'}}>
                  <CheckCircle size={24} color="#10B981" style={{margin:'0 auto 8px'}}/>
                  <span style={{fontSize:24,fontWeight:800,color:'#1F2937',display:'block'}}>12</span>
                  <span style={{fontSize:13,color:'#6B7280',fontWeight:500}}>Items Sold</span>
                </div>
              </div>
            </div>

            {/* Profile Settings */}
            <div style={{background:'#fff',borderRadius:20,padding:28,border:'1px solid #F1F5F9',boxShadow:'0 4px 16px rgba(0,0,0,0.04)'}}>
              <h3 style={{fontSize:18,fontWeight:700,color:'#1F2937',marginBottom:20}}>Account Settings</h3>
              
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',background:'#F8FAFC',borderRadius:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <Bell size={18} color="#6B7280"/>
                    <span style={{fontSize:14,fontWeight:600,color:'#374151'}}>Email Notifications</span>
                  </div>
                  <label style={{position:'relative',display:'inline-flex',alignItems:'center',cursor:'pointer'}}>
                    <input type="checkbox" defaultChecked style={{srOnly:true,opacity:0,position:'absolute'}}/>
                    <div style={{width:44,height:24,background:'#2563EB',borderRadius:999,position:'relative'}}>
                      <div style={{position:'absolute',top:2,left:22,width:20,height:20,background:'#fff',borderRadius:'50%',transition:'all 0.2s'}}></div>
                    </div>
                  </label>
                </div>
                <button className="btn-secondary" style={{width:'100%',justifyContent:'center',padding:'12px',fontSize:14}}>Change Password</button>
              </div>

              <div style={{marginTop:32,borderTop:'1px solid #F1F5F9',paddingTop:24}}>
                <h4 style={{fontSize:14,fontWeight:700,color:'#EF4444',marginBottom:12}}>Danger Zone</h4>
                {!deleteConfirm ? (
                  <button onClick={()=>setDeleteConfirm(true)} style={{background:'none',border:'none',color:'#EF4444',fontSize:14,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Trash2 size={16}/> Delete Account</button>
                ) : (
                  <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:12,padding:16}}>
                    <p style={{fontSize:13,color:'#991B1B',margin:'0 0 12px',fontWeight:500}}>Are you absolutely sure? This will delete all your items and chat history.</p>
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={()=>setDeleteConfirm(false)} className="btn-secondary" style={{padding:'6px 12px',fontSize:12,flex:1,borderColor:'#FECACA',color:'#991B1B'}}>Cancel</button>
                      <button onClick={()=>toast.success('Account deletion scheduled')} className="btn-danger" style={{padding:'6px 12px',fontSize:12,flex:1}}>Yes, Delete</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
