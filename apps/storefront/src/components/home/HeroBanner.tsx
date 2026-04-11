"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Leaf, ShieldCheck } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239D5F1B\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
        aria-hidden="true"
      />

      <div className="section relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-8 lg:py-0 lg:min-h-[600px] items-center">
        {/* Text Content */}
        <div className="order-2 lg:order-1 py-8 lg:py-16">
          <div className="inline-flex items-center gap-2 bg-forest/10 border border-forest/20 text-forest text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Leaf className="w-3.5 h-3.5 text-rust" aria-hidden="true" />
            Directly from Uttarakhand artisans
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-forest leading-tight mb-5">
            Sacred &amp; Organic
            <br />
            <span className="text-rust">Himalayan</span> Products
          </h1>

          <p className="text-forest/70 text-lg leading-relaxed mb-8 max-w-lg">
            From Himalayan cow ghee rooted in sacred tradition to handcrafted sacred Janeu and wild honey harvested at 3,000 meters, each product carries a traceable legacy of purity and craftsmanship.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Button variant="rust" size="lg" asChild>
              <Link href="/products">
                Shop the Collection
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-forest/40 text-forest hover:bg-forest/10 hover:text-forest hover:border-forest/60"
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
                className="flex items-center gap-1.5 text-forest/60 text-xs"
              >
                <Icon className="w-3.5 h-3.5 text-rust" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image - Fully visible on desktop, optimized for mobile */}
        <div className="order-1 lg:order-2 relative w-full">
          {/* Mobile: smaller height, object-cover */}
          <div className="relative w-full h-[300px] sm:h-[400px] lg:hidden rounded-2xl overflow-hidden">
            <Image
              src="/hero-bg.png"
              alt="Devtatva Himalayan Heritage Products"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Desktop: full image visible with contain */}
          <div className="hidden lg:block relative w-full h-[600px]">
            <Image
              src="/hero-bg.png"
              alt="Devtatva Himalayan Heritage Products"
              fill
              priority
              className="object-contain"
              sizes="50vw"
            />
            {/* Floating badges */}
            <div className="absolute top-8 right-8 bg-snow rounded-xl px-4 py-2 shadow-lg text-sm font-semibold text-forest border border-forest/10">
              100% Natural
            </div>
            <div className="absolute bottom-8 left-8 bg-rust rounded-xl px-4 py-2 shadow-lg text-sm font-semibold text-snow">
              Direct from artisans
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
