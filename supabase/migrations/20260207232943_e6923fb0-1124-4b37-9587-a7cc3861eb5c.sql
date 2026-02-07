
-- Add company_admin to existing app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'company_admin';

-- Table: company_admins (links company_admin users to their companies)
CREATE TABLE public.company_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);
ALTER TABLE public.company_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company admins can view own assignments"
  ON public.company_admins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage company admins"
  ON public.company_admins FOR ALL
  USING (public.is_admin(auth.uid()));

-- Table: company_claims (company owners claim their company)
CREATE TABLE public.company_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.company_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claims"
  ON public.company_claims FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims"
  ON public.company_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all claims"
  ON public.company_claims FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_company_claims_updated_at
  BEFORE UPDATE ON public.company_claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table: company_suggestions (users suggest new companies)
CREATE TABLE public.company_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  description TEXT,
  sector TEXT,
  city TEXT,
  website_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.company_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own suggestions"
  ON public.company_suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own suggestions"
  ON public.company_suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all suggestions"
  ON public.company_suggestions FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_company_suggestions_updated_at
  BEFORE UPDATE ON public.company_suggestions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper function to check if user is company admin for a specific company
CREATE OR REPLACE FUNCTION public.is_company_admin(_user_id UUID, _company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_admins
    WHERE user_id = _user_id AND company_id = _company_id
  )
$$;
