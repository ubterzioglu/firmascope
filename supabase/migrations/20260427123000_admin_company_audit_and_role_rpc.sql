ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS provenance_tag text NOT NULL DEFAULT 'before',
ADD COLUMN IF NOT EXISTS created_via text NOT NULL DEFAULT 'legacy_import',
ADD COLUMN IF NOT EXISTS created_by_admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

UPDATE public.companies
SET provenance_tag = 'before',
    created_via = 'legacy_import'
WHERE provenance_tag IS NULL
   OR created_via IS NULL;

CREATE OR REPLACE FUNCTION public.set_user_role_admin(
  _target_user_id uuid,
  _enabled boolean DEFAULT true
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can manage admin roles.';
  END IF;

  IF _enabled THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    DELETE FROM public.user_roles
    WHERE user_id = _target_user_id
      AND role = 'admin';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_company_admin(
  p_name text,
  p_slug text,
  p_initials text DEFAULT '',
  p_sector text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_size text DEFAULT NULL,
  p_company_type text DEFAULT 'A.S.',
  p_description text DEFAULT NULL,
  p_logo_url text DEFAULT NULL,
  p_banner_url text DEFAULT NULL,
  p_provenance_tag text DEFAULT 'admin_manual',
  p_created_via text DEFAULT 'admin_panel'
)
RETURNS public.companies
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  created_company public.companies;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can create companies.';
  END IF;

  IF coalesce(trim(p_name), '') = '' THEN
    RAISE EXCEPTION 'Company name is required.';
  END IF;

  IF coalesce(trim(p_slug), '') = '' THEN
    RAISE EXCEPTION 'Company slug is required.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.companies
    WHERE slug = trim(p_slug)
  ) THEN
    RAISE EXCEPTION 'A company with this slug already exists.';
  END IF;

  INSERT INTO public.companies (
    name,
    slug,
    initials,
    sector,
    city,
    size,
    company_type,
    description,
    logo_url,
    banner_url,
    provenance_tag,
    created_via,
    created_by_admin_user_id
  )
  VALUES (
    trim(p_name),
    trim(p_slug),
    coalesce(trim(p_initials), ''),
    nullif(trim(coalesce(p_sector, '')), ''),
    nullif(trim(coalesce(p_city, '')), ''),
    nullif(trim(coalesce(p_size, '')), ''),
    nullif(trim(coalesce(p_company_type, '')), ''),
    nullif(trim(coalesce(p_description, '')), ''),
    nullif(trim(coalesce(p_logo_url, '')), ''),
    nullif(trim(coalesce(p_banner_url, '')), ''),
    coalesce(nullif(trim(coalesce(p_provenance_tag, '')), ''), 'admin_manual'),
    coalesce(nullif(trim(coalesce(p_created_via, '')), ''), 'admin_panel'),
    auth.uid()
  )
  RETURNING * INTO created_company;

  RETURN created_company;
END;
$$;
