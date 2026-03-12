import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { ShoppingBag, BookOpen, Monitor, Sofa, Shield, CheckCircle, Users, ArrowRight, Star, Zap } from 'lucide-react'
import { MOCK_ITEMS } from '../lib/mockData'
import ItemCard from '../components/ItemCard'

const featuredItems = MOCK_ITEMS.filter(i => i.status === 'approved').slice(0, 4)

const steps = [
  { icon: <Monitor size={32} color="#2563EB"/>, title: 'Post Your Item', desc: 'List items in under 2 minutes with photos, price & condition.', step: '01' },
  { icon: <Shield size={32} color="#10B981"/>, title: 'Admin Approves', desc: 'Our team verifies listings to keep the marketplace safe and trusted.', step: '02' },
  { icon: <Users size={32} color="#F59E0B"/>, title: 'Connect & Deal', desc: 'Chat with buyers/sellers securely within the platform.', step: '03' },
]

const trustPoints = [
  { icon: <CheckCircle size={28} color="#2563EB"/>, title: 'Verified Students', desc: 'Only registered students from verified college emails can join.' },
  { icon: <Shield size={28} color="#10B981"/>, title: 'Admin Moderated', desc: 'Every listing is reviewed before appearing in the marketplace.' },
  { icon: <Star size={28} color="#F59E0B"/>, title: 'Trust Scores', desc: 'Sellers earn scores based on successful deals and reviews.' },
  { icon: <Zap size={28} color="#EF4444"/>, title: 'Fast & Safe', desc: 'Find what you need in seconds, deal safely within campus.' },
]

const stats = [
  { label: 'Items Listed', value: '2,400+' },
  { label: 'Happy Students', value: '1,800+' },
  { label: 'Colleges', value: '50+' },
  { label: 'Deals Closed', value: '3,200+' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      {/* ==================== NAVBAR ==================== */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', height: 68, gap: 16,
        }}>
          <Link to="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
            <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#2563EB,#1D4ED8)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <ShoppingBag size={20} color="#fff"/>
            </div>
            <span style={{fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:20,color:'#1F2937'}}>
              EEC<span style={{color:'#2563EB'}}>Shop</span>
            </span>
          </Link>
          <div style={{flex:1}} />
          <div style={{display:'flex',gap:12}}>
            <Link to="/login" className="btn-secondary" style={{padding:'9px 20px',fontSize:14}}>Login</Link>
            <Link to="/register" className="btn-primary" style={{padding:'9px 20px',fontSize:14}}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 50%, #FFFBEB 100%)',
        padding: '80px 24px 100px',
        overflow: 'hidden', position: 'relative',
      }}>
        {/* Decorative blobs */}
        <div style={{position:'absolute',top:-100,right:-100,width:400,height:400,borderRadius:'50%',background:'rgba(37,99,235,0.06)',filter:'blur(60px)'}} />
        <div style={{position:'absolute',bottom:-80,left:-80,width:300,height:300,borderRadius:'50%',background:'rgba(16,185,129,0.06)',filter:'blur(50px)'}} />

        <div style={{maxWidth:1280,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}} className="hero-grid">
          {/* Left text */}
          <motion.div initial={{opacity:0,x:-40}} animate={{opacity:1,x:0}} transition={{duration:0.6}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'#DBEAFE',color:'#1D4ED8',padding:'6px 14px',borderRadius:999,fontSize:13,fontWeight:600,marginBottom:20}}>
              🎓 Campus Marketplace · Trusted by Students
            </div>
            <h1 style={{fontSize:'clamp(32px,4vw,52px)',fontWeight:800,color:'#1F2937',lineHeight:1.15,marginBottom:20}}>
              Buy & Sell Within<br/><span style={{color:'#2563EB'}}>Your Campus</span> Safely
            </h1>
            <p style={{fontSize:18,color:'#6B7280',lineHeight:1.7,marginBottom:36,maxWidth:480}}>
              EECShop connects students for seamless second-hand trades — fast, verified, and campus-safe. From textbooks to laptops, find great deals near you.
            </p>
            <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
              <button onClick={()=>navigate('/register')} className="btn-primary" style={{fontSize:16,padding:'14px 28px'}}>
                Explore Marketplace <ArrowRight size={18}/>
              </button>
              <button onClick={()=>navigate('/login')} className="btn-secondary" style={{fontSize:16,padding:'14px 28px'}}>
                Login
              </button>
            </div>

            {/* Mini stats */}
            <div style={{display:'flex',gap:24,marginTop:48,flexWrap:'wrap'}}>
              {stats.map(s => (
                <div key={s.label}>
                  <p style={{fontSize:22,fontWeight:800,color:'#1F2937',margin:0}}>{s.value}</p>
                  <p style={{fontSize:13,color:'#6B7280',margin:0}}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right illustration */}
          <motion.div
            initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{duration:0.6,delay:0.2}}
            className="float-animation"
            style={{display:'flex',justifyContent:'center'}}
          >
            <div style={{position:'relative',width:'100%',maxWidth:480}}>
              {/* Main hero card */}
              <div style={{background:'#fff',borderRadius:24,padding:28,boxShadow:'0 20px 60px rgba(37,99,235,0.18)',border:'1px solid #E2E8F0'}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                  <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,#2563EB,#1D4ED8)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <BookOpen size={22} color="#fff"/>
                  </div>
                  <div>
                    <p style={{fontWeight:700,fontSize:15,margin:0}}>Advanced Algorithms Textbook</p>
                    <p style={{color:'#6B7280',fontSize:13,margin:0}}>Books · Like New</p>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                  <span style={{fontSize:28,fontWeight:800,color:'#2563EB'}}>₹450</span>
                  <span style={{background:'#DCFCE7',color:'#15803D',padding:'4px 12px',borderRadius:999,fontSize:12,fontWeight:700}}>✓ Approved</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'#F8FAFC',borderRadius:12}}>
                  <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#2563EB,#1D4ED8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'#fff',fontWeight:700}}>A</div>
                  <div>
                    <p style={{fontWeight:600,fontSize:13,margin:0}}>Arjun M. · NIT Trichy</p>
                    <div style={{display:'flex',alignItems:'center',gap:4}}>
                      {'★★★★★'.split('').map((s,i)=><span key={i} style={{color:'#F59E0B',fontSize:12}}>{s}</span>)}
                      <span style={{fontSize:12,color:'#6B7280'}}> 4.8</span>
                    </div>
                  </div>
                  <button className="btn-primary" style={{marginLeft:'auto',padding:'8px 16px',fontSize:13}}>Contact</button>
                </div>
              </div>

              {/* Floating badge 1 */}
              <div style={{position:'absolute',top:-16,right:-16,background:'#fff',borderRadius:14,padding:'10px 16px',boxShadow:'0 10px 30px rgba(0,0,0,0.12)',border:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:18}}>🛡️</span>
                <span style={{fontSize:13,fontWeight:600,color:'#1F2937'}}>Admin Verified</span>
              </div>
              {/* Floating badge 2 */}
              <div style={{position:'absolute',bottom:-16,left:-16,background:'#fff',borderRadius:14,padding:'10px 16px',boxShadow:'0 10px 30px rgba(0,0,0,0.12)',border:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:18}}>⚡</span>
                <span style={{fontSize:13,fontWeight:600,color:'#1F2937'}}>Post in 2 mins</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}}>
            <p className="section-title">How EECShop Works</p>
            <p className="section-subtitle">List, approve, connect — it's that simple.</p>
          </motion.div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:28,position:'relative'}}>
            {steps.map((s, i) => (
              <motion.div key={i}
                initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
                transition={{duration:0.5,delay:i*0.12}}
                whileHover={{y:-6,boxShadow:'0 20px 40px rgba(37,99,235,0.12)'}}
                style={{background:'#F8FAFC',borderRadius:20,padding:32,position:'relative',border:'1px solid #F1F5F9',transition:'box-shadow 0.2s'}}
              >
                <div style={{position:'absolute',top:20,right:20,fontSize:48,fontWeight:900,color:'rgba(37,99,235,0.06)',lineHeight:1}}>{s.step}</div>
                <div style={{width:56,height:56,borderRadius:16,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(0,0,0,0.08)',marginBottom:20}}>
                  {s.icon}
                </div>
                <h3 style={{fontSize:19,fontWeight:700,marginBottom:10}}>{s.title}</h3>
                <p style={{color:'#6B7280',lineHeight:1.6,fontSize:15,margin:0}}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED ITEMS ==================== */}
      <section style={{padding:'80px 24px',background:'#F8FAFC'}}>
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}}>
            <p className="section-title">Featured Items</p>
            <p className="section-subtitle">Fresh listings from students near you.</p>
          </motion.div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:24}}>
            {featuredItems.map(item => <ItemCard key={item.id} item={item} />)}
          </div>
          <div style={{textAlign:'center',marginTop:40}}>
            <Link to="/register" className="btn-primary" style={{display:'inline-flex',fontSize:15,padding:'13px 32px'}}>
              View All Listings <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== TRUST SECTION ==================== */}
      <section style={{padding:'80px 24px',background:'linear-gradient(135deg,#1F2937 0%,#111827 100%)'}}>
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}}>
            <p style={{fontFamily:'Poppins,sans-serif',fontSize:28,fontWeight:700,color:'#fff',textAlign:'center',marginBottom:8}}>Why Students Trust Us</p>
            <p style={{fontSize:16,color:'#9CA3AF',textAlign:'center',marginBottom:48}}>Safety and trust are at the core of EECShop</p>
          </motion.div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:24}}>
            {trustPoints.map((t, i) => (
              <motion.div key={i}
                initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
                transition={{duration:0.5,delay:i*0.1}}
                whileHover={{y:-4}}
                style={{background:'rgba(255,255,255,0.05)',borderRadius:20,padding:28,border:'1px solid rgba(255,255,255,0.1)',transition:'all 0.2s'}}
              >
                <div style={{width:52,height:52,borderRadius:14,background:'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
                  {t.icon}
                </div>
                <h3 style={{fontSize:17,fontWeight:700,color:'#fff',marginBottom:8}}>{t.title}</h3>
                <p style={{color:'#9CA3AF',fontSize:14,lineHeight:1.6,margin:0}}>{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section style={{padding:'80px 24px',background:'linear-gradient(135deg,#2563EB,#1D4ED8)',textAlign:'center'}}>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}}>
          <h2 style={{fontSize:36,fontWeight:800,color:'#fff',marginBottom:16}}>Ready to Buy or Sell?</h2>
          <p style={{fontSize:18,color:'rgba(255,255,255,0.8)',marginBottom:36,maxWidth:500,margin:'0 auto 36px'}}>Join thousands of students who've found great deals on EECShop</p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/register" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 32px',background:'#fff',color:'#2563EB',borderRadius:12,fontWeight:700,fontSize:16,textDecoration:'none',transition:'transform 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='none'}
            >
              Join Free Today <ArrowRight size={18}/>
            </Link>
            <Link to="/login" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 32px',background:'rgba(255,255,255,0.12)',color:'#fff',borderRadius:12,fontWeight:600,fontSize:16,border:'2px solid rgba(255,255,255,0.3)',textDecoration:'none'}}>
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer style={{background:'#111827',padding:'48px 24px 28px'}}>
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:32}}>
            <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#2563EB,#1D4ED8)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <ShoppingBag size={17} color="#fff"/>
            </div>
            <span style={{fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:18,color:'#fff'}}>EEC<span style={{color:'#2563EB'}}>Shop</span></span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:32,marginBottom:36}}>
            <div>
              <p style={{color:'#9CA3AF',fontSize:14,maxWidth:280,lineHeight:1.7,margin:0}}>The safest campus marketplace for students. Buy, sell, and connect — all within your college community.</p>
            </div>
            <div style={{display:'flex',gap:48,flexWrap:'wrap'}}>
              {[['Platform',['Marketplace','Sell Item','How It Works']],['Support',['About Us','Contact','Report Issue']],['Legal',['Terms of Service','Privacy Policy','Cookie Policy']]].map(([heading,links]) => (
                <div key={heading}>
                  <p style={{color:'#fff',fontWeight:600,fontSize:14,marginBottom:12}}>{heading}</p>
                  {links.map(l=>(
                    <a key={l} href="#" style={{display:'block',color:'#9CA3AF',fontSize:14,marginBottom:8,textDecoration:'none',transition:'color 0.15s'}}
                      onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                      onMouseLeave={e=>e.currentTarget.style.color='#9CA3AF'}
                    >{l}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid #1F2937',paddingTop:24,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
            <p style={{color:'#6B7280',fontSize:13,margin:0}}>© 2024 EECShop. All rights reserved.</p>
            <p style={{color:'#6B7280',fontSize:13,margin:0}}>Made with ❤️ for campus students</p>
          </div>
        </div>
      </footer>

      <style>{`
        .hero-grid { @media (max-width: 768px) { grid-template-columns: 1fr; } }
        @media (max-width:768px) { .hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </PageWrapper>
  )
}
