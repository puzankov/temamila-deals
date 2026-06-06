"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function PropertyGallery({ images, alt }: { images: string[]; alt: string }) {
  const [open, setOpen] = useState(false);
  const count = images.length;

  // Esc to close + lock body scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (count === 0) return null;

  const thumbs = images.slice(1, 3);

  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        {/* Main image */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 md:col-span-2 md:row-span-2"
        >
          <Image
            src={images[0]}
            alt={`${alt} — main photo`}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transition group-hover:scale-[1.02]"
            priority
          />
          {/* Mobile-only "view all" pill (desktop uses the overlay on the 3rd tile) */}
          {count > 1 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur md:hidden">
              View all {count} photos
            </span>
          )}
        </button>

        {/* Up to two side thumbnails (desktop) */}
        {thumbs.map((src, i) => {
          const showAll = i === thumbs.length - 1 && count > 3;
          return (
            <button
              key={src}
              type="button"
              onClick={() => setOpen(true)}
              className="group relative hidden aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 md:block"
            >
              <Image
                src={src}
                alt={`${alt} — photo ${i + 2}`}
                fill
                sizes="33vw"
                className="object-cover transition group-hover:scale-[1.02]"
              />
              {showAll && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 text-white transition group-hover:bg-black/65">
                  <GridIcon />
                  <span className="text-sm font-semibold">See all {count} photos</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Full gallery modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close gallery"
            className="fixed right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white backdrop-blur transition hover:bg-white/20"
          >
            ×
          </button>
          <div
            className="mx-auto max-w-3xl space-y-3 px-4 py-16"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`${alt} — photo ${i + 1}`}
                className="w-full rounded-lg bg-slate-900"
                loading={i < 2 ? "eager" : "lazy"}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function GridIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
