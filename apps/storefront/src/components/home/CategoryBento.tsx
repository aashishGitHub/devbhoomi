"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    key: "sacred",
    title: "Sacred Items",
    subtitle: "Rudraksha · Havan Samagri · Brass Idols",
    description:
      "Authentic ritual products sourced from temple artisans of Rishikesh — blessed by tradition.",
    href: "/products?category=sacred",
    badge: "bg-rust/20 text-rust border-rust/30",
    span: "lg:col-span-2 lg:row-span-2",
    large: true,
    heroImage: "/sacred-items.png",
  },
  {
    key: "foods",
    title: "Himalayan Foods",
    subtitle: "Wild Honey · A2 Ghee · Grains",
    description: "High-altitude superfoods from Uttarakhand fields — chemical free, nutrient rich.",
    href: "/products?category=foods",
    badge: "bg-misty/20 text-misty border-misty/30",
    span: "lg:col-span-1",
    large: false,
    heroImage: "/himalayan-foods.png",
  },
  {
    key: "wellness",
    title: "Health & Wellness",
    subtitle: "Shilajit · Ashwagandha · Herbal Care",
    description: "Ancient Ayurvedic wisdom in modern formats — pure, potent, and traceable.",
    href: "/products?category=wellness",
    badge: "bg-forest/30 text-misty border-forest/40",
    span: "lg:col-span-1",
    large: false,
    heroImage: "/wellness-hero.png",
  },
];

export function CategoryBento() {
  return (
    <section className="section py-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-rust/80 mb-3">
          Our Collections
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold text-forest leading-tight mb-3"
          style={{ fontFamily: "Georgia, serif" }}>
          Three Pillars of Devtatva
        </h2>
        <p className="text-forest/60 text-base max-w-lg mx-auto">
          Every product maps to one sacred commitment — ritual, nourishment, or wellness.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: idx * 0.12 }}
            className={cn(cat.span)}
          >
            <Link
              href={cat.href}
              className={cn(
                "group relative overflow-hidden rounded-3xl flex flex-col justify-end",
                "border border-white/10 transition-all duration-500",
                "hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:-translate-y-1",
                cat.large ? "min-h-[400px] p-8 sm:p-10" : "min-h-[220px] p-6 sm:p-8"
              )}
            >
              {/* Full-bleed category image */}
              <Image
                src={cat.heroImage}
                alt={cat.title}
                fill
                className="object-cover object-top opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                sizes={cat.large
                  ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 66vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                }
                priority={cat.large}
              />

              {/* Dark vignette at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 pointer-events-none" />

              {/* Badge top-right */}
              <div className={cn("absolute top-6 right-6 z-10 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border", cat.badge)}>
                {cat.key}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <p className="text-snow/50 text-xs font-semibold tracking-widest uppercase mb-2">
                  {cat.subtitle}
                </p>
                <h3
                  className={cn(
                    "font-bold text-snow leading-tight mb-2",
                    cat.large ? "text-3xl" : "text-xl"
                  )}
                  style={cat.large ? { fontFamily: "Georgia, serif" } : {}}
                >
                  {cat.title}
                </h3>
                {cat.large && (
                  <p className="text-snow/60 text-sm leading-relaxed mb-4 max-w-sm">
                    {cat.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-1.5 text-snow/80 group-hover:text-snow text-sm font-semibold transition-colors">
                  Explore
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
