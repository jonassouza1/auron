"use client";

export default function FilterBar() {
  return (
    <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <select className="p-2 border rounded-xl text-gray-700 w-full md:w-auto">
        <option>Todas as categorias</option>
        <option>Facas</option>
        <option>Canivetes</option>
        <option>Kit sobrevivência</option>
      </select>
      <input
        type="text"
        placeholder="Buscar produto..."
        className="p-2 border rounded-xl w-full md:w-1/3 text-gray-700"
      />
    </div>
  );
}
