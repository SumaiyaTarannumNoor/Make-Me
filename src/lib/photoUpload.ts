import { supabase } from "@/integrations/supabase/client";
import { removeBackground } from "@imgly/background-removal";

/**
 * Resize an image blob to fit within `maxSize` (longest side).
 * Returns a PNG blob.
 */
export async function resizeImage(source: Blob | File, maxSize = 800): Promise<Blob> {
  const bitmap = await createImageBitmap(source);
  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = longest > maxSize ? maxSize / longest : 1;
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
      "image/png",
      0.95
    );
  });
}

/**
 * Remove the background from an image blob using an on-device model.
 * Returns a transparent PNG blob.
 */
export async function removeImageBackground(source: Blob): Promise<Blob> {
  return await removeBackground(source, { output: { format: "image/png" } });
}

/**
 * Upload a blob to a private storage bucket and return the stored path.
 * Path shape: `{userId}/{subpath}-{timestamp}.png`
 */
export async function uploadPhoto(
  bucket: string,
  userId: string,
  subpath: string,
  blob: Blob
): Promise<string> {
  const path = `${userId}/${subpath}-${Date.now()}.png`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { contentType: "image/png", upsert: true });
  if (error) throw error;
  return path;
}

/**
 * Return a long-lived signed URL for a stored private image (1 year).
 */
export async function getPhotoUrl(bucket: string, path: string): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (error) return null;
  return data.signedUrl;
}

/**
 * Best-effort delete of a stored photo (ignores errors).
 */
export async function deletePhoto(bucket: string, path: string): Promise<void> {
  if (!path) return;
  await supabase.storage.from(bucket).remove([path]);
}
