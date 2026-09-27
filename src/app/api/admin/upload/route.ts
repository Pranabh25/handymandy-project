import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { IMAGE_TYPES, MAX_UPLOAD_BYTES, saveUpload, sniffImageType } from "@/server/storage";

/** POST /api/admin/upload — multipart field "file". Admin only. Returns { url }. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Please sign in as an admin." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Send the image as multipart form data." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image was attached." }, { status: 400 });
  }
  if (file.size === 0) return NextResponse.json({ error: "The image is empty." }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Images must be 5 MB or smaller." }, { status: 413 });
  }
  const allowedMimes = Object.values(IMAGE_TYPES) as string[];
  if (file.type && !allowedMimes.includes(file.type)) {
    return NextResponse.json({ error: "Upload a JPG, PNG, WebP or AVIF image." }, { status: 415 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniffImageType(bytes);
  if (!ext) {
    return NextResponse.json({ error: "That file doesn't look like a JPG, PNG, WebP or AVIF image." }, { status: 415 });
  }

  const { url } = await saveUpload(bytes, ext, "products");
  return NextResponse.json({ url }, { status: 201 });
}
