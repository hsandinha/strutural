// src/components/NavItemWithDropdown.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

// Definição do tipo para cada item do submenu
interface SubItem {
  name: string;
  value: string;
}

// Definição das propriedades que o componente recebe
interface NavItemWithDropdownProps {
  title: string;
  basePath: string; // Ex: "/comprar"
  subItems: SubItem[];
}

export function NavItemWithDropdown({
  title,
  basePath,
  subItems,
}: NavItemWithDropdownProps) {
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

  // O return com o JSX que estava faltando ou incorreto
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={basePath}
        className="flex items-center gap-1 text-gray-600 hover:text-black font-medium focus:outline-none border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all duration-300"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Link>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-white rounded-md shadow-lg border z-30">
          <div className="p-2">
            {subItems.map((item) => (
              // Cada sub-item agora é um link com o filtro na URL
              <Link
                key={item.name}
                href={`${basePath}?tipo=${item.value}`}
                className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t my-1"></div>
            <Link
              href={basePath}
              className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Todos os Imóveis
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
