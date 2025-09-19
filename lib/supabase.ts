import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // Allow server to start but operations will fail with clear error
  console.warn("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in environment.");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);