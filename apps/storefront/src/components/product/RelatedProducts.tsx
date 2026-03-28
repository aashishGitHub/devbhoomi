import { productService } from "@/lib/products-data";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  category: string;
  currentId: string;
}

export async function RelatedProducts({
  category,
  currentId,
}: RelatedProductsProps) {
  let products = [];
  try {
    const data = await productService.list(
      { category } as any,
      { next: { revalidate: 300 } } as RequestInit
    );
    products = data.items.filter((p) => p.id !== currentId).slice(0, 4);
  } catch {
    return null;
  }

  if (!products.length) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-forest mb-6">You might also like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
