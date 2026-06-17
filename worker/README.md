# FirmaScope Scrape Worker

External, queue-based company scraper. Runs **outside** Supabase (Crawlee + Node cannot run inside a Deno Edge Function), connects with the **service role key**, claims `queued` rows from `scrape_jobs`, crawls external company directories **HTTP-first**, and writes normalized results to `company_import_staging` for **manual admin approval**. Nothing reaches the canonical `companies` table without an admin approving it in the panel.

## Setup

```bash
cd worker
cp .env.example .env   # fill SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
npm install
```

## Run

```bash
npm start          # long-running poll loop (Railway/Fly/VPS)
npm run run-once   # process one queued job and exit (GitHub Actions cron)
npm run typecheck  # tsc --noEmit
```

## How a job flows

1. Admin creates a job in the panel (`/admin/scrape`) → row inserted with `status='queued'`.
2. Worker `claimNextQueuedJob()` atomically flips it to `running`.
3. `CheerioCrawler` fetches the seed URLs, respecting `robots.txt`, with an
   identifiable `User-Agent`, rate limiting, and retries.
4. `src/parser.ts` extracts **company-only** fields and detail links.
5. Each company is staged with `dedupe_status` computed against existing slugs.
6. Cancellation is cooperative: the loop checks `scrape_jobs.status` and aborts
   if an admin set it to `cancelled`.
7. On completion the job is marked `done` / `failed` / `cancelled` with stats.

## Compliance (KVKK + robots)

- **Company-only data.** Never extract personal names, phones, or emails. The
  staging schema has no columns for them; keep `parser.ts` aligned.
- **robots.txt** is honored (`respectRobotsTxtFile: true`).
- **Identifiable UA** with a contact address (RFC 9309 expectation).
- **Staging gate.** Results are not published until an admin approves them.
- **Secrets stay server-side.** The service role key lives only in the worker
  environment — never in the browser bundle.

## Adapting to a target site

`src/parser.ts` ships a generic MVP heuristic because the target directory's DOM
is not fixed at design time. Set `config.detailUrlPattern` on the job (a regex
string matching company detail URLs) and replace the field selectors in
`parsePage()` with the real ones for your source.
