-- Create rate limit trigger for reviews
DROP TRIGGER IF EXISTS enforce_rate_limit_reviews ON public.reviews;
CREATE TRIGGER enforce_rate_limit_reviews
BEFORE INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.enforce_rate_limit();

-- Create rate limit trigger for salaries
DROP TRIGGER IF EXISTS enforce_rate_limit_salaries ON public.salaries;
CREATE TRIGGER enforce_rate_limit_salaries
BEFORE INSERT ON public.salaries
FOR EACH ROW
EXECUTE FUNCTION public.enforce_rate_limit();

-- Create rate limit trigger for interviews
DROP TRIGGER IF EXISTS enforce_rate_limit_interviews ON public.interviews;
CREATE TRIGGER enforce_rate_limit_interviews
BEFORE INSERT ON public.interviews
FOR EACH ROW
EXECUTE FUNCTION public.enforce_rate_limit();