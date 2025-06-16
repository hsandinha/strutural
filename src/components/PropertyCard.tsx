// src/components/PropertyCard.tsx

import { Imovel } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Scan } from "lucide-react";

// Definimos as propriedades que o nosso componente vai receber
interface PropertyCardProps {
  imovel: Imovel;
}

// Função para formatar o preço como moeda brasileira
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export function PropertyCard({ imovel }: PropertyCardProps) {
  return (
    // O card inteiro é um link para a página de detalhes do imóvel
    <Link href={`/imoveis/${imovel.id}`} className="block h-full">
      <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group h-full flex flex-col">
        {/* Imagem do Imóvel */}
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={imovel.fotos[0]} // Usamos a primeira foto do array
            alt={`Foto do imóvel ${imovel.titulo}`}
            fill // Preenche o container
            style={{ objectFit: "cover" }} // Garante que a imagem cubra o espaço sem distorcer
            className="transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Conteúdo do Card */}
        <div className="p-4 bg-white flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {imovel.titulo}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {imovel.bairro}, {imovel.cidade}
          </p>
          <p className="text-2xl font-extrabold text-blue-600 my-4">
            {formatPrice(imovel.preco)}
          </p>

          {/* Detalhes com Ícones (usando mt-auto para empurrar para o final) */}
          <div className="flex justify-around items-center border-t pt-3 text-sm text-gray-700 mt-auto">
            <div className="flex items-center gap-2">
              <Bed size={18} />
              <span>{imovel.quartos}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath size={18} />
              <span>{imovel.banheiros}</span>
            </div>
            <div className="flex items-center gap-2">
              <Scan size={18} />
              <span>{imovel.area} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
