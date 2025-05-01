import { Suspense } from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  image_url: string;
  description: string;
  quantity: number;
  price: number;
  discount_price?: number;
  size_name: string;
};

export const revalidate = 3600;

async function getProducts(category?: string): Promise<Product[]> {
  let url = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/products`
    : "http://localhost:3000/api/v1/products";

  if (category) {
    url += `?category_name=${encodeURIComponent(category)}`;
  }

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  const data = await res.json();

  return data.products.map((product: Product) => ({
    ...product,
    price: Number(product.price),
    discount_price: product.discount_price
      ? Number(product.discount_price)
      : undefined,
  }));
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const category =
    typeof resolvedSearchParams.category === "string"
      ? resolvedSearchParams.category
      : undefined;

  const products = await getProducts(category);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <Header />
      <Suspense fallback={<div>Carregando filtros...</div>}>
        <FilterBar />
      </Suspense>
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
