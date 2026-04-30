"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, PlayCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/hero-bg.png",
    alt: "Himalayan misty mountains at dawn",
    caption: "From the peaks of Uttarakhand",
  },
  {
    src: "https://picsum.photos/seed/himalaya-forest/1600/900",
    alt: "Himalayan pine forest with morning mist",
    caption: "Wild & organically grown",
  },
  {
    src: "https://picsum.photos/seed/sacred-temple/1600/900",
    alt: "Sacred Himalayan temple atmosphere",
    caption: "Rooted in ancient tradition",
  },
  {
    src: "https://picsum.photos/seed/honey-harvest/1600/900",
    alt: "Golden honey harvest in the mountains",
    caption: "Pure, wild & unfiltered",
  },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 2,
  left: Math.random() * 100,
  top: Math.random() * 100,
  yRange: -(Math.random() * 140 + 60),
  xRange: (Math.random() - 0.5) * 60,
  duration: Math.random() * 10 + 12,
  delay: Math.random() * 10,
}));

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#091519]">

      {/* ── Crossfading Image Slideshow ──────────────────────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.04 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ opacity: { duration: 1.5, ease: "easeInOut" }, scale: { duration: 8, ease: "linear" } }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={SLIDES[current].src}
            alt={SLIDES[current].alt}
            fill
            priority={current === 0}
            className="object-cover object-center"
            sizes="100vw"
            quality={90}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Cinematic Overlays ──────────────────────────────────────── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#091519]/75 via-[#091519]/35 to-[#091519]/95 pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#091519]/40 via-transparent to-[#091519]/40 pointer-events-none" />

      {/* ── Floating Particles (mist / dust) ────────────────────────── */}
      {mounted && (
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-snow/25"
              style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%` }}
              animate={{ y: [0, p.yRange], x: [0, p.xRange], opacity: [0, 0.7, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
            />
          ))}
        </div>
      )}

      {/* ── Slide Dots ──────────────────────────────────────────────── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-500 rounded-full ${i === current ? "bg-snow w-8 h-2" : "bg-snow/30 w-2 h-2"}`}
          />
        ))}
      </div>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="section relative z-10 w-full pt-24 pb-20 flex flex-col items-center text-center">

        {/* Animated slide caption */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`caption-${current}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6 }}
            className="text-misty/80 text-xs sm:text-sm tracking-[0.2em] uppercase font-medium mb-4"
          >
            {SLIDES[current].caption}
          </motion.p>
        </AnimatePresence>

        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-snow/10 backdrop-blur-md border border-snow/20 text-snow text-xs sm:text-sm font-medium px-5 py-2 rounded-full mb-8 shadow-2xl"
        >
          <Sparkles className="w-4 h-4 text-rust" aria-hidden="true" />
          Directly from Uttarakhand artisans
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-snow leading-[1.08] mb-6 tracking-tight drop-shadow-xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Sacred &amp; Organic
          <br />
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2783C] via-[#FFD98E] to-[#C2783C] animate-pulse">
              Himalayan
            </span>
          </span>{" "}
          Products
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-snow/75 text-lg sm:text-xl md:text-2xl font-light leading-relaxed mb-10 max-w-2xl"
        >
          Feel the profound purity of the mountains. From age-old Bilona ghee
          to wild forest honey, experience authentic heritage delivered to your soul.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Button
            variant="rust"
            size="lg"
            className="h-14 px-8 text-base sm:text-lg rounded-full shadow-[0_0_50px_-10px_rgba(157,95,27,0.9)] hover:scale-105 hover:shadow-[0_0_70px_-10px_rgba(157,95,27,1)] transition-all duration-300"
            asChild
          >
            <Link href="/products">
              Explore Collection
              <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-8 text-base sm:text-lg rounded-full border-snow/30 text-snow hover:bg-snow/15 hover:border-snow/60 backdrop-blur-md transition-all duration-300"
            asChild
          >
            <Link href="/about">
              <PlayCircle className="w-5 h-5 mr-2" aria-hidden="true" />
              Our Story
            </Link>
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-8 border-t border-snow/10 pt-8 w-full max-w-3xl"
        >
          {[
            { icon: ShieldCheck, label: "NPOP Certified Organic" },
            { icon: Leaf, label: "Sustainably Sourced" },
            { icon: Sparkles, label: "Traditional Methods" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-snow/70 text-xs sm:text-sm font-medium tracking-wide"
            >
              <div className="bg-snow/10 p-2 rounded-full backdrop-blur-sm border border-snow/10">
                <Icon className="w-3.5 h-3.5 text-misty" aria-hidden="true" />
              </div>
              {label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll Indicator ────────────────────────────────────────── */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-50"
      >
        <span className="text-snow text-[10px] tracking-[0.25em] uppercase font-semibold">Scroll</span>
        <ChevronDown className="w-5 h-5 text-snow" />
      </motion.div>
    </section>
  );
}
