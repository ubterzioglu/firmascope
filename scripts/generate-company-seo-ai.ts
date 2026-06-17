/**
 * Standalone AI SEO generation. NOT part of `npm run build` — run it manually
 * or on a schedule so deploys stay decoupled from Gemini calls/cost.
 *
 *   npm run seo:generate
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (+ SUPABASE_URL) and GEMINI_API_KEY in the
 * environment (or .env.local). Writes AI summaries to company_seo_profiles;
 * falls back to the deterministic builder per-company on any Gemini failure.
 * Optional model override: GEMINI_MODEL (default: gemini-2.5-flash).
 *
 * Cron: schedule `npm run seo:generate` via a Coolify scheduled task or Supabase
 * pg_cron job that hits a wrapper; it is idempotent (upsert on company_id).
 */
import { buildCompanySeoContent, computeCompanySnapshot } from "../src/lib/company-seo";
import { loadLocalEnv } from "./lib/env";
import { generateCompanySummary, type GeneratedAiContent } from "./lib/gemini";
import { getServiceSupabaseClient } from "./lib/supabase";

const AI_PROMPT_VERSION = "gemini-flash-v1";
const DETERMINISTIC_PROMPT_VERSION = "deterministic-v1";
const CONCURRENCY = 3;

type CompanyRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sector: string | null;
  city: string | null;
  size: string | null;
  company_type: string | null;
};

const countWords = (sections: Array<string | null | undefined>) =>
  sections
    .filter(Boolean)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const main = async () => {
  loadLocalEnv();

  const supabase = getServiceSupabaseClient();
  if (!supabase) {
    console.warn("Skipping AI SEO generation: SUPABASE_SERVICE_ROLE_KEY is missing.");
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "GEMINI_API_KEY is missing — every company will use the deterministic fallback."
    );
  }

  const { data: companies, error: companyError } = await supabase
    .from("companies")
    .select("id,name,slug,description,sector,city,size,company_type")
    .eq("status", "Aktif")
    .order("name");

  if (companyError) {
    throw companyError;
  }

  if (!companies || companies.length === 0) {
    console.log("No active companies found for AI SEO generation.");
    return;
  }

  const companyRows = companies as CompanyRow[];
  const companyIds = companyRows.map((company) => company.id);

  const [{ data: reviews, error: reviewError }, { data: salaries, error: salaryError }, { data: interviews, error: interviewError }] =
    await Promise.all([
      supabase.from("reviews_public").select("*").in("company_id", companyIds),
      supabase.from("salaries_public").select("*").in("company_id", companyIds),
      supabase.from("interviews_public").select("*").in("company_id", companyIds),
    ]);

  if (reviewError) throw reviewError;
  if (salaryError) throw salaryError;
  if (interviewError) throw interviewError;

  const groupBy = <T extends { company_id: string | null }>(rows: T[] | null) => {
    const map = new Map<string, T[]>();
    for (const row of rows ?? []) {
      if (!row.company_id) continue;
      map.set(row.company_id, [...(map.get(row.company_id) ?? []), row]);
    }
    return map;
  };

  const reviewMap = groupBy(reviews as Array<{ company_id: string | null }> | null);
  const salaryMap = groupBy(salaries as Array<{ company_id: string | null }> | null);
  const interviewMap = groupBy(interviews as Array<{ company_id: string | null }> | null);

  let aiCount = 0;
  let fallbackCount = 0;

  const buildPayload = async (company: CompanyRow) => {
    const companyReviews = (reviewMap.get(company.id) ?? []) as never[];
    const companySalaries = (salaryMap.get(company.id) ?? []) as never[];
    const companyInterviews = (interviewMap.get(company.id) ?? []) as never[];

    // Deterministic content is always computed: it is both the fallback and the
    // source of non-AI fields (externalLinks, sourceSnapshot, etc.).
    const deterministic = buildCompanySeoContent({
      company,
      reviews: companyReviews,
      salaries: companySalaries,
      interviews: companyInterviews,
    });

    const snapshot = computeCompanySnapshot({
      reviews: companyReviews,
      salaries: companySalaries,
      interviews: companyInterviews,
    });

    const ai: GeneratedAiContent | null = await generateCompanySummary({
      name: company.name,
      description: company.description,
      sector: company.sector,
      city: company.city,
      size: company.size,
      company_type: company.company_type,
      snapshot,
    });

    const usedAi = ai !== null;
    if (usedAi) {
      aiCount += 1;
    } else {
      fallbackCount += 1;
    }

    const content = usedAi
      ? {
          intro_summary: ai.introSummary,
          culture_summary: ai.cultureSummary,
          salary_summary: ai.salarySummary,
          interview_summary: ai.interviewSummary,
          pros_summary: ai.prosSummary,
          cons_summary: ai.consSummary,
          candidate_takeaway: ai.candidateTakeaway,
          faq_items_json: ai.faqItems.length > 0 ? ai.faqItems : deterministic.faqItems,
          keywords_json: ai.keywords.length > 0 ? ai.keywords : deterministic.keywords,
          word_count: countWords([
            ai.introSummary,
            ai.cultureSummary,
            ai.salarySummary,
            ai.interviewSummary,
            ai.prosSummary,
            ai.consSummary,
            ai.candidateTakeaway,
            ...ai.faqItems.map((item) => `${item.question} ${item.answer}`),
          ]),
        }
      : {
          intro_summary: deterministic.introSummary,
          culture_summary: deterministic.cultureSummary,
          salary_summary: deterministic.salarySummary,
          interview_summary: deterministic.interviewSummary,
          pros_summary: deterministic.prosSummary,
          cons_summary: deterministic.consSummary,
          candidate_takeaway: deterministic.candidateTakeaway,
          faq_items_json: deterministic.faqItems,
          keywords_json: deterministic.keywords,
          word_count: deterministic.wordCount,
        };

    return {
      company_id: company.id,
      ...content,
      // External links and source snapshot stay deterministic regardless of AI.
      external_links_json: deterministic.externalLinks,
      source_snapshot_json: snapshot,
      generation_status: deterministic.generationStatus,
      prompt_version: usedAi ? AI_PROMPT_VERSION : DETERMINISTIC_PROMPT_VERSION,
      generated_at: new Date().toISOString(),
    };
  };

  // Bounded concurrency to control Gemini quota/cost.
  const payloads: Array<Awaited<ReturnType<typeof buildPayload>>> = [];
  for (let index = 0; index < companyRows.length; index += CONCURRENCY) {
    const batch = companyRows.slice(index, index + CONCURRENCY);
    const results = await Promise.all(batch.map(buildPayload));
    payloads.push(...results);
    console.log(`Processed ${Math.min(index + CONCURRENCY, companyRows.length)}/${companyRows.length} companies...`);
  }

  const { error: upsertError } = await supabase
    .from("company_seo_profiles")
    .upsert(payloads, { onConflict: "company_id" });

  if (upsertError) {
    throw upsertError;
  }

  console.log(
    `SEO profiles upserted for ${payloads.length} companies (${aiCount} AI, ${fallbackCount} deterministic fallback).`
  );
};

main().catch((error) => {
  console.error("AI SEO generation failed:", error);
  process.exitCode = 1;
});
