// src/components/PropertyMediaGallery.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Imovel } from "@/types";
import Image from "next/image";
import {
  Camera,
  Map,
  Video,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ZoomIn,
  Layout,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface PropertyMediaGalleryProps {
  imovel: Imovel;
}

export function PropertyMediaGallery({ imovel }: PropertyMediaGalleryProps) {
  const [activeView, setActiveView] = useState<"fotos" | "mapa" | "video">(
    "fotos"
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setAutoPlay(false); // Reset autoplay on new open
    if (intervalId) clearInterval(intervalId);
  }, []);

  const closeLightbox = () => {
    setLightboxOpen(false);
    setAutoPlay(false);
    setShowGrid(false);
    if (intervalId) clearInterval(intervalId);
  };
  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % imovel.fotos.length);
  }, [imovel.fotos.length]);

  const prevImage = useCallback(() => {
    setLightboxIndex(
      (prev) => (prev - 1 + imovel.fotos.length) % imovel.fotos.length
    );
  }, [imovel.fotos.length]);

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((prev) => !prev);
  }, []);

  const toggleGrid = () => {
    setShowGrid((prev) => !prev);
  };

  useEffect(() => {
    if (autoPlay) {
      const id = setInterval(nextImage, 3000);
      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoPlay, nextImage]);

  // Adiciona listener para as setas do teclado no lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage, closeLightbox]);

  const renderContent = () => {
    switch (activeView) {
      case "fotos":
        return (
          // Galeria em grade
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[450px]">
            {/* Imagem Principal */}
            {imovel.fotos.length > 0 && (
              <div
                className="col-span-4 sm:col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(0)}
              >
                <Image
                  src={imovel.fotos?.[0]}
                  alt={`Foto principal de ${imovel.titulo}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Miniaturas */}
            {imovel.fotos.slice(1, 5).map((foto, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(index + 1)}
              >
                <Image
                  src={foto}
                  alt={`Miniatura ${index + 2}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="hover:scale-105 transition-transform duration-300"
                />
                {index === 3 && imovel.fotos.length > 5 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <p className="text-white font-bold text-lg">
                      Ver mais fotos
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case "mapa":
        return (
          <div className="h-[550px] bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              Funcionalidade de Mapa em construção.
            </p>
          </div>
        );
      case "video":
        if (!imovel.videoUrl) {
          return (
            <div className="h-[550px] bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                Vídeo indisponível para este imóvel.
              </p>
            </div>
          );
        }
        return (
          <div className="rounded-lg overflow-hidden aspect-video items-center justify-center">
            <iframe
              width="100%"
              height="100%"
              src={imovel.videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}

      <div className="flex items-center justify-center gap-2 p-2 rounded-lg max-w-xs mx-auto">
        <button
          onClick={() => setActiveView("fotos")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-colors ${
            activeView === "fotos"
              ? "bg-white text-blue-600 shadow"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Camera size={16} /> FOTOS
        </button>
        <button
          onClick={() => setActiveView("mapa")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-colors ${
            activeView === "mapa"
              ? "bg-white text-blue-600 shadow"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Map size={16} /> MAPA
        </button>
        {imovel.videoUrl && (
          <button
            onClick={() => setActiveView("video")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-colors ${
              activeView === "video"
                ? "bg-white text-blue-600 shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Video size={16} /> VÍDEO
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          {/* Header do Lightbox */}
          <div className="absolute top-6 left-6 text-white text-sm">
            Foto {lightboxIndex + 1}/{imovel.fotos.length}
          </div>
          <div className="absolute top-4 right-6 flex gap-4 z-50">
            {/* Botão de Zoom (funcionalidade pode ser adicionada posteriormente) */}
            <button className="text-white hover:opacity-75">
              <ZoomIn size={24} />
            </button>
            {/* Botão de Play/Pause */}
            <button
              onClick={toggleAutoPlay}
              className="text-white hover:opacity-75"
            >
              {autoPlay ? <Pause size={24} /> : <Play size={24} />}
            </button>
            {/* Botão de Grid */}
            <button
              onClick={toggleGrid}
              className="text-white hover:opacity-75"
            >
              <Layout size={24} />
            </button>
            {/* Botão de Fechar */}
            <button
              onClick={closeLightbox}
              className="text-white hover:opacity-75"
            >
              <X size={32} />
            </button>
          </div>

          {/* Área da Imagem Principal */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[80vh] flex-grow flex items-center justify-center"
            onClick={nextImage}
          >
            <Image
              src={imovel.fotos?.[lightboxIndex]}
              alt={`Imagem ${lightboxIndex + 1}`}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Grid de Miniaturas (Aparece quando showGrid é true) */}
          {showGrid && (
            <div className="absolute bottom-0 left-0 w-full bg-black/80 p-4 overflow-x-auto whitespace-nowrap">
              {imovel.fotos.map((foto, index) => (
                <button
                  key={index}
                  className={`inline-block w-24 h-16 mr-2 rounded-md overflow-hidden cursor-pointer opacity-60 hover:opacity-100 ${
                    lightboxIndex === index
                      ? "opacity-100 border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    setLightboxIndex(index);
                  }}
                >
                  <Image
                    src={foto}
                    alt={`Miniatura ${index + 1}`}
                    width={96}
                    height={64}
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Botões de Navegação (Laterais) */}
          {imovel.fotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-black/20 text-white p-3 rounded-full z-50 hover:bg-black/50"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-black/20 text-white p-3 rounded-full z-50 hover:bg-black/50"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
