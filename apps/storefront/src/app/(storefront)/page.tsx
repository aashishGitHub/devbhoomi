import type { Metadata } from "next";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryBento } from "@/components/home/CategoryBento";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HeritageBanner } from "@/components/home/HeritageBanner";
import { TrustSignals } from "@/components/home/TrustSignals";
import { NewsletterStrip } from "@/components/home/NewsletterStrip";

export const metadata: Metadata = {
  title: "Devbhoomi — Sacred & Organic Himalayan Products",
  description:
    "Shop authentic Rudraksha, organic Himalayan honey, A2 ghee, Shilajit and sacred ritual items directly from artisans of Uttarakhand.",
};

// SSG + ISR — revalidate every 5 minutes
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryBento />
      <FeaturedProducts />
      <HeritageBanner />
      <TrustSignals />
      <NewsletterStrip />
    </>
  );
}
