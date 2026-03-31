import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import PageWrapper from '../components/PageWrapper'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, ShoppingBag, ArrowRight, AlertCircle, CheckCircle, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ]
  if (!password) return null
  return (
    <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}>
      {checks.map(c => (
        <div key={c.label} style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:c.ok?'#15803D':'#6B7280'}}>
          {c.ok ? <CheckCircle size={12}/> : <span style={{width:12,height:12,borderRadius:'50%',border:'1.5px solid #D1D5DB',display:'inline-block'}}/>}
          {c.label}
        </div>
      ))}
    </div>
  )
}

export default function Register() {
  const { register } = useAuth()
  const navigate      = useNavigate()
  const [form, setForm]       = useState({ name:'', email:'', password:'', confirm:'', college:'', role:'student', adminCode:'' })
  const [errors, setErrors]   = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake]     = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    else {
      // Remove domain restriction for admins as requested
      if (form.role === 'student' && !form.email.endsWith('@college.edu')) {
        e.email = 'Student emails must end with @college.edu'
      }
    }
    
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!form.college.trim()) e.college = 'College name is required'
    
    if (form.role === 'admin' && form.adminCode !== '310624104165') {
      e.adminCode = 'Invalid access code'
    }
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
    const { data, error } = await register(form)
    setLoading(false)
    if (error) {
      setErrors({ general: error.message || 'Registration failed. Try again.' })
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } else if (data?.session) {
      toast.success('Account created! Welcome to EECShop 🎉')
      navigate('/dashboard')
    } else {
      toast.success('Account created! Please check your email to verify your account. ✉️')
      navigate('/login')
    }
  }

  const set = key => e => {
    setForm(p => ({ ...p, [key]: e.target.value }))
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }))
  }

  const renderField = (label, icon, inputKey, type='text', placeholder, showToggle) => (
    <div key={inputKey}>
      <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'block',marginBottom:8}}>{label}</label>
      <div style={{position:'relative'}}>
        <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#9CA3AF',pointerEvents:'none'}}>{icon}</span>
        <input
          type={showToggle ? (showPwd?'text':'password') : type}
          value={form[inputKey]} onChange={set(inputKey)}
          placeholder={placeholder}
          className="input-field"
          style={{paddingLeft:44,paddingRight:showToggle?48:16,borderColor:errors[inputKey]?'#EF4444':undefined}}
        />
        {showToggle && (
          <button type="button" onClick={()=>setShowPwd(p=>!p)}
            style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#9CA3AF'}}
          >
            {showPwd ? <EyeOff size={17}/> : <Eye size={17}/>}
          </button>
        )}
      </div>
      {errors[inputKey] && <p style={{color:'#EF4444',fontSize:13,marginTop:5}}>{errors[inputKey]}</p>}
      {inputKey === 'password' && <PasswordStrength password={form.password} />}
    </div>
  )

  return (
    <PageWrapper>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',background:'linear-gradient(135deg,#EFF6FF 0%,#F0FDF4 100%)',padding:'32px 16px'}}>
        <div style={{
          display:'grid',gridTemplateColumns:'1fr 1fr',maxWidth:960,width:'100%',margin:'0 auto',
          background:'#fff',borderRadius:24,boxShadow:'0 25px 60px rgba(37,99,235,0.15)',overflow:'hidden',
        }} className="auth-grid">
          {/* Left */}
          <div style={{background:'linear-gradient(135deg,#10B981,#059669)',padding:'48px 40px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <Link to="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',marginBottom:48}}>
              <div style={{width:38,height:38,borderRadius:10,background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <ShoppingBag size={20} color="#fff"/>
              </div>
              <span style={{fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:20,color:'#fff'}}>EECShop</span>
            </Link>
            <h2 style={{fontSize:26,fontWeight:800,color:'#fff',marginBottom:14,lineHeight:1.2}}>
              Join your campus community marketplace
            </h2>
            <p style={{color:'rgba(255,255,255,0.8)',fontSize:15,lineHeight:1.7,marginBottom:32}}>
              Create your free account and start trading with verified students today.
            </p>
            {[
              { icon:'🆓', text:'Completely free to join' },
              { icon:'🎓', text:'College-verified community' },
              { icon:'💰', text:'Save money on essentials' },
              { icon:'🤝', text:'Safe, campus-only trades' },
            ].map((f,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                <span style={{fontSize:18}}>{f.icon}</span>
                <span style={{color:'rgba(255,255,255,0.85)',fontSize:14}}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Right Form */}
          <motion.div
            initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.35}}
            className={shake ? 'shake' : ''}
            style={{padding:'40px',display:'flex',flexDirection:'column',justifyContent:'center',overflowY:'auto'}}
          >
            <h2 style={{fontSize:24,fontWeight:800,color:'#1F2937',marginBottom:6}}>Create Account</h2>
            <p style={{color:'#6B7280',fontSize:14,marginBottom:24}}>
              Already a member? <Link to="/login" style={{color:'#2563EB',fontWeight:600,textDecoration:'none'}}>Sign in</Link>
            </p>

            {errors.general && (
              <div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 16px',background:'#FEE2E2',borderRadius:12,marginBottom:16,border:'1px solid #FECACA'}}>
                <AlertCircle size={16} color="#DC2626"/>
                <span style={{color:'#DC2626',fontSize:14}}>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
              {renderField("Full Name", <User size={16}/>, "name", "text", "Your full name")}
              {renderField("College Email", <Mail size={16}/>, "email", "email", "you@college.edu")}
              {renderField("College Name", <GraduationCap size={16}/>, "college", "text", "e.g. NIT Trichy, IIT Madras")}
              
              {/* Account Type Selection */}
              <div>
                <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'block',marginBottom:8}}>Account Type</label>
                <div style={{display:'flex',gap:12}}>
                  {['student', 'admin'].map(r => (
                    <button key={r} type="button" onClick={()=>setForm(p=>({...p,role:r}))}
                      style={{
                        flex:1,padding:'14px',borderRadius:16,border:'2px solid',
                        borderColor: form.role === r ? '#2563EB' : '#E5E7EB',
                        background: form.role === r ? '#EFF6FF' : '#fff',
                        cursor:'pointer',textAlign:'left',transition:'all 0.2s',position:'relative',
                        display:'flex',flexDirection:'column',gap:4
                      }}
                    >
                      <span style={{fontSize:15,fontWeight:700,color:form.role===r?'#2563EB':'#374151',textTransform:'capitalize'}}>{r}</span>
                      <span style={{fontSize:12,color:form.role===r?'#3B82F6':'#6B7280',lineHeight:1.4}}>
                        {r === 'student' ? 'Buy & sell items on campus' : 'Approve & moderate listings'}
                      </span>
                      {form.role === r && <div style={{position:'absolute',top:12,right:12,width:18,height:18,borderRadius:'50%',background:'#2563EB',display:'flex',alignItems:'center',justifyContent:'center'}}><CheckCircle size={12} color="#fff"/></div>}
                    </button>
                  ))}
                </div>
                <p style={{fontSize:12,color:'#9CA3AF',marginTop:8,marginLeft:2}}>
                  {form.role === 'admin' ? '⚠️ Admin accounts require special authorization.' : 'Students join the campus marketplace.'}
                </p>
              </div>

              {/* Conditional Admin Code */}
              <AnimatePresence>
                {form.role === 'admin' && (
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} transition={{duration:0.25}}>
                    <div style={{paddingTop:8}}>
                      <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'block',marginBottom:8}}>Admin Access Code</label>
                      <div style={{position:'relative'}}>
                        <Shield size={17} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#9CA3AF',pointerEvents:'none'}} />
                        <input type="password" value={form.adminCode} onChange={set('adminCode')}
                          placeholder="Enter your authorization code" className="input-field"
                          style={{paddingLeft:44,borderColor:errors.adminCode?'#EF4444':undefined}}
                        />
                      </div>
                      {errors.adminCode && <p style={{color:'#EF4444',fontSize:13,marginTop:5}}>{errors.adminCode}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {renderField("Password", <Lock size={16}/>, "password", "password", "Min 6 characters", true)}
              {renderField("Confirm Password", <Lock size={16}/>, "confirm", "password", "Repeat your password", true)}

              <button type="submit" className="btn-primary" disabled={loading}
                style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:16,marginTop:4,opacity:loading?0.7:1}}
              >
                {loading ? (
                  <><span style={{width:18,height:18,border:'3px solid rgba(255,255,255,0.3)',borderTop:'3px solid #fff',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}} /> Creating...</>
                ) : (
                  <>Create Free Account <ArrowRight size={17}/></>
                )}
              </button>
            </form>
            <p style={{textAlign:'center',fontSize:12,color:'#9CA3AF',marginTop:16}}>
              By registering you agree to our <a href="#" style={{color:'#6B7280'}}>Terms</a> & <a href="#" style={{color:'#6B7280'}}>Privacy Policy</a>
            </p>
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
