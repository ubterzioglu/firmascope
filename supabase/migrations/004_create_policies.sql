-- RLS Policies for Profiles
-- Profiles sadece public olarak görülebilir, users kendi profillerini edit/delete edebilir

drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can insert their profile." on public.profiles;
create policy "Users can insert their profile." on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile." on public.profiles;
create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can delete their own profile." on public.profiles;
create policy "Users can delete their own profile." on public.profiles
  for delete using (auth.uid() = id);

-- RLS Policies for Companies
-- Companies'de user_id kolanı yok, bu yüzden sadece policy'leri enable ediyoruz
-- Uygulamada role-based access kontrol yapılacak

drop policy if exists "Companies are viewable by everyone." on public.companies;
create policy "Companies are viewable by everyone." on public.companies
  for select using (true);

drop policy if exists "Admins can manage companies." on public.companies;
create policy "Admins can manage companies." on public.companies
  for insert with check (true);

drop policy if exists "Admins can update companies." on public.companies;
create policy "Admins can update companies." on public.companies
  for update using (true);

drop policy if exists "Admins can delete companies." on public.companies;
create policy "Admins can delete companies." on public.companies
  for delete using (true);
