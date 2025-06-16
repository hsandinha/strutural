"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

// Definimos os tipos para as props que o componente receberá
interface SubItem {
  name: string;
  href: string;
}

interface NavItemWithDropdownProps {
  title: string;
  basePath: string; // Ex: "/comprar" ou "/alugar"
  subItems: SubItem[];
}

export function NavItemWithDropdown({
  title,
  basePath,
  subItems,
}: NavItemWithDropdownProps) {
  // Estado para controlar se o dropdown está aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // Cancela o timeout se o mouse voltar antes de fechar
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Só fecha depois de 2 segundos (2000 ms)
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 90);
  };

  return (
    // Usamos onMouseLeave e onMouseEnter para controlar no Desktop
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Botão principal do menu */}
      <button className="flex items-center gap-1 text-gray-600 hover:text-black font-medium focus:outline-none">
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* O menu dropdown que aparece/desaparece */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-md shadow-lg border z-30">
          <div className="p-2">
            {subItems.map((item) => (
              <Link
                key={item.name}
                href={`${basePath}${item.href}`}
                className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)} // Fecha o menu ao clicar em um item
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
