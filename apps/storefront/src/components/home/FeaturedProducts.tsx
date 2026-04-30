import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { productService } from "@/lib/products-data";

// ISR — revalidated as part of the page (300s)
async function getFeaturedProducts() {
  try {
    const data = await productService.list(
      { sort: "featured" },
      { next: { revalidate: 300 } } as RequestInit
    );
    return data.items.slice(0, 8);
  } catch {
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="relative bg-gradient-to-b from-cream via-[#f5ebe0] to-cream py-20 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M40 0 L80 40 L40 80 L0 40\' fill=\'none\' stroke=\'%23254B5A\' stroke-width=\'1\'/%3E%3C/svg%3E")' }}
      />
      <div className="section relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-rust/80 mb-2">
              Best Sellers
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-forest leading-tight"
              style={{ fontFamily: "Georgia, serif" }}>
              Featured Products
            </h2>
            <p className="text-forest/60 text-base mt-2">
              Bestsellers handpicked from our artisan collection
            </p>
          </div>
          <Button variant="outline" size="sm"
            className="border-forest/30 text-forest hover:bg-forest hover:text-snow transition-all duration-300 rounded-full px-6"
            asChild
          >
            <Link href="/products">View all →</Link>
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-forest/40">
            <p className="text-lg">Products loading from the mountains…</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Legacy placeholder — kept as fallback reference only
// When NEXT_PUBLIC_USE_MOCK=true the mock layer is used instead
const _PLACEHOLDER_PRODUCTS_UNUSED = [
  {
    id: "p1",
    name: "5 Mukhi Rudraksha Bead",
    slug: "5-mukhi-rudraksha-bead",
    category: "sacred",
    subcategory: "rudraksha",
    description: "Authentic Rudraksha bead from Rishikesh artisans.",
    price: { inr: 1200, usd: 14.5 },
    images: [],
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "p2",
    name: "Wild Raw Himalayan Honey",
    slug: "wild-raw-himalayan-honey",
    category: "foods",
    subcategory: "honey",
    description: "Raw honey harvested at 3000m altitude.",
    price: { inr: 850, usd: 10.2 },
    images: [],
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "p3",
    name: "Pure Shilajit Resin",
    slug: "pure-shilajit-resin",
    category: "wellness",
    subcategory: "supplements",
    description: "Purified Himalayan Shilajit with 80+ minerals.",
    price: { inr: 2400, usd: 29.0 },
    images: [],
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: "p4",
    name: "A2 Bilona Ghee (500ml)",
    slug: "a2-bilona-ghee-500ml",
    category: "foods",
    subcategory: "ghee",
    description: "Traditionally churned A2 cow ghee from Uttarakhand.",
    price: { inr: 1650, usd: 19.8 },
    images: [],
    status: "active",
    created_at: "",
    updated_at: "",
  },
];
