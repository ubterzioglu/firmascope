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
