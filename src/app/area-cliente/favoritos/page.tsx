// src/app/area-cliente/favoritos/page.tsx
"use client";

import { mockImoveis } from "@/lib/mockData";
import { PropertyCard } from "@/components/PropertyCard";
import Link from "next/link";

export default function FavoritosPage() {
  // Por enquanto, vamos simular que os 3 primeiros imóveis são os favoritos
  const favoriteProperties = mockImoveis.slice(0, 3);

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <Link
            href="/area-cliente/dashboard"
            className="text-blue-600 hover:underline"
          >
            &larr; Voltar para o Painel
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mt-2">
            Meus Imóveis Favoritos
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {favoriteProperties.length} imóveis salvos.
          </p>
        </div>

        {/* Grade de Imóveis Favoritados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favoriteProperties.map((imovel) => (
            <PropertyCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      </div>
    </main>
  );
}
