function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getConfig() {
  return {
    port: parsePositiveInt(process.env.PORT, 3001),
    graphApiVersion: process.env.GRAPH_API_VERSION || "v19.0",
    igUserId: process.env.IG_USER_ID || "",
    igAccessToken: process.env.IG_ACCESS_TOKEN || "",
    openClawApiToken: process.env.OPENCLAW_API_TOKEN || "",
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    reelStatusPollIntervalMs: parsePositiveInt(process.env.REEL_STATUS_POLL_INTERVAL_MS, 3000),
    reelStatusMaxAttempts: parsePositiveInt(process.env.REEL_STATUS_MAX_ATTEMPTS, 10),
  };
}
