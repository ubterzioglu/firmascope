CREATE TABLE IF NOT EXISTS public.company_seo_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
  intro_summary TEXT,
  culture_summary TEXT,
  salary_summary TEXT,
  interview_summary TEXT,
  pros_summary TEXT,
  cons_summary TEXT,
  candidate_takeaway TEXT,
  faq_items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  external_links_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  keywords_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  word_count INT NOT NULL DEFAULT 0,
  generation_status TEXT NOT NULL DEFAULT 'generated'
    CHECK (generation_status IN ('generated', 'insufficient_data')),
  source_snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  prompt_version TEXT NOT NULL DEFAULT 'deterministic-v1',
  generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_seo_profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_company_seo_profiles_updated_at
  BEFORE UPDATE ON public.company_seo_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Company SEO profiles are viewable by everyone"
  ON public.company_seo_profiles FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage company SEO profiles"
  ON public.company_seo_profiles FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
