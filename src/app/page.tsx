// src/app/page.tsx

"use client";

import { useState } from "react";
import { mockImoveis } from "@/lib/mockData";
import { Imovel } from "@/types";
import { SearchBar } from "@/components/SearchBar";
import { PropertiesCarousel } from "@/components/PropertiesCarousel";

export default function HomePage() {
  // 1. Um único estado para controlar TODOS os filtros
  const [filters, setFilters] = useState({
    // 'view' controla as abas (Lançamentos, Comprar, Alugar)
    view: "Lançamentos",
    // 'tipo' controla o filtro do submenu (apartamento, casa, etc)
    tipo: "todos",
  });

  // 2. Uma única função para atualizar qualquer filtro
  const handleFilterChange = (filterType: string, value: string) => {
    console.log(`Filtro acionado: ${filterType} = ${value}`); // Para teste

    // Se o clique veio dos submenus COMPRAR/ALUGAR, mudamos a 'view' e o 'tipo'
    if (filterType === "comprar" || filterType === "alugar") {
      setFilters({ view: filterType, tipo: value });
    } else {
      // Para outros filtros (como as abas), atualizamos o filtro correspondente
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: value,
      }));
    }
  };

  // 3. Lógica de filtro unificada
  const filteredProperties = mockImoveis.filter((imovel: Imovel) => {
    let viewMatch = false;
    if (filters.view === "Lançamentos") {
      viewMatch = imovel.emDestaque === true;
    } else if (filters.view === "comprar") {
      viewMatch = imovel.finalidade.toLowerCase() === "comprar";
    } else if (filters.view === "alugar") {
      viewMatch = imovel.finalidade.toLowerCase() === "alugar";
    }

    const tipoMatch =
      filters.tipo === "todos" || imovel.tipo?.toLowerCase() === filters.tipo;

    return viewMatch && tipoMatch;
  });

  return (
    <main>
      {/* Seção da Barra de Busca */}
      <section className="relative py-12 bg-cover bg-center bg-[url('/fundo.jpg')]">
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center min-h-[500px] py-12 opacity-70">
          <h1 className="text-4xl text-white font-bold text-center mb-8">
            Imóveis para venda e aluguel
          </h1>
          <SearchBar
            onSearch={() => {
              /* Na home, o botão de busca não faz nada por enquanto */
            }}
          />
        </div>
      </section>

      {/* Seção de Imóveis em Destaque */}
      <section className="container mx-auto px-4 py-16 overflow-visible">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Imóveis em Destaque
        </h2>

        {/* Abas da página que agora também usam a função de filtro principal */}
        <div className="flex justify-center items-center gap-8 mb-10 border-b border-gray-200">
          {["Lançamentos", "comprar", "alugar"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilterChange("view", tab)}
              className={`relative px-4 py-2 font-medium text-lg transition-colors cursor-pointer
        ${
          filters.view === tab
            ? "text-blue-600 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-600"
            : "text-gray-600 hover:text-blue-600"
        }
        bg-transparent border-none outline-none
      `}
              style={{ background: "none" }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Carrossel exibindo a lista final filtrada */}
        <PropertiesCarousel properties={filteredProperties} />
      </section>
    </main>
  );
}
