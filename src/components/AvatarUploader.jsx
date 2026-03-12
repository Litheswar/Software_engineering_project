import { useState } from 'react'
import { Camera, Loader2, UploadCloud, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function AvatarUploader({ url, onUpload, size = 100 }) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(event) {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
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
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #E2E8F0, #CBD5E1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '4px solid #fff',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
      }}>
        {url ? (
          <img src={url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ fontSize: size * 0.4, color: '#64748B', fontWeight: 700 }}>?</div>
        )}
      </div>

      <label style={{
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
        transition: 'all 0.2s'
      }}>
        {uploading ? (
          <Loader2 size={size * 0.16} className="animate-spin" color="#2563EB" />
        ) : (
          <Camera size={size * 0.16} color="#4B5563" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  )
}
