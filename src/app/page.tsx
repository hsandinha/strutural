// src/app/page.tsx

"use client";

import { useState } from "react";
import { mockImoveis } from "@/lib/mockData";
import { Imovel } from "@/types";
import { SearchBar } from "@/components/SearchBar";
import { PropertiesCarousel } from "@/components/PropertiesCarousel";
import { NeighborhoodCard } from "@/components/NeighborhoodCard";

const bairrosDestaque = [
  // --- Belo Horizonte ---
  {
    name: "Anchieta",
    city: "Belo Horizonte",
    imageUrl: "/anchieta.png",
    href: "/comprar?localizacao=anchieta",
  },
  {
    name: "Belvedere",
    city: "Belo Horizonte",
    imageUrl: "/belvedere.jpg",
    href: "/comprar?localizacao=belvedere",
  },
  {
    name: "Cruzeiro",
    city: "Belo Horizonte",
    imageUrl: "/cruzeiro.jpg",
    href: "/comprar?localizacao=Cruzeiro",
  },
  {
    name: "Funcionarios",
    city: "Belo Horizonte",
    imageUrl: "/funcionarios.jpg",
    href: "/comprar?localizacao=funcionarios",
  },
  {
    name: "Gutierrez",
    city: "Belo Horizonte",
    imageUrl: "/gutierrez.jpg",
    href: "/comprar?localizacao=gutierrez",
  },
  {
    name: "Lourdes",
    city: "Belo Horizonte",
    imageUrl: "/lourdes.jpeg",
    href: "/comprar?localizacao=Lourdes",
  },
  {
    name: "Luxemburgo",
    city: "Belo Horizonte",
    imageUrl: "/luxemburgo.jpeg",
    href: "/comprar?localizacao=luxemburgo",
  },
  {
    name: "Mangabeiras",
    city: "Belo Horizonte",
    imageUrl: "/mangabeiras.jpeg",
    href: "/comprar?localizacao=mangabeiras",
  },
  {
    name: "Santo Agostinho",
    city: "Belo Horizonte",
    imageUrl: "/santoAgostinho.jpeg",
    href: "/comprar?localizacao=santoAgostinho",
  },
  {
    name: "Santo Antonio",
    city: "Belo Horizonte",
    imageUrl: "/santoAntonio.jpg",
    href: "/comprar?localizacao=santoAntonio",
  },
  {
    name: "São Pedro",
    city: "Belo Horizonte",
    imageUrl: "/saopedro.jpg",
    href: "/comprar?localizacao=SaoPedro",
  },
  {
    name: "Savassi",
    city: "Belo Horizonte",
    imageUrl: "/savassi.jpg",
    href: "/comprar?localizacao=savassi",
  },
  {
    name: "Serra",
    city: "Belo Horizonte",
    imageUrl: "/serra.jpg",
    href: "/comprar?localizacao=serra",
  },
  {
    name: "Sion",
    city: "Belo Horizonte",
    imageUrl: "/sion.png",
    href: "/comprar?localizacao=sion",
  },
  // --- Nova Lima ---
  {
    name: "Vila da Serra",
    city: "Nova Lima",
    imageUrl: "/viladaserra.jpg",
    href: "/comprar?localizacao=vila-da-serra",
  },
  {
    name: "Condominios Nova Lima",
    city: "Nova Lima",
    imageUrl: "/casa.jpg",
    href: "/comprar?localizacao=condominio",
  },
];

export default function HomePage() {
  // 1. Um único estado para controlar TODOS os filtros
  const [filters, setFilters] = useState({
    // 'view' controla as abas (Lançamentos, Comprar)
    view: "Lançamentos",
    // 'tipo' controla o filtro do submenu (apartamento, casa, etc)
    tipo: "todos",
  });

  // 2. Uma única função para atualizar qualquer filtro
  const handleFilterChange = (filterType: string, value: string) => {
    console.log(`Filtro acionado: ${filterType} = ${value}`); // Para teste

    // Se o clique veio dos submenus COMPRAR, mudamos a 'view' e o 'tipo'
    if (filterType === "comprar") {
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
            Imóveis para Venda
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
          {["Lançamentos", "comprar"].map((tab) => (
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
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">
            Bairros em Destaque
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {bairrosDestaque.map((bairro) => (
              <NeighborhoodCard
                key={bairro.name}
                name={bairro.name}
                city={bairro.city}
                imageUrl={bairro.imageUrl}
                href={bairro.href}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
