import { promises as fs } from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright-core";
import { ROOT_DIR, loadLocalEnv } from "./lib/env";
import { getRouteManifest } from "./lib/route-manifest";
const DIST_DIR = path.join(ROOT_DIR, "dist");
const isPrerenderRequired = process.env.PRERENDER_REQUIRED === "true";
const MIME_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const resolveBrowserPath = async () => {
  const candidatePaths = [
    process.env.PRERENDER_BROWSER_PATH,
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean) as string[];

  for (const browserPath of candidatePaths) {
    try {
      await fs.access(browserPath);
      return browserPath;
    } catch {
      continue;
    }
  }

  throw new Error("No supported browser binary found for prerendering.");
};

const createStaticServer = () => {
  const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url ?? "/", "http://localhost");
    const routePath = decodeURIComponent(requestUrl.pathname);
    const filesystemPath = path.join(DIST_DIR, routePath);

    const tryServeFile = async (filePath: string) => {
      try {
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
          return false;
        }

        const buffer = await fs.readFile(filePath);
        res.statusCode = 200;
        res.setHeader("Content-Type", MIME_TYPES[path.extname(filePath)] || "application/octet-stream");
        res.end(buffer);
        return true;
      } catch {
        return false;
      }
    };

    if (await tryServeFile(filesystemPath)) {
      return;
    }

    if (await tryServeFile(path.join(filesystemPath, "index.html"))) {
      return;
    }

    const fallback = path.join(DIST_DIR, "index.html");
    const buffer = await fs.readFile(fallback);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(buffer);
  });

  return new Promise<{ server: http.Server; port: number }>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Unable to resolve prerender server port."));
        return;
      }

      resolve({ server, port: address.port });
    });
  });
};

const writePrerenderedHtml = async (route: string, html: string) => {
  const targetPath =
    route === "/"
      ? path.join(DIST_DIR, "index.html")
      : path.join(DIST_DIR, route.replace(/^\//, ""), "index.html");

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, html, "utf-8");
};

const main = async () => {
  loadLocalEnv();

  let browserPath: string;
  try {
    browserPath = await resolveBrowserPath();
  } catch (error) {
    if (isPrerenderRequired) {
      throw error;
    }

    console.warn(
      "Skipping prerender: no supported browser binary found. Set PRERENDER_REQUIRED=true to fail instead."
    );
    return;
  }

  const routeManifest = await getRouteManifest();
  const { server, port } = await createStaticServer();
  const browser = await chromium.launch({
    executablePath: browserPath,
    headless: true,
  });

  try {
    const concurrency = 4;
    for (let index = 0; index < routeManifest.indexableRoutes.length; index += concurrency) {
      const batch = routeManifest.indexableRoutes.slice(index, index + concurrency);
      await Promise.all(
        batch.map(async (route) => {
          console.log(`Prerendering ${route}`);
          const page = await browser.newPage();

          try {
            await page.goto(`http://127.0.0.1:${port}${route}`, {
              waitUntil: "networkidle",
              timeout: 30000,
            });
            await page.waitForTimeout(500);

            const html = await page.content();
            await writePrerenderedHtml(route, html);
          } finally {
            await page.close();
          }
        })
      );
    }

    console.log(`Prerender completed for ${routeManifest.indexableRoutes.length} routes.`);
  } finally {
    await browser.close();
    server.close();
  }
};

main().catch((error) => {
  console.error("Prerender failed:", error);
  process.exitCode = 1;
});
