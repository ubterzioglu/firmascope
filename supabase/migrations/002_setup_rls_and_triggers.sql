-- Enable RLS on all tables
alter table if exists public.profiles enable row level security;
alter table if exists public.companies enable row level security;
alter table if exists public.contacts enable row level security;
alter table if exists public.projects enable row level security;
alter table if exists public.activities enable row level security;

