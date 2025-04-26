"use client";

import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const products = [
    {
      id: 1,
      name: "Faca Tática Auron",
      image_url: "/images/faca1.jpg",
      description: "Faca resistente ideal para trilhas e aventuras.",
      quantity: 5,
      price: 249.9,
      discount_price: 199.9,
      size: "P",
    },
    {
      id: 2,
      name: "Canivete Compacto",
      image_url: "/images/faca2.jpg",
      description: "Canivete dobrável perfeito para uso diário.",
      quantity: 10,
      price: 129.9,
      size: "M",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <Header />
      <FilterBar />
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
