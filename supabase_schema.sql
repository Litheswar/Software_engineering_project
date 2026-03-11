-- ==========================================
-- SUPABASE DATABASE SCHEMA FOR EECShop
-- ==========================================

-- 1️⃣ PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  trust_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read their own profile."
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);


-- 2️⃣ ITEMS TABLE
CREATE TABLE public.items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT,
  condition TEXT,
  images TEXT[] DEFAULT '{}',
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Policies for Items
CREATE POLICY "Anyone logged in can read items."
  ON public.items FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Only seller can insert their own items."
  ON public.items FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Only seller can update their own items."
  ON public.items FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = seller_id);

CREATE POLICY "Only seller can delete their own items."
  ON public.items FOR DELETE 
  TO authenticated 
  USING (auth.uid() = seller_id);


-- 3️⃣ MESSAGES TABLE
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for Messages
CREATE POLICY "Users can read messages if they are sender or receiver."
  ON public.messages FOR SELECT 
  TO authenticated 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages if they are sender."
  ON public.messages FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = sender_id);


-- 4️⃣ NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for Notifications
CREATE POLICY "Users can read their own notifications."
  ON public.notifications FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Note: No INSERT policy for authenticated users means only the system (postgres / service_role) can insert notifications, keeping it secure.


-- 5️⃣ WISHLIST TABLE
CREATE TABLE public.wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, item_id)
);

-- Enable RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Policies for Wishlist
CREATE POLICY "Users can read their own wishlist."
  ON public.wishlist FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own wishlist."
  ON public.wishlist FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlist."
  ON public.wishlist FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);


-- ==========================================
-- INDEXES
-- ==========================================

-- Foreign Key Indexes
CREATE INDEX IF NOT EXISTS idx_items_seller_id ON public.items(seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_item_id ON public.messages(item_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_item_id ON public.wishlist(item_id);

-- Created At Indexes for faster sorting
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishlist_created_at ON public.wishlist(created_at DESC);
