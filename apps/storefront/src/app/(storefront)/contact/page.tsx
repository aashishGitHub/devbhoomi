import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — Devtatva",
  description:
    "Have a question about our products, order, or sourcing? Reach out to us – we are happy to help and guide you. Contact Devtatva Wellness Pvt. Ltd.",
};

export default function ContactPage() {
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
              <Mail className="w-3.5 h-3.5 text-misty" aria-hidden="true" />
              Get in Touch
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-snow leading-tight mb-6">
              Contact Us
            </h1>

            <p className="text-lg sm:text-xl text-snow/80 max-w-2xl mx-auto">
              Have a question about our products, order, or sourcing? Reach out to us – we are
              happy to help and guide you
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Company Info Card */}
          <div className="mb-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cream to-snow border border-muted/20 p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-forest mb-8">
                Devtatva Wellness Pvt. Ltd.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-forest" aria-hidden="true" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-forest/60 uppercase tracking-wide mb-2">
                      Address
                    </h3>
                    <p className="text-forest/80 leading-relaxed">
                      Post office – Binta, Bagwalipokher
                      <br />
                      District – Almora
                      <br />
                      Uttarakhand, India
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-forest" aria-hidden="true" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-forest/60 uppercase tracking-wide mb-2">
                      Email
                    </h3>
                    <a
                      href="mailto:Devtatva@zohomail.in"
                      className="text-forest/80 hover:text-rust transition-colors"
                    >
                      Devtatva@zohomail.in
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-forest" aria-hidden="true" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-forest/60 uppercase tracking-wide mb-2">
                      Phone
                    </h3>
                    <a
                      href="tel:+919718650521"
                      className="text-forest/80 hover:text-rust transition-colors"
                    >
                      +91 97186 50521
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-forest" aria-hidden="true" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-forest/60 uppercase tracking-wide mb-2">
                      Working Hours
                    </h3>
                    <p className="text-forest/80">
                      Monday to Saturday
                      <br />
                      10 AM – 5 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Closing Message */}
          <div className="text-center">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rust/10 to-rust/5 border border-rust/20 p-8 lg:p-10">
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239D5F1B\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                }}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <p className="text-xl font-semibold text-rust mb-3">
                  &ldquo;From Devtatva with care&rdquo;
                </p>
                <p className="text-forest/70 max-w-2xl mx-auto">
                  Every message is handled with the same care and authenticity that defines
                  Devtatva
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
