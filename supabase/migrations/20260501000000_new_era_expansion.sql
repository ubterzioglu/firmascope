-- ============================================================
-- new_era expansion: social links, profile enrichment, posts/feed,
-- post-images storage bucket, salary stats RPC.
-- Follows existing patterns: public-SELECT + own-data RLS + admin ALL,
-- security_invoker views, submission_logs-based rate limiting.
-- ============================================================

-- 1. Company social media / contact links
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS twitter_url text,
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS facebook_url text;

-- 2. Profile enrichment (display_name + avatar_url already exist)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS website_url text;

-- 3. Posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  post_type text NOT NULL DEFAULT 'text'
    CHECK (post_type IN ('text', 'job_offer', 'job_search')),
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  position text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT USING (true);
CREATE POLICY "Auth users can insert own posts"
  ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all posts"
  ON public.posts FOR ALL USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER enforce_rate_limit_posts
  BEFORE INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.enforce_rate_limit();

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user ON public.posts (user_id);

-- 4. posts_public view (joins author profile + company, hides raw user_id)
DROP VIEW IF EXISTS public.posts_public;
CREATE VIEW public.posts_public
WITH (security_invoker = on) AS
SELECT
  p.id,
  p.content,
  p.image_url,
  p.post_type,
  p.company_id,
  p.position,
  p.created_at,
  pr.display_name AS author_display_name,
  pr.avatar_url AS author_avatar_url,
  c.name AS company_name,
  c.slug AS company_slug
FROM public.posts p
LEFT JOIN public.profiles pr ON pr.user_id = p.user_id
LEFT JOIN public.companies c ON c.id = p.company_id;

GRANT SELECT ON public.posts_public TO anon, authenticated;

-- 5. Allow reporting posts: extend reports.target_type CHECK constraint
ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_target_type_check;
ALTER TABLE public.reports
  ADD CONSTRAINT reports_target_type_check
  CHECK (target_type IN ('review', 'salary', 'interview', 'post'));

-- 5b. Allow voting on posts: extend validate_vote() trigger function
CREATE OR REPLACE FUNCTION public.validate_vote()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.target_type NOT IN ('review', 'salary', 'interview', 'post') THEN
    RAISE EXCEPTION 'Invalid target_type: %', NEW.target_type;
  END IF;
  IF NEW.vote_type NOT IN (1, -1) THEN
    RAISE EXCEPTION 'Invalid vote_type: %', NEW.vote_type;
  END IF;
  RETURN NEW;
END;
$$;

-- 6. post-images storage bucket (public read; users write own folder; admins delete)
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Post images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

CREATE POLICY "Users can upload own post images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'post-images'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own post images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'post-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own post images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'post-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can delete any post image"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'post-images' AND public.is_admin(auth.uid()));

-- 7. Salary aggregation RPC (min / avg / max / count per job_title + city)
CREATE OR REPLACE FUNCTION public.get_salary_stats(p_company_id uuid)
RETURNS TABLE (
  job_title text,
  location_city text,
  min_amount int,
  avg_amount int,
  max_amount int,
  sample_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    job_title,
    location_city,
    min(salary_amount)::int AS min_amount,
    round(avg(salary_amount))::int AS avg_amount,
    max(salary_amount)::int AS max_amount,
    count(*) AS sample_count
  FROM public.salaries
  WHERE company_id = p_company_id
  GROUP BY job_title, location_city
  ORDER BY count(*) DESC, job_title ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_salary_stats(uuid) TO anon, authenticated;
