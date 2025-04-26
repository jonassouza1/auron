"use client";

interface FilterBarProps {
  onCategoryChange: (category: string) => void;
}

export default function FilterBar({ onCategoryChange }: FilterBarProps) {
  return (
    <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <select
        onChange={(e) => onCategoryChange(e.target.value)}
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
      />
    </div>
  );
}
