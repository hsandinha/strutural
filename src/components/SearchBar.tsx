// src/components/SearchBar.tsx
"use client";

import { useState } from "react";
import type { SearchFilters } from "@/types"; // 1. Importe o tipo que criamos

export function SearchBar({
  onSearch,
}: {
  onSearch: (filters: SearchFilters) => void;
}) {
  // 2. Usamos o tipo no nosso estado para garantir consistência
  const [filters, setFilters] = useState<SearchFilters>({
    finalidade: "Comprar",
    tipo: "Todos",
    localizacao: "",
    quartos: "Todos",
    valorMin: "",
    valorMax: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="bg-white/90 p-8 rounded-lg shadow-2xl w-full max-w-5xl mx-auto backdrop-blur-sm overflow-visible">
      <form>
        {/* Linha 1 de Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label
              htmlFor="finalidade"
              className="block text-xs font-semibold text-gray-500 uppercase mb-1"
            >
              Finalidade
            </label>
            <select
              id="finalidade"
              name="finalidade"
              value={filters.finalidade}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
            >
              <option>Comprar</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="tipo"
              className="block text-xs font-semibold text-gray-500 uppercase mb-1"
            >
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              value={filters.tipo}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
            >
              <option value="Todos">Todos</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="terreno">Terreno</option>
              <option value="loja">Lojas</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="localizacao"
              className="block text-xs font-semibold text-gray-500 uppercase mb-1"
            >
              Localização
            </label>
            <input
              type="text"
              id="localizacao"
              name="localizacao"
              value={filters.localizacao}
              onChange={handleInputChange}
              placeholder="Bairro ou Cidade"
              className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
            />
          </div>
        </div>

        {/* Linha 2 de Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="quartos"
              className="block text-xs font-semibold text-gray-500 uppercase mb-1"
            >
              Quartos
            </label>
            <select
              id="quartos"
              name="quartos"
              value={filters.quartos}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
            >
              <option value="Todos">Todos</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Valor
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="valorMin"
                value={filters.valorMin}
                onChange={handleInputChange}
                placeholder="Min"
                className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
              />
              <input
                type="text"
                name="valorMax"
                value={filters.valorMax}
                onChange={handleInputChange}
                placeholder="Max"
                className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Botão de Busca */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSearchClick}
            className="w-full md:w-1/3 bg-gray-900/80 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-900 transition-colors border-2 border-blue-600 text-sm tracking-wider"
          >
            BUSCAR IMÓVEIS
          </button>
        </div>
      </form>
    </div>
  );
}
