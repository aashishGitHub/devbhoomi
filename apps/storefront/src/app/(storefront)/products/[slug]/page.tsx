import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductImages } from "@/components/product/ProductImages";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { productService, MOCK_PRODUCTS } from "@/lib/products-data";
import type { Product } from "@/types/product";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Fetch product via productService (mock or real API, controlled by env var)
async function getProduct(slug: string): Promise<Product | null> {
  try {
    return await productService.get(slug);
  } catch {
    return null;
  }
}

/**
 * generateStaticParams — required for `output: 'export'` (Cloudflare build).
 * In mock mode: pre-renders all 9 mock product pages at build time.
 * In real-API mode: returns [] so Next.js falls back to on-demand ISR.
 */
export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
  }
  return [];
}

// Static metadata per product
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.seo?.title ?? product.name,
    description: product.seo?.description ?? product.description,
    keywords: product.seo?.keywords,
    openGraph: {
      title: product.seo?.title ?? product.name,
      description: product.seo?.description ?? product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      type: "website",
    },
  };
}

// SSG + ISR — 60s revalidation
export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    {
      label: capitalise(product.category),
      href: `/products?category=${product.category}`,
    },
    { label: product.name, href: "#" },
  ];

  return (
    <div className="section pt-20 pb-6">
      <Breadcrumb items={breadcrumbs} className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <ProductImages images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />
      <RelatedProducts category={product.category} currentId={product.id} />
    </div>
  );
}

function capitalise(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
