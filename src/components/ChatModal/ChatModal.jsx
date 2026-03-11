import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

const ChatModal = ({ isOpen, onClose, item }) => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      onClose();
    }, 1800);
  };

  const quickMessages = [
    'Is this still available?',
    'Can we negotiate the price?',
    'Where can we meet?',
    'What is the final condition?',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-blue-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(item?.seller)}
                  </div>
                  <div>
                    <p className="font-semibold text-textDark text-sm">{item?.seller}</p>
                    <p className="text-xs text-textMuted truncate max-w-[180px]">{item?.title}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-textMuted hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-8 gap-3"
                  >
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                      <MessageCircle size={32} className="text-secondary" />
                    </div>
                    <p className="font-semibold text-textDark">Message Sent!</p>
                    <p className="text-sm text-textMuted text-center">
                      {item?.seller} will get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Quick messages */}
                    <p className="text-xs font-medium text-textMuted mb-2">Quick Messages</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {quickMessages.map((msg) => (
                        <button
                          key={msg}
                          onClick={() => setMessage(msg)}
                          className="text-xs border border-gray-200 rounded-full px-3 py-1.5 text-textDark hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          {msg}
                        </button>
                      ))}
                    </div>

                    {/* Message input */}
                    <form onSubmit={handleSend}>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message to the seller..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={!message.trim()}
                        className="mt-3 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={16} />
                        Send Message
                      </motion.button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
