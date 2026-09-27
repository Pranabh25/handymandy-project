import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * File storage for admin uploads (product photos).
 *
 * Local-disk implementation: files live under UPLOAD_DIR (default ./uploads)
 * and are served by src/app/uploads/[...path]/route.ts at /uploads/<key>.
 *
 * To move to S3 / Cloudinary / R2 later, re-implement these three functions
 * (saveUpload → put object & return its public URL, readUpload → not needed
 * when a CDN serves files, deleteUpload → delete object). Callers only ever
 * deal with the returned URL, which is what ProductImage.url stores.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const IMAGE_TYPES = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
} as const;
export type ImageExt = keyof typeof IMAGE_TYPES;

const CONTENT_TYPES: Record<string, string> = { ...IMAGE_TYPES, jpeg: "image/jpeg" };

export const PUBLIC_PREFIX = "/uploads/";

function uploadRoot() {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./uploads");
}

/** Detects the real image type from the file's magic bytes (never trust the client MIME alone). */
export function sniffImageType(buf: Uint8Array): ImageExt | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  const ascii = (from: number, to: number) => String.fromCharCode(...buf.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return "avif";
  return null;
}

/** Resolves a storage key to an absolute path, refusing anything outside the upload root. */
function resolveKey(key: string): string | null {
  const root = uploadRoot();
  const cleaned = key.replace(/\\/g, "/");
  if (cleaned.includes("\0")) return null;
  const full = path.resolve(root, cleaned);
  if (!full.startsWith(root + path.sep)) return null;
  return full;
}

/** Stores the file under <folder>/<yyyy>/<mm>/<random>.<ext> and returns its public URL. */
export async function saveUpload(data: Uint8Array, ext: ImageExt, folder = "products"): Promise<{ url: string; key: string }> {
  const now = new Date();
  const key = [
    folder,
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, "0"),
    `${randomBytes(12).toString("hex")}.${ext}`,
  ].join("/");
  const full = resolveKey(key);
  if (!full) throw new Error("Invalid upload path");
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, data);
  return { url: `${PUBLIC_PREFIX}${key}`, key };
}

/** Reads a stored file by key. Returns null when missing or outside the upload root. */
export async function readUpload(key: string): Promise<{ data: Buffer; contentType: string } | null> {
  const full = resolveKey(key);
  if (!full) return null;
  const ext = path.extname(full).slice(1).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) return null;
  try {
    return { data: await readFile(full), contentType };
  } catch {
    return null;
  }
}

/** Deletes a stored file by its public URL (no-op for URLs we don't own). */
export async function deleteUpload(url: string): Promise<void> {
  if (!url.startsWith(PUBLIC_PREFIX)) return;
  const full = resolveKey(url.slice(PUBLIC_PREFIX.length));
  if (!full) return;
  await unlink(full).catch(() => undefined);
}
