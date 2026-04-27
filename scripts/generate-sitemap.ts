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

const toUrlNode = (url: string, lastmod: string) => {
  return `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
};

const generate = async () => {
  loadLocalEnv();
  const lastmod = new Date().toISOString().slice(0, 10);
  const { indexableRoutes } = await getRouteManifest();
  const outputPath = path.join(ROOT_DIR, "public", "sitemap.xml");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from(indexableRoutes)
      .sort((a, b) => a.localeCompare(b))
      .map((route) => toUrlNode(`${SITE_URL}${route}`, lastmod)),
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
