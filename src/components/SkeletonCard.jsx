export default function SkeletonCard() {
  return (
    <div style={{
      background:'#fff', borderRadius:16, overflow:'hidden',
      border:'1px solid #F1F5F9', boxShadow:'0 4px 12px rgba(0,0,0,0.05)',
    }}>
      {/* Image skeleton */}
      <div className="skeleton" style={{paddingTop:'65%'}} />
      <div style={{padding:'14px 16px'}}>
        <div className="skeleton" style={{height:12,width:'40%',marginBottom:8}} />
        <div className="skeleton" style={{height:16,width:'85%',marginBottom:6}} />
        <div className="skeleton" style={{height:16,width:'60%',marginBottom:14}} />
        <div className="skeleton" style={{height:24,width:'35%',marginBottom:16}} />
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:10,borderTop:'1px solid #F1F5F9'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div className="skeleton" style={{width:26,height:26,borderRadius:'50%'}} />
            <div>
              <div className="skeleton" style={{height:12,width:60,marginBottom:4}} />
              <div className="skeleton" style={{height:10,width:40}} />
            </div>
          </div>
          <div className="skeleton" style={{height:30,width:80,borderRadius:8}} />
        </div>
      </div>
    </div>
  )
}
