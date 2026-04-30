"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // TODO: wire up to /api/v1/newsletter/subscribe
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a3a2a] via-forest to-[#0f2128] py-20">
      {/* Floating glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-misty/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="section text-center max-w-xl mx-auto relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-snow/10 border border-snow/20 mb-6 mx-auto"
        >
          <Mail className="w-7 h-7 text-misty" aria-hidden="true" />
        </motion.div>

        <h2 className="text-3xl sm:text-4xl font-bold text-snow mb-3"
          style={{ fontFamily: "Georgia, serif" }}>
          Stories from the Himalayas
        </h2>
        <p className="text-snow/60 text-base mb-8 max-w-sm mx-auto">
          Subscribe for seasonal harvests, artisan stories, and early
          access to rare products. No spam, unsubscribe anytime.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl py-4 px-6"
          >
            <CheckCircle className="w-5 h-5" aria-hidden="true" />
            You&apos;re subscribed! Welcome to Devtatva.
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-snow/10 border-snow/20 text-snow placeholder:text-snow/40 focus:border-misty focus:ring-misty/30 rounded-full px-5"
              aria-label="Email address"
            />
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="shrink-0 rounded-full px-7 bg-misty text-forest font-bold hover:bg-snow transition-colors"
            >
              Subscribe
            </Button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
