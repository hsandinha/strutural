// src/components/SearchBar.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";

// O componente agora recebe uma função 'onSearch' como propriedade
export function SearchBar({ onSearch }: { onSearch: (filters: any) => void }) {
  // O estado dos filtros agora vive aqui dentro
  const [localFilters, setLocalFilters] = useState({
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
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchClick = () => {
    // Quando o botão é clicado, chamamos a função que veio do componente "pai"
    onSearch(localFilters);
  };

  return (
    <div className="bg-white/90 p-8 rounded-lg shadow-2xl w-full max-w-5xl mx-auto backdrop-blur-sm overflow-visible">
      {/* ... o resto do seu formulário ... */}
      {/* A mudança principal é adicionar 'name' e 'value' e 'onChange' aos inputs/selects */}
      {/* Exemplo para um select: */}
      <select
        id="finalidade"
        name="finalidade"
        value={localFilters.finalidade}
        onChange={handleInputChange}
        className="w-full border-gray-300 rounded-md p-3 text-gray-700 shadow-sm"
      >
        <option>Comprar</option>
        <option>Alugar</option>
      </select>

      {/* ... faça o mesmo para os outros inputs e selects ... */}

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSearchClick}
          className="w-full md:w-1/3 bg-gray-900/80 ..."
        >
          BUSCAR IMÓVEIS
        </button>
      </div>
    </div>
  );
}
