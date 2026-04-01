import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import ImageUploader from '../components/ImageUploader'
import GoBack from '../components/GoBack'
import { CATEGORIES, CONDITIONS, PRICE_SUGGESTIONS } from '../lib/mockData'
import { Info, CheckCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

function FormField({ label, error, required, hint, children }) {
  return (
    <div>
      <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
        {label} {required && <span style={{color:'#EF4444'}}>*</span>}
        {hint && <span style={{background:'#F3F4F6',color:'#6B7280',padding:'1px 8px',borderRadius:999,fontSize:11,fontWeight:500,cursor:'help'}} title={hint}><Info size={11}/> Tip</span>}
      </label>
      {children}
      {error && <p style={{color:'#EF4444',fontSize:13,marginTop:5}}>{error}</p>}
    </div>
  )
}

export default function SellItem() {
  const { user, profile } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ title:'', category:'', price:'', condition:'', description:'' })
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading]   = useState(false)
  const [dbCategories, setDbCategories] = useState([])
  const [submitted, setSubmitted] = useState(false)

  // Fetch real categories from database
  useEffect(() => {
    async function getCats() {
      const { data, error } = await supabase.from('categories').select('name').order('name')
      if (error) {
        console.error('Error fetching categories:', error)
        setDbCategories(CATEGORIES.slice(1)) // Fallback to mock
      } else {
        setDbCategories(data.map(c => c.name))
      }
    }
    getCats()
  }, [])

  // Warn if user tries to leave with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (form.title || form.description || images.length > 0) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [form, images])

  const suggestion = PRICE_SUGGESTIONS[form.category]

  function set(k) { return e => { setForm(p=>({...p,[k]:e.target.value})); if(errors[k]) setErrors(p=>({...p,[k]:''})) } }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    else if (form.title.length < 5) e.title = 'Title too short (min 5 chars)'
    if (!form.category) e.category = 'Select a category'
    if (!form.price) e.price = 'Price is required'
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price'
    if (!form.condition) e.condition = 'Select condition'
    if (!form.description.trim()) e.description = 'Description is required'
    else if (form.description.trim().length < 20) e.description = 'Description must be at least 20 characters'
    if (images.length === 0) e.images = 'Upload at least one image'
    return e
  }

  const BUCKET_NAME = 'items-images'

  async function handleSubmit(ev) {
    ev.preventDefault()
    console.log("Submit button clicked")
    
    if (!user) { 
      toast.error('You must be logged in to sell items'); 
      return 
    }
    
    const errs = validate()
    if (Object.keys(errs).length) { 
      setErrors(errs); 
      toast.error('Please fix the errors before submitting.'); 
      return 
    }
    
    setLoading(true)
    const toastId = toast.loading('Starting submission...')
    
    try {
      // 1. Upload Images
      const uploadedUrls = []
      for (const [index, img] of images.entries()) {
        if (img.file) {
          // Check file size (5MB limit)
          if (img.file.size > 5 * 1024 * 1024) {
            throw new Error(`Image "${img.file.name}" is too large. Maximum size is 5MB.`)
          }

          toast.loading(`Uploading image ${index + 1}...`, { id: toastId })
          const fileExt = img.file.name.split('.').pop()
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `${user.id}/${Date.now()}_${fileName}`
          
          console.log(`[Submission] Uploading to ${BUCKET_NAME}/${filePath}`)
          const { data, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, img.file)
            
          if (uploadError) {
            console.error("[Submission] Upload error:", uploadError)
            throw new Error(`Upload failed: ${uploadError.message}`)
          }
          
          console.log("[Submission] Upload response:", data)
          
          const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath)
            
          console.log("[Submission] Public URL generated:", publicUrl)
          uploadedUrls.push(publicUrl)
        }
      }

      // 2. Insert Item into Database
      toast.loading('Saving item details...', { id: toastId })
      const itemData = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        condition: form.condition,
        image_url: uploadedUrls[0] || '', // Primary image
        seller_id: user.id,
        status: 'pending'
      }
      
      console.log("Inserting item:", itemData)
      const { data: item, error: dbError } = await supabase
        .from('items')
        .insert([itemData])
        .select()
        .single()
        
      if (dbError) {
        console.error("DB Error:", dbError)
        throw new Error(`Database error: ${dbError.message}`)
      }
      
      // 3. Update Seller Statistics
      const { error: userError } = await supabase
        .from('users')
        .update({ listings_count: (profile?.listings_count || 0) + 1 })
        .eq('id', user.id)
        
      if (userError) console.error("Could not update seller stats:", userError)

      toast.success('Your item has been submitted for approval!', { id: toastId })
      setSubmitted(true)
    } catch (error) {
      console.error("Submission failed:", error)
      toast.error(error.message || 'Something went wrong. Please try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <PageWrapper>
      <Navbar/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh'}}>
        <motion.div initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',stiffness:300,damping:22}}
          style={{textAlign:'center',padding:48,maxWidth:440}}
        >
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.15,type:'spring'}}
            style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#10B981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'0 12px 30px rgba(16,185,129,0.35)'}}
          >
            <CheckCircle size={40} color="#fff"/>
          </motion.div>
          <h2 style={{fontSize:26,fontWeight:800,color:'#1F2937',marginBottom:10}}>Item Submitted! 🎉</h2>
          <p style={{color:'#6B7280',lineHeight:1.7,fontSize:15,marginBottom:32}}>
            Your listing "<strong>{form.title}</strong>" is now pending admin review. It will appear in the marketplace once approved — usually within 24hrs.
          </p>
          <div style={{background:'#F0FDF4',borderRadius:14,padding:16,marginBottom:28,border:'1px solid #BBF7D0'}}>
            <p style={{color:'#15803D',fontSize:14,margin:0,fontWeight:500}}>📋 What happens next?</p>
            <ul style={{color:'#374151',fontSize:13,textAlign:'left',marginTop:8,paddingLeft:16,lineHeight:1.8}}>
              <li>Admin reviews your listing for accuracy</li>
              <li>You receive a notification once approved</li>
              <li>Buyers can then contact you directly</li>
            </ul>
          </div>
          <div style={{display:'flex',gap:12}}>
            <button className="btn-secondary" onClick={()=>navigate('/dashboard')} style={{flex:1,justifyContent:'center'}}>Browse Market</button>
            <button className="btn-primary" onClick={()=>{setSubmitted(false);setForm({title:'',category:'',price:'',condition:'',description:''});setImages([])}} style={{flex:1,justifyContent:'center'}}>Post Another</button>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )

  const itemConditions = ['New', 'Like New', 'Good', 'Fair']

  return (
    <PageWrapper>
      <Navbar/>
      <div style={{maxWidth:760,margin:'0 auto',padding:'24px 24px 60px'}}>
        <GoBack />
        <div style={{marginBottom:28,marginTop:8}}>
          <h1 style={{fontSize:26,fontWeight:800,color:'#1F2937',marginBottom:6}}>Post an Item for Sale</h1>
          <p style={{color:'#6B7280',fontSize:15}}>Fill in the details — quality listings sell faster!</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{background:'#fff',borderRadius:20,padding:28,boxShadow:'0 4px 16px rgba(0,0,0,0.07)',marginBottom:20}}>
            <h3 style={{fontSize:17,fontWeight:700,marginBottom:20,color:'#1F2937',borderBottom:'1px solid #F1F5F9',paddingBottom:14}}>📦 Basic Information</h3>
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <FormField label="Item Title" required error={errors.title} hint="Be specific: brand + model + size if applicable">
                <input value={form.title} onChange={set('title')} placeholder="e.g. Sony WH-1000XM4 Headphones"
                  className="input-field" style={{borderColor:errors.title?'#EF4444':undefined}} />
              </FormField>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}} className="two-col">
                <FormField label="Category" required error={errors.category}>
                  <select value={form.category} onChange={set('category')}
                    className="input-field"
                    style={{appearance:'none',borderColor:errors.category?'#EF4444':undefined,
                      backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat:'no-repeat',backgroundPosition:'right 14px center'
                    }}
                  >
                    <option value="">Select category</option>
                    {dbCategories.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>

                <FormField label="Condition" required error={errors.condition}>
                  <select value={form.condition} onChange={set('condition')}
                    className="input-field"
                    style={{appearance:'none',borderColor:errors.condition?'#EF4444':undefined,
                      backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat:'no-repeat',backgroundPosition:'right 14px center'
                    }}
                  >
                    <option value="">Select condition</option>
                    {itemConditions.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
              </div>

              <FormField label="Price (₹)" required error={errors.price} hint="Price negotiation is possible">
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontWeight:700,fontSize:16,color:'#374151'}}>₹</span>
                  <input type="number" value={form.price} onChange={set('price')} min="1"
                    placeholder="0"
                    className="input-field"
                    style={{paddingLeft:32,borderColor:errors.price?'#EF4444':undefined}} />
                </div>
                {suggestion && form.category && (
                  <AnimatePresence>
                    <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                      style={{display:'flex',alignItems:'center',gap:6,marginTop:6,fontSize:13,color:'#6B7280',background:'#FFFBEB',padding:'6px 12px',borderRadius:8,border:'1px solid #FDE68A'}}
                    >
                      💡 Similar <strong>{form.category}</strong> items sell for <strong>₹{suggestion.min.toLocaleString('en-IN')} – ₹{suggestion.max.toLocaleString('en-IN')}</strong>
                    </motion.div>
                  </AnimatePresence>
                )}
              </FormField>
            </div>
          </div>

          <div style={{background:'#fff',borderRadius:20,padding:28,boxShadow:'0 4px 16px rgba(0,0,0,0.07)',marginBottom:20}}>
            <h3 style={{fontSize:17,fontWeight:700,marginBottom:20,color:'#1F2937',borderBottom:'1px solid #F1F5F9',paddingBottom:14}}>📷 Photos</h3>
            <ImageUploader images={images} onChange={setImages} />
            {errors.images && <p style={{color:'#EF4444',fontSize:13,marginTop:8}}>{errors.images}</p>}
          </div>

          <div style={{background:'#fff',borderRadius:20,padding:28,boxShadow:'0 4px 16px rgba(0,0,0,0.07)',marginBottom:28}}>
            <h3 style={{fontSize:17,fontWeight:700,marginBottom:20,color:'#1F2937',borderBottom:'1px solid #F1F5F9',paddingBottom:14}}>📝 Description</h3>
            <FormField label="Item Description" required error={errors.description} hint="Include age, defects, reason for selling">
              <textarea value={form.description} onChange={set('description')} rows={5}
                placeholder="Describe your item honestly. Include usage duration, any defects, accessories included, reason for selling, etc. (min 20 characters)"
                className="input-field"
                style={{resize:'vertical',lineHeight:1.6,borderColor:errors.description?'#EF4444':undefined}}
              />
              <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
                <span style={{fontSize:12,color:form.description.length<20&&form.description.length>0?'#EF4444':'#9CA3AF'}}>
                  {form.description.length} / 20 min characters
                </span>
              </div>
            </FormField>
          </div>

          {/* Submit */}
          <div style={{background:'#FFFBEB',borderRadius:16,padding:16,marginBottom:20,border:'1px solid #FDE68A',display:'flex',alignItems:'flex-start',gap:10}}>
            <Info size={18} color="#92400E" style={{flexShrink:0,marginTop:1}}/>
            <p style={{fontSize:13,color:'#78350F',margin:0,lineHeight:1.6}}>
              <strong>Moderation note:</strong> Your item will be reviewed by an admin before appearing in the marketplace. Listings with clear photos and accurate descriptions are approved faster.
            </p>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{width:'100%',justifyContent:'center',padding:'15px',fontSize:17,opacity:loading?0.8:1}}
          >
            {loading ? <><Loader size={18} style={{animation:'spin 0.8s linear infinite'}}/> Submitting...</> : '🚀 Submit for Approval'}
          </button>
        </form>
      </div>
      <style>{`
        @media (max-width:640px) { .two-col { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </PageWrapper>
  )
}
