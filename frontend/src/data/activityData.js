// Mock data for Activity Page

export const mockUserListings = [
  {
    id: 1,
    title: "Calculus Textbook - 8th Edition",
    category: "Textbooks",
    price: 250,
    condition: "Like New",
    status: "APPROVED",
    views: 42,
    createdAt: "2024-01-15",
    image: "https://placehold.co/300x200?text=Calculus+Book"
  },
  {
    id: 2,
    title: "MacBook Air 2020",
    category: "Electronics",
    price: 45000,
    condition: "Good",
    status: "PENDING",
    views: 15,
    createdAt: "2024-01-18",
    image: "https://placehold.co/300x200?text=MacBook+Air"
  },
  {
    id: 3,
    title: "Winter Jacket - Size M",
    category: "Clothing",
    price: 800,
    condition: "Like New",
    status: "SOLD",
    views: 67,
    createdAt: "2024-01-10",
    image: "https://placehold.co/300x200?text=Winter+Jacket"
  },
  {
    id: 4,
    title: "Study Desk Lamp",
    category: "Furniture",
    price: 350,
    condition: "New",
    status: "APPROVED",
    views: 23,
    createdAt: "2024-01-20",
    image: "https://placehold.co/300x200?text=Desk+Lamp"
  }
];

export const mockChats = [
  {
    id: 1,
    buyerName: "Rahul Sharma",
    itemName: "Calculus Textbook - 8th Edition",
    lastMessage: "Is this still available?",
    timestamp: "2 hours ago",
    unread: true,
    messages: [
      { id: 1, sender: "buyer", text: "Hi, is this still available?", time: "10:30 AM" },
      { id: 2, sender: "seller", text: "Yes, it's still available!", time: "10:32 AM" },
      { id: 3, sender: "buyer", text: "Great! What's the condition?", time: "10:35 AM" }
    ]
  },
  {
    id: 2,
    buyerName: "Priya Patel",
    itemName: "MacBook Air 2020",
    lastMessage: "Can you reduce the price to ₹40,000?",
    timestamp: "1 day ago",
    unread: false,
    messages: [
      { id: 1, sender: "buyer", text: "Can you reduce the price to ₹40,000?", time: "Yesterday" }
    ]
  },
  {
    id: 3,
    buyerName: "Amit Kumar",
    itemName: "Winter Jacket - Size M",
    lastMessage: "Sold to someone else",
    timestamp: "3 days ago",
    unread: false,
    messages: [
      { id: 1, sender: "buyer", text: "Sold to someone else", time: "3 days ago" }
    ]
  }
];

export const mockProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@college.edu",
  trustScore: 4.8,
  itemsPosted: 12,
  itemsSold: 8,
  responseRate: 92,
  joinDate: "2023-09-15",
  totalEarnings: 25000
};

export const quickReplies = [
  "Is it available?",
  "Price negotiable?",
  "Can I see more photos?",
  "Where can we meet?",
  "I'm interested!"
];

export const topPerformingItem = mockUserListings.find(item => item.views === Math.max(...mockUserListings.map(i => i.views)));