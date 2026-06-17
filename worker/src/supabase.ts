import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// Service-role client: bypasses RLS so the worker can read queued jobs and
// write staging rows / logs. This key must never reach a browser.
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type JobStatus = "queued" | "running" | "done" | "failed" | "cancelled";

export interface ScrapeJob {
  id: string;
  source: string;
  seed_urls: string[];
  status: JobStatus;
  config: Record<string, unknown>;
  stats: Record<string, unknown>;
}

export interface StagingCompany {
  name: string;
  slug: string;
  website_url?: string | null;
  sector?: string | null;
  city?: string | null;
  size?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  description?: string | null;
  source_url: string;
  normalized?: Record<string, unknown>;
}

/** Atomically claims the oldest queued job by flipping it to `running`. */
export async function claimNextQueuedJob(): Promise<ScrapeJob | null> {
  const { data: candidate, error: selErr } = await supabase
    .from("scrape_jobs")
    .select("*")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (selErr) throw selErr;
  if (!candidate) return null;

  // Guard against another worker grabbing it: only succeed if still queued.
  const { data: claimed, error: updErr } = await supabase
    .from("scrape_jobs")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("id", candidate.id)
    .eq("status", "queued")
    .select("*")
    .maybeSingle();
  if (updErr) throw updErr;
  return (claimed as ScrapeJob) ?? null;
}

export async function isJobCancelled(jobId: string): Promise<boolean> {
  const { data } = await supabase.from("scrape_jobs").select("status").eq("id", jobId).maybeSingle();
  return data?.status === "cancelled";
}

export async function finishJob(
  jobId: string,
  status: Extract<JobStatus, "done" | "failed" | "cancelled">,
  stats: Record<string, unknown>,
): Promise<void> {
  await supabase
    .from("scrape_jobs")
    .update({ status, stats, finished_at: new Date().toISOString() })
    .eq("id", jobId);
}

export async function log(
  jobId: string,
  level: "debug" | "info" | "warn" | "error",
  message: string,
  context: Record<string, unknown> = {},
): Promise<void> {
  await supabase.from("crawl_job_logs").insert({ job_id: jobId, level, message, context });
  // Mirror to stdout for local/CI visibility.
  // eslint-disable-next-line no-console
  console.log(`[${level}] ${jobId} ${message}`);
}

export async function recordItem(
  jobId: string,
  item: { url: string; status: string; http_status?: number; error_code?: string; error_message?: string },
): Promise<void> {
  await supabase.from("scrape_job_items").insert({
    job_id: jobId,
    url: item.url,
    status: item.status,
    http_status: item.http_status ?? null,
    error_code: item.error_code ?? null,
    error_message: item.error_message ?? null,
  });
}

/**
 * Inserts a staging company, computing dedupe_status against existing companies
 * by slug. Skips silently if the same (job, slug) was already staged.
 */
export async function upsertStaging(jobId: string, company: StagingCompany): Promise<void> {
  const { data: existing } = await supabase
    .from("companies")
    .select("id")
    .eq("slug", company.slug)
    .maybeSingle();

  await supabase.from("company_import_staging").insert({
    job_id: jobId,
    name: company.name,
    slug: company.slug,
    website_url: company.website_url ?? null,
    sector: company.sector ?? null,
    city: company.city ?? null,
    size: company.size ?? null,
    linkedin_url: company.linkedin_url ?? null,
    twitter_url: company.twitter_url ?? null,
    instagram_url: company.instagram_url ?? null,
    facebook_url: company.facebook_url ?? null,
    description: company.description ?? null,
    source_url: company.source_url,
    normalized: company.normalized ?? {},
    dedupe_status: existing ? "matches_existing" : "new",
    matched_company_id: existing?.id ?? null,
    review_status: "pending",
  });
}
