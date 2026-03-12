import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: '#FFF5F5',
          borderRadius: 16,
          border: '1px solid #FECACA',
          margin: '20px 0'
        }}>
          <AlertTriangle size={48} color="#EF4444" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#991B1B', marginBottom: 8 }}>
            Something went wrong
          </h3>
          <p style={{ color: '#B91C1C', fontSize: 14, marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
            We encountered an error while loading this section. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto', background: '#EF4444' }}
          >
            <RefreshCw size={16} /> Reload Page
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <pre style={{ 
              marginTop: 20, 
              padding: 12, 
              background: '#fff', 
              borderRadius: 8, 
              fontSize: 12, 
              color: '#6B7280', 
              textAlign: 'left',
              overflowX: 'auto'
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
