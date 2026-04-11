import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Package, MapPin, Clock, IndianRupee } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Information — Devtatva",
  description:
    "Learn about Devtatva's shipping policy, delivery timelines, and charges. We ship authentic Himalayan products pan-India with care and authenticity.",
};

export default function ShippingPage() {
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
              <Truck className="w-3.5 h-3.5 text-misty" aria-hidden="true" />
              Delivery Information
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-snow leading-tight mb-6">
              Shipping Information
            </h1>

            <p className="text-lg sm:text-xl text-snow/80 max-w-2xl mx-auto">
              We deliver authentic Himalayan products from the mountains to your doorstep with
              care
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Content */}
      <section className="section py-16 lg:py-24">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Shipping Coverage */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-forest" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-forest mb-4">
                  Pan-India Delivery
                </h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  We currently ship to all states and union territories across India. Whether
                  you&apos;re in a metro city or a remote village, we ensure your order reaches you
                  safely.
                </p>
                <div className="bg-cream rounded-2xl border border-muted/20 p-6">
                  <p className="text-sm text-forest/70">
                    <strong className="text-forest">Note:</strong> International shipping is not
                    available at this time but will be introduced in the near future.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-stone/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-stone" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-forest mb-4">
                  Delivery Timeline
                </h2>
                <p className="text-forest/80 leading-relaxed mb-4">
                  Standard delivery takes <strong>5–7 business days</strong> from the date of
                  order confirmation.
                </p>
                <ul className="space-y-2 text-forest/80">
                  <li className="flex items-start gap-2">
                    <span className="text-rust font-bold shrink-0">•</span>
                    <span>
                      Metro cities: 3–5 business days
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rust font-bold shrink-0">•</span>
                    <span>
                      Other cities and towns: 5–7 business days
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rust font-bold shrink-0">•</span>
                    <span>
                      Remote and hilly areas: 7–10 business days
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Shipping Charges */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rust/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-rust" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-forest mb-4">
                  Shipping Charges
                </h2>
                <div className="bg-gradient-to-br from-rust/10 to-rust/5 border border-rust/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-forest">
                      Free Shipping
                    </span>
                    <span className="text-2xl font-bold text-rust">₹0</span>
                  </div>
                  <p className="text-sm text-forest/70">
                    On orders above ₹999
                  </p>
                </div>
                <p className="text-forest/80 mt-4">
                  For orders below ₹999, a nominal shipping fee will be calculated at checkout
                  based on your location and order weight.
                </p>
              </div>
            </div>
          </div>

          {/* Packaging */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-forest" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-forest mb-4">
                  Packaging & Handling
                </h2>
                <p className="text-forest/80 leading-relaxed">
                  Each product is carefully packaged to preserve its sanctity, purity, and
                  freshness during transit. Sacred items are handled with special care, and
                  consumables are sealed to maintain quality.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest/5 to-forest/[0.02] border border-forest/10 p-8 lg:p-10 text-center">
            <h3 className="text-xl font-bold text-forest mb-3">
              Questions about your order?
            </h3>
            <p className="text-forest/70 mb-6">
              Track your shipment or contact us for delivery updates
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
