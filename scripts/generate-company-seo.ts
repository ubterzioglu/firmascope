import { buildCompanySeoContent } from "../src/lib/company-seo";
import { loadLocalEnv } from "./lib/env";
import { getServiceSupabaseClient } from "./lib/supabase";

const PROMPT_VERSION = "deterministic-v1";

const main = async () => {
  loadLocalEnv();

  const supabase = getServiceSupabaseClient();
  if (!supabase) {
    console.warn("Skipping company SEO generation: SUPABASE_SERVICE_ROLE_KEY is missing.");
    return;
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
    console.log("No active companies found for SEO generation.");
    return;
  }

  const companyIds = companies.map((company) => company.id);
  const [{ data: reviews, error: reviewError }, { data: salaries, error: salaryError }, { data: interviews, error: interviewError }] =
    await Promise.all([
      supabase.from("reviews_public").select("*").in("company_id", companyIds),
      supabase.from("salaries_public").select("*").in("company_id", companyIds),
      supabase.from("interviews_public").select("*").in("company_id", companyIds),
    ]);

  if (reviewError) throw reviewError;
  if (salaryError) throw salaryError;
  if (interviewError) throw interviewError;

  const reviewMap = new Map<string, typeof reviews>();
  const salaryMap = new Map<string, typeof salaries>();
  const interviewMap = new Map<string, typeof interviews>();

  for (const review of reviews ?? []) {
    if (!review.company_id) continue;
    reviewMap.set(review.company_id, [...(reviewMap.get(review.company_id) ?? []), review]);
  }
  for (const salary of salaries ?? []) {
    if (!salary.company_id) continue;
    salaryMap.set(salary.company_id, [...(salaryMap.get(salary.company_id) ?? []), salary]);
  }
  for (const interview of interviews ?? []) {
    if (!interview.company_id) continue;
    interviewMap.set(interview.company_id, [...(interviewMap.get(interview.company_id) ?? []), interview]);
  }

  const payload = companies.map((company) => {
    const content = buildCompanySeoContent({
      company,
      reviews: reviewMap.get(company.id) ?? [],
      salaries: salaryMap.get(company.id) ?? [],
      interviews: interviewMap.get(company.id) ?? [],
    });

    return {
      company_id: company.id,
      intro_summary: content.introSummary,
      culture_summary: content.cultureSummary,
      salary_summary: content.salarySummary,
      interview_summary: content.interviewSummary,
      pros_summary: content.prosSummary,
      cons_summary: content.consSummary,
      candidate_takeaway: content.candidateTakeaway,
      faq_items_json: content.faqItems,
      external_links_json: content.externalLinks,
      keywords_json: content.keywords,
      word_count: content.wordCount,
      generation_status: content.generationStatus,
      source_snapshot_json: content.sourceSnapshot,
      prompt_version: PROMPT_VERSION,
      generated_at: new Date().toISOString(),
    };
  });

  const { error: upsertError } = await supabase
    .from("company_seo_profiles")
    .upsert(payload, { onConflict: "company_id" });

  if (upsertError) {
    throw upsertError;
  }

  console.log(`Generated SEO profiles for ${payload.length} companies.`);
};

main().catch((error) => {
  console.error("Company SEO generation failed:", error);
  process.exitCode = 1;
});
