"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <select
        onChange={(e) => handleCategoryChange(e.target.value)}
        value={currentCategory}
        className="p-2 border rounded-xl text-gray-700 w-full md:w-auto hover:cursor-pointer"
      >
        <option value="">Todas as categorias</option>
        <option value="Camisa">Camisa</option>
        <option value="Calça">Calça</option>
        <option value="Casaco">Casaco</option>
        <option value="Bermuda">Bermuda</option>
        <option value="Roupa Íntima">Roupa Íntima</option>
        <option value="Calçado">Calçado</option>
      </select>

      <input
        type="text"
        placeholder="Buscar produto..."
        className="p-2 border rounded-xl w-full md:w-1/3 text-gray-700"
        defaultValue={currentSearch}
        // Você pode adicionar o handler depois para atualizar a URL com a busca
      />
    </div>
  );
}
