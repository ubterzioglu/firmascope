# firmascope - Handover (2026-02-08)

This handover is written so the project can be continued from another computer without losing context.
It intentionally does NOT include secrets or passwords.

## 1) What Was Done In This Session

### Supabase: moved to a new project
- Target Supabase project ref: `jhgtjldygapeztuoetng` (Supabase Cloud).
- App now uses the new project URL + **publishable** key (see `.env`).

### Supabase Auth: fixed Google OAuth + callback/allowlist
- Frontend Google sign-in was migrated from Lovable Cloud auth to Supabase OAuth (PKCE).
  - `src/pages/Auth.tsx`: uses `supabase.auth.signInWithOAuth({ provider: "google", ... })`
  - `src/integrations/supabase/client.ts`: `flowType: "pkce"` + `detectSessionInUrl: true`
- Supabase Auth config updated so production works on `https://www.firmascope.com`:
  - `site_url`: `https://www.firmascope.com`
  - `uri_allow_list`: includes:
    - `https://www.firmascope.com`
    - `https://firmascope.com`
    - `https://firmascope-*.vercel.app`
    - `http://localhost:5173`

Important: in this project, the OAuth flow only worked consistently with the `sb_publishable_...` key.

### Admin / RLS fixes
- Admin panel lists users from `profiles`. A previous migration locked down `profiles` SELECT to "own profile only",
  which made the Admin panel user list empty.
- Added a migration to allow admins to SELECT all profiles:
  - `supabase/migrations/20260208132500_allow_admin_select_profiles.sql`
  - Commit: `eee03dd`

### Admin panel: company create now supports logo/banner upload
- Admin "Companies" dialog can upload logo and banner images to Supabase Storage bucket `company-assets`
  and writes `companies.logo_url` / `companies.banner_url` automatically.
  - File: `src/pages/Admin.tsx`
  - Commit: `36431d5`

### Seeded company
- Inserted `Mercedes-Benz Turk AS` (display name uses Turkish chars) into `companies` with slug `mercedes-benz-turk-as`.

## 2) Current Production URLs

- Production site: `https://www.firmascope.com`
  - `https://firmascope.com` redirects to `https://www.firmascope.com`
- Note: `firmascope2026.vercel.app` returns `DEPLOYMENT_NOT_FOUND` (it is NOT the current prod URL).

## 3) Repos / Hosting

### GitHub
- Current remote in this workspace: `https://github.com/ubterzioglu/firmascope2026`
- GitHub sometimes reports: "This repository moved" to `https://github.com/ubterzioglu/firmascope`
  - If you clone fresh on the new computer, consider using the new repo URL if it is the canonical one.

### Vercel
- Actual Vercel project name: `firmascope` (not `firmascope2026`).
- On a fresh machine:
  1. `vercel login`
  2. `vercel link --project firmascope --yes`
  3. `vercel list --status READY`

## 4) Supabase Project Details

### Project ref
- `jhgtjldygapeztuoetng`

### Local env vars (Vite)
- `.env` is committed and contains:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY` (public by design)

### Supabase CLI
On a fresh machine:
1. `supabase login` (or export a PAT as `SUPABASE_ACCESS_TOKEN`)
2. Link (requires DB password):
   - `supabase link --project-ref jhgtjldygapeztuoetng -p "<DB_PASSWORD>"`
3. Apply migrations:
   - `supabase db push`

Note: some Supabase Management/Auth admin API calls can be blocked by Cloudflare on corporate networks.
Workarounds:
- Prefer Supabase Dashboard UI when blocked.
- Or switch network (hotspot) temporarily.

## 5) Auth + Admin Accounts

The app determines admin permissions via:
- Table: `public.user_roles`
- RPC: `public.is_admin(_user_id uuid)`
- Frontend: `src/hooks/useAuth.tsx` calls `supabase.rpc("is_admin", { _user_id: user.id })`

Users with admin role (as of 2026-02-08):
- `admin@firmascope.com` (admin)
- `ubterzioglu@gmail.com` (admin)
- `cenkkarakuz@gmail.com` (admin)

Regular user (as of 2026-02-08):
- `user@firmascope.com` (not admin)

Passwords are intentionally not recorded here; share them out-of-band if needed.

## 6) Database Notes (Schema + Policies)

### Key tables/views
- `companies`, `reviews`, `salaries`, `interviews`
- `profiles`, `user_roles`
- `company_suggestions`, `company_claims`, `company_admins`
- `votes`, `reports`, `announcements`, `submission_logs`
- Public views (user_id not exposed):
  - `reviews_public`, `salaries_public`, `interviews_public`

### Storage
- Bucket: `company-assets` (public read, admin write)

### Rate limiting
- Trigger-based rate limiting exists (see migrations). Typical limit: 5 submissions per hour.

## 7) Local Dev Quickstart

```powershell
cd <repo>
npm install
npm run dev
```

Optional checks:
```powershell
npm test
npm run build
```

## 8) Known Sharp Edges / Troubleshooting

### 1) OAuth issues
If Google login fails:
- Verify Supabase Auth:
  - Provider Google enabled
  - `site_url` and `uri_allow_list` match the current domain(s)
- Verify frontend uses publishable key in `.env`.

### 2) Admin panel user list empty
This was fixed by `20260208132500_allow_admin_select_profiles.sql`.
If it regresses, check `profiles` RLS policies.

### 3) Node script flakiness
Some Node-based auth tests can crash with a low-level Node assertion on Windows.
Prefer testing auth in the browser or with simple HTTP calls.

## 9) Security Follow-ups (Strongly Recommended)

Some secrets were pasted into chat during debugging (Google client secret, service role JWT, PAT, DB password).
After stabilizing:
1. Rotate Supabase keys as needed.
2. Rotate Google OAuth client secret if exposed.
3. Rotate DB password if exposed.
4. Revoke and recreate PAT tokens.

## 10) Most Relevant Recent Commits

- `36431d5` feat(admin): add company logo/banner upload in admin panel
- `eee03dd` fix(rls): allow admins to list profiles
- `64905cc` fix(env): point app to new Supabase project (publishable key)
- `ada1047` fix(auth): use Supabase Google OAuth (pkce)
- `a70da66` fix(db): make triggers and storage bucket migration idempotent

