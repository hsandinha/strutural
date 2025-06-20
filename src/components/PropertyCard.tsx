// src/components/PropertyCard.tsx
"use client";

import { useState } from "react";
import { Imovel } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Scan } from "lucide-react";

// --- Imports do Swiper ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface PropertyCardProps {
  imovel: Imovel;
}

const formatPrice = (price: number) => {
  if (!price) return "A consultar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export function PropertyCard({ imovel }: PropertyCardProps) {
  // Estado para controlar se o carrossel deve ser exibido
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group"
      // Eventos para ativar o carrossel ao passar o mouse
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-56">
        <button className="absolute top-3 right-3 z-10 bg-white/70 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
          <Heart size={20} className="text-gray-600" />
        </button>

        {isHovered && imovel.fotos.length > 1 ? (
          // --- Renderiza o CARROSSEL quando o mouse está sobre o card ---
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            className="h-full w-full"
            // Estilos customizados para os botões e paginação do Swiper
            style={
              {
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
                "--swiper-navigation-size": "15px",
              } as React.CSSProperties
            }
          >
            {imovel.fotos.map((foto, index) => (
              <SwiperSlide key={index} className="overflow-hidden">
                <Link
                  href={`/imoveis/${imovel.id}`}
                  className="block h-full w-full"
                >
                  <Image
                    src={foto}
                    alt={`Foto ${index + 1} de ${imovel.titulo}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // --- Renderiza uma IMAGEM ESTÁTICA por padrão ---
          <Link href={`/imoveis/${imovel.id}`} className="block h-full w-full">
            <Image
              src={imovel.fotos[0]}
              alt={imovel.titulo}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {imovel.titulo}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {imovel.endereco.bairro}, {imovel.endereco.cidade}
        </p>

        <div className="mt-auto">
          <p className="text-2xl font-bold text-blue-700 mb-4">
            {formatPrice(imovel.preco)}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-3">
            <span className="flex items-center gap-2">
              <Bed size={16} /> {imovel.quartos}
            </span>
            <span className="flex items-center gap-2">
              <Bath size={16} /> {imovel.banheiros}
            </span>
            <span className="flex items-center gap-2">
              <Scan size={16} /> {imovel.area} m²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
