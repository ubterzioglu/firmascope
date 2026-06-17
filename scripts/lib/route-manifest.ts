import { INDEXABLE_STATIC_ROUTES, slugifyTaxonomyValue } from "../../src/lib/site";
import { getPublicSupabaseClient } from "./supabase";

export type RouteEntry = {
  path: string;
  lastmod: string;
};

export type RouteManifest = {
  companyRoutes: string[];
  companyEntries: RouteEntry[];
  sectorRoutes: string[];
  cityRoutes: string[];
  indexableRoutes: string[];
};

const toDateOnly = (value: string | null | undefined) =>
  value ? value.split("T")[0] : null;

export const getRouteManifest = async (): Promise<RouteManifest> => {
  const staticRoutes = [...INDEXABLE_STATIC_ROUTES];
  const fallbackLastmod = new Date().toISOString().slice(0, 10);
  const supabase = getPublicSupabaseClient();

  if (!supabase) {
    return {
      companyRoutes: [],
      companyEntries: [],
      sectorRoutes: [],
      cityRoutes: [],
      indexableRoutes: staticRoutes,
    };
  }

  const { data, error } = await supabase
    .from("companies")
    .select("id,slug,sector,city,created_at")
    .eq("status", "Aktif");

  if (error || !data) {
    console.warn("Route manifest generated without dynamic routes:", error?.message ?? "unknown error");
    return {
      companyRoutes: [],
      companyEntries: [],
      sectorRoutes: [],
      cityRoutes: [],
      indexableRoutes: staticRoutes,
    };
  }

  // Build a per-company latest-content date from the public review/salary/
  // interview views, falling back to the company creation date.
  const companyLastmod = new Map<string, string>();
  for (const company of data) {
    const created = toDateOnly((company as { created_at?: string | null }).created_at);
    if (created) {
      companyLastmod.set((company as { id: string }).id, created);
    }
  }

  const contentSources = ["reviews_public", "salaries_public", "interviews_public"] as const;
  const contentResults = await Promise.all(
    contentSources.map((source) => supabase.from(source).select("company_id,created_at"))
  );
  for (const result of contentResults) {
    for (const row of (result.data as Array<{ company_id: string | null; created_at: string | null }> | null) ?? []) {
      if (!row.company_id) continue;
      const date = toDateOnly(row.created_at);
      if (!date) continue;
      const existing = companyLastmod.get(row.company_id);
      if (!existing || date > existing) {
        companyLastmod.set(row.company_id, date);
      }
    }
  }

  const companyEntries = data
    .filter((company) => Boolean(company.slug))
    .map((company) => ({
      path: `/sirket/${company.slug}`,
      lastmod: companyLastmod.get((company as { id: string }).id) ?? fallbackLastmod,
    }))
    .sort((a, b) => a.path.localeCompare(b.path, "tr"));

  const companyRoutes = companyEntries.map((entry) => entry.path);

  const sectorRoutes = Array.from(
    new Set(
      data
        .map((company) => company.sector)
        .filter(Boolean)
        .map((sector) => `/sektor/${slugifyTaxonomyValue(sector as string)}`)
    )
  ).sort((a, b) => a.localeCompare(b, "tr"));

  const cityRoutes = Array.from(
    new Set(
      data
        .map((company) => company.city)
        .filter(Boolean)
        .map((city) => `/sehir/${slugifyTaxonomyValue(city as string)}`)
    )
  ).sort((a, b) => a.localeCompare(b, "tr"));

  return {
    companyRoutes,
    companyEntries,
    sectorRoutes,
    cityRoutes,
    indexableRoutes: [...staticRoutes, ...companyRoutes, ...sectorRoutes, ...cityRoutes],
  };
};
