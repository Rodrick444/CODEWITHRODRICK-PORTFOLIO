import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase Storage credentials not configured. Image uploads will fail.");
}

export const supabaseStorage = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

export const BUCKET_NAME = "project-images";

export async function uploadToSupabase(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  if (!supabaseStorage) {
    throw new Error("Supabase Storage is not configured");
  }

  const { data, error } = await supabaseStorage.storage
    .from(BUCKET_NAME)
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  const { data: urlData } = supabaseStorage.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deleteFromSupabase(filePath: string): Promise<void> {
  if (!supabaseStorage) {
    throw new Error("Supabase Storage is not configured");
  }

  const { error } = await supabaseStorage.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete from Supabase: ${error.message}`);
  }
}
