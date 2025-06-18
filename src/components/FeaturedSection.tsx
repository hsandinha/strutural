// src/components/FeaturedSection.tsx

"use client";

import { useState } from "react";
import { Imovel } from "@/types";
import { PropertiesCarousel } from "./PropertiesCarousel";

// Este componente recebe a lista inicial de imóveis do servidor
export function FeaturedSection({
  initialProperties,
}: {
  initialProperties: Imovel[];
}) {
  const [activeFilter, setActiveFilter] = useState("Lançamentos");

  const filteredProperties = initialProperties.filter((imovel) => {
    if (activeFilter === "Lançamentos") return imovel.emDestaque === true;
    if (activeFilter === "Comprar") return imovel.finalidade === "Comprar";
    return true;
  });

  return (
    <section className="container mx-auto px-4 py-16 overflow-visible">
      <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Imóveis em Destaque
      </h2>

      {/* Abas de filtro (exatamente como antes) */}
      <div className="flex justify-center items-center gap-8 mb-10">
        <button
          onClick={() => setActiveFilter("Lançamentos")}
          className={`font-medium text-lg ... ${
            activeFilter === "Lançamentos" ? "..." : "..."
          }`}
        >
          Lançamentos
        </button>
        {/* ... os outros 2 botões ... */}
      </div>

      {/* Carrossel exibindo a lista filtrada */}
      <PropertiesCarousel properties={filteredProperties} />
    </section>
  );
}
