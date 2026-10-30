// Single shared Supabase client for the whole app (auth session included).
// Re-exports the auto-generated Lovable Cloud client so every page and
// admin component talks to the same project and the same session.
export { supabase } from "../integrations/supabase/client";
