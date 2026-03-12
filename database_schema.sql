-- EECShop Marketplace Schema
-- This script is idempotent and safe to run multiple times.

-- 1. EXTENSIONS & STORAGE
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  college TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student',
  trust_score NUMERIC DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  listings_count INTEGER DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL REFERENCES public.categories(name),
  condition TEXT NOT NULL,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sold')),
  views INTEGER DEFAULT 0,
  wishlist_count INTEGER DEFAULT 0,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, item_id)
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS POLICIES (Idempotent)

-- Users Table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
  CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
  CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

  DROP POLICY IF EXISTS "System can create user profiles" ON public.users;
  CREATE POLICY "System can create user profiles" ON public.users FOR INSERT WITH CHECK (true);
END $$;

-- Categories Table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
  CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
  
  DROP POLICY IF EXISTS "Only admins can manage categories" ON public.categories;
  CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
END $$;

-- Items Table
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Approved items are viewable by everyone" ON public.items;
  CREATE POLICY "Approved items are viewable by everyone" ON public.items FOR SELECT USING (status = 'approved' OR status = 'sold' OR seller_id = auth.uid());

  DROP POLICY IF EXISTS "Users can insert their own items" ON public.items;
  CREATE POLICY "Users can insert their own items" ON public.items FOR INSERT WITH CHECK (auth.uid() = seller_id);

  DROP POLICY IF EXISTS "Users can update their own items" ON public.items;
  CREATE POLICY "Users can update their own items" ON public.items FOR UPDATE USING (auth.uid() = seller_id);

  DROP POLICY IF EXISTS "Users can delete their own items" ON public.items;
  CREATE POLICY "Users can delete their own items" ON public.items FOR DELETE USING (auth.uid() = seller_id);
END $$;

-- Wishlist Table
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can manage their own wishlist" ON public.wishlist;
  CREATE POLICY "Users can manage their own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);
END $$;

-- 4. TRIGGERS & FUNCTIONS (Optionally re-create if needed)

-- Initial Categories
INSERT INTO public.categories (name, icon)
VALUES 
  ('Electronics', 'Smartphone'),
  ('Books', 'Book'),
  ('Furniture', 'Home'),
  ('Clothing', 'Shirt'),
  ('Academics', 'GraduationCap'),
  ('Sports', 'Dribbble'),
  ('Other', 'MoreHorizontal')
ON CONFLICT (name) DO NOTHING;
