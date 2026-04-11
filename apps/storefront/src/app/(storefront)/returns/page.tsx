import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, AlertCircle, RefreshCcw, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Return & Refund Policy — Devtatva",
  description:
    "At Devtatva, we take utmost care to deliver products that reflect purity, authenticity, and quality. Learn about our return and refund policy for sacred and consumable products.",
};

export default function ReturnsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest/95 to-stone py-16 lg:py-24">
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
              <ShieldCheck className="w-3.5 h-3.5 text-misty" aria-hidden="true" />
              Customer Protection
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-snow leading-tight mb-6">
              Return &amp; Refund Policy
            </h1>

            <p className="text-lg sm:text-xl text-snow/80 max-w-2xl mx-auto">
              At Devtatva, we take utmost care to deliver products that reflect purity,
              authenticity, and quality
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="section py-16 lg:py-24">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <p className="text-lg text-forest/80 leading-relaxed">
            Due to the sacred and consumable nature of our products, returns are handled with
            specific guidelines to ensure the integrity and sanctity of our offerings.
          </p>

          {/* Returns */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
                <RefreshCcw className="w-5 h-5 text-forest" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-forest mb-4">Returns</h2>
                <ul className="space-y-3 text-forest/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      Returns are accepted only if the product is damaged, defective, or incorrect
                      at the time of delivery.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      Customers must raise a request within 48 hours of delivery with clear images.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Non-Returnable Items */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rust/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-rust" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-forest mb-4">Non-Returnable Items</h2>
                <div className="bg-cream rounded-2xl border border-muted/20 p-6">
                  <ul className="space-y-3 text-forest/80">
                    <li className="flex items-start gap-2">
                      <span className="text-rust font-bold shrink-0">•</span>
                      <span>Sacred items (e.g., Janeu, Rudraksha, Puja products)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rust font-bold shrink-0">•</span>
                      <span>Consumables (e.g., honey, ghee, herbs)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rust font-bold shrink-0">•</span>
                      <span>Opened or used products</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Refunds */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-stone/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-stone" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-forest mb-4">Refunds</h2>
                <ul className="space-y-3 text-forest/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Once approved, refunds will be processed within 5–7 business days.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Refunds will be credited to the original payment method.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Replacement */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
                <RefreshCcw className="w-5 h-5 text-forest" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-forest mb-4">Replacement</h2>
                <p className="text-forest/80">
                  Eligible products may be replaced instead of refunded, based on availability.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest/5 to-forest/[0.02] border border-forest/10 p-8 lg:p-10 text-center">
            <h3 className="text-xl font-bold text-forest mb-3">Need Help?</h3>
            <p className="text-forest/70 mb-6">
              If you have questions about returns or need to initiate a return request, please
              contact our support team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-forest text-snow font-semibold px-8 py-3 rounded-xl hover:bg-forest/90 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
