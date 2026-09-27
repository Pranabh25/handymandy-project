import { readUpload } from "@/server/storage";

/** Serves admin-uploaded files from UPLOAD_DIR. Keys are random, so files are immutable. */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  if (!path?.length || path.some((seg) => !seg || seg === "." || seg === ".." || seg.includes("/") || seg.includes("\\"))) {
    return new Response("Not found", { status: 404 });
  }
  const file = await readUpload(path.join("/"));
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
