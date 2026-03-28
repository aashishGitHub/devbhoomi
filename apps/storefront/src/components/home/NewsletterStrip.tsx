"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, CheckCircle } from "lucide-react";

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
    <section className="bg-cream border-t border-muted/20 py-14">
      <div className="section text-center max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-forest/8 mb-5 mx-auto">
          <Mail className="w-5 h-5 text-forest" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-forest mb-2">
          Stories from the Himalayas
        </h2>
        <p className="text-forest/60 text-sm mb-7">
          Subscribe for seasonal harvests, artisan stories, and exclusives.
          No spam, unsubscribe anytime.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl py-3 px-5">
            <CheckCircle className="w-4 h-4" aria-hidden="true" />
            You&apos;re subscribed! Welcome to Devbhoomi.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
              aria-label="Email address"
            />
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="shrink-0"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
