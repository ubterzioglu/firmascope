-- NOTE: Postgres does NOT support `CREATE OR REPLACE TRIGGER`.
-- This migration normalizes trigger names and prevents duplicate rate-limit triggers.

-- 1) Create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2) Rate limiting triggers (keep only one set)
DROP TRIGGER IF EXISTS rate_limit_reviews ON public.reviews;
DROP TRIGGER IF EXISTS rate_limit_salaries ON public.salaries;
DROP TRIGGER IF EXISTS rate_limit_interviews ON public.interviews;

DROP TRIGGER IF EXISTS enforce_rate_limit_reviews ON public.reviews;
CREATE TRIGGER enforce_rate_limit_reviews
  BEFORE INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_rate_limit();

DROP TRIGGER IF EXISTS enforce_rate_limit_salaries ON public.salaries;
CREATE TRIGGER enforce_rate_limit_salaries
  BEFORE INSERT ON public.salaries
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_rate_limit();

DROP TRIGGER IF EXISTS enforce_rate_limit_interviews ON public.interviews;
CREATE TRIGGER enforce_rate_limit_interviews
  BEFORE INSERT ON public.interviews
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_rate_limit();

-- 3) Vote validation trigger
DROP TRIGGER IF EXISTS validate_vote_trigger ON public.votes;
CREATE TRIGGER validate_vote_trigger
  BEFORE INSERT OR UPDATE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_vote();

-- 4) updated_at triggers
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_company_claims_updated_at ON public.company_claims;
CREATE TRIGGER update_company_claims_updated_at
  BEFORE UPDATE ON public.company_claims
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_company_suggestions_updated_at ON public.company_suggestions;
CREATE TRIGGER update_company_suggestions_updated_at
  BEFORE UPDATE ON public.company_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
