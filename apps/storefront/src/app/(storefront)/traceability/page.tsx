import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Eye, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Traceability — Devtatva",
  description:
    "At Devtatva, every product carries a story of origin. We ensure complete transparency in sourcing and preparation from the pristine regions of Devbhoomi Uttarakhand to your home.",
};

export default function TraceabilityPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest/95 to-stone py-16 lg:py-24">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
          aria-hidden="true"
        />

        <div className="section relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-snow/10 border border-snow/20 text-snow/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Eye className="w-3.5 h-3.5 text-misty" aria-hidden="true" />
              Transparency & Trust
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-snow leading-tight mb-6">
              Traceability
            </h1>

            <p className="text-lg sm:text-xl text-snow/80 max-w-2xl mx-auto">
              Every product carries a story of origin
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="mb-16 space-y-6">
            <p className="text-lg sm:text-xl text-forest/80 leading-relaxed">
              At <span className="font-semibold text-forest">Devtatva</span>, every product carries
              a story of origin. From the pristine regions of{" "}
              <span className="font-semibold text-rust">Devbhoomi Uttarakhand</span> to your home,
              we ensure complete transparency in sourcing and preparation.
            </p>

            <p className="text-lg sm:text-xl text-forest/80 leading-relaxed">
              Each offering is carefully traced back to its source—whether it is sacred materials
              used in rituals or organic produce grown in the Himalayan ecosystem—ensuring
              authenticity, purity, and integrity at every step.
            </p>
          </div>

          {/* Journey Timeline */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-10 text-center">
              The Journey from Mountains to Your Home
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Source",
                  description:
                    "From pristine Himalayan villages, artisan communities, and organic farms across Devbhoomi Uttarakhand",
                  icon: MapPin,
                  color: "rust",
                },
                {
                  step: "2",
                  title: "Verification",
                  description:
                    "Each product is inspected for authenticity, purity, and adherence to traditional methods or organic standards",
                  icon: ShieldCheck,
                  color: "forest",
                },
                {
                  step: "3",
                  title: "Preparation",
                  description:
                    "Carefully packaged to preserve sanctity and freshness, with complete documentation of origin and handling",
                  icon: Eye,
                  color: "stone",
                },
              ].map(({ step, title, description, icon: Icon, color }) => (
                <div
                  key={step}
                  className="relative flex gap-6 items-start group"
                >
                  {/* Step number with connecting line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full bg-${color}/10 border-2 border-${color}/30 text-${color} font-bold text-lg group-hover:scale-110 transition-transform`}
                    >
                      {step}
                    </div>
                    {step !== "3" && (
                      <div className="w-0.5 h-16 bg-muted/30 mt-2" aria-hidden="true" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon
                        className={`w-5 h-5 text-${color}`}
                        aria-hidden="true"
                      />
                      <h3 className="text-xl font-bold text-forest">{title}</h3>
                    </div>
                    <p className="text-forest/70 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commitment Statement */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest/5 to-forest/[0.02] border border-forest/10 p-8 lg:p-12 mb-16">
            <div className="relative z-10">
              <ShieldCheck className="w-10 h-10 text-forest mb-4" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-forest mb-4">
                Our Commitment to Transparency
              </h3>
              <p className="text-forest/70 leading-relaxed mb-6">
                We believe in honest relationships with our customers. Every product listing
                includes details about its origin village, artisan community, certifications, and
                traditional preparation methods. When you choose Devtatva, you&apos;re not just buying a
                product—you&apos;re supporting a traceable, ethical supply chain rooted in the
                Himalayas.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-forest/60">
                  <div className="w-2 h-2 rounded-full bg-forest" aria-hidden="true" />
                  NPOP Organic Certified
                </div>
                <div className="flex items-center gap-2 text-forest/60">
                  <div className="w-2 h-2 rounded-full bg-forest" aria-hidden="true" />
                  FSSAI Licensed
                </div>
                <div className="flex items-center gap-2 text-forest/60">
                  <div className="w-2 h-2 rounded-full bg-forest" aria-hidden="true" />
                  Artisan Verified
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-forest mb-4">
              Experience Traceable Authenticity
            </h3>
            <p className="text-forest/70 mb-6 max-w-2xl mx-auto">
              Browse our collection to see the complete origin story of each product
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-rust text-snow font-semibold px-8 py-4 rounded-xl hover:bg-rust/90 transition-colors shadow-md hover:shadow-lg"
            >
              Explore Products
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
