import React from 'react';

/**
 * ErrorBoundary - A class component that catches JavaScript errors anywhere 
 * in their child component tree, logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-surface p-6 text-center">
          <div className="bg-white rounded-2xl shadow-premium p-8 max-w-md w-full border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="font-heading font-bold text-xl text-textDark mb-3">Something went wrong</h2>
            <p className="text-textMuted mb-8 text-sm leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left bg-gray-50 p-4 rounded-lg overflow-auto max-h-40">
                <summary className="text-xs font-bold text-textMuted cursor-pointer mb-2">Error Details</summary>
                <p className="text-[10px] font-mono text-red-600 whitespace-pre-wrap">
                  {this.state.error && this.state.error.toString()}
                </p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
