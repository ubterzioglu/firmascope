import { promises as fs } from "node:fs";
import path from "node:path";
import { ROOT_DIR } from "./lib/env";

const DIST_DIR = path.join(ROOT_DIR, "dist");
const isStrict = process.env.JSONLD_STRICT === "true";

const JSONLD_BLOCK = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;

type ValidationIssue = {
  file: string;
  message: string;
};

const decodeEntities = (value: string) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const collectHtmlFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
};

const validateNode = (file: string, node: unknown, issues: ValidationIssue[]) => {
  if (!node || typeof node !== "object") {
    issues.push({ file, message: "JSON-LD block is not an object" });
    return;
  }

  const record = node as Record<string, unknown>;
  if (!("@context" in record)) {
    issues.push({ file, message: "JSON-LD block missing @context" });
  }
  if (!("@type" in record) && !("@graph" in record)) {
    issues.push({ file, message: "JSON-LD block missing both @type and @graph" });
  }
};

const main = async () => {
  let htmlFiles: string[];
  try {
    htmlFiles = await collectHtmlFiles(DIST_DIR);
  } catch (error) {
    const message = `Skipping JSON-LD validation: dist/ not found (${(error as Error).message}).`;
    if (isStrict) {
      throw new Error(message);
    }
    console.warn(message);
    return;
  }

  const issues: ValidationIssue[] = [];
  let blockCount = 0;
  let pagesWithJsonLd = 0;

  for (const file of htmlFiles) {
    const html = await fs.readFile(file, "utf-8");
    const relative = path.relative(DIST_DIR, file);
    let pageHadBlock = false;

    for (const match of html.matchAll(JSONLD_BLOCK)) {
      pageHadBlock = true;
      blockCount += 1;
      const raw = decodeEntities(match[1].trim());

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        issues.push({ file: relative, message: `Invalid JSON: ${(error as Error).message}` });
        continue;
      }

      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          validateNode(relative, item, issues);
        }
      } else {
        validateNode(relative, parsed, issues);
      }
    }

    if (pageHadBlock) {
      pagesWithJsonLd += 1;
    }
  }

  console.log(
    `JSON-LD validation: scanned ${htmlFiles.length} HTML files, ${blockCount} blocks across ${pagesWithJsonLd} pages.`
  );

  if (issues.length > 0) {
    console.warn(`JSON-LD validation found ${issues.length} issue(s):`);
    for (const issue of issues) {
      console.warn(`  - ${issue.file}: ${issue.message}`);
    }
    if (isStrict) {
      throw new Error(`JSON-LD validation failed with ${issues.length} issue(s).`);
    }
    return;
  }

  console.log("JSON-LD validation passed with no issues.");
};

main().catch((error) => {
  console.error("JSON-LD validation failed:", error);
  process.exitCode = 1;
});
