-- RLS Policies for Profiles
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

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
