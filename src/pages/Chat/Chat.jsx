import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Info, MessageCircle, ChevronLeft, Search, Image as ImageIcon
} from 'lucide-react';
import { mockChats } from '../../data/mockData';
import { getInitials, formatPrice } from '../../utils/helpers';
import BackButton from '../../components/BackButton/BackButton';

const Chat = () => {
  const [activeChatId, setActiveChatId] = useState(mockChats[0]?.id || null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState(mockChats);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  const activeChat = chats.find(c => c.id === activeChatId);

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setIsMobileListOpen(false);
    // Mark as read
    setChats(chats.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(chats.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          lastMessage: message.trim(),
          timestamp: 'Just now',
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    }));
    setMessage('');
  };

  return (
    <div className="page-container flex flex-col pt-16 h-screen overflow-hidden">
      <div className="flex-1 max-w-7xl w-full mx-auto bg-white sm:my-6 sm:rounded-2xl sm:shadow-card sm:border sm:border-gray-100 flex overflow-hidden">

        {/* ── Left Panel: Chat List ────────────────────── */}
        <div className={`w-full sm:w-80 md:w-96 border-r border-gray-100 flex flex-col bg-gray-50/30 ${!isMobileListOpen ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <BackButton fallbackPath="/dashboard" label="Back" />
              <h1 className="font-heading font-bold text-xl text-textDark">Messages</h1>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-gray-100 border-none rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {chats.length === 0 ? (
              <div className="text-center py-10">
                <MessageCircle size={32} className="text-textMuted mx-auto mb-2" />
                <p className="text-sm font-medium text-textDark">No messages yet</p>
                <p className="text-xs text-textMuted mt-1">Contact sellers to start chatting.</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeChatId === chat.id
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                    activeChatId === chat.id ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-primary to-blue-700 text-white'
                  }`}>
                    {getInitials(chat.partnerName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`font-semibold text-sm truncate ${activeChatId === chat.id ? 'text-white' : 'text-textDark'}`}>
                        {chat.partnerName}
                      </p>
                      <span className={`text-[10px] whitespace-nowrap ${activeChatId === chat.id ? 'text-white/80' : 'text-textMuted'}`}>
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className={`text-xs truncate font-medium mb-0.5 ${activeChatId === chat.id ? 'text-white/90' : 'text-textDark/80'}`}>
                      {chat.itemTitle}
                    </p>
                    <p className={`text-xs truncate ${activeChatId === chat.id ? 'text-white/70' : 'text-textMuted'} ${chat.unread > 0 && activeChatId !== chat.id ? 'font-semibold text-textDark' : ''}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && activeChatId !== chat.id && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Right Panel: Active Conversation ─────────── */}
        <div className={`flex-1 flex flex-col bg-white ${isMobileListOpen ? 'hidden sm:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Header */}
              <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMobileListOpen(true)}
                    className="sm:hidden p-2 -ml-2 text-textMuted hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(activeChat.partnerName)}
                  </div>
                  <div>
                    <h2 className="font-bold text-textDark text-sm">{activeChat.partnerName}</h2>
                    <p className="text-xs text-secondary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full inline-block" /> Online
                    </p>
                  </div>
                </div>
                <button title="Report User" className="p-2 text-textMuted hover:bg-red-50 hover:text-danger rounded-lg transition-all">
                  <Info size={18} />
                </button>
              </div>

              {/* Item Context Banner */}
              <div className="bg-gray-50 border-b border-gray-100 p-3 sm:px-6 flex items-center gap-4 shrink-0">
                {activeChat.itemImage ? (
                  <img src={activeChat.itemImage} alt={activeChat.itemTitle} className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <ImageIcon size={20} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-textDark truncate">{activeChat.itemTitle}</p>
                  <p className="text-secondary font-bold text-sm">{formatPrice(activeChat.itemPrice)}</p>
                </div>
                <button className="text-xs font-semibold bg-white border border-gray-200 text-textDark px-3 py-1.5 rounded-lg hover:border-primary shrink-0 transition-colors">
                  View Item
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-slate-50/50">
                {activeChat.messages.map((msg, i) => {
                  const isMe = msg.sender === 'me';
                  const showAvatar = !isMe && (i === 0 || activeChat.messages[i - 1].sender === 'me');

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
                    >
                      {!isMe && (
                        <div className="w-8 shrink-0">
                          {showAvatar && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                              {getInitials(activeChat.partnerName)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm ${
                            isMe
                              ? 'bg-primary text-white rounded-br-none shadow-md shadow-primary/20'
                              : 'bg-white text-textDark border border-gray-100 rounded-bl-none shadow-sm'
                          }`}
                        >
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-textMuted mt-1 px-1">
                          {msg.time}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <div className="flex-1 min-h-[44px] bg-gray-50 border border-gray-200 rounded-2xl relative transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full bg-transparent border-none outline-none resize-none px-4 py-3 text-sm max-h-32 custom-scrollbar"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={!message.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/30 shrink-0 transition-all"
                  >
                    <Send size={18} className="translate-x-[1px]" />
                  </motion.button>
                </form>
                <div className="flex items-center gap-1.5 mt-2 justify-center text-[10px] text-textMuted font-medium">
                  <Info size={12} />
                  Meet inside campus for safe transactions. Never pay in advance without verifying the item.
                </div>
              </div>
            </>
          ) : (
            // No chat selected state (Desktop only logically)
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 p-6 text-center h-full">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={36} className="text-primary" />
              </div>
              <h2 className="font-heading font-bold text-xl text-textDark mb-2">Your Conversations</h2>
              <p className="text-textMuted text-sm max-w-sm">
                Select a chat from the left to view messages or continue the conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
