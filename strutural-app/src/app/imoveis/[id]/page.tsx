// src/app/imoveis/[id]/page.tsx

import { mockImoveis } from "@/lib/mockData";
import Image from "next/image";
import { Bed, Bath, Scan, MapPin } from "lucide-react";

// Função para formatar o preço
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

// Esta função recebe os parâmetros da URL (o ID do imóvel)
export default function PropertyDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Encontra o imóvel no nosso array de dados falsos usando o ID da URL
  const imovel = mockImoveis.find((p) => p.id === params.id);

  // Se o imóvel não for encontrado, exibe uma mensagem
  if (!imovel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Imóvel não encontrado</h1>
      </div>
    );
  }

  // Se encontrou, exibe os detalhes
  return (
    <main className="bg-gray-100 min-h-screen pt-10">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-gray-900">{imovel.titulo}</h1>
        <div className="flex items-center gap-2 text-gray-600 mt-2">
          <MapPin size={20} />
          <span>
            {imovel.bairro}, {imovel.cidade}
          </span>
        </div>

        <p className="text-5xl font-extrabold text-blue-700 my-6">
          {formatPrice(imovel.preco)}
        </p>

        <div className="flex space-x-6 border-y py-4 text-lg">
          <div className="flex items-center gap-2">
            <Bed />
            <span>{imovel.quartos} Quartos</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath />
            <span>{imovel.banheiros} Banheiros</span>
          </div>
          <div className="flex items-center gap-2">
            <Scan />
            <span>{imovel.area} m²</span>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">Sobre este imóvel</h2>
          <p className="text-gray-700 leading-relaxed">{imovel.descricao}</p>
        </div>
      </div>
    </main>
  );
}
