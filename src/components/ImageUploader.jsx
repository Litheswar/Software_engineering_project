import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ImageUploader({ images, onChange, maxImages = 5 }) {
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  function handleFiles(files) {
    const validFormats = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    const arr = Array.from(files).slice(0, maxImages - images.length)
    arr.forEach(file => {
      if (!validFormats.includes(file.type)) {
        toast.error(`Invalid format: ${file.name}. Only JPG, PNG, WEBP allowed.`)
        return
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name} (Max 5MB)`)
        return
      }

      const reader = new FileReader()
      reader.onload = e => onChange(prev => [...prev, { url: e.target.result, file }])
      reader.readAsDataURL(file)
    })
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  function removeImage(idx) {
    onChange(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => images.length < maxImages && fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragOver ? '#2563EB' : '#D1D5DB'}`,
          borderRadius: 16,
          padding: '32px 24px',
          textAlign: 'center',
          background: dragOver ? '#EFF6FF' : '#F8FAFC',
          cursor: images.length < maxImages ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
        }}
      >
        <Upload size={32} color={dragOver ? '#2563EB' : '#9CA3AF'} style={{margin:'0 auto 12px'}} />
        <p style={{fontSize:15,fontWeight:600,color: dragOver ? '#2563EB':'#374151',margin:'0 0 6px'}}>
          {images.length < maxImages ? 'Drop images here or click to upload' : `Maximum ${maxImages} images reached`}
        </p>
        <p style={{fontSize:13,color:'#9CA3AF',margin:0}}>
          PNG, JPG, WEBP up to 5MB each • Up to {maxImages} images
        </p>
        <input ref={fileRef} type="file" multiple accept="image/*" style={{display:'none'}}
          onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))',gap:12,marginTop:16}}>
          <AnimatePresence>
            {images.map((img, i) => (
              <motion.div key={i}
                initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.8}}
                style={{position:'relative',borderRadius:12,overflow:'hidden',
                  aspectRatio:'1',border:'2px solid #E2E8F0'}}
              >
                <img src={img.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                {i === 0 && (
                  <div style={{position:'absolute',bottom:4,left:4,background:'#2563EB',color:'#fff',
                    fontSize:10,fontWeight:700,padding:'2px 6px',borderRadius:4}}>Main</div>
                )}
                <button onClick={() => removeImage(i)} style={{
                  position:'absolute',top:4,right:4,width:22,height:22,borderRadius:'50%',
                  background:'rgba(0,0,0,0.7)',border:'none',cursor:'pointer',
                  display:'flex',alignItems:'center',justifyContent:'center',
                }}>
                  <X size={12} color="#fff"/>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {images.length === 0 && (
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 0',color:'#9CA3AF',fontSize:13}}>
          <Image size={16}/> Upload at least 1 image for better visibility
        </div>
      )}
    </div>
  )
}
