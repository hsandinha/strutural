// src/app/comprar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { mockImoveis } from "@/lib/mockData";
import { Imovel } from "@/types";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";

export default function ComprarPage() {
  const [imoveisFiltrados, setImoveisFiltrados] = useState<Imovel[]>([]);

  // Carrega todos os imóveis para 'Comprar' inicialmente
  useEffect(() => {
    const imoveisParaComprar = mockImoveis.filter(
      (imovel) => imovel.finalidade === "Comprar"
    );
    setImoveisFiltrados(imoveisParaComprar);
  }, []);

  // Esta função será chamada pela SearchBar
  const handleSearch = (filters: any) => {
    console.log("Buscando com os filtros:", filters);
    // Aqui virá a lógica complexa para filtrar os imóveis com base nos filtros
    // Por enquanto, apenas exibimos um log
    alert("Funcionalidade de busca ainda será implementada!");
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Seção da Barra de Busca */}
      <section className="py-8 bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Seção dos Resultados */}
      <section className="container mx-auto px-4 py-12">
        {/* Cabeçalho dos Resultados */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {imoveisFiltrados.length} imóveis à venda encontrados
          </h1>
          <div>
            <label htmlFor="sort" className="text-sm mr-2">
              Ordenar por:
            </label>
            <select id="sort" className="border-gray-300 rounded-md text-sm">
              <option>Relevância</option>
              <option>Menor Preço</option>
              <option>Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Grade de Imóveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {imoveisFiltrados.map((imovel) => (
            <PropertyCard key={imovel.id} imovel={imovel} />
          ))}
        </div>

        {/* Paginação (Exemplo simples) */}
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-md">&lt;</button>
            <button className="px-4 py-2 border rounded-md bg-blue-600 text-white">
              1
            </button>
            <button className="px-4 py-2 border rounded-md">&gt;</button>
          </div>
        </div>
      </section>
    </main>
  );
}
