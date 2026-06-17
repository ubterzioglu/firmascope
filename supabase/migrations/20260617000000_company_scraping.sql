-- Company scraping pipeline: queue-based, server-side crawler lands data in a
-- staging table for manual admin approve/reject before it reaches `companies`.
-- All tables are admin-only (RLS via public.is_admin). The external worker
-- accesses these tables with the service role key, which bypasses RLS.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE public.scrape_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  seed_urls TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'running', 'done', 'failed', 'cancelled')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);

CREATE TABLE public.scrape_job_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.scrape_jobs(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  entity_key TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'done', 'failed', 'skipped')),
  attempt INT NOT NULL DEFAULT 0,
  http_status INT,
  error_code TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Company-only fields. Deliberately NO personal data (KVKK): no contact names,
-- phones, or emails of individuals.
CREATE TABLE public.company_import_staging (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.scrape_jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  website_url TEXT,
  sector TEXT,
  city TEXT,
  size TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  description TEXT,
  source_url TEXT NOT NULL,
  normalized JSONB NOT NULL DEFAULT '{}'::jsonb,
  dedupe_status TEXT NOT NULL DEFAULT 'new'
    CHECK (dedupe_status IN ('new', 'matches_existing')),
  matched_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  review_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (review_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.crawl_job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.scrape_jobs(id) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'info'
    CHECK (level IN ('debug', 'info', 'warn', 'error')),
  message TEXT NOT NULL,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scrape_job_items_job_id ON public.scrape_job_items(job_id);
CREATE INDEX idx_company_import_staging_job_id ON public.company_import_staging(job_id);
CREATE INDEX idx_company_import_staging_review ON public.company_import_staging(review_status);
CREATE INDEX idx_crawl_job_logs_job_id ON public.crawl_job_logs(job_id);

-- ---------------------------------------------------------------------------
-- RLS: admin-only on all four tables
-- ---------------------------------------------------------------------------

ALTER TABLE public.scrape_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_job_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_import_staging ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crawl_job_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage scrape jobs"
  ON public.scrape_jobs FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins manage scrape job items"
  ON public.scrape_job_items FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins manage company import staging"
  ON public.company_import_staging FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins manage crawl job logs"
  ON public.crawl_job_logs FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- Approve / reject RPCs (admin-gated, reuse create_company_admin)
-- ---------------------------------------------------------------------------

-- Approves a staging row by creating a canonical company via the existing
-- admin RPC, then stamps social links and marks the staging row approved.
-- Returns the staging row's updated state plus the created company id (or
-- marks matches_existing if the slug already exists).
CREATE OR REPLACE FUNCTION public.approve_company_import(p_staging_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  staging public.company_import_staging;
  created_company public.companies;
  existing_id UUID;
  initials TEXT;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can approve company imports.';
  END IF;

  SELECT * INTO staging
  FROM public.company_import_staging
  WHERE id = p_staging_id;

  IF staging.id IS NULL THEN
    RAISE EXCEPTION 'Staging row not found.';
  END IF;

  IF staging.review_status <> 'pending' THEN
    RAISE EXCEPTION 'Staging row is not pending (current: %).', staging.review_status;
  END IF;

  -- Guard against duplicate slug: mark matched, do not create.
  SELECT id INTO existing_id FROM public.companies WHERE slug = staging.slug;
  IF existing_id IS NOT NULL THEN
    UPDATE public.company_import_staging
    SET dedupe_status = 'matches_existing',
        matched_company_id = existing_id
    WHERE id = p_staging_id;

    RETURN jsonb_build_object(
      'status', 'matches_existing',
      'matched_company_id', existing_id
    );
  END IF;

  -- First letter of up to the first two words, e.g. "Acme Bilisim" -> "AB".
  SELECT string_agg(upper(left(word, 1)), '')
  INTO initials
  FROM (
    SELECT word
    FROM regexp_split_to_table(trim(staging.name), '\s+') AS word
    WHERE word <> ''
    LIMIT 2
  ) AS words;
  initials := coalesce(nullif(initials, ''), upper(left(staging.name, 2)));

  created_company := public.create_company_admin(
    p_name := staging.name,
    p_slug := staging.slug,
    p_initials := initials,
    p_sector := staging.sector,
    p_city := staging.city,
    p_size := staging.size,
    p_description := staging.description,
    p_provenance_tag := 'scrape_import',
    p_created_via := 'scrape_worker'
  );

  -- create_company_admin does not accept social links; persist them now.
  UPDATE public.companies
  SET website_url = staging.website_url,
      linkedin_url = staging.linkedin_url,
      twitter_url = staging.twitter_url,
      instagram_url = staging.instagram_url,
      facebook_url = staging.facebook_url
  WHERE id = created_company.id;

  UPDATE public.company_import_staging
  SET review_status = 'approved',
      matched_company_id = created_company.id
  WHERE id = p_staging_id;

  RETURN jsonb_build_object(
    'status', 'approved',
    'company_id', created_company.id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_company_import(p_staging_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can reject company imports.';
  END IF;

  UPDATE public.company_import_staging
  SET review_status = 'rejected'
  WHERE id = p_staging_id
    AND review_status = 'pending';
END;
$$;
