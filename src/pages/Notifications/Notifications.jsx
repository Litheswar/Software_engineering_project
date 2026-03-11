import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, MessageCircle, Heart,
  PackageCheck, Info
} from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import BackButton from '../../components/BackButton/BackButton';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const getIcon = (type) => {
  switch (type) {
    case 'chat': return <MessageCircle size={18} className="text-secondary" />;
    case 'approved': return <CheckCircle size={18} className="text-primary" />;
    case 'sold': return <PackageCheck size={18} className="text-accent" />;
    case 'wishlist': return <Heart size={18} className="text-danger" />;
    default: return <Info size={18} className="text-textMuted" />;
  }
};

const getBgColor = (type) => {
  switch (type) {
    case 'chat': return 'bg-green-50 text-green-700';
    case 'approved': return 'bg-blue-50 text-blue-700';
    case 'sold': return 'bg-amber-50 text-amber-700';
    case 'wishlist': return 'bg-red-50 text-red-700';
    default: return 'bg-gray-50 text-gray-700';
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="page-container pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading font-bold text-h2 text-textDark flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-danger text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-textMuted mt-1">Updates on your listings, chats, and wishlist</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm font-medium text-primary hover:text-primary-700 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {notifications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Bell size={48} className="text-textMuted mx-auto mb-4" />
              <p className="font-semibold text-textDark">All caught up!</p>
              <p className="text-sm text-textMuted">You have no new notifications.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <motion.div
                key={notif.id}
                variants={fadeUp}
                onClick={() => markRead(notif.id)}
                className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                  notif.unread
                    ? 'bg-blue-50/40 border-primary/20 shadow-sm'
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className={`text-sm ${notif.unread ? 'font-semibold text-textDark' : 'text-textDark font-medium'}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-textMuted mt-1">{notif.time}</p>
                </div>
                {notif.unread && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;
