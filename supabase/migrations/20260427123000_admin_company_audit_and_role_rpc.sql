ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS provenance_tag text NOT NULL DEFAULT 'before',
ADD COLUMN IF NOT EXISTS created_via text NOT NULL DEFAULT 'legacy_import',
ADD COLUMN IF NOT EXISTS created_by_admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

UPDATE public.companies
SET provenance_tag = 'before',
    created_via = 'legacy_import'
WHERE provenance_tag IS NULL
   OR created_via IS NULL;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'ubterzioglu@gmail.com'
$$;

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
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Only the super admin can manage admin roles.';
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

CREATE OR REPLACE FUNCTION public.apply_company_import_metadata()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  import_source text := current_setting('app.company_import_source', true);
BEGIN
  IF import_source = 'sql_upload' THEN
    NEW.provenance_tag := 'admin_manual';
    NEW.created_via := 'sql_upload';
    NEW.created_by_admin_user_id := auth.uid();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_company_import_metadata ON public.companies;
CREATE TRIGGER set_company_import_metadata
  BEFORE INSERT ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.apply_company_import_metadata();

CREATE OR REPLACE FUNCTION public.execute_company_import_sql(sql_text text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cleaned_sql text;
  statements text[];
  raw_statement text;
  statement_text text;
  values_segment text;
  attempted_rows int;
  inserted_rows int;
  total_statements int := 0;
  successful_rows int := 0;
  skipped_rows int := 0;
  error_details jsonb := '[]'::jsonb;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can import companies.';
  END IF;

  IF coalesce(trim(sql_text), '') = '' THEN
    RAISE EXCEPTION 'SQL file is empty.';
  END IF;

  cleaned_sql := regexp_replace(sql_text, E'--.*$', '', 'gm');
  statements := regexp_split_to_array(cleaned_sql, E';\\s*');

  FOREACH raw_statement IN ARRAY statements LOOP
    statement_text := btrim(raw_statement);

    IF statement_text = '' THEN
      CONTINUE;
    END IF;

    total_statements := total_statements + 1;

    IF statement_text ~* '\m(DROP|DELETE|ALTER|UPDATE|TRUNCATE|CREATE|GRANT|REVOKE)\M' THEN
      error_details := error_details || jsonb_build_array(jsonb_build_object(
        'statement_number', total_statements,
        'message', 'Only INSERT INTO companies statements are allowed.'
      ));
      CONTINUE;
    END IF;

    IF statement_text !~* '^INSERT\s+INTO\s+(public\.)?companies\s*\(' THEN
      error_details := error_details || jsonb_build_array(jsonb_build_object(
        'statement_number', total_statements,
        'message', 'Statement must start with INSERT INTO companies.'
      ));
      CONTINUE;
    END IF;

    IF statement_text !~* '\)\s*VALUES\s*\(' THEN
      error_details := error_details || jsonb_build_array(jsonb_build_object(
        'statement_number', total_statements,
        'message', 'Statement must include a VALUES clause.'
      ));
      CONTINUE;
    END IF;

    values_segment := regexp_replace(statement_text, '(?is)^.*?\mVALUES\M\s*', '');
    values_segment := regexp_replace(values_segment, '(?is)\s*ON\s+CONFLICT.*$', '');
    attempted_rows := greatest(coalesce(array_length(regexp_split_to_array(values_segment, '\)\s*,\s*\('), 1), 0), 1);

    BEGIN
      PERFORM set_config('app.company_import_source', 'sql_upload', true);
      EXECUTE statement_text;
      GET DIAGNOSTICS inserted_rows = ROW_COUNT;

      successful_rows := successful_rows + inserted_rows;
      skipped_rows := skipped_rows + greatest(attempted_rows - inserted_rows, 0);
    EXCEPTION
      WHEN unique_violation THEN
        skipped_rows := skipped_rows + attempted_rows;
        error_details := error_details || jsonb_build_array(jsonb_build_object(
          'statement_number', total_statements,
          'message', 'Duplicate slug detected. Use ON CONFLICT (slug) DO NOTHING.'
        ));
      WHEN OTHERS THEN
        error_details := error_details || jsonb_build_array(jsonb_build_object(
          'statement_number', total_statements,
          'message', SQLERRM
        ));
    END;
  END LOOP;

  RETURN jsonb_build_object(
    'total_statements', total_statements,
    'successful_rows', successful_rows,
    'skipped_rows', skipped_rows,
    'errors', error_details
  );
END;
$$;
