// src/components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NavItemWithDropdown } from "./NavItemWithDropdown";

// Itens do submenu
const propertyTypes = [
  { name: "Apartamentos", value: "apartamento" },
  { name: "Casas", value: "casa" },
  { name: "Terrenos", value: "terreno" },
  { name: "Lojas", value: "loja" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="py-4 px-8 z-20 bg-white shadow-md border-b relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex flex-col">
          <Link href="/">
            <Image
              src="/strutural.png"
              alt="Logo da Strutural Imobiliária"
              width={200}
              height={50}
              priority
            />
          </Link>
        </div>

        {/* Menu Desktop */}
        <div className="hidden lg:flex flex-col items-end">
          <nav className="flex items-center space-x-6 text-xs text-gray-500 mb-2">
            <NavItemWithDropdown title="COMPRAR" subItems={propertyTypes} />
            <NavItemWithDropdown title="ALUGAR" subItems={propertyTypes} />

            <Link
              href="/cadastrar-imovel"
              className="text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all duration-300 cursor-pointer"
            >
              ANUNCIE SEU IMÓVEL
            </Link>
            <Link
              href="/contato"
              className="text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all duration-300 cursor-pointer"
            >
              CONTATO
            </Link>
            <Link
              href="/sobre"
              className="text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all duration-300 cursor-pointer"
            >
              SOBRE
            </Link>
            <Link
              href="/area-cliente"
              className="text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all duration-300 cursor-pointer"
            >
              ÁREA DO CLIENTE
            </Link>
          </nav>
        </div>

        {/* Botão Menu Mobile (Hambúrguer) */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span
            className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Menu Mobile (Dropdown) */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t transition-all duration-300 ${
          isMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-col py-4 px-8 space-y-4">
          {/* Para mobile, você pode simplificar os dropdowns ou criar uma versão mobile específica */}
          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium text-sm">COMPRAR</span>
            <div className="ml-4 mt-2 space-y-2">
              {propertyTypes.map((type) => (
                <Link
                  key={type.value}
                  href={`/comprar?tipo=${type.value}`}
                  className="block text-gray-500 text-xs hover:text-blue-600 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {type.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium text-sm">ALUGAR</span>
            <div className="ml-4 mt-2 space-y-2">
              {propertyTypes.map((type) => (
                <Link
                  key={type.value}
                  href={`/alugar?tipo=${type.value}`}
                  className="block text-gray-500 text-xs hover:text-blue-600 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {type.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/cadastrar-imovel"
            className="text-gray-600 hover:text-blue-600 font-medium text-sm cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            ANUNCIE SEU IMÓVEL
          </Link>
          <Link
            href="/contato"
            className="text-gray-600 hover:text-blue-600 font-medium text-sm cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            CONTATO
          </Link>
          <Link
            href="/sobre"
            className="text-gray-600 hover:text-blue-600 font-medium text-sm cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            SOBRE
          </Link>
          <Link
            href="/area-cliente"
            className="text-gray-600 hover:text-blue-600 font-medium text-sm cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            ÁREA DO CLIENTE
          </Link>
        </nav>
      </div>
    </header>
  );
}
