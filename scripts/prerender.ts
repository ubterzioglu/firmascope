import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import http from "node:http";
import path from "node:path";
import { promisify } from "node:util";
import { ROOT_DIR, loadLocalEnv } from "./lib/env";
import { getRouteManifest } from "./lib/route-manifest";

const execFileAsync = promisify(execFile);
const DIST_DIR = path.join(ROOT_DIR, "dist");
const EDGE_PATHS = [
  process.env.PRERENDER_BROWSER_PATH,
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean) as string[];

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
  for (const browserPath of EDGE_PATHS) {
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

  const browserPath = await resolveBrowserPath();
  const routeManifest = await getRouteManifest();
  const { server, port } = await createStaticServer();

  try {
    for (const route of routeManifest.indexableRoutes) {
      const url = `http://127.0.0.1:${port}${route}`;
      console.log(`Prerendering ${route}`);

      const { stdout } = await execFileAsync(browserPath, [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--virtual-time-budget=20000",
        "--dump-dom",
        url,
      ], {
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 5,
      });

      await writePrerenderedHtml(route, stdout);
    }

    console.log(`Prerender completed for ${routeManifest.indexableRoutes.length} routes.`);
  } finally {
    server.close();
  }
};

main().catch((error) => {
  console.error("Prerender failed:", error);
  process.exitCode = 1;
});
