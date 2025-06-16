// src/components/Header.tsx

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

// A função Header agora é mais simples e não precisa mais receber props
export function Header() {
  return (
    <header className="py-4 px-8 z-20 bg-white shadow-md border-b">
      <div className="container mx-auto flex justify-between items-center">
        {/* Coluna da Esquerda: Logo e Área do Cliente */}
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

        {/* Coluna da Direita: Navegação */}
        <div className="flex flex-col items-end">
          {/* Navegação Principal */}
          <nav className="flex items-center space-x-6 text-xs text-gray-500 mb-2">
            {/* O NavItemWithDropdown agora pega a função do Contexto, então não passamos mais props para ele aqui */}
            <NavItemWithDropdown title="COMPRAR" subItems={propertyTypes} />
            <NavItemWithDropdown title="ALUGAR" subItems={propertyTypes} />

            <Link
              href="/cadastrar-imovel"
              className="text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-red-600 pb-1 transition-all duration-300"
            >
              ANUNCIE SEU IMÓVEL
            </Link>
            <Link
              href="/contato"
              className="text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-red-600 pb-1 transition-all duration-300"
            >
              CONTATO
            </Link>
            <Link
              href="/sobre"
              className="text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-red-600 pb-1 transition-all duration-300"
            >
              SOBRE
            </Link>
            <Link
              href="/area-cliente"
              className="text-gray-600 hover:text-black font-medium border-b-2 border-transparent hover:border-red-600 pb-1 transition-all duration-300"
            >
              ÁREA DO CLIENTE
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
