
-- 1. İçerik raporlama tablosu
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  target_id uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('review', 'salary', 'interview')),
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reports"
  ON public.reports FOR ALL
  USING (is_admin(auth.uid()));

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Rate limit on reports too
CREATE TRIGGER enforce_rate_limit_reports
  BEFORE INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_rate_limit();

-- Index for quick lookups
CREATE INDEX idx_reports_target ON public.reports (target_type, target_id);
CREATE INDEX idx_reports_status ON public.reports (status);

-- 2. Storage bucket for company logos/banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Company assets are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-assets');

CREATE POLICY "Admins can upload company assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'company-assets' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update company assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'company-assets' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete company assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'company-assets' AND is_admin(auth.uid()));

-- Company admins can also manage their company's assets
CREATE POLICY "Company admins can upload own company assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'company-assets' 
    AND EXISTS (
      SELECT 1 FROM public.company_admins 
      WHERE user_id = auth.uid()
    )
  );

-- 3. Realtime — ana tablolarda aktif et
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.companies;

-- 4. Performance indexes (eksik olanlar)
CREATE INDEX IF NOT EXISTS idx_reviews_company ON public.reviews (company_id);
CREATE INDEX IF NOT EXISTS idx_salaries_company ON public.salaries (company_id);
CREATE INDEX IF NOT EXISTS idx_interviews_company ON public.interviews (company_id);
CREATE INDEX IF NOT EXISTS idx_votes_target ON public.votes (target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_submission_logs_user ON public.submission_logs (user_id, created_at);
