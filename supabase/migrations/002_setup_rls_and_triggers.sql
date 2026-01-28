-- Enable RLS on all tables
alter table if exists public.profiles enable row level security;
alter table if exists public.companies enable row level security;
alter table if exists public.contacts enable row level security;
alter table if exists public.projects enable row level security;
alter table if exists public.activities enable row level security;

-- Drop existing policies if they exist (to avoid conflicts)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update their own profile." on public.profiles;
drop policy if exists "Users can delete their own profile." on public.profiles;

drop policy if exists "Users can view their own companies." on public.companies;
drop policy if exists "Users can insert companies." on public.companies;
drop policy if exists "Users can update their own companies." on public.companies;
drop policy if exists "Users can delete their own companies." on public.companies;

drop policy if exists "Users can view their own contacts." on public.contacts;
drop policy if exists "Users can insert contacts." on public.contacts;
drop policy if exists "Users can update their own contacts." on public.contacts;
drop policy if exists "Users can delete their own contacts." on public.contacts;

drop policy if exists "Users can view their own projects." on public.projects;
drop policy if exists "Users can insert projects." on public.projects;
drop policy if exists "Users can update their own projects." on public.projects;
drop policy if exists "Users can delete their own projects." on public.projects;

drop policy if exists "Users can view their own activities." on public.activities;
drop policy if exists "Users can insert activities." on public.activities;
drop policy if exists "Users can update their own activities." on public.activities;
drop policy if exists "Users can delete their own activities." on public.activities;

-- RLS Policies for Profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update their own profile." on public.profiles
  for update using ((select auth.uid()) = id);

create policy "Users can delete their own profile." on public.profiles
  for delete using ((select auth.uid()) = id);

-- RLS Policies for Companies
create policy "Users can view their own companies." on public.companies
  for select using (auth.uid() = user_id);

create policy "Users can insert companies." on public.companies
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own companies." on public.companies
  for update using (auth.uid() = user_id);

create policy "Users can delete their own companies." on public.companies
  for delete using (auth.uid() = user_id);

-- RLS Policies for Contacts
create policy "Users can view their own contacts." on public.contacts
  for select using (auth.uid() = user_id);

create policy "Users can insert contacts." on public.contacts
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own contacts." on public.contacts
  for update using (auth.uid() = user_id);

create policy "Users can delete their own contacts." on public.contacts
  for delete using (auth.uid() = user_id);

-- RLS Policies for Projects
create policy "Users can view their own projects." on public.projects
  for select using (auth.uid() = user_id);

create policy "Users can insert projects." on public.projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects." on public.projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects." on public.projects
  for delete using (auth.uid() = user_id);

-- RLS Policies for Activities
create policy "Users can view their own activities." on public.activities
  for select using (auth.uid() = user_id);

create policy "Users can insert activities." on public.activities
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own activities." on public.activities
  for update using (auth.uid() = user_id);

create policy "Users can delete their own activities." on public.activities
  for delete using (auth.uid() = user_id);
