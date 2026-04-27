import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../src/integrations/supabase/types";

const resolveEnvValue = (...values: Array<string | undefined>) =>
  values.find((value) => value && !value.startsWith("REPLACE_WITH_")) ?? "";

export const getPublicSupabaseClient = () => {
  const url = resolveEnvValue(
    process.env.SUPABASE_URL,
    process.env.VITE_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  const key = resolveEnvValue(
    process.env.SUPABASE_ANON_KEY,
    process.env.VITE_SUPABASE_ANON_KEY,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  if (!url || !key) {
    return null;
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

export const getServiceSupabaseClient = () => {
  const url = resolveEnvValue(
    process.env.SUPABASE_URL,
    process.env.VITE_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  const key = resolveEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!url || !key) {
    return null;
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
