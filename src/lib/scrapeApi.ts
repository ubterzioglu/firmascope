// Data-access layer for the company scraping pipeline.
// All reads/writes go through supabase-js with the anon key; RLS restricts
// every scraping table to admins (public.is_admin). The external worker uses
// the service role key out-of-band and is not represented here.
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ScrapeJob = Database["public"]["Tables"]["scrape_jobs"]["Row"];
export type ScrapeJobLog = Database["public"]["Tables"]["crawl_job_logs"]["Row"];
export type CompanyImportStaging = Database["public"]["Tables"]["company_import_staging"]["Row"];

export interface CreateScrapeJobInput {
  source: string;
  seedUrls: string[];
  config?: Record<string, unknown>;
}

/** Enqueues a new scrape job. The external worker polls for `queued` jobs. */
export async function createScrapeJob(input: CreateScrapeJobInput): Promise<ScrapeJob> {
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("scrape_jobs")
    .insert({
      source: input.source,
      seed_urls: input.seedUrls,
      config: (input.config ?? {}) as never,
      status: "queued",
      created_by: auth.user?.id ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listScrapeJobs(): Promise<ScrapeJob[]> {
  const { data, error } = await supabase
    .from("scrape_jobs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getScrapeJob(id: string): Promise<ScrapeJob | null> {
  const { data, error } = await supabase
    .from("scrape_jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listJobLogs(jobId: string): Promise<ScrapeJobLog[]> {
  const { data, error } = await supabase
    .from("crawl_job_logs")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Requests cancellation; the worker is expected to honor `cancelled` status. */
export async function cancelScrapeJob(id: string): Promise<void> {
  const { error } = await supabase
    .from("scrape_jobs")
    .update({ status: "cancelled" })
    .eq("id", id);
  if (error) throw error;
}

export async function listPendingImports(): Promise<CompanyImportStaging[]> {
  const { data, error } = await supabase
    .from("company_import_staging")
    .select("*")
    .eq("review_status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export interface ApproveImportResult {
  status: "approved" | "matches_existing";
  company_id?: string;
  matched_company_id?: string;
}

/** Approves a staging row -> canonical company via the approve_company_import RPC. */
export async function approveImport(stagingId: string): Promise<ApproveImportResult> {
  const { data, error } = await supabase.rpc("approve_company_import", {
    p_staging_id: stagingId,
  });
  if (error) throw error;
  return data as unknown as ApproveImportResult;
}

export async function rejectImport(stagingId: string): Promise<void> {
  const { error } = await supabase.rpc("reject_company_import", {
    p_staging_id: stagingId,
  });
  if (error) throw error;
}
