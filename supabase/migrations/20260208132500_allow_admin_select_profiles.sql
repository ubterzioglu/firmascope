-- Allow admins to view all profiles (needed for Admin panel user list).
-- Keeps non-admin users restricted to only their own profile.

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin(auth.uid()));

