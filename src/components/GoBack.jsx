import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function GoBack() {
  const navigate = useNavigate()

  return (
    <button 
      onClick={() => navigate(-1)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#6B7280', fontSize: 14, fontWeight: 600,
        padding: '8px 12px 8px 0', marginBottom: 16,
        transition: 'all 0.2s ease',
      }}
      className="go-back-btn"
    >
      <ArrowLeft size={16} /> Back
      <style>{`
        .go-back-btn:hover {
          color: #1F2937;
          transform: translateX(-4px);
        }
      `}</style>
    </button>
  )
}
