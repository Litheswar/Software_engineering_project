-- 1. Create Storage Bucket for Item Images
-- Note: Replace with manual bucket creation in dashboard if preferred: "item-images" (Public: true)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Add Storage Policy to allow authenticated uploads
CREATE POLICY "Users can upload item images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'item-images');

-- 3. Improve Items Table
-- Set default status to 'active'
ALTER TABLE public.items
ALTER COLUMN status SET DEFAULT 'active';

-- Prevent empty titles
ALTER TABLE public.items
ALTER COLUMN title SET NOT NULL;

-- 4. Allow authenticated users to read items
CREATE POLICY "Allow authenticated users to read items"
ON public.items
FOR SELECT
TO authenticated
USING (true);
