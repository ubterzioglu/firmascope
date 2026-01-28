-- Create profiles table for user metadata
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  company_name text,
  phone_number text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create RLS policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update their own profile." on public.profiles
  for update using ((select auth.uid()) = id);

create policy "Users can delete their own profile." on public.profiles
  for delete using ((select auth.uid()) = id);

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Create trigger for new user
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create companies table
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  description text,
  phone text,
  email text,
  website text,
  address text,
  city text,
  country text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on companies
alter table public.companies enable row level security;

create policy "Users can view their own companies." on public.companies
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert companies." on public.companies
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own companies." on public.companies
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own companies." on public.companies
  for delete using ((select auth.uid()) = user_id);

-- Create contacts table
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  company_id uuid references public.companies on delete set null,
  first_name text not null,
  last_name text,
  email text,
  phone text,
  position text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on contacts
alter table public.contacts enable row level security;

create policy "Users can view their own contacts." on public.contacts
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert contacts." on public.contacts
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own contacts." on public.contacts
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own contacts." on public.contacts
  for delete using ((select auth.uid()) = user_id);

-- Create projects table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  company_id uuid references public.companies on delete set null,
  name text not null,
  description text,
  status text default 'active',
  start_date date,
  end_date date,
  budget decimal(12, 2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on projects
alter table public.projects enable row level security;

create policy "Users can view their own projects." on public.projects
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert projects." on public.projects
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own projects." on public.projects
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own projects." on public.projects
  for delete using ((select auth.uid()) = user_id);

-- Create activities table
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  contact_id uuid references public.contacts on delete set null,
  company_id uuid references public.companies on delete set null,
  project_id uuid references public.projects on delete set null,
  activity_type text not null,
  title text not null,
  description text,
  activity_date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on activities
alter table public.activities enable row level security;

create policy "Users can view their own activities." on public.activities
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert activities." on public.activities
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own activities." on public.activities
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own activities." on public.activities
  for delete using ((select auth.uid()) = user_id);
