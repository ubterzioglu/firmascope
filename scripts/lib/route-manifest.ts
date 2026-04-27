import { INDEXABLE_STATIC_ROUTES, slugifyTaxonomyValue } from "../../src/lib/site";
import { getPublicSupabaseClient } from "./supabase";

export type RouteManifest = {
  companyRoutes: string[];
  sectorRoutes: string[];
  cityRoutes: string[];
  indexableRoutes: string[];
};

export const getRouteManifest = async (): Promise<RouteManifest> => {
  const staticRoutes = [...INDEXABLE_STATIC_ROUTES];
  const supabase = getPublicSupabaseClient();

  if (!supabase) {
    return {
      companyRoutes: [],
      sectorRoutes: [],
      cityRoutes: [],
      indexableRoutes: staticRoutes,
    };
  }

  const { data, error } = await supabase
    .from("companies")
    .select("slug,sector,city")
    .eq("status", "Aktif");

  if (error || !data) {
    console.warn("Route manifest generated without dynamic routes:", error?.message ?? "unknown error");
    return {
      companyRoutes: [],
      sectorRoutes: [],
      cityRoutes: [],
      indexableRoutes: staticRoutes,
    };
  }

  const companyRoutes = data
    .map((company) => company.slug)
    .filter(Boolean)
    .map((slug) => `/sirket/${slug}`)
    .sort((a, b) => a.localeCompare(b, "tr"));

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
    sectorRoutes,
    cityRoutes,
    indexableRoutes: [...staticRoutes, ...companyRoutes, ...sectorRoutes, ...cityRoutes],
  };
};
