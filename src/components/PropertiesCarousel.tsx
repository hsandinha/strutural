// src/components/PropertiesCarousel.tsx

"use client";

import { Imovel } from "@/types";
import { PropertyCard } from "./PropertyCard";

// Importando componentes e módulos do Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Importando os estilos do Swiper (MUITO IMPORTANTE)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface PropertiesCarouselProps {
  properties: Imovel[];
}

export function PropertiesCarousel({ properties }: PropertiesCarouselProps) {
  // Se não houver imóveis para mostrar, exibe uma mensagem
  if (properties.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Nenhum imóvel encontrado para este filtro.
      </div>
    );
  }

  return (
    <div className="relative w-full pb-8 overflow-visible">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation // Habilita as setas de navegação
        pagination={{ clickable: true }}
        breakpoints={{
          // 2 cards para telas médias
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // 4 cards para telas grandes, como no print
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {properties.map((imovel) => (
          <SwiperSlide key={imovel.id}>
            <PropertyCard imovel={imovel} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
