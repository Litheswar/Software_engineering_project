-- ========================================================
-- EECShop: Idempotent Database Migration Script
-- Purpose: Safe to run multiple times in Supabase SQL Editor
-- Features: Items, Wishlist, Reports, Categories, Users
-- ========================================================

-- ==========================================
-- 1. EXTENSIONS SETUP
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. USERS TABLE & SYNC
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  college TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  trust_score INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  listings_count INTEGER DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Ensure incremental columns exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS listings_count INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS sold_count INTEGER DEFAULT 0;

-- Role Constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'moderator'));

-- RLS Enable
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2.1 USERS POLICIES (DROP THEN CREATE)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE 
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ==========================================
-- 3. CATEGORIES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Default Data
INSERT INTO public.categories (name, icon) VALUES
('Books', 'book'), ('Electronics', 'cpu'), ('Stationery', 'pen-tool'),
('Lab Equipment', 'test-tube'), ('Furniture', 'sofa'), ('Clothing', 'shirt'),
('Sports', 'activity'), ('Gaming', 'gamepad-2'), ('Toys', 'ghost'),
('Collectibles', 'gem'), ('Art Supplies', 'palette'), ('Musical Instruments', 'music'),
('Kitchen Items', 'utensils'), ('Other', 'more-horizontal')
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- 4. ITEMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT REFERENCES public.categories(name),
  condition TEXT,
  image_url TEXT,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'sold', 'rejected')),
  views INTEGER DEFAULT 0,
  wishlist_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- 4.1 ITEMS POLICIES
DROP POLICY IF EXISTS "Public can view approved items" ON public.items;
CREATE POLICY "Public can view approved items" ON public.items FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Sellers can view all their own items" ON public.items;
CREATE POLICY "Sellers can view all their own items" ON public.items FOR SELECT USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can post new items" ON public.items;
CREATE POLICY "Users can post new items" ON public.items FOR INSERT WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers can update their own items" ON public.items;
CREATE POLICY "Sellers can update their own items" ON public.items FOR UPDATE USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers can delete their own items" ON public.items;
CREATE POLICY "Sellers can delete their own items" ON public.items FOR DELETE USING (auth.uid() = seller_id);

-- ==========================================
-- 5. WISHLIST TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, item_id)
);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own wishlist" ON public.wishlist;
CREATE POLICY "Users can manage their own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 6. REPORTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Users can view their own reports" ON public.reports FOR SELECT USING (auth.uid() = reporter_id);

-- ==========================================
-- 7. PERFORMANCE INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_items_seller ON public.items(seller_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- ==========================================
-- 8. TRIGGER: AUTH -> PUBLIC.USERS
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, college, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', 'User'), 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'college', 'Unknown'),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 9. SCHEMA REFRESH (CRITICAL)
-- ==========================================
NOTIFY pgrst, 'reload schema';
