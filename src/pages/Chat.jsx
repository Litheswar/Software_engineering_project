import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import { supabase } from '../lib/supabase'
import { createNotification } from '../lib/notifications'
import toast from 'react-hot-toast'
import { ArrowLeft, Send } from 'lucide-react'

export default function Chat() {
  const { itemId, otherUserId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [messages, setMessages] = useState([])
  const [item, setItem] = useState(null)
  const [otherUser, setOtherUser] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  
  const endRef = useRef(null)

  useEffect(() => {
    if (!user) return

    async function fetchData() {
      // Fetch Item details
      const { data: itemData } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single()
      
      if (itemData) setItem(itemData)

      // Fetch other user details
      const { data: userData } = await supabase
        .from('users')
        .select('name, avatar_url, trust_score')
        .eq('id', otherUserId)
        .single()
      
      if (userData) setOtherUser(userData)

      // Fetch existing messages
      const { data: msgs, error } = await supabase
        .from('messages')
        .select('*')
        .eq('item_id', itemId)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      if (msgs) setMessages(msgs)
      
      setLoading(false)
    }

    fetchData()

    // Subscribe to new messages
    const channel = supabase.channel(`chat_${itemId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `item_id=eq.${itemId}` },
        (payload) => {
          const msg = payload.new
          // Only add to state if it belongs to this conversation
          if (
            (msg.sender_id === user.id && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, msg])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [itemId, otherUserId, user])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const messageText = newMessage.trim()
    setNewMessage('') // optimistic UI clear

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: otherUserId,
        item_id: itemId,
        message: messageText
      })

    if (error) {
      toast.error('Failed to send message')
      setNewMessage(messageText) // Revert state
      return
    }

    // Trigger Notification for the receiver
    // Don't await this so it doesn't block UI perception
    const { data: senderProfile } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single()

    const senderName = senderProfile?.name || 'Someone'
    const itemTitle = item?.title ? `"${item.title}"` : 'an item'

    createNotification(
      otherUserId,
      'message',
      'New Message 💬',
      `${senderName} sent you a message regarding ${itemTitle}`,
      itemId
    ).catch(console.error)
  }

  if (loading) {
    return (
      <PageWrapper>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: 100 }}>Loading chat...</div>
      </PageWrapper>
    )
  }

  // Check if we couldn't load the item or other user
  if (!item || !otherUser) {
    return (
      <PageWrapper>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: 100 }}>
          <p>Chat not found or item deleted.</p>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{marginTop: 10}}>Go Back</button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '20px auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
        
        {/* Chat Header */}
        <div style={{ background: '#fff', padding: '16px 24px', borderRadius: '16px 16px 0 0', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={24} color="#6B7280" />
          </button>
          
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            {otherUser.avatar_url ? (
              <img src={otherUser.avatar_url} alt="" style={{width: 44, height: 44, borderRadius: '50%', objectFit: 'cover'}} />
            ) : (
              otherUser.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#1F2937' }}>{otherUser.name}</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
              Regarding: <strong>{item.title}</strong>
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, background: '#F8FAFC', padding: 24, overflowY: 'auto', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9CA3AF', margin: 'auto 0' }}>
              No messages yet. Send a message to start chatting!
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === user.id
              const timestampStr = msg.created_at.endsWith('Z') || msg.created_at.includes('+') ? msg.created_at : msg.created_at + 'Z'
              const timeStr = new Date(timestampStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              const dateStr = new Date(timestampStr).toLocaleDateString([], { month: 'short', day: 'numeric'})

              return (
                <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    maxWidth: '75%', 
                    padding: '12px 16px', 
                    borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isMine ? '#2563EB' : '#fff',
                    color: isMine ? '#fff' : '#1F2937',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: isMine ? 'none' : '1px solid #E2E8F0'
                  }}>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.message}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: isMine ? '#BFDBFE' : '#9CA3AF' }}>{dateStr} · {timeStr}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={endRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} style={{ background: '#fff', padding: '16px 24px', borderRadius: '0 0 16px 16px', border: '1px solid #E2E8F0', display: 'flex', gap: 12 }}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            style={{ 
              flex: 1, 
              padding: '12px 16px', 
              borderRadius: 24, 
              border: '1px solid #E2E8F0', 
              background: '#F8FAFC',
              outline: 'none',
              fontSize: 15
            }}
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            style={{ 
              width: 46, height: 46, 
              borderRadius: '50%', 
              background: newMessage.trim() ? '#2563EB' : '#9CA3AF', 
              color: '#fff', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s'
            }}
          >
            <Send size={18} style={{ marginLeft: 2 }} />
          </button>
        </form>
      </div>
    </PageWrapper>
  )
}
