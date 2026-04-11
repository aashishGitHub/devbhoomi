import type { Metadata } from "next";
import Link from "next/link";
import { Mountain, Heart, Leaf, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story — Devtatva",
  description:
    "In the timeless embrace of the Himalayas, Devtatva was conceived to carry forward a legacy of authenticity and devotion. Learn about our journey from the sacred land of Uttarakhand.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest/95 to-stone py-20 lg:py-28">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
          aria-hidden="true"
        />

        <div className="section relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-snow/10 border border-snow/20 text-snow/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Mountain className="w-3.5 h-3.5 text-misty" aria-hidden="true" />
            Our Story
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-snow leading-tight mb-6">
            Devtatva
          </h1>

          <p className="text-xl sm:text-2xl text-misty font-medium mb-8 max-w-3xl mx-auto">
            From the Land of Gods to Your Home
          </p>

          <div className="flex items-center justify-center gap-1 text-snow/60 text-sm">
            <span>Sacred Traditions</span>
            <span className="text-misty">·</span>
            <span>Himalayan Purity</span>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="section py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Main Story */}
          <div className="space-y-8 mb-20">
            <p className="text-lg sm:text-xl text-forest/80 leading-relaxed">
              In the timeless embrace of the Himalayas, where nature remains pure and
              spirituality is a way of life, <span className="font-semibold text-forest">Devtatva</span> was
              conceived to carry forward a legacy of authenticity and devotion.
            </p>

            <p className="text-lg sm:text-xl text-forest/80 leading-relaxed">
              Rooted in the sacred land of <span className="font-semibold text-rust">Devbhoomi Uttarakhand</span>, our
              offerings are thoughtfully sourced to preserve their original sanctity, purity, and
              essence. Each product reflects a harmonious blend of ancient traditions and natural
              abundance, curated for those who seek more than just consumption—those who seek
              meaning.
            </p>

            <p className="text-lg sm:text-xl text-forest/80 leading-relaxed">
              With an unwavering commitment to quality and authenticity, Devtatva aspires to bring
              the divine essence of the Himalayas into modern living, creating a bridge between
              heritage and home.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Heart,
                title: "Authenticity",
                description:
                  "Every product carries the true essence of Himalayan heritage",
                color: "rust",
              },
              {
                icon: Leaf,
                title: "Purity",
                description:
                  "Sourced from pristine valleys, untouched by modern pollution",
                color: "forest",
              },
              {
                icon: Sparkles,
                title: "Devotion",
                description:
                  "Crafted with reverence for sacred traditions and rituals",
                color: "stone",
              },
            ].map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="group text-center p-8 rounded-2xl bg-cream border border-muted/20 hover:shadow-card-hover transition-all duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-${color}/10 border border-${color}/20 mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon
                    className={`w-6 h-6 text-${color}`}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl font-bold text-forest mb-2">{title}</h3>
                <p className="text-sm text-forest/60 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          {/* Brand Statement */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rust/10 to-rust/5 border border-rust/20 p-10 lg:p-14 text-center">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239D5F1B\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <Mountain className="w-12 h-12 text-rust mx-auto mb-6" aria-hidden="true" />
              <h2 className="text-3xl sm:text-4xl font-bold text-forest mb-4">
                Devtatva
              </h2>
              <p className="text-xl sm:text-2xl text-rust font-semibold mb-3">
                From the Land of Gods to Your Home
              </p>
              <p className="text-base text-forest/70 font-medium">
                Sacred Traditions. Himalayan Purity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section py-16 lg:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-forest mb-6">
            Experience the Himalayan Difference
          </h2>
          <p className="text-lg text-forest/70 mb-8 max-w-2xl mx-auto">
            Explore our collection of authentic products, each carrying a story from the sacred
            mountains to your home.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-rust text-snow font-semibold px-8 py-4 rounded-xl hover:bg-rust/90 transition-colors shadow-md hover:shadow-lg"
          >
            <Leaf className="w-5 h-5" aria-hidden="true" />
            Browse Our Products
          </Link>
        </div>
      </section>
    </>
  );
}
