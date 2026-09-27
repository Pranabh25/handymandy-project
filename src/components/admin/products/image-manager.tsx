"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, GripVertical, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "@/components/product/product-image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ImageItem } from "./form-types";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 12;

async function uploadOne(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed");
  return json.url;
}

/** Upload, preview, reorder (drag or arrows), set primary (= first), alt text, remove. */
export function ImageManager({ images, onChange, productName, error }: { images: ImageItem[]; onChange: (v: ImageItem[]) => void; productName: string; error?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const latest = useRef(images);
  useEffect(() => {
    latest.current = images;
  }, [images]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, Math.max(0, MAX_IMAGES - images.length));
    if (list.length < files.length) toast.warning(`Only ${MAX_IMAGES} images per product — extra files were skipped.`);
    const valid = list.filter((f) => {
      if (!ACCEPT.split(",").includes(f.type)) {
        toast.error(`${f.name}: use JPG, PNG, WebP or AVIF.`);
        return false;
      }
      if (f.size > MAX_BYTES) {
        toast.error(`${f.name} is larger than 5 MB.`);
        return false;
      }
      return true;
    });
    setUploading((n) => n + valid.length);
    const results = await Promise.allSettled(valid.map(uploadOne));
    setUploading((n) => n - valid.length);
    const added: ImageItem[] = [];
    results.forEach((r, i) => {
      if (r.status === "fulfilled") added.push({ url: r.value, alt: "" });
      else toast.error(`${valid[i].name}: ${r.reason instanceof Error ? r.reason.message : "upload failed"}`);
    });
    if (added.length) {
      onChange([...latest.current, ...added]);
      toast.success(`${added.length} ${added.length === 1 ? "image" : "images"} uploaded — save to publish.`);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= images.length || from === to) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {images.map((img, i) => (
          <div
            key={img.url}
            draggable
            onDragStart={(e) => {
              setDragIndex(i);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setOverIndex(i);
            }}
            onDragLeave={() => setOverIndex((o) => (o === i ? null : o))}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex != null) move(dragIndex, i);
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={cn(
              "group overflow-hidden rounded-lg border bg-background transition-shadow",
              overIndex === i && dragIndex !== i && "ring-2 ring-terracotta",
              dragIndex === i && "opacity-50",
            )}
          >
            <div className="relative aspect-square cursor-grab bg-muted active:cursor-grabbing">
              <ProductImage src={img.url} alt={img.alt || productName || "Product image"} sizes="200px" />
              <span className="absolute top-1.5 left-1.5 rounded-md bg-background/90 p-1 text-muted-foreground" aria-hidden>
                <GripVertical className="size-3.5" />
              </span>
              {i === 0 ? (
                <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-1 rounded-full bg-charcoal px-2 py-0.5 text-[0.65rem] font-semibold text-ivory">
                  <Star className="size-3" aria-hidden /> Primary
                </span>
              ) : null}
            </div>
            <div className="space-y-2 p-2">
              <Input
                value={img.alt}
                onChange={(e) => onChange(images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
                placeholder="Describe the photo"
                aria-label={`Alt text for image ${i + 1}`}
                className="h-8 text-xs"
                maxLength={160}
              />
              <div className="flex items-center justify-between gap-1">
                <div className="flex gap-0.5">
                  <Button type="button" variant="ghost" size="icon-xs" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move image ${i + 1} earlier`}>
                    <ArrowLeft />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-xs" onClick={() => move(i, i + 1)} disabled={i === images.length - 1} aria-label={`Move image ${i + 1} later`}>
                    <ArrowRight />
                  </Button>
                  {i !== 0 ? (
                    <Button type="button" variant="ghost" size="xs" onClick={() => move(i, 0)} aria-label={`Make image ${i + 1} the primary image`}>
                      <Star /> Primary
                    </Button>
                  ) : null}
                </div>
                <Button type="button" variant="ghost" size="icon-xs" onClick={() => onChange(images.filter((_, j) => j !== i))} aria-label={`Remove image ${i + 1}`} className="text-destructive hover:text-destructive">
                  <Trash2 />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {Array.from({ length: uploading }, (_, i) => (
          <div key={`up-${i}`} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/50 text-xs text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden /> Uploading…
          </div>
        ))}
        {images.length + uploading < MAX_IMAGES ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex == null) void handleFiles(e.dataTransfer.files);
            }}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-background px-3 text-center text-xs text-muted-foreground transition-colors hover:border-terracotta hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ImagePlus className="size-6 text-terracotta" aria-hidden />
            <span className="font-medium text-foreground">Add images</span>
            <span>JPG, PNG, WebP or AVIF · up to 5 MB</span>
          </button>
        ) : null}
      </div>
      <input ref={inputRef} type="file" accept={ACCEPT} multiple className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => void handleFiles(e.target.files)} />
      <p className="text-xs text-muted-foreground">The first image is the primary photo on cards and the product page. Drag to reorder.</p>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
