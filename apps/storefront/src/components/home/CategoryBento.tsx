import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    key: "sacred",
    title: "Sacred Items",
    subtitle: "Rudraksha · Havan Samagri · Brass Idols",
    description:
      "Authentic ritual products sourced from temple artisans of Rishikesh — blessed by tradition.",
    href: "/products?category=sacred",
    emoji: "🙏",
    gradient: "from-rust/20 to-rust/5",
    accentColor: "text-rust",
    borderColor: "border-rust/20",
    span: "lg:col-span-2 lg:row-span-2",
    large: true,
  },
  {
    key: "foods",
    title: "Himalayan Foods",
    subtitle: "Wild Honey · A2 Ghee · Grains",
    description:
      "High-altitude superfoods from Uttarakhand fields — chemical free, nutrient rich.",
    href: "/products?category=foods",
    emoji: "🍯",
    gradient: "from-misty/30 to-misty/5",
    accentColor: "text-stone",
    borderColor: "border-misty/30",
    span: "lg:col-span-1",
    large: false,
  },
  {
    key: "wellness",
    title: "Heritage Wellness",
    subtitle: "Shilajit · Ashwagandha · Herbal Care",
    description:
      "Ancient Ayurvedic wisdom in modern formats — pure, potent, and traceable.",
    href: "/products?category=wellness",
    emoji: "🌿",
    gradient: "from-forest/10 to-forest/[0.03]",
    accentColor: "text-forest",
    borderColor: "border-forest/15",
    span: "lg:col-span-1",
    large: false,
  },
];

export function CategoryBento() {
  return (
    <section className="section py-14">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-forest mb-2">
          Three Pillars of Devbhoomi
        </h2>
        <p className="text-forest/60 text-sm max-w-lg mx-auto">
          Everything we sell maps to one of three sacred commitments — ritual,
          nourishment, and wellness.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 auto-rows-fr">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.key}
            href={cat.href}
            className={cn(
              "group relative overflow-hidden rounded-3xl border bg-snow p-8 flex flex-col justify-between",
              "transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
              `bg-gradient-to-br ${cat.gradient}`,
              cat.borderColor,
              cat.span,
              cat.large ? "min-h-72" : "min-h-44"
            )}
          >
            {/* Emoji */}
            <span
              className={cn(
                "mb-4 block transition-transform duration-300 group-hover:scale-110",
                cat.large ? "text-6xl" : "text-4xl"
              )}
              aria-hidden="true"
            >
              {cat.emoji}
            </span>

            <div>
              <h3
                className={cn(
                  "font-bold text-forest mb-1",
                  cat.large ? "text-2xl" : "text-lg"
                )}
              >
                {cat.title}
              </h3>
              <p className={cn("text-xs font-medium mb-2", cat.accentColor)}>
                {cat.subtitle}
              </p>
              {cat.large && (
                <p className="text-sm text-forest/60 leading-relaxed mb-4">
                  {cat.description}
                </p>
              )}
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-semibold",
                  cat.accentColor
                )}
              >
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
