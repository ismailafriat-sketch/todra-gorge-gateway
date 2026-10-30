import { supabase } from "./supabase";

// Upload a file to the media bucket and return a long-lived signed URL.
// Since the workspace blocks public buckets, we sign for 10 years.
const TEN_YEARS_SECONDS = 60 * 60 * 24 * 365 * 10;

export async function uploadMedia(file: File, folder = "uploads"): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("media")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (upErr) throw upErr;

  const { data, error } = await supabase.storage
    .from("media")
    .createSignedUrl(path, TEN_YEARS_SECONDS);
  if (error || !data?.signedUrl) throw error ?? new Error("Signed URL failed");
  return data.signedUrl;
}
