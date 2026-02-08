# Supabase Migration Guide

Bu döküman, Lovable Cloud'dan kendi Supabase projenize geçiş için hazırlanmıştır.

---

## 1. Yeni Supabase Projesi Oluşturun

1. [supabase.com](https://supabase.com) adresine gidin
2. Yeni proje oluşturun
3. Proje URL ve Anon Key'i kaydedin

---

## 2. Schema Migration (SQL Editor'de çalıştırın)

Aşağıdaki SQL'i Supabase Dashboard > SQL Editor'de çalıştırın:

```sql
-- =============================================
-- STEP 1: Create ENUM types
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'company_admin');

-- =============================================
-- STEP 2: Create Tables
-- =============================================

-- Companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  initials TEXT NOT NULL DEFAULT '',
  description TEXT,
  city TEXT,
  sector TEXT,
  size TEXT,
  status TEXT DEFAULT 'Aktif',
  company_type TEXT DEFAULT 'A.Ş.',
  logo_url TEXT,
  banner_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  pros TEXT,
  cons TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  recommends BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Salaries table
CREATE TABLE public.salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  salary_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'TRY',
  experience_years INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Interviews table
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  position TEXT NOT NULL,
  experience TEXT,
  difficulty TEXT,
  result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  vote_type SMALLINT NOT NULL CHECK (vote_type IN (1, -1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);

-- Reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  link_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Company suggestions table
CREATE TABLE public.company_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  description TEXT,
  sector TEXT,
  city TEXT,
  website_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Company claims table
CREATE TABLE public.company_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Company admins table
CREATE TABLE public.company_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, company_id)
);

-- Submission logs table (for rate limiting)
CREATE TABLE public.submission_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- STEP 3: Create Public Views (security invoker)
-- =============================================

CREATE VIEW public.reviews_public
WITH (security_invoker=on) AS
SELECT id, company_id, title, pros, cons, rating, recommends, created_at, updated_at
FROM public.reviews;

CREATE VIEW public.salaries_public
WITH (security_invoker=on) AS
SELECT id, company_id, job_title, salary_amount, currency, experience_years, created_at
FROM public.salaries;

CREATE VIEW public.interviews_public
WITH (security_invoker=on) AS
SELECT id, company_id, position, experience, difficulty, result, created_at
FROM public.interviews;

-- Grant access to views
GRANT SELECT ON public.reviews_public TO anon, authenticated;
GRANT SELECT ON public.salaries_public TO anon, authenticated;
GRANT SELECT ON public.interviews_public TO anon, authenticated;

-- =============================================
-- STEP 4: Create Functions
-- =============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Has role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Is admin function
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Is company admin function
CREATE OR REPLACE FUNCTION public.is_company_admin(_user_id UUID, _company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_admins
    WHERE user_id = _user_id AND company_id = _company_id
  )
$$;

-- Has submitted salary function
CREATE OR REPLACE FUNCTION public.has_submitted_salary(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.salaries WHERE user_id = p_user_id
  )
$$;

-- Rate limit enforcement function
CREATE OR REPLACE FUNCTION public.enforce_rate_limit()
RETURNS TRIGGER
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

-- Vote validation trigger function
CREATE OR REPLACE FUNCTION public.validate_vote()
RETURNS TRIGGER
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

-- Handle new user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

-- =============================================
-- STEP 5: Create Triggers
-- =============================================

-- Updated at triggers
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_suggestions_updated_at BEFORE UPDATE ON public.company_suggestions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_claims_updated_at BEFORE UPDATE ON public.company_claims
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Rate limit triggers
CREATE TRIGGER enforce_reviews_rate_limit BEFORE INSERT ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.enforce_rate_limit();

CREATE TRIGGER enforce_salaries_rate_limit BEFORE INSERT ON public.salaries
FOR EACH ROW EXECUTE FUNCTION public.enforce_rate_limit();

CREATE TRIGGER enforce_interviews_rate_limit BEFORE INSERT ON public.interviews
FOR EACH ROW EXECUTE FUNCTION public.enforce_rate_limit();

CREATE TRIGGER enforce_reports_rate_limit BEFORE INSERT ON public.reports
FOR EACH ROW EXECUTE FUNCTION public.enforce_rate_limit();

-- Vote validation trigger
CREATE TRIGGER validate_vote_trigger BEFORE INSERT OR UPDATE ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.validate_vote();

-- New user trigger (on auth.users)
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- STEP 6: Enable RLS and Create Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_logs ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Companies are viewable by everyone" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Admins can manage companies" ON public.companies FOR ALL USING (is_admin(auth.uid()));

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (is_admin(auth.uid()));

-- Reviews policies
CREATE POLICY "Public can read reviews via view" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can view own reviews" ON public.reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Auth users can insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL USING (is_admin(auth.uid()));

-- Salaries policies
CREATE POLICY "Public can read salaries via view" ON public.salaries FOR SELECT USING (true);
CREATE POLICY "Users can view own salaries" ON public.salaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Auth users can insert own salaries" ON public.salaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own salaries" ON public.salaries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own salaries" ON public.salaries FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all salaries" ON public.salaries FOR ALL USING (is_admin(auth.uid()));

-- Interviews policies
CREATE POLICY "Public can read interviews via view" ON public.interviews FOR SELECT USING (true);
CREATE POLICY "Users can view own interviews" ON public.interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Auth users can insert own interviews" ON public.interviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interviews" ON public.interviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interviews" ON public.interviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all interviews" ON public.interviews FOR ALL USING (is_admin(auth.uid()));

-- Votes policies
CREATE POLICY "Votes are viewable by everyone" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Users can insert own votes" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON public.votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON public.votes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage votes" ON public.votes FOR ALL USING (is_admin(auth.uid()));

-- Reports policies
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all reports" ON public.reports FOR ALL USING (is_admin(auth.uid()));

-- Announcements policies
CREATE POLICY "Announcements are viewable by everyone" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (is_admin(auth.uid()));

-- Company suggestions policies
CREATE POLICY "Users can view own suggestions" ON public.company_suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own suggestions" ON public.company_suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Super admins can manage all suggestions" ON public.company_suggestions FOR ALL USING (is_admin(auth.uid()));

-- Company claims policies
CREATE POLICY "Users can view own claims" ON public.company_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own claims" ON public.company_claims FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Super admins can manage all claims" ON public.company_claims FOR ALL USING (is_admin(auth.uid()));

-- Company admins policies
CREATE POLICY "Company admins can view own assignments" ON public.company_admins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Super admins can manage company admins" ON public.company_admins FOR ALL USING (is_admin(auth.uid()));

-- Submission logs policies
CREATE POLICY "Users can view own submission logs" ON public.submission_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage submission logs" ON public.submission_logs FOR ALL USING (is_admin(auth.uid()));

-- =============================================
-- STEP 7: Create Storage Bucket
-- =============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('company-assets', 'company-assets', true);

CREATE POLICY "Company assets are publicly accessible"
ON storage.objects FOR SELECT USING (bucket_id = 'company-assets');

CREATE POLICY "Admins can upload company assets"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'company-assets' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update company assets"
ON storage.objects FOR UPDATE USING (bucket_id = 'company-assets' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete company assets"
ON storage.objects FOR DELETE USING (bucket_id = 'company-assets' AND is_admin(auth.uid()));
```

---

## 3. Data Migration (İsteğe bağlı - Mevcut Veriler)

Şu an veritabanında az veri var. Schema oluşturduktan sonra aşağıdaki verileri ekleyebilirsiniz:

```sql
-- Companies
INSERT INTO public.companies (id, name, slug, initials, description, city, sector, size, company_type)
VALUES 
  ('2bc2744e-ef0a-4dd1-a383-26d6fceef8ad', 'Mercedes Benz Türk A.Ş.', 'mercedes-benz-turk', 'MB', 'Otomotiv üretimi ve satışı', 'İstanbul', 'Otomotiv', '1000+', 'A.Ş.'),
  ('bd2b5a01-20b5-4bbb-8efa-c7c3b180d060', 'Deneme Şirket', 'deneme-şirket', 'DŞ', 'Mikemmel bir şirket', 'İstanbul', 'Teknoloji', NULL, 'A.Ş.');
```

**NOT:** Kullanıcılar yeni Supabase'de yeniden kayıt olmalı çünkü auth.users tablosu taşınamaz.

---

## 4. Lovable Projesinde Değişiklikler

Yeni Supabase projenizi Lovable'a bağlamak için:

1. **Lovable Settings > Connectors** bölümüne gidin
2. **"Connect to Supabase"** seçin
3. Yeni projenizin **URL** ve **Anon Key** bilgilerini girin

Bu işlem otomatik olarak:
- `.env` dosyasını güncelleyecek
- `src/integrations/supabase/client.ts` dosyasını güncelleyecek
- `src/integrations/supabase/types.ts` dosyasını güncelleyecek

---

## 5. Google OAuth Ayarları

Yeni Supabase projenizde Google OAuth'u yapılandırın:

1. **Supabase Dashboard > Authentication > Providers > Google**
2. Google Cloud Console'dan yeni OAuth credentials oluşturun
3. Redirect URL'i güncelleyin: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

---

## Özet Checklist

- [ ] Supabase projesi oluşturuldu
- [ ] Schema SQL'i çalıştırıldı
- [ ] Storage bucket oluşturuldu
- [ ] Google OAuth yapılandırıldı
- [ ] Lovable'da yeni Supabase bağlantısı yapıldı
- [ ] Uygulama test edildi
