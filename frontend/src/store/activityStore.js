import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockUserListings, mockChats } from '../data/activityData';

const useActivityStore = create(
  persist(
    (set, get) => ({
      // User listings state
      userListings: mockUserListings,
      setUserListings: (listings) => set({ userListings: listings }),
      
      // Add new listing
      addListing: (listing) => set((state) => ({
        userListings: [...state.userListings, { ...listing, id: Date.now() }]
      })),
      
      // Update listing status
      updateListingStatus: (id, status) => set((state) => ({
        userListings: state.userListings.map(listing => 
          listing.id === id ? { ...listing, status } : listing
        )
      })),
      
      // Delete listing
      deleteListing: (id) => set((state) => ({
        userListings: state.userListings.filter(listing => listing.id !== id)
      })),
      
      // Chats state
      chats: mockChats,
      setChats: (chats) => set({ chats }),
      
      // Mark chat as read
      markChatAsRead: (chatId) => set((state) => ({
        chats: state.chats.map(chat => 
          chat.id === chatId ? { ...chat, unread: false } : chat
        )
      })),
      
      // Add message to chat
      addMessage: (chatId, message) => set((state) => ({
        chats: state.chats.map(chat => 
          chat.id === chatId 
            ? { 
                ...chat, 
                messages: [...chat.messages, message],
                lastMessage: message.text,
                timestamp: 'Just now'
              }
            : chat
        )
      })),
      
      // Profile state
      profile: {
        name: "Alex Johnson",
        email: "alex.johnson@college.edu",
        trustScore: 4.8,
        itemsPosted: 12,
        itemsSold: 8,
        responseRate: 92,
        joinDate: "2023-09-15",
        totalEarnings: 25000
      },
      
      // Update profile
      updateProfile: (profileData) => set((state) => ({
        profile: { ...state.profile, ...profileData }
      })),
      
      // Active tab
      activeTab: 'listings',
      setActiveTab: (tab) => set({ activeTab: tab })
    }),
    {
      name: 'activity-storage',
      partialize: (state) => ({ 
        userListings: state.userListings,
        chats: state.chats,
        profile: state.profile
      }),
    }
  )
);

export default useActivityStore;