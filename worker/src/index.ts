import { CheerioCrawler, Configuration } from "crawlee";
import { env } from "./env.js";
import { parsePage } from "./parser.js";
import {
  claimNextQueuedJob, finishJob, isJobCancelled, log, recordItem, upsertStaging,
  type ScrapeJob,
} from "./supabase.js";

// Keep Crawlee's local storage ephemeral; we persist everything to Supabase.
Configuration.getGlobalConfig().set("persistStorage", false);

async function runJob(job: ScrapeJob): Promise<void> {
  await log(job.id, "info", "Job started", { source: job.source, seeds: job.seed_urls.length });

  let companiesFound = 0;
  let pagesOk = 0;
  let pagesFailed = 0;
  let cancelled = false;

  const detailUrlPattern =
    typeof job.config?.detailUrlPattern === "string" ? job.config.detailUrlPattern : undefined;

  const crawler = new CheerioCrawler({
    // Politeness + compliance.
    respectRobotsTxtFile: true,
    maxRequestsPerMinute: env.MAX_REQUESTS_PER_MINUTE,
    maxConcurrency: env.MAX_CONCURRENCY,
    maxRequestRetries: 3,
    requestHandlerTimeoutSecs: 45,
    additionalMimeTypes: ["text/html", "application/xhtml+xml"],
    preNavigationHooks: [
      async ({ request }) => {
        request.headers = { ...request.headers, "User-Agent": env.SCRAPE_USER_AGENT };
      },
    ],
    async requestHandler(ctx) {
      // Cooperative cancellation: stop enqueuing/processing if admin cancelled.
      if (await isJobCancelled(job.id)) {
        cancelled = true;
        await crawler.autoscaledPool?.abort();
        return;
      }

      const { request, enqueueLinks } = ctx;
      const url = request.loadedUrl ?? request.url;
      const { links, company } = parsePage(ctx, { detailUrlPattern });

      if (company) {
        await upsertStaging(job.id, company);
        companiesFound += 1;
        await log(job.id, "debug", "Company staged", { slug: company.slug, url });
      }

      if (links.length > 0) {
        await enqueueLinks({ urls: links });
      }

      pagesOk += 1;
      await recordItem(job.id, { url, status: "done", http_status: 200 });
    },
    async failedRequestHandler({ request }, error) {
      pagesFailed += 1;
      await recordItem(job.id, {
        url: request.url,
        status: "failed",
        error_code: "request_failed",
        error_message: error instanceof Error ? error.message : String(error),
      });
      await log(job.id, "warn", "Request failed", { url: request.url });
    },
  });

  try {
    await crawler.run(job.seed_urls);
    const stats = { companiesFound, pagesOk, pagesFailed };
    if (cancelled) {
      await finishJob(job.id, "cancelled", stats);
      await log(job.id, "info", "Job cancelled", stats);
    } else {
      await finishJob(job.id, "done", stats);
      await log(job.id, "info", "Job done", stats);
    }
  } catch (error) {
    const stats = { companiesFound, pagesOk, pagesFailed };
    await finishJob(job.id, "failed", stats);
    await log(job.id, "error", "Job failed", {
      ...stats,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function tick(): Promise<boolean> {
  const job = await claimNextQueuedJob();
  if (!job) return false;
  await runJob(job);
  return true;
}

async function main(): Promise<void> {
  if (env.RUN_ONCE) {
    const did = await tick();
    // eslint-disable-next-line no-console
    console.log(did ? "Processed one job." : "No queued jobs.");
    return;
  }

  // eslint-disable-next-line no-console
  console.log("Worker started; polling for queued jobs...");
  // Long-running poll loop. A processed job loops immediately to drain the queue.
  for (;;) {
    const did = await tick();
    if (!did) {
      await new Promise((r) => setTimeout(r, env.POLL_INTERVAL_MS));
    }
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Fatal worker error:", error);
  process.exit(1);
});
