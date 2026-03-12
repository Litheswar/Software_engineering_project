-- ==========================================
-- SUPABASE PROFILES POLICIES FIXED
-- ==========================================

-- 1. Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Users can read their own profile." ON public.profiles;

-- 2. Create the new SELECT policy allowing ANY authenticated user to read profiles
CREATE POLICY "Authenticated users can read all profiles."
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- 3. Ensure the UPDATE policy only allows updating own profile
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 4. Ensure the INSERT policy only allows inserting own profile 
-- (Note: Even though the trigger handles creating it, if manual insert 
-- happens via system or authenticated API, it should match user ID)
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
