import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      recentlyViewed: [],
      
      // Wishlist actions
      addToWishlist: (item) => {
        const wishlist = get().wishlist;
        if (!wishlist.find(wishItem => wishItem.id === item.id)) {
          set({ wishlist: [...wishlist, item] });
        }
      },
      
      removeFromWishlist: (itemId) => {
        set({ 
          wishlist: get().wishlist.filter(item => item.id !== itemId) 
        });
      },
      
      isInWishlist: (itemId) => {
        return get().wishlist.some(item => item.id === itemId);
      },
      
      toggleWishlist: (item) => {
        const isInWish = get().isInWishlist(item.id);
        if (isInWish) {
          get().removeFromWishlist(item.id);
        } else {
          get().addToWishlist(item);
        }
      },
      
      // Recently viewed actions
      addToRecentlyViewed: (item) => {
        const viewed = get().recentlyViewed;
        const filtered = viewed.filter(viewedItem => viewedItem.id !== item.id);
        const newViewed = [item, ...filtered].slice(0, 6); // Keep only 6 items
        set({ recentlyViewed: newViewed });
      },
      
      clearRecentlyViewed: () => {
        set({ recentlyViewed: [] });
      }
    }),
    {
      name: 'campus-exchange-storage', // unique name
      partialize: (state) => ({ wishlist: state.wishlist }), // only persist wishlist
    }
  )
);

export default useWishlistStore;