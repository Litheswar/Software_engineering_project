-- ========================================================
-- EECShop: The Ultimate Supabase Reset & Fix Script
-- Resolves: Infinite Recursion, 500 Schema Errors, 400 Column Errors
-- ========================================================

-- 1. CLEANUP: Drop everything to start fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- 2. TABLE SYNC: Ensure columns exist and are correct
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

-- Ensure columns exist if the table was created previously without them
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS listings_count INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS sold_count INTEGER DEFAULT 0;

-- 3. ROLE CONSTRAINTS
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'moderator'));

-- 4. NON-RECURSIVE RLS POLICIES
-- Enabling RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- POLICY: PUBLIC SELECT (NO RECURSION)
-- In a marketplace, being able to see seller profiles is essential for trust.
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.users FOR SELECT 
USING (true);

-- POLICY: OWNER UPDATE (NO RECURSION)
-- Direct check against auth.uid()
CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. TRIGGER: ATOMIC PROFILE CREATION
-- SECURITY DEFINER bypasses RLS, so no INSERT policy is needed
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. STORAGE POLICIES (for Avatar Uploads)
-- Note: Buckets should be created in the Supabase Dashboard
-- Policy for 'avatars' bucket
-- DROP POLICY IF EXISTS "Avatar images are public" ON storage.objects;
-- CREATE POLICY "Avatar images are public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
-- CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT 
-- WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 7. THE CRITICAL REFRESH
-- This command forces Supabase to refresh its field cache and resolves 500 errors
NOTIFY pgrst, 'reload schema';


