// src/components/Header.tsx

import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { NavItemWithDropdown } from "./NavItemWithDropdown";

const submenuItems = [
  { name: "Apartamentos", href: "/apartamentos" },
  { name: "Casas", href: "/casas" },
  { name: "Terrenos", href: "/terrenos" },
  { name: "Lojas", href: "/lojas" },
];

export function Header() {
  return (
    <header className="py-4 px-8 z-20 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="justify-items-start">
          <Link href="/">
            <Image
              src="/Strutural.png"
              alt="Logo da Strutural Imobiliária"
              width={230}
              height={100}
              priority
            />
          </Link>
        </div>

        {/* FILHO 2: A Navegação */}
        <div>
          <nav className="text-sm flex items-center space-x-6 cursor-pointer">
            <NavItemWithDropdown
              title="COMPRAR"
              basePath="/comprar"
              subItems={submenuItems}
            />
            <NavItemWithDropdown
              title="ALUGAR"
              basePath="/alugar"
              subItems={submenuItems}
            />
            <Link
              href="/cadastrar-imovel"
              className="text-sm text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all duration-300 cursor-pointer"
            >
              ANUNCIE SEU IMÓVEL
            </Link>
            <Link
              href="/contato"
              className="text-sm text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all duration-300 cursor-pointer"
            >
              CONTATO
            </Link>
            <Link
              href="/sobre"
              className=" text-sm text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all duration-300 cursor-pointer"
            >
              SOBRE
            </Link>
            <Link
              href="/area-cliente"
              className="text-sm text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-blue-600 pb-1 transition-all duration-300 cursor-pointer"
            >
              ÁREA DO CLIENTE
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
