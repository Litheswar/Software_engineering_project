import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaComments } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useActivityStore from '../store/activityStore';
import { quickReplies } from '../data/activityData';

const ChatPanel = () => {
  const { chats, markChatAsRead, addMessage } = useActivityStore();
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    if (chat.unread) {
      markChatAsRead(chat.id);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      id: Date.now(),
      sender: 'seller',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addMessage(selectedChat.id, message);
    setNewMessage('');
    toast.success('Message sent!');
  };

  const handleQuickReply = (reply) => {
    setNewMessage(reply);
  };

  const isItemSold = (itemName) => {
    // Mock check if item is sold
    return itemName.includes('Winter Jacket');
  };

  if (chats.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No conversations yet</h3>
        <p className="text-gray-600">Your messages will appear here</p>
      </motion.div>
    );
  }

  return (
    <div className="flex h-[600px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Messages</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ backgroundColor: '#f9fafb' }}
              onClick={() => handleChatSelect(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer ${
                selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-gray-800">{chat.buyerName}</h4>
                {chat.unread && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1 truncate">{chat.itemName}</p>
              <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
              <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedChat.buyerName}</h3>
                  <p className="text-sm text-gray-600">{selectedChat.itemName}</p>
                </div>
                {isItemSold(selectedChat.itemName) && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Item Sold
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === 'seller'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-200 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'seller' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {!isItemSold(selectedChat.itemName) && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-white px-2 py-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              {isItemSold(selectedChat.itemName) ? (
                <div className="text-center py-4 text-gray-500">
                  <FaTimes className="inline mr-2" />
                  Chat disabled - Item sold
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FaComments className="text-4xl mx-auto mb-2" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;