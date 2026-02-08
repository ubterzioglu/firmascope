
-- ============================================
-- SECURITY: Anonymity protection
-- Create public views WITHOUT user_id
-- Views default to security_invoker=false → bypass RLS on base tables
-- ============================================

CREATE OR REPLACE VIEW public.reviews_public AS
SELECT id, company_id, title, pros, cons, rating, recommends, created_at, updated_at
FROM public.reviews;

CREATE OR REPLACE VIEW public.salaries_public AS
SELECT id, company_id, job_title, salary_amount, currency, experience_years, created_at
FROM public.salaries;

CREATE OR REPLACE VIEW public.interviews_public AS
SELECT id, company_id, position, experience, difficulty, result, created_at
FROM public.interviews;

-- Grant SELECT on views to all API roles
GRANT SELECT ON public.reviews_public TO anon, authenticated;
GRANT SELECT ON public.salaries_public TO anon, authenticated;
GRANT SELECT ON public.interviews_public TO anon, authenticated;

-- ============================================
-- Restrict base table SELECT to own records only
-- Prevents attackers from querying base tables to get user_id
-- ============================================

DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Users can view own reviews"
ON public.reviews FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Salaries are viewable by everyone" ON public.salaries;
CREATE POLICY "Users can view own salaries"
ON public.salaries FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Interviews are viewable by everyone" ON public.interviews;
CREATE POLICY "Users can view own interviews"
ON public.interviews FOR SELECT
USING (auth.uid() = user_id);

-- ============================================
-- Admin full access to base tables (moderation)
-- ============================================

CREATE POLICY "Admins can manage all reviews"
ON public.reviews FOR ALL
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all salaries"
ON public.salaries FOR ALL
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all interviews"
ON public.interviews FOR ALL
USING (public.is_admin(auth.uid()));

-- ============================================
-- Fix: Add unique constraint for company_admins upsert
-- ============================================

ALTER TABLE public.company_admins
ADD CONSTRAINT company_admins_user_company_unique UNIQUE (user_id, company_id);
