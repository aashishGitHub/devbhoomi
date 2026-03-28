"use client";
import { useSearchParams } from "next/navigation";

const LABELS: Record<string, string> = {
  sacred: "Sacred & Ritual",
  foods: "Himalayan Foods",
  wellness: "Wellness & Ayurveda",
};

export function ProductPageTitle() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const title = q
    ? `Search: "${q}"`
    : category
    ? (LABELS[category] ?? category.charAt(0).toUpperCase() + category.slice(1))
    : "All Products";

  return (
    <h1 className="text-3xl font-bold text-forest">{title}</h1>
  );
}
