import type { CheerioCrawlingContext } from "crawlee";
import type { StagingCompany } from "./supabase.js";

/** ASCII-only slug — kept in sync with the app's slugify (src/lib/admin/constants.ts). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface ParseResult {
  /** Detail/company URLs discovered on a list page, to be enqueued. */
  links: string[];
  /** A company parsed from a detail page, if this page is one. */
  company: StagingCompany | null;
}

/**
 * ADAPTER — site-specific extraction.
 *
 * The target directory's DOM is unknown at design time (see plan "açık/atlanan"),
 * so this MVP uses conservative, generic heuristics:
 *  - treat anchors matching a configurable detail pattern as company links
 *  - on a detail page, read company-only fields from common meta/landmarks
 *
 * Replace the selectors below with the real ones once the target site is fixed.
 * KEEP THIS COMPANY-ONLY: never extract personal names, phones, or emails (KVKK).
 */
export function parsePage(
  ctx: CheerioCrawlingContext,
  opts: { detailUrlPattern?: string } = {},
): ParseResult {
  const { $, request } = ctx;
  const url = request.loadedUrl ?? request.url;

  // --- List extraction: collect candidate company links ---
  const links: string[] = [];
  const pattern = opts.detailUrlPattern ? new RegExp(opts.detailUrlPattern) : null;
  $("a[href]").each((_i, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    let abs: string;
    try {
      abs = new URL(href, url).toString();
    } catch {
      return;
    }
    if (pattern && pattern.test(abs)) links.push(abs);
  });

  // --- Detail extraction: only if the page looks like a company profile ---
  // Heuristic: an <h1> company name plus an outbound website link.
  const name = ($("h1").first().text() || "").trim();
  let company: StagingCompany | null = null;
  if (name && (!pattern || pattern.test(url))) {
    const website =
      $('a[rel~="website"]').attr("href") ||
      $('a:contains("Web")').attr("href") ||
      null;
    const findSocial = (host: string) =>
      $(`a[href*="${host}"]`).first().attr("href") || null;

    company = {
      name,
      slug: slugify(name),
      website_url: website,
      sector: $('[data-field="sector"]').first().text().trim() || null,
      city: $('[data-field="city"]').first().text().trim() || null,
      size: $('[data-field="size"]').first().text().trim() || null,
      linkedin_url: findSocial("linkedin.com"),
      twitter_url: findSocial("twitter.com") || findSocial("x.com"),
      instagram_url: findSocial("instagram.com"),
      facebook_url: findSocial("facebook.com"),
      description: $('meta[name="description"]').attr("content") || null,
      source_url: url,
      normalized: { extractor: "generic-mvp" },
    };
    if (!company.slug) company = null; // skip un-sluggable names
  }

  return { links: Array.from(new Set(links)), company };
}
