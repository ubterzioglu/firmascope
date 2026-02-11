-- Fix profiles table - remove public SELECT access, only allow users to see their own profile
-- This prevents email harvesting and user ID leakage

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);