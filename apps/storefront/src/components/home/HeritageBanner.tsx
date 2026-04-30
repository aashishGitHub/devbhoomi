"use client";

import { Mountain, Users, Award, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const STATS = [
  { value: "200+", label: "Artisan families supported", icon: Users },
  { value: "50+", label: "Himalayan villages sourced", icon: Mountain },
  { value: "100%", label: "Naturally harvested", icon: Leaf },
  { value: "NPOP", label: "Organic certified", icon: Award },
];

const PILLARS = [
  { emoji: "🏔️", title: "Source Verified", body: "Every batch is traceable to a specific Himalayan village, artisan, and harvest season." },
  { emoji: "🤝", title: "Artisan First", body: "We pay 30–40% above market rate so that traditional knowledge is preserved and rewarded." },
  { emoji: "🌱", title: "Zero Chemicals", body: "No pesticides, no synthetic fragrances, no adulterants — ever. Certified by NPOP and FSSAI." },
];

export function HeritageBanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative overflow-hidden bg-[#091519] text-snow py-24">
      {/* Background mountain silhouette */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: 'url("https://picsum.photos/seed/himalaya-bg/1600/400")', backgroundSize: 'cover', backgroundPosition: 'center bottom' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#091519] via-transparent to-[#091519] pointer-events-none" />

      <div className="section relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-misty/70 mb-3">
            Our Commitment
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-snow mb-4"
            style={{ fontFamily: "Georgia, serif" }}>
            The Devtatva Commitment
          </h2>
          <p className="text-snow/50 max-w-xl mx-auto text-base leading-relaxed">
            Every product carries a story — from the hands that crafted it to the Himalayan
            valley it came from. We verify traceability, certify organics, and pay artisans fairly.
          </p>
        </motion.div>

        {/* 3-Pillar cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 hover:bg-white/8 transition-colors duration-300"
            >
              <div className="text-4xl mb-4">{p.emoji}</div>
              <h3 className="text-lg font-bold text-snow mb-2">{p.title}</h3>
              <p className="text-snow/50 text-sm leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats counter row */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-snow/10 pt-12">
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-snow/8 border border-snow/12 mb-4 mx-auto group-hover:bg-snow/15 transition-colors duration-300">
                <Icon className="w-6 h-6 text-misty" aria-hidden="true" />
              </div>
              <div className="text-4xl font-extrabold text-snow mb-1" style={{ fontFamily: "Georgia, serif" }}>{value}</div>
              <div className="text-xs text-snow/40 font-medium tracking-wide">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
