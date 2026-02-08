-- Fix security definer views by recreating them with security_invoker=on
-- This ensures RLS policies are enforced based on the querying user

-- Drop and recreate reviews_public view
DROP VIEW IF EXISTS public.reviews_public;
CREATE VIEW public.reviews_public
WITH (security_invoker=on) AS
SELECT 
  id,
  company_id,
  title,
  pros,
  cons,
  rating,
  recommends,
  created_at,
  updated_at
FROM public.reviews;

-- Drop and recreate salaries_public view  
DROP VIEW IF EXISTS public.salaries_public;
CREATE VIEW public.salaries_public
WITH (security_invoker=on) AS
SELECT
  id,
  company_id,
  job_title,
  salary_amount,
  currency,
  experience_years,
  created_at
FROM public.salaries;

-- Drop and recreate interviews_public view
DROP VIEW IF EXISTS public.interviews_public;
CREATE VIEW public.interviews_public
WITH (security_invoker=on) AS
SELECT
  id,
  company_id,
  position,
  experience,
  difficulty,
  result,
  created_at
FROM public.interviews;

-- Grant SELECT on views to anon and authenticated users
GRANT SELECT ON public.reviews_public TO anon, authenticated;
GRANT SELECT ON public.salaries_public TO anon, authenticated;
GRANT SELECT ON public.interviews_public TO anon, authenticated;

-- Add public read policies on the base tables for the views to work
-- Reviews - allow public read (user_id is not exposed in view)
DROP POLICY IF EXISTS "Public can read reviews via view" ON public.reviews;
CREATE POLICY "Public can read reviews via view"
ON public.reviews FOR SELECT
USING (true);

-- Salaries - allow public read (user_id is not exposed in view)
DROP POLICY IF EXISTS "Public can read salaries via view" ON public.salaries;
CREATE POLICY "Public can read salaries via view"
ON public.salaries FOR SELECT
USING (true);

-- Interviews - allow public read (user_id is not exposed in view)
DROP POLICY IF EXISTS "Public can read interviews via view" ON public.interviews;
CREATE POLICY "Public can read interviews via view"
ON public.interviews FOR SELECT
USING (true);