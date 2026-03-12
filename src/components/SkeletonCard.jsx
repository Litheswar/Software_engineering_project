export default function SkeletonCard() {
  return (
    <div style={{
      background:'#fff', borderRadius:16, overflow:'hidden',
      border:'1px solid #F1F5F9', boxShadow:'0 4px 12px rgba(0,0,0,0.05)',
      height: '100%'
    }}>
      {/* Image skeleton */}
      <div className="skeleton" style={{paddingTop:'65%', position: 'relative'}}>
        <div style={{position:'absolute', top: 10, left: 10, width: 60, height: 18, borderRadius: 999, background: '#E2E8F0'}} />
        <div style={{position:'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: '50%', background: '#E2E8F0'}} />
      </div>
      
      <div style={{padding:'14px 16px'}}>
        {/* Category & Stats */}
        <div style={{display:'flex', justifyContent:'space-between', marginBottom: 12}}>
          <div className="skeleton" style={{height:10, width:'30%', borderRadius: 4}} />
          <div className="skeleton" style={{height:10, width:'20%', borderRadius: 4}} />
        </div>

        {/* Title skeletons */}
        <div className="skeleton" style={{height:16, width:'90%', marginBottom:8, borderRadius: 4}} />
        <div className="skeleton" style={{height:16, width:'60%', marginBottom:16, borderRadius: 4}} />

        {/* Price skeleton */}
        <div className="skeleton" style={{height:24, width:'40%', marginBottom:16, borderRadius: 4}} />

        {/* Seller Info skeleton */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          paddingTop:12, borderTop:'1px solid #F1F5F9'
        }}>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <div className="skeleton" style={{width:26, height:26, borderRadius:'50%'}} />
            <div>
              <div className="skeleton" style={{height:12, width:60, marginBottom:4, borderRadius: 2}} />
              <div className="skeleton" style={{height:10, width:40, borderRadius: 2}} />
            </div>
          </div>
          <div className="skeleton" style={{height:28, width:75, borderRadius:8}} />
        </div>
      </div>

      <style>{`
        .skeleton {
          background: linear-gradient(90deg, #F1F5F9 25%, #F8FAFC 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite linear;
        }
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
