"use client"; // 1. A linha mais importante: torna a página interativa.

import { useState } from "react"; // 2. Importa o hook para controlar o estado
import { mockImoveis } from "@/lib/mockData";
import { PropertiesCarousel } from "@/components/PropertiesCarousel";
import { SearchBar } from "@/components/SearchBar";

export default function HomePage() {
  // 3. Cria a "memória" para saber qual filtro está ativo. Começa com 'Lançamentos'.
  const [activeFilter, setActiveFilter] = useState("Lançamentos");

  // 4. Filtra a lista de imóveis ANTES de exibi-la, com base no filtro ativo.
  const filteredProperties = mockImoveis.filter((imovel) => {
    if (activeFilter === "Lançamentos") {
      // Assumindo que 'Lançamentos' são os imóveis em destaque
      return imovel.emDestaque === true;
    }
    if (activeFilter === "Comprar") {
      return imovel.finalidade === "Comprar";
    }
    if (activeFilter === "Alugar") {
      return imovel.finalidade === "Alugar";
    }
    return true;
  });

  return (
    <main>
      {/* Seção da Barra de Busca */}
      <section className="relative py-12 bg-cover bg-center bg-[url('/fundo.jpg')]">
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center min-h-[500px] py-12">
          <h1 className="text-4xl text-white font-bold text-center mb-8">
            Imóveis para venda e aluguel
          </h1>
          <SearchBar />
        </div>
      </section>

      {/* Seção de Imóveis em Destaque */}
      <section className="container mx-auto px-4 py-16 overflow-visible">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Imóveis em Destaque
        </h2>

        {/* 5. OPÇÕES DE FILTRO COM O ESTILO CORRETO E FUNCIONALIDADE */}
        <div className="flex justify-center items-center gap-8 mb-10">
          <button
            onClick={() => setActiveFilter("Lançamentos")}
            className={`font-medium text-lg text-gray-500 hover:text-blue-600 border-b-2 pb-1 transition-colors duration-300 cursor-pointer ${
              activeFilter === "Lançamentos"
                ? "border-blue-600 text-blue-600"
                : "border-transparent"
            }`}
          >
            Lançamentos
          </button>
          <button
            onClick={() => setActiveFilter("Comprar")}
            className={`font-medium text-lg text-gray-500 hover:text-blue-600 border-b-2 pb-1 transition-colors duration-300 cursor-pointer ${
              activeFilter === "Comprar"
                ? "border-blue-600 text-blue-600"
                : "border-transparent"
            }`}
          >
            Comprar
          </button>
          <button
            onClick={() => setActiveFilter("Alugar")}
            className={`font-medium text-lg text-gray-500 hover:text-blue-600 border-b-2 pb-1 transition-colors duration-300 cursor-pointer ${
              activeFilter === "Alugar"
                ? "border-blue-600 text-blue-600"
                : "border-transparent"
            }`}
          >
            Alugar
          </button>
        </div>

        {/* 6. GRID DE CARDS EXIBINDO A LISTA JÁ FILTRADA */}
        <div>
          <PropertiesCarousel properties={filteredProperties} />
        </div>
      </section>
    </main>
  );
}
