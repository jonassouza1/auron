"use client";

import { useEffect, useState } from "react";
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        let url = "/api/v1/products";
        if (selectedCategory) {
          url += `?category_name=${encodeURIComponent(selectedCategory)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        const normalizedProducts = data.products.map((product: Product) => ({
          ...product,
          price: Number(product.price),
          discount_price: product.discount_price
            ? Number(product.discount_price)
            : undefined,
        }));

        setProducts(normalizedProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory]); // sempre que mudar a categoria, refaz o fetch

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <Header />
      <FilterBar onCategoryChange={setSelectedCategory} />

      {loading ? (
        <div className="text-center mt-10 text-gray-600">
          Carregando produtos...
        </div>
      ) : (
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}
