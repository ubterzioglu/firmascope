-- Form Enrichment Migration
-- Adds new columns to reviews, salaries, interviews tables
-- Updates public views to expose new fields
-- All new columns are nullable for backward compatibility

-- ============================================================
-- REVIEWS TABLE - new columns
-- ============================================================

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS reviewer_relationship TEXT
    CHECK (reviewer_relationship IN ('current_employee', 'former_employee', 'applicant')),
  ADD COLUMN IF NOT EXISTS position_level TEXT
    CHECK (position_level IN ('individual_contributor', 'manager', 'executive', 'intern', 'freelancer_or_contractor')),
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS work_model TEXT
    CHECK (work_model IN ('onsite', 'hybrid', 'remote')),
  ADD COLUMN IF NOT EXISTS rating_work_atmosphere INT CHECK (rating_work_atmosphere >= 1 AND rating_work_atmosphere <= 5),
  ADD COLUMN IF NOT EXISTS rating_communication INT CHECK (rating_communication >= 1 AND rating_communication <= 5),
  ADD COLUMN IF NOT EXISTS rating_team_spirit INT CHECK (rating_team_spirit >= 1 AND rating_team_spirit <= 5),
  ADD COLUMN IF NOT EXISTS rating_work_life_balance INT CHECK (rating_work_life_balance >= 1 AND rating_work_life_balance <= 5),
  ADD COLUMN IF NOT EXISTS rating_manager_behavior INT CHECK (rating_manager_behavior >= 1 AND rating_manager_behavior <= 5),
  ADD COLUMN IF NOT EXISTS rating_tasks INT CHECK (rating_tasks >= 1 AND rating_tasks <= 5),
  ADD COLUMN IF NOT EXISTS rating_compensation_benefits INT CHECK (rating_compensation_benefits >= 1 AND rating_compensation_benefits <= 5),
  ADD COLUMN IF NOT EXISTS rating_career_growth INT CHECK (rating_career_growth >= 1 AND rating_career_growth <= 5),
  ADD COLUMN IF NOT EXISTS benefits TEXT[];

-- ============================================================
-- SALARIES TABLE - new columns
-- ============================================================

ALTER TABLE public.salaries
  ADD COLUMN IF NOT EXISTS salary_basis TEXT
    CHECK (salary_basis IN ('net', 'gross')),
  ADD COLUMN IF NOT EXISTS employment_type TEXT
    CHECK (employment_type IN ('full_time', 'part_time', 'intern', 'contractor')),
  ADD COLUMN IF NOT EXISTS seniority_level TEXT
    CHECK (seniority_level IN ('junior', 'mid', 'senior', 'lead', 'manager', 'director')),
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS work_model TEXT
    CHECK (work_model IN ('onsite', 'hybrid', 'remote')),
  ADD COLUMN IF NOT EXISTS location_city TEXT,
  ADD COLUMN IF NOT EXISTS bonus_amount_yearly INT,
  ADD COLUMN IF NOT EXISTS equity_or_stock TEXT,
  ADD COLUMN IF NOT EXISTS benefits TEXT[];

-- ============================================================
-- INTERVIEWS TABLE - new columns
-- ============================================================

ALTER TABLE public.interviews
  ADD COLUMN IF NOT EXISTS interview_year INT,
  ADD COLUMN IF NOT EXISTS interview_type TEXT
    CHECK (interview_type IN ('onsite', 'remote', 'hybrid')),
  ADD COLUMN IF NOT EXISTS stage_count INT,
  ADD COLUMN IF NOT EXISTS has_case_study BOOLEAN,
  ADD COLUMN IF NOT EXISTS response_time_days INT,
  ADD COLUMN IF NOT EXISTS salary_discussed BOOLEAN,
  ADD COLUMN IF NOT EXISTS offered_salary_amount INT,
  ADD COLUMN IF NOT EXISTS offered_salary_currency TEXT
    CHECK (offered_salary_currency IN ('TRY', 'USD', 'EUR'));

-- Also expand the existing difficulty/result check constraints
ALTER TABLE public.interviews DROP CONSTRAINT IF EXISTS interviews_difficulty_check;
ALTER TABLE public.interviews ADD CONSTRAINT interviews_difficulty_check
  CHECK (difficulty IN ('Kolay', 'Orta', 'Zor', 'Çok Zor') OR difficulty IS NULL);

ALTER TABLE public.interviews DROP CONSTRAINT IF EXISTS interviews_result_check;
ALTER TABLE public.interviews ADD CONSTRAINT interviews_result_check
  CHECK (result IN ('Teklif Aldım', 'Reddedildi', 'Beklemede', 'Katılmadım', 'Olumlu', 'Olumsuz', 'Belirsiz') OR result IS NULL);

-- ============================================================
-- DROP AND RECREATE PUBLIC VIEWS
-- ============================================================

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
  reviewer_relationship,
  position_level,
  department,
  work_model,
  rating_work_atmosphere,
  rating_communication,
  rating_team_spirit,
  rating_work_life_balance,
  rating_manager_behavior,
  rating_tasks,
  rating_compensation_benefits,
  rating_career_growth,
  benefits,
  created_at,
  updated_at
FROM public.reviews;

DROP VIEW IF EXISTS public.salaries_public;
CREATE VIEW public.salaries_public
WITH (security_invoker=on) AS
SELECT
  id,
  company_id,
  job_title,
  salary_amount,
  currency,
  salary_basis,
  experience_years,
  employment_type,
  seniority_level,
  department,
  work_model,
  location_city,
  bonus_amount_yearly,
  equity_or_stock,
  benefits,
  created_at
FROM public.salaries;

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
  interview_year,
  interview_type,
  stage_count,
  has_case_study,
  response_time_days,
  salary_discussed,
  offered_salary_amount,
  offered_salary_currency,
  created_at
FROM public.interviews;

GRANT SELECT ON public.reviews_public TO anon, authenticated;
GRANT SELECT ON public.salaries_public TO anon, authenticated;
GRANT SELECT ON public.interviews_public TO anon, authenticated;
