// src/app/imoveis/[id]/page.tsx

import { mockImoveis } from "@/lib/mockData";
import Image from "next/image";
import { Bed, Bath, Scan, MapPin } from "lucide-react";

export async function generateStaticParams() {
  return mockImoveis.map((imovel) => ({
    id: imovel.id,
  }));
}

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
  const { id } = params;
  const imovel = mockImoveis.find((p) => p.id === id);

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
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Título e Localização */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{imovel.titulo}</h1>
          <div className="flex items-center gap-2 text-gray-600 mt-2">
            <MapPin size={20} />
            <span>
              {imovel.bairro}, {imovel.cidade}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
          {imovel.fotos.map((foto, index) => (
            <div
              key={index}
              className={`relative w-full overflow-hidden rounded-lg ${
                index === 0 ? "md:col-span-2 h-[500px]" : "h-64"
              }`}
            >
              <Image
                src={foto}
                alt={`Foto ${index + 1} do ${imovel.titulo}`}
                fill
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Detalhes e Descrição */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold mb-4 border-b pb-2">
              Sobre este imóvel
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {imovel.descricao}
            </p>
          </div>

          <div className="row-start-1 lg:row-auto">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border sticky top-10">
              <p className="text-4xl font-extrabold text-blue-700 mb-6">
                {formatPrice(imovel.preco)}
              </p>
              <div className="space-y-4 text-lg">
                <div className="flex items-center gap-3">
                  <Bed />
                  <span>{imovel.quartos} Quartos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bath />
                  <span>{imovel.banheiros} Banheiros</span>
                </div>
                <div className="flex items-center gap-3">
                  <Scan />
                  <span>{imovel.area} m²</span>
                </div>
              </div>
              <button className="w-full mt-8 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
                Entrar em contato via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
