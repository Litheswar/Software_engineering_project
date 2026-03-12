import { motion } from 'framer-motion'

/**
 * Wrapper component for consistent page entry animation.
 * Wrap each page's root element with this.
 */
export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  )
}
