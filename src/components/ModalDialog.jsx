import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function ModalDialog({ isOpen, onClose, title, children, maxWidth = 480 }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(17,24,39,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 400, cursor: 'pointer',
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 500, width: `min(${maxWidth}px, calc(100vw - 32px))`,
            background: '#fff', borderRadius: 20,
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px', borderBottom: '1px solid #F1F5F9',
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: '50%', border: 'none',
              background: '#F1F5F9', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background='#E5E7EB'}
              onMouseLeave={e => e.currentTarget.style.background='#F1F5F9'}
            >
              <X size={16} color="#6B7280" />
            </button>
          </div>
          {/* Body */}
          <div style={{ padding: 24 }}>{children}</div>
        </motion.div>
      </>
    )}
    </AnimatePresence>
  )
}
