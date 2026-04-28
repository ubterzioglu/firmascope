import { createClient } from "@supabase/supabase-js";

import { getConfig } from "./config.js";

let supabaseClient;

function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { supabaseUrl, supabaseServiceRoleKey } = getConfig();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for persistence");
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseClient;
}

export async function createLog(payload) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("instagram_publish_logs")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function updateLog(id, payload) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("instagram_publish_logs").update(payload).eq("id", id);

  if (error) {
    throw error;
  }
}
