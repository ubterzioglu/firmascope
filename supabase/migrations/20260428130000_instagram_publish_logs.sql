CREATE TABLE IF NOT EXISTS public.instagram_publish_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'instagram' CHECK (source = 'instagram'),
  request_media_type TEXT NOT NULL CHECK (request_media_type IN ('IMAGE', 'REEL')),
  request_media_url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  container_id TEXT,
  publish_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('received', 'container_created', 'publishing', 'published', 'failed')),
  request_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  meta_responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.instagram_publish_logs ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_instagram_publish_logs_updated_at
  BEFORE UPDATE ON public.instagram_publish_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins can manage instagram publish logs"
  ON public.instagram_publish_logs FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
