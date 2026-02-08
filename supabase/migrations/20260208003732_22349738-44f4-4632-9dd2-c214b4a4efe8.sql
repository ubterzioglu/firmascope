
-- =============================================
-- 1. VOTE SİSTEMİ (Thumbs Up / Thumbs Down)
-- =============================================
CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  vote_type smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);

-- Validation trigger (CHECK yerine trigger kullanıyoruz)
CREATE OR REPLACE FUNCTION public.validate_vote()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.target_type NOT IN ('review', 'salary', 'interview') THEN
    RAISE EXCEPTION 'Invalid target_type: %', NEW.target_type;
  END IF;
  IF NEW.vote_type NOT IN (1, -1) THEN
    RAISE EXCEPTION 'Invalid vote_type: %. Must be 1 or -1', NEW.vote_type;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_vote_trigger
  BEFORE INSERT OR UPDATE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.validate_vote();

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are viewable by everyone"
  ON public.votes FOR SELECT USING (true);

CREATE POLICY "Users can insert own votes"
  ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
  ON public.votes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON public.votes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage votes"
  ON public.votes FOR ALL USING (public.is_admin(auth.uid()));


-- =============================================
-- 2. RATE LIMITING (Saatte max 5 gönderi)
-- =============================================
CREATE TABLE public.submission_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.submission_logs ENABLE ROW LEVEL SECURITY;

-- Trigger SECURITY DEFINER ile insert yapar, doğrudan erişim kısıtlı
CREATE POLICY "Admins can manage submission logs"
  ON public.submission_logs FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view own submission logs"
  ON public.submission_logs FOR SELECT USING (auth.uid() = user_id);

-- Rate limit enforcement trigger (SECURITY DEFINER — RLS bypass)
CREATE OR REPLACE FUNCTION public.enforce_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count int;
BEGIN
  SELECT count(*) INTO recent_count
  FROM public.submission_logs
  WHERE user_id = NEW.user_id
    AND action_type = TG_TABLE_NAME
    AND created_at > now() - interval '1 hour';

  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Saatte en fazla 5 gönderi yapabilirsiniz. Lütfen daha sonra tekrar deneyin.';
  END IF;

  INSERT INTO public.submission_logs (user_id, action_type)
  VALUES (NEW.user_id, TG_TABLE_NAME);

  RETURN NEW;
END;
$$;

CREATE TRIGGER rate_limit_reviews
  BEFORE INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.enforce_rate_limit();

CREATE TRIGGER rate_limit_salaries
  BEFORE INSERT ON public.salaries
  FOR EACH ROW EXECUTE FUNCTION public.enforce_rate_limit();

CREATE TRIGGER rate_limit_interviews
  BEFORE INSERT ON public.interviews
  FOR EACH ROW EXECUTE FUNCTION public.enforce_rate_limit();


-- =============================================
-- 3. GIVE-TO-GET SALARY GATING
-- =============================================
CREATE OR REPLACE FUNCTION public.has_submitted_salary(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.salaries WHERE user_id = p_user_id
  )
$$;
