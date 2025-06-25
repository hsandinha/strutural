// src/app/page.tsx

"use client";

import { getProperties } from "@/lib/firebase/properties"; // 1. Importa nossa nova função de busca
import { FeaturedSection } from "@/components/FeaturedSection";
import { SearchBar } from "@/components/SearchBar";
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

export default async function HomePage() {
  // 2. Buscamos os imóveis do Firebase quando a página é construída no servidor
  const propertiesFromDb = await getProperties();

  return (
    <main>
      <section className="relative py-20 bg-cover bg-center bg-[url('/fundo.jpg')]">
        <div className="absolute inset-0  bg-opacity-40" />
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center min-h-[420px] py-12">
          <h1 className="text-4xl text-white font-bold text-center mb-8">
            Encontre o imóvel dos seus sonhos
          </h1>
          <SearchBar />
        </div>
      </section>

      {/* 3. Passamos os dados vindos do Firebase para o componente de cliente */}
      <FeaturedSection initialProperties={propertiesFromDb} />

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">
            Bairros em Destaque
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bairrosDestaque.map((bairro) => (
              <NeighborhoodCard key={bairro.name} {...bairro} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
