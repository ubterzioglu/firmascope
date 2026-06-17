import { writeFile } from "node:fs/promises";
import path from "node:path";
import { SITE_URL } from "../src/lib/site";
import { ROOT_DIR, loadLocalEnv } from "./lib/env";
import { getRouteManifest } from "./lib/route-manifest";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

type UrlNode = {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
};

const toUrlNode = ({ loc, lastmod, changefreq, priority }: UrlNode) =>
  [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");

// Per route-class SEO signals. Home/listing change most often and are most
// important; company pages update as content arrives; taxonomy pages are
// aggregate landing pages.
const classify = (route: string): { changefreq: string; priority: string } => {
  if (route === "/") return { changefreq: "daily", priority: "1.0" };
  if (route === "/sirketler") return { changefreq: "daily", priority: "0.9" };
  if (route.startsWith("/sirket/")) return { changefreq: "weekly", priority: "0.8" };
  if (route.startsWith("/sektor/") || route.startsWith("/sehir/")) {
    return { changefreq: "weekly", priority: "0.6" };
  }
  return { changefreq: "monthly", priority: "0.5" };
};

const generate = async () => {
  loadLocalEnv();
  const defaultLastmod = new Date().toISOString().slice(0, 10);
  const { indexableRoutes, companyEntries } = await getRouteManifest();
  const outputPath = path.join(ROOT_DIR, "public", "sitemap.xml");

  // Per-company lastmod from the manifest; everything else uses the build date.
  const lastmodByRoute = new Map<string, string>();
  for (const entry of companyEntries) {
    lastmodByRoute.set(entry.path, entry.lastmod);
  }

  const nodes = Array.from(indexableRoutes)
    .sort((a, b) => a.localeCompare(b))
    .map((route) => {
      const { changefreq, priority } = classify(route);
      return toUrlNode({
        loc: `${SITE_URL}${route}`,
        lastmod: lastmodByRoute.get(route) ?? defaultLastmod,
        changefreq,
        priority,
      });
    });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...nodes,
    "</urlset>",
    "",
  ].join("\n");

  await writeFile(outputPath, xml, "utf-8");
  console.log(`Sitemap generated: ${outputPath} (${indexableRoutes.length} URLs)`);
};

generate().catch((error) => {
  console.error("Sitemap generation failed:", error);
  process.exitCode = 1;
});
