import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import ImageUploader from '../components/ImageUploader'
import { ArrowLeft, Save, Trash2, Loader, Info } from 'lucide-react'
import toast from 'react-hot-toast'

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor']

export default function EditItem() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [categories, setCategories] = useState([])
  const [form, setForm]           = useState({ title:'', category:'', price:'', condition:'', description:'' })
  const [imageUrl, setImageUrl]   = useState('')
  const [newImages, setNewImages] = useState([])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      // Fetch item
      const { data: item } = await supabase.from('items').select('*').eq('id', id).single()
      if (item) {
        if (item.seller_id !== user?.id) {
          toast.error('Unauthorized')
          navigate('/activity')
          return
        }
        setForm({
          title: item.title,
          category: item.category,
          price: item.price,
          condition: item.condition,
          description: item.description
        })
        setImageUrl(item.image_url)
      } else {
        toast.error('Item not found')
        navigate('/activity')
      }

      // Fetch categories
      const { data: cats } = await supabase.from('categories').select('name').order('name')
      if (cats) setCategories(cats.map(c => c.name))
      setLoading(false)
    }
    if (user) fetchData()
  }, [id, user, navigate])

  const setField = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      let finalImageUrl = imageUrl

      // Upload new image if provided
      if (newImages.length > 0) {
        const file = newImages[0].file
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('items-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('items-images')
          .getPublicUrl(filePath)
        
        finalImageUrl = publicUrl
      }

      const { error } = await supabase
        .from('items')
        .update({
          ...form,
          price: Number(form.price),
          image_url: finalImageUrl,
          status: 'pending' // Re-verify on edit
        })
        .eq('id', id)

      if (error) throw error
      toast.success('Listing updated! Sent for re-approval.')
      navigate('/activity')
    } catch (e) {
      toast.error(e.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageWrapper><Navbar/><div style={{textAlign:'center',padding:40}}><Loader className="spin" /></div></PageWrapper>

  return (
    <PageWrapper>
      <Navbar />
      <div style={{maxWidth:800,margin:'0 auto',padding:'24px 24px 60px'}}>
        <button onClick={()=>navigate(-1)} style={{display:'flex',alignItems:'center',gap:8,background:'none',border:'none',color:'#6B7280',cursor:'pointer',marginBottom:24,fontSize:14,fontWeight:600}}>
          <ArrowLeft size={16}/> Back to Activity
        </button>

        <div style={{background:'#fff',borderRadius:20,border:'1px solid #E2E8F0',boxShadow:'0 4px 20px rgba(0,0,0,0.05)',overflow:'hidden'}}>
          <div style={{padding:'24px 32px',borderBottom:'1px solid #F1F5F9',background:'#F8FAFC'}}>
            <h1 style={{fontSize:22,fontWeight:800,color:'#1F2937'}}>Edit Listing</h1>
            <p style={{fontSize:14,color:'#6B7280',margin:'4px 0 0'}}>Update your item details. Edits require re-approval.</p>
          </div>

          <form onSubmit={handleSave} style={{padding:32,display:'flex',flexDirection:'column',gap:24}}>
            <div>
              <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'block',marginBottom:8}}>Title</label>
              <input value={form.title} onChange={setField('title')} className="input-field" required />
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
              <div>
                <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'block',marginBottom:8}}>Category</label>
                <select value={form.category} onChange={setField('category')} className="input-field" required>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'block',marginBottom:8}}>Price (₹)</label>
                <input type="number" value={form.price} onChange={setField('price')} className="input-field" required />
              </div>
            </div>

            <div>
              <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'block',marginBottom:8}}>Condition</label>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                {CONDITIONS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(p=>({...p,condition:c}))} style={{
                    padding:'8px 16px',borderRadius:12,border:'2px solid',
                    fontSize:13,fontWeight:600,cursor:'pointer',transition:'all 0.2s',
                    borderColor: form.condition===c?'#2563EB':'#E2E8F0',
                    background: form.condition===c?'#EFF6FF':'#fff',
                    color: form.condition===c?'#2563EB':'#6B7280'
                  }}>{c}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'block',marginBottom:8}}>Description</label>
              <textarea value={form.description} onChange={setField('description')} rows={4} className="input-field" style={{resize:'vertical'}} required />
            </div>

            <div>
              <label style={{fontSize:14,fontWeight:600,color:'#374151',display:'block',marginBottom:8}}>Update Image (Optional)</label>
              {imageUrl && !newImages.length && (
                <div style={{marginBottom:12,position:'relative',width:120,height:120,borderRadius:12,overflow:'hidden',border:'2px solid #E2E8F0'}}>
                  <img src={imageUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  <div style={{position:'absolute',bottom:0,left:0,right:0,background:'rgba(0,0,0,0.5)',color:'#fff',fontSize:10,textAlign:'center',padding:2}}>Current</div>
                </div>
              )}
              <ImageUploader images={newImages} onChange={setNewImages} maxImages={1} />
            </div>

            <div style={{display:'flex',gap:12,marginTop:12,paddingTop:24,borderTop:'1px solid #F1F5F9'}}>
              <button type="button" onClick={()=>navigate('/activity')} className="btn-secondary" style={{flex:1,justifyContent:'center'}}>Cancel</button>
              <button type="submit" className="btn-primary" style={{flex:2,justifyContent:'center'}} disabled={saving}>
                {saving ? <Loader className="spin" size={18}/> : <Save size={18}/>}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}
