
-- 1. handle_new_user trigger — yeni kullanıcı kaydında otomatik profil oluşturur
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. enforce_rate_limit triggers — saatte 5 gönderi limiti
CREATE OR REPLACE TRIGGER enforce_rate_limit_reviews
  BEFORE INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_rate_limit();

CREATE OR REPLACE TRIGGER enforce_rate_limit_salaries
  BEFORE INSERT ON public.salaries
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_rate_limit();

CREATE OR REPLACE TRIGGER enforce_rate_limit_interviews
  BEFORE INSERT ON public.interviews
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_rate_limit();

-- 3. validate_vote trigger — oy verilerinin geçerliliğini kontrol eder
CREATE OR REPLACE TRIGGER validate_vote_trigger
  BEFORE INSERT OR UPDATE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_vote();

-- 4. update_updated_at triggers — otomatik timestamp güncelleme
CREATE OR REPLACE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_company_claims_updated_at
  BEFORE UPDATE ON public.company_claims
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_company_suggestions_updated_at
  BEFORE UPDATE ON public.company_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
