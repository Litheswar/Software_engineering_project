import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import PageWrapper from '../components/PageWrapper'
import { Eye, EyeOff, Mail, Lock, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake]     = useState(false)

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    setLoading(true)
    const { error } = await login(form)
    setLoading(false)
    if (error) {
      let msg = error.message
      if (msg.includes('Email not confirmed')) {
        msg = 'Please confirm your email address before logging in. Check your inbox! ✉️'
      } else if (msg.includes('Invalid login credentials')) {
        msg = 'Incorrect email or password. Please try again.'
      }
      setErrors({ general: msg })
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } else {
      toast.success('Welcome back! 🎉')
      navigate('/dashboard')
    }
  }

  const set = key => e => {
    setForm(p => ({ ...p, [key]: e.target.value }))
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }))
  }

  return (
    <PageWrapper>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg,#EFF6FF 0%,#F0FDF4 100%)',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          maxWidth: 920, width: '100%', margin: '0 auto',
          background: '#fff', borderRadius: 24,
          boxShadow: '0 25px 60px rgba(37,99,235,0.15)',
          overflow: 'hidden', minHeight: 560,
        }} className="auth-grid">
          {/* Left Panel */}
          <div style={{
            background: 'linear-gradient(135deg,#2563EB 0%,#1D4ED8 60%,#1E40AF 100%)',
            padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <Link to="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',marginBottom:48}}>
              <div style={{width:38,height:38,borderRadius:10,background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <ShoppingBag size={20} color="#fff"/>
              </div>
              <span style={{fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:20,color:'#fff'}}>EECShop</span>
            </Link>
            <h2 style={{fontSize:28,fontWeight:800,color:'#fff',marginBottom:14,lineHeight:1.2}}>
              Welcome back to your campus marketplace
            </h2>
            <p style={{color:'rgba(255,255,255,0.75)',fontSize:15,lineHeight:1.7,marginBottom:36}}>
              Log in to browse deals, post items, and connect with fellow students safely.
            </p>
            {[
              { icon:'🛡️', text:'Verified student community' },
              { icon:'⚡', text:'Post items in under 2 minutes' },
              { icon:'💬', text:'Chat securely within campus' },
            ].map((f,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <span style={{fontSize:20}}>{f.icon}</span>
                <span style={{color:'rgba(255,255,255,0.85)',fontSize:14}}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Right Form */}
          <motion.div
            initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.35}}
            className={shake ? 'shake' : ''}
            style={{padding:'48px 40px',display:'flex',flexDirection:'column',justifyContent:'center'}}
          >
            <h2 style={{fontSize:26,fontWeight:800,color:'#1F2937',marginBottom:6}}>Sign in</h2>
            <p style={{color:'#6B7280',fontSize:15,marginBottom:32}}>
              Don't have an account? <Link to="/register" style={{color:'#2563EB',fontWeight:600,textDecoration:'none'}}>Create one free</Link>
            </p>

            {errors.general && (
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 16px',background:'#FEE2E2',borderRadius:12,marginBottom:20,border:'1px solid #FECACA'}}>
                <AlertCircle size={16} color="#DC2626"/>
                <span style={{color:'#DC2626',fontSize:14}}>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:20}}>
              {/* Email */}
              <div>
                <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'block',marginBottom:8}}>Email Address</label>
                <div style={{position:'relative'}}>
                  <Mail size={17} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#9CA3AF',pointerEvents:'none'}} />
                  <input
                    type="email" value={form.email} onChange={set('email')}
                    placeholder="you@college.edu"
                    className="input-field"
                    style={{paddingLeft:44,borderColor:errors.email?'#EF4444':undefined}}
                  />
                </div>
                {errors.email && <p style={{color:'#EF4444',fontSize:13,marginTop:5}}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'block',marginBottom:8}}>Password</label>
                <div style={{position:'relative'}}>
                  <Lock size={17} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#9CA3AF',pointerEvents:'none'}} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password} onChange={set('password')}
                    placeholder="Your password"
                    className="input-field"
                    style={{paddingLeft:44,paddingRight:48,borderColor:errors.password?'#EF4444':undefined}}
                  />
                  <button type="button" onClick={()=>setShowPwd(p=>!p)}
                    style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#9CA3AF'}}
                  >
                    {showPwd ? <EyeOff size={17}/> : <Eye size={17}/>}
                  </button>
                </div>
                {errors.password && <p style={{color:'#EF4444',fontSize:13,marginTop:5}}>{errors.password}</p>}
              </div>

              <div style={{display:'flex',justifyContent:'flex-end'}}>
                <a href="#" style={{fontSize:13,color:'#2563EB',textDecoration:'none',fontWeight:500}}>Forgot password?</a>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}
                style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:16,opacity:loading?0.7:1}}
              >
                {loading ? (
                  <><span style={{width:18,height:18,border:'3px solid rgba(255,255,255,0.3)',borderTop:'3px solid #fff',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}} /> Signing in...</>
                ) : (
                  <>Sign In <ArrowRight size={17}/></>
                )}
              </button>
            </form>

            <div style={{marginTop:24,padding:'16px',background:'#F0FDF4',borderRadius:12,border:'1px solid #BBF7D0'}}>
              <p style={{color:'#15803D',fontSize:13,margin:0,textAlign:'center'}}>
                Demo: Use any email + password to log in with mock mode 🚀
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media (max-width:640px) { .auth-grid { grid-template-columns: 1fr !important; } .auth-grid > div:first-child { display: none !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </PageWrapper>
  )
}
