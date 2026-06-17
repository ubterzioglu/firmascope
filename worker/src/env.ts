// Environment loading + validation. Fails fast at startup if required
// secrets are missing (never default secrets to empty strings).

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

export const env = {
  SUPABASE_URL: required("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),
  SCRAPE_USER_AGENT: optional(
    "SCRAPE_USER_AGENT",
    "FirmaScopeBot/0.1 (+contact: admin@firmascope.com; purpose: internal-company-indexing)",
  ),
  POLL_INTERVAL_MS: Number(optional("POLL_INTERVAL_MS", "15000")),
  MAX_REQUESTS_PER_MINUTE: Number(optional("MAX_REQUESTS_PER_MINUTE", "60")),
  MAX_CONCURRENCY: Number(optional("MAX_CONCURRENCY", "2")),
  RUN_ONCE: optional("RUN_ONCE", "") === "1",
};
