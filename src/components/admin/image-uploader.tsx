"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useAutosave } from "./autosave";

export function ImageUploader({
  name,
  initial,
}: {
  name: string;
  initial?: string[];
}) {
  const save = useAutosave();
  const [images, setImages] = useState<string[]>(initial ?? []);
  const [removed, setRemoved] = useState<string[]>([]); // persisted images to delete on save
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialSet = useMemo(() => new Set(initial ?? []), [initial]);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;
    setError(null);
    setUploading((n) => n + files.length);

    await Promise.allSettled(
      files.map(async (file) => {
        try {
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/admin/blob-upload",
            contentType: file.type,
          });
          setImages((prev) => [...prev, blob.url]);
          save();
        } catch {
          setError("Some images failed to upload. Please try again.");
        } finally {
          setUploading((n) => n - 1);
        }
      }),
    );
  }

  function remove(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
    if (initialSet.has(url)) {
      // Published image — defer Blob deletion until the form is saved.
      setRemoved((prev) => [...prev, url]);
    } else {
      // Unsaved upload — delete from Blob right away so it isn't orphaned.
      fetch("/api/admin/blob-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }).catch(() => {});
    }
    save();
  }

  function makePrimary(url: string) {
    setImages((prev) => [url, ...prev.filter((u) => u !== url)]);
    save();
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-sm transition ${
          dragging ? "border-brand bg-brand-tint" : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <svg className="mb-1 h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        <span className="font-medium text-slate-600">Click to upload or drag &amp; drop</span>
        <span className="text-xs text-slate-400">PNG, JPG, WebP — multiple allowed</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Previews */}
      {(images.length > 0 || uploading > 0) && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((url, i) => {
            const isPrimary = i === 0;
            return (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
              >
                <Image src={url} alt="" fill sizes="150px" className="object-cover" />

                {/* Primary star — top right */}
                <button
                  type="button"
                  onClick={() => makePrimary(url)}
                  title={isPrimary ? "Primary image" : "Make primary"}
                  className={`absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 text-sm leading-none backdrop-blur transition ${
                    isPrimary ? "text-amber-400" : "text-white/80 hover:text-white"
                  }`}
                >
                  {isPrimary ? "★" : "☆"}
                </button>

                {/* Delete — top left */}
                <button
                  type="button"
                  onClick={() => remove(url)}
                  title="Remove image"
                  className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 text-white/80 backdrop-blur transition hover:bg-red-600 hover:text-white"
                >
                  ✕
                </button>

                {isPrimary && (
                  <span className="absolute bottom-1 left-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Primary
                  </span>
                )}
              </div>
            );
          })}

          {/* Uploading placeholders */}
          {Array.from({ length: uploading }).map((_, i) => (
            <div
              key={`up-${i}`}
              className="flex aspect-square animate-pulse items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-xs text-slate-400"
            >
              Uploading…
            </div>
          ))}
        </div>
      )}

      {/* Submitted with the form: ordered list (first = primary) + deferred deletions */}
      <input type="hidden" name={name} value={images.join("\n")} />
      <input type="hidden" name="removedImages" value={removed.join("\n")} />
    </div>
  );
}
