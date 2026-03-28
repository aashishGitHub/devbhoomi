"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImagesProps {
  images: string[];
  name: string;
}

export function ProductImages({ images, name }: ProductImagesProps) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square bg-cream rounded-3xl flex items-center justify-center text-8xl">
        🌿
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream border border-muted/20">
        <Image
          src={images[active]}
          alt={`${name} — image ${active + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={cn(
                "relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-150",
                idx === active
                  ? "border-forest"
                  : "border-muted/30 hover:border-muted"
              )}
              aria-label={`View image ${idx + 1}`}
              aria-pressed={idx === active}
            >
              <Image
                src={src}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
