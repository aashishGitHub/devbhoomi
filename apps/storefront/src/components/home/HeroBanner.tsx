"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Leaf, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest/95 to-stone min-h-[560px] flex items-center">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
        aria-hidden="true"
      />

      <div className="section relative z-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 bg-snow/10 border border-snow/20 text-snow/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Leaf className="w-3.5 h-3.5 text-misty" aria-hidden="true" />
            Directly from Uttarakhand artisans
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-snow leading-tight mb-5">
            Sacred &amp; Organic
            <br />
            <span className="text-misty">Himalayan</span> Products
          </h1>

          <p className="text-snow/70 text-lg leading-relaxed mb-8 max-w-lg">
            From Rudraksha beads blessed in Rishikesh to wild honey harvested
            at 3,000m, every product carries a traceable story of artisanship and nature.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Button
              variant="rust"
              size="lg"
              asChild
            >
              <Link href="/products">
                Shop the Collection
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-snow/40 text-snow hover:bg-snow/10 hover:text-snow hover:border-snow/60"
              asChild
            >
              <Link href="/about">Our Story</Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: ShieldCheck, label: "NPOP Certified Organic" },
              { icon: Leaf, label: "Sustainably Sourced" },
              { icon: ShieldCheck, label: "FSSAI Licensed" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-snow/60 text-xs"
              >
                <Icon className="w-3.5 h-3.5 text-misty" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Hero image — decorative */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative w-80 h-80 rounded-full bg-snow/5 border border-snow/10 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-misty/10 border border-misty/20 flex items-center justify-center">
              <span className="text-7xl" aria-hidden="true">🌿</span>
            </div>
            {/* Floating badges */}
            <div className="absolute -top-4 -right-6 bg-snow rounded-xl px-3 py-2 shadow-card text-xs font-semibold text-forest">
              100% Natural
            </div>
            <div className="absolute -bottom-2 -left-8 bg-rust rounded-xl px-3 py-2 shadow-card text-xs font-semibold text-snow">
              Direct from artisans
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
