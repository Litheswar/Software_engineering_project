// Utility helpers for EECShop

/**
 * Format price to Indian currency display
 */
export const formatPrice = (price) => {
  return `₹${Number(price).toLocaleString('en-IN')}`;
};

/**
 * Return badge class for item condition
 */
export const conditionBadgeClass = (condition) => {
  const map = {
    'New': 'badge-new',
    'Like New': 'badge-new',
    'Good': 'badge-good',
    'Used': 'badge-used',
    'Damaged': 'badge-damaged',
  };
  return map[condition] || 'badge-used';
};

/**
 * Return trust score color based on score
 */
export const trustScoreColor = (score) => {
  if (score >= 85) return 'text-green-600';
  if (score >= 65) return 'text-yellow-600';
  return 'text-red-500';
};

/**
 * Truncate text to given length
 */
export const truncate = (text, maxLen = 60) => {
  if (!text) return '';
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
};

/**
 * Time ago helper
 */
export const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/**
 * Generate avatar initials from name
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

/**
 * Get category icon emoji (Updated categories)
 */
export const categoryEmoji = (category) => {
  const map = {
    'Books': '📚',
    'Electronics': '🔌',
    'Lab Equipment': '🔬',
    'Stationery': '✏️',
    'Engineering Tools': '📐',
    'Hostel Items': '🛏️',
    'Furniture': '🪑',
    'Sports': '⚽',
    'Gaming': '🎮',
    'Clothing': '👕',
    'Accessories': '🎒',
    'Others': '📦',
  };
  return map[category] || '📦';
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Simple image placeholder gradient by category (Updated categories)
 */
export const getCategoryGradient = (category) => {
  const map = {
    'Books': 'from-blue-400 to-blue-600',
    'Electronics': 'from-purple-400 to-purple-600',
    'Lab Equipment': 'from-teal-400 to-teal-600',
    'Stationery': 'from-yellow-400 to-amber-500',
    'Engineering Tools': 'from-gray-400 to-gray-600',
    'Hostel Items': 'from-rose-400 to-rose-600',
    'Furniture': 'from-orange-400 to-orange-600',
    'Sports': 'from-lime-400 to-lime-600',
    'Gaming': 'from-indigo-400 to-indigo-600',
    'Clothing': 'from-pink-400 to-pink-600',
    'Accessories': 'from-cyan-400 to-cyan-600',
    'Others': 'from-slate-400 to-slate-600',
  };
  return map[category] || 'from-slate-400 to-slate-600';
};
