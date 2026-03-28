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
    <section className="section py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-forest mb-1">
            Featured Products
          </h2>
          <p className="text-forest/60 text-sm">
            Bestsellers handpicked from our collection
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/products">View all →</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
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
