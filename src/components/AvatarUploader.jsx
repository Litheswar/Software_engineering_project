import { useState, useRef } from 'react'
import { Camera, Loader2, UploadCloud, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function AvatarUploader({ url, onUpload, size = 120 }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave" || e.type === "drop") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const processFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
       toast.error('Please upload an image file.')
       return
    }
    // Validate file size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
       toast.error('File size must be under 5MB.')
       return
    }

    try {
      setUploading(true)
      
      // Set preview (local object URL)
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      onUpload(publicUrl)
      toast.success('Avatar updated! ✨')
    } catch (error) {
      toast.error(error.message)
      setPreview(null) // Revert preview on failure
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    try {
        setUploading(true)
        onUpload(null)
        setPreview(null)
        toast.success("Avatar removed")
    } catch (error) {
        toast.error("Failed to remove avatar")
    } finally {
        setUploading(false)
    }
  }

  const displayUrl = preview || url

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div 
        style={{ 
            position: 'relative', 
            width: size, 
            height: size,
            transition: 'all 0.2s',
            transform: dragActive ? 'scale(1.05)' : 'scale(1)',
            cursor: uploading ? 'not-allowed' : 'pointer'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => { if (!uploading) inputRef.current?.click() }}
      >
        <div style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #E2E8F0, #CBD5E1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: dragActive ? '4px dashed #3B82F6' : '4px solid #fff',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
        }}>
          {displayUrl ? (
            <img 
               src={displayUrl} 
               alt="Avatar" 
               style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  opacity: uploading ? 0.5 : 1
               }} 
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748B' }}>
               <UploadCloud size={size * 0.3} />
               <span style={{ fontSize: 10, fontWeight: 700, marginTop: 4 }}>Drag Image</span>
            </div>
          )}

          {uploading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.4)' }}>
              <Loader2 size={size * 0.3} className="animate-spin" color="#2563EB" />
            </div>
          )}
        </div>

        <button 
          onClick={(e) => { 
             e.stopPropagation()
             inputRef.current?.click() 
          }}
          disabled={uploading}
          title="Upload new avatar"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: '50%',
            background: '#fff',
            border: '2px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
            zIndex: 10
        }}>
          <Camera size={size * 0.16} color="#4B5563" />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
        style={{ display: 'none' }}
      />
      
      {/* Remove option if there is an avatar */}
      {displayUrl && !uploading && (
        <button 
          onClick={handleRemove}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#EF4444',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Trash2 size={12} /> Remove Avatar
        </button>
      )}
    </div>
  )
}
