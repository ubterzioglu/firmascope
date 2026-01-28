-- ========================================
-- FIRMASCOPE DATABASE MIGRATION
-- ========================================
-- Bu SQL'i Supabase Dashboard → SQL Editor'de çalıştırın
-- 
-- Adımlar:
-- 1. https://app.supabase.com/ → feafcmvulxsrjrdxosyt projesine girin
-- 2. SQL Editor → New Query aç
-- 3. Bu dosyanın tüm içeriğini kopyala
-- 4. SQL Editor'e yapıştır
-- 5. RUN butonuna tıkla
-- ========================================

-- ========================================
-- 1. CREATE TABLES
-- ========================================

-- Create profiles table for user metadata
create table if not exists public.profiles (
  id uuid primary key not null,
  email text,
  full_name text,
  avatar_url text,
  company_name text,
  phone_number text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  foreign key (id) references auth.users(id) on delete cascade
);

-- Create companies table
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  description text,
  phone text,
  email text,
  website text,
  address text,
  city text,
  country text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  foreign key (user_id) references public.profiles(id) on delete cascade
);

-- Create contacts table
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  company_id uuid,
  first_name text not null,
  last_name text,
  email text,
  phone text,
  position text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  foreign key (user_id) references public.profiles(id) on delete cascade,
  foreign key (company_id) references public.companies(id) on delete set null
);

-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  company_id uuid,
  name text not null,
  description text,
  status text default 'active',
  start_date date,
  end_date date,
  budget decimal(12, 2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  foreign key (user_id) references public.profiles(id) on delete cascade,
  foreign key (company_id) references public.companies(id) on delete set null
);

-- Create activities table
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  contact_id uuid,
  company_id uuid,
  project_id uuid,
  activity_type text not null,
  title text not null,
  description text,
  activity_date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  foreign key (user_id) references public.profiles(id) on delete cascade,
  foreign key (contact_id) references public.contacts(id) on delete set null,
  foreign key (company_id) references public.companies(id) on delete set null,
  foreign key (project_id) references public.projects(id) on delete set null
);

-- ========================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ========================================

alter table if exists public.profiles enable row level security;
alter table if exists public.companies enable row level security;
alter table if exists public.contacts enable row level security;
alter table if exists public.projects enable row level security;
alter table if exists public.activities enable row level security;

-- ========================================
-- 3. CREATE AUTH TRIGGER
-- ========================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do update set
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========================================
-- 4. CREATE RLS POLICIES
-- ========================================

-- RLS Policies for Profiles (id = user id)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can update their own profile." on public.profiles;
create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Users can delete their own profile." on public.profiles;
create policy "Users can delete their own profile." on public.profiles
  for delete using (auth.uid() = id);

-- RLS Policies for Companies
drop policy if exists "Users can view their own companies." on public.companies;
create policy "Users can view their own companies." on public.companies
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert companies." on public.companies;
create policy "Users can insert companies." on public.companies
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own companies." on public.companies;
create policy "Users can update their own companies." on public.companies
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own companies." on public.companies;
create policy "Users can delete their own companies." on public.companies
  for delete using (auth.uid() = user_id);

-- RLS Policies for Contacts
drop policy if exists "Users can view their own contacts." on public.contacts;
create policy "Users can view their own contacts." on public.contacts
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert contacts." on public.contacts;
create policy "Users can insert contacts." on public.contacts
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own contacts." on public.contacts;
create policy "Users can update their own contacts." on public.contacts
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own contacts." on public.contacts;
create policy "Users can delete their own contacts." on public.contacts
  for delete using (auth.uid() = user_id);

-- RLS Policies for Projects
drop policy if exists "Users can view their own projects." on public.projects;
create policy "Users can view their own projects." on public.projects
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert projects." on public.projects;
create policy "Users can insert projects." on public.projects
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own projects." on public.projects;
create policy "Users can update their own projects." on public.projects
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own projects." on public.projects;
create policy "Users can delete their own projects." on public.projects
  for delete using (auth.uid() = user_id);

-- RLS Policies for Activities
drop policy if exists "Users can view their own activities." on public.activities;
create policy "Users can view their own activities." on public.activities
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert activities." on public.activities;
create policy "Users can insert activities." on public.activities
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own activities." on public.activities;
create policy "Users can update their own activities." on public.activities
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own activities." on public.activities;
create policy "Users can delete their own activities." on public.activities
  for delete using (auth.uid() = user_id);

-- ========================================
-- MIGRATION COMPLETE!
-- ========================================
-- Tüm tablolar, triggers ve RLS policies oluşturuldu.
-- Uygulama şimdi kullanıma hazır!
