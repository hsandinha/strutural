// src/components/NavItemWithDropdown.tsx
"use client";

import { useState, useRef } from "react";
import { useFilters } from "@/context/FilterContext";
import { ChevronDown } from "lucide-react";

// Definição do tipo para cada item do submenu
interface SubItem {
  name: string;
  value: string;
}

// Definição das propriedades que o componente recebe
interface NavItemWithDropdownProps {
  title: string;
  subItems: SubItem[];
}

export function NavItemWithDropdown({
  title,
  subItems,
}: NavItemWithDropdownProps) {
  // Pega a função para alterar filtros do nosso contexto global
  const { setFilters } = useFilters();

  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Lógica para abrir o menu ao passar o mouse
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  // Lógica para fechar o menu com um pequeno atraso
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  // Função para quando um item do filtro é clicado
  const handleFilterClick = (value: string) => {
    const finalidade = title.toLowerCase();
    // Atualiza o estado global através do contexto
    setFilters({ finalidade: finalidade, lancamento: false, tipo: value });
    setIsOpen(false); // Fecha o menu
  };

  // O return com o JSX que estava faltando ou incorreto
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-1 text-gray-600 hover:text-black font-medium focus:outline-none border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all duration-300 cursor-pointer">
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-white rounded-md shadow-lg border z-30 cursor-pointer">
          <div className="p-2">
            {subItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleFilterClick(item.value)}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
              >
                {item.name}
              </button>
            ))}
            <div className="border-t my-1" />
            <button
              onClick={() => handleFilterClick("todos")}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 font-semibold"
            >
              Todos os Imóveis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
