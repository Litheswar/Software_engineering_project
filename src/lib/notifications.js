import { supabase } from './supabase';

/**
 * Creates a notification for a user.
 * 
 * @param {string} userId - The recipient user ID
 * @param {string} type - 'message' | 'wishlist' | 'report' | 'item_approved' | 'item_rejected'
 * @param {string} title 
 * @param {string} message 
 * @param {string} relatedItem - The item ID to link (optional)
 */
export async function createNotification(userId, type, title, message, relatedItem = null) {
  if (!userId) return;

  // Prevent duplicate within 5 seconds
  const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
  
  let recentQuery = supabase
    .from('notifications')
    .select('id')
    .eq('user_id', userId)
    .eq('type', type)
    .eq('title', title)
    .gte('created_at', fiveSecondsAgo)
  
  if (relatedItem) {
    recentQuery = recentQuery.eq('related_item', relatedItem)
  }

  const { data: existing } = await recentQuery.maybeSingle();
  if (existing) {
    return; // Duplicate prevented
  }

  const payload = {
    user_id: userId,
    type,
    title,
    message,
  };
  if (relatedItem) payload.related_item = relatedItem;

  const { error } = await supabase.from('notifications').insert(payload);
  if (error) {
    console.error('Failed to create notification:', error);
  }
}

/**
 * Adjusts the trust_score of a given user safely.
 */
async function adjustTrustScore(userId, amount) {
  if (!userId) return;

  // 1. Fetch current trust score natively 
  const { data, error } = await supabase
    .from('users')
    .select('trust_score')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Failed to fetch trust score:', error);
    return;
  }

  const currentScore = data.trust_score || 0;
  // Use Math.max if we don't want trust score to drop below 0
  const newScore = Math.max(0, currentScore + amount);

  const { error: updateError } = await supabase
    .from('users')
    .update({ trust_score: newScore })
    .eq('id', userId);

  if (updateError) {
    console.error('Failed to update trust score:', updateError);
  }
}

export async function increaseTrustScore(userId, amount = 1) {
  return adjustTrustScore(userId, amount);
}

export async function decreaseTrustScore(userId, amount = 5) {
  return adjustTrustScore(userId, -amount);
}
