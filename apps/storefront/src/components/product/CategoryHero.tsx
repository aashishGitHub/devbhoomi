"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Leaf, ShieldCheck, Sparkles, Mountain, Search } from "lucide-react";

const CATEGORY_CONFIG = {
  sacred: {
    title: "Sacred & Ritual",
    titleAccent: "Items",
    subtitle: "Rudraksha · Havan Samagri · Brass Idols · Janeu",
    description:
      "Authentic ritual products sourced from temple artisans of Rishikesh — blessed by centuries of tradition and sacred purpose.",
    image: "/sacred-items.png",
    accentClass: "text-[#FFD98E]",
    badgeClass: "bg-rust/20 border-rust/30 text-[#FFD98E]",
    overlay: "from-[#2a0f00]/90 via-[#1a0900]/55 to-transparent",
    sideOverlay: "from-[#2a0f00]/40",
    badges: [
      { icon: ShieldCheck, label: "Temple Sourced" },
      { icon: Sparkles, label: "Blessed by Tradition" },
      { icon: Leaf, label: "100% Authentic" },
    ],
    stats: [
      { value: "50+", label: "Sacred SKUs" },
      { value: "15+", label: "Artisan families" },
      { value: "100%", label: "Purity certified" },
    ],
  },
  foods: {
    title: "Himalayan",
    titleAccent: "Foods",
    subtitle: "Wild Honey · A2 Ghee · Grains · Spices",
    description:
      "High-altitude superfoods from Uttarakhand fields — chemical free, nutrient rich, and harvested by mountain communities.",
    image: "/himalayan-foods.png",
    accentClass: "text-misty",
    badgeClass: "bg-misty/20 border-misty/30 text-misty",
    overlay: "from-[#0a1f10]/90 via-[#071512]/55 to-transparent",
    sideOverlay: "from-[#0a1f10]/40",
    badges: [
      { icon: Leaf, label: "NPOP Certified" },
      { icon: ShieldCheck, label: "FSSAI Licensed" },
      { icon: Mountain, label: "3,000m+ Altitude" },
    ],
    stats: [
      { value: "30+", label: "Food products" },
      { value: "3,000m", label: "Harvest altitude" },
      { value: "Zero", label: "Chemicals used" },
    ],
  },
  wellness: {
    title: "Health &",
    titleAccent: "Wellness",
    subtitle: "Shilajit · Ashwagandha · Herbal Care · Oils",
    description:
      "Ancient Ayurvedic wisdom in modern formats — pure, potent, and traceable to their Himalayan origins.",
    image: "/wellness-hero.png",
    accentClass: "text-[#88dab0]",
    badgeClass: "bg-forest/30 border-misty/30 text-[#88dab0]",
    overlay: "from-[#051a0c]/90 via-[#091519]/55 to-transparent",
    sideOverlay: "from-[#051a0c]/40",
    badges: [
      { icon: Leaf, label: "Ayurvedic Certified" },
      { icon: ShieldCheck, label: "Lab Tested" },
      { icon: Sparkles, label: "Traditional Methods" },
    ],
    stats: [
      { value: "40+", label: "Wellness SKUs" },
      { value: "80+", label: "Minerals in Shilajit" },
      { value: "100%", label: "Natural extracts" },
    ],
  },
} as const;

export function CategoryHero() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") as keyof typeof CATEGORY_CONFIG | null;
  const query = searchParams.get("q");

  // Search results — simple branded header
  if (query) {
    return (
      <div className="bg-gradient-to-b from-[#091519] to-[#0f2128] pt-20 pb-10">
        <div className="section">
          <nav className="flex items-center gap-1.5 text-snow/40 text-xs font-medium mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-snow/70 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-snow/70 transition-colors">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-snow/70">Search results</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-snow/10 border border-snow/15 flex items-center justify-center">
              <Search className="w-4.5 h-4.5 text-misty" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-snow" style={{ fontFamily: "Georgia, serif" }}>
                Results for &ldquo;<span className="text-misty">{query}</span>&rdquo;
              </h1>
              <p className="text-snow/40 text-sm mt-0.5">Authentic Himalayan products</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // All products — no category
  if (!category || !(category in CATEGORY_CONFIG)) {
    return (
      <div className="relative overflow-hidden bg-[#091519] pt-20 pb-14">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a6cbd3\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
        />
        <div className="section relative z-10">
          <nav className="flex items-center gap-1.5 text-snow/40 text-xs font-medium mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-snow/70 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-snow/70">All Products</span>
          </nav>
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-rust/80 mb-3"
          >
            Our Collections
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-snow leading-tight mb-3 tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            All <span className="text-misty">Products</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-snow/60 text-base sm:text-lg max-w-xl leading-relaxed mb-8"
          >
            Browse our complete collection of sacred items, organic Himalayan foods, and heritage wellness products — sourced directly from artisans of Uttarakhand.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { icon: ShieldCheck, label: "NPOP Certified Organic" },
              { icon: Leaf, label: "Sustainably Sourced" },
              { icon: Sparkles, label: "Artisan Made" },
              { icon: Mountain, label: "Himalayan Origins" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 bg-snow/8 backdrop-blur-sm border border-snow/12 text-snow/70 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                <Icon className="w-3 h-3 text-misty" aria-hidden="true" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  const config = CATEGORY_CONFIG[category];

  return (
    <section className="relative overflow-hidden min-h-[400px] sm:min-h-[480px] flex items-end bg-[#091519]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={config.image}
          alt={config.title + " " + config.titleAccent}
          fill
          priority
          className="object-cover object-center opacity-65"
          sizes="100vw"
        />
      </div>

      {/* Bottom-up gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${config.overlay} pointer-events-none`} />
      {/* Side overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.sideOverlay} via-transparent to-transparent pointer-events-none`} />
      {/* Top fade for header */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#091519]/60 to-transparent pointer-events-none" />

      <div className="section relative z-10 w-full pt-24 pb-12 sm:pb-16">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1.5 text-snow/45 text-xs font-medium mb-5"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-snow/75 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-snow/75 transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-snow/80">{config.title} {config.titleAccent}</span>
        </motion.nav>

        {/* Category badge */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border mb-4 ${config.badgeClass}`}
        >
          {category}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-snow leading-[1.1] mb-3 tracking-tight drop-shadow-lg"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {config.title}{" "}
          <span className={config.accentClass}>{config.titleAccent}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-snow/50 text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase mb-4"
        >
          {config.subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-snow/65 text-base leading-relaxed max-w-xl mb-8"
        >
          {config.description}
        </motion.p>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap gap-2.5"
          >
            {config.badges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 bg-snow/10 backdrop-blur-sm border border-snow/15 text-snow/75 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                <Icon className="w-3 h-3" aria-hidden="true" />
                {label}
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-7 sm:gap-9"
          >
            {config.stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div
                  className={`text-2xl sm:text-3xl font-extrabold ${config.accentClass} leading-none`}
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {value}
                </div>
                <div className="text-snow/40 text-[10px] font-medium tracking-wide mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
