import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "public", "sitemap.xml");

const SITE_URL = "https://www.firmascope.com";
const STATIC_ROUTES = ["/", "/sirketler", "/yasal", "/giris", "/sirket-oner"];

const loadEnvFromFile = (filename: string) => {
  const envPath = path.join(ROOT, filename);
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf-8");
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }
    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
};

const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

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
  loadEnvFromFile(".env");
  loadEnvFromFile(".env.local");

  const lastmod = new Date().toISOString().slice(0, 10);
  const routes = new Set(STATIC_ROUTES);
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("slug")
        .eq("status", "Aktif");

      if (!error && data) {
        for (const company of data) {
          if (company.slug) {
            routes.add(`/sirket/${company.slug}`);
          }
        }
      }
    } catch (error) {
      console.warn("Sitemap dynamic route fetch skipped:", error);
    }
  } else {
    console.warn("Sitemap generated without dynamic company routes (missing Supabase env).");
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from(routes)
      .sort((a, b) => a.localeCompare(b))
      .map((route) => toUrlNode(`${SITE_URL}${route}`, lastmod)),
    "</urlset>",
    "",
  ].join("\n");

  await writeFile(OUTPUT_PATH, xml, "utf-8");
  console.log(`Sitemap generated: ${OUTPUT_PATH} (${routes.size} URLs)`);
};

generate().catch((error) => {
  console.error("Sitemap generation failed:", error);
  process.exitCode = 1;
});
