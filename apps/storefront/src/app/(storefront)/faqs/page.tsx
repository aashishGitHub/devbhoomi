import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Package, ShieldCheck, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQs — Devtatva",
  description:
    "Frequently asked questions about Devtatva products, ordering, shipping, and our commitment to authentic Himalayan products from Uttarakhand.",
};

export default function FAQsPage() {
  const faqs = [
    {
      category: "Products",
      icon: Package,
      questions: [
        {
          q: "Are your products authentic?",
          a: "Yes, all our products are sourced directly from artisans and farmers in Devbhoomi Uttarakhand. Each product is traceable to its village of origin and carries certifications where applicable (NPOP Organic, FSSAI).",
        },
        {
          q: "What makes your products different from others?",
          a: "Our products are handcrafted using traditional methods, sourced from pristine Himalayan regions, and carefully verified for authenticity. We maintain complete transparency in sourcing and preparation.",
        },
        {
          q: "Do you provide certificates for organic products?",
          a: "Yes, all our organic products come with NPOP organic certification. Details are mentioned in the product listing.",
        },
      ],
    },
    {
      category: "Ordering",
      icon: ShieldCheck,
      questions: [
        {
          q: "How do I place an order?",
          a: "Browse our products, add items to your cart, and proceed to checkout. You can pay via UPI or place an order through WhatsApp for manual confirmation.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We currently accept UPI payments and WhatsApp-based orders. More payment options will be available soon.",
        },
        {
          q: "Can I modify or cancel my order?",
          a: "Please contact us immediately at Devtatva@zohomail.in or +91 97186 50521 if you need to modify or cancel an order. We'll do our best to accommodate requests before the order is shipped.",
        },
      ],
    },
    {
      category: "Shipping & Delivery",
      icon: Truck,
      questions: [
        {
          q: "Where do you ship?",
          a: "We currently ship pan-India. Shipping is free on orders above ₹999.",
        },
        {
          q: "How long does delivery take?",
          a: "Delivery typically takes 5-7 business days depending on your location. Remote areas may take slightly longer.",
        },
        {
          q: "Do you ship internationally?",
          a: "We currently ship only within India. International shipping will be available in the near future.",
        },
      ],
    },
  ];

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
              <HelpCircle className="w-3.5 h-3.5 text-misty" aria-hidden="true" />
              Help Center
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-snow leading-tight mb-6">
              Frequently Asked Questions
            </h1>

            <p className="text-lg sm:text-xl text-snow/80 max-w-2xl mx-auto">
              Everything you need to know about Devtatva products, ordering, and delivery
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Content */}
      <section className="section py-16 lg:py-24">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map(({ category, icon: Icon, questions }) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-forest" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-forest">{category}</h2>
              </div>

              <div className="space-y-6">
                {questions.map(({ q, a }, idx) => (
                  <div
                    key={idx}
                    className="bg-cream rounded-2xl border border-muted/20 p-6 lg:p-8 hover:shadow-card transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-forest mb-3">{q}</h3>
                    <p className="text-forest/70 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rust/10 to-rust/5 border border-rust/20 p-8 lg:p-10 text-center mt-16">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239D5F1B\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-forest mb-3">
                Still have questions?
              </h3>
              <p className="text-forest/70 mb-6 max-w-2xl mx-auto">
                We&apos;re here to help. Reach out to our team and we&apos;ll get back to you as soon as
                possible.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-rust text-snow font-semibold px-8 py-3 rounded-xl hover:bg-rust/90 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
