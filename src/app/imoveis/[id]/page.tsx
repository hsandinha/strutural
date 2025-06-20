// src/app/imoveis/[id]/page.tsx
"use client";

// --- Imports Essenciais ---
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { mockImoveis } from "@/lib/mockData";
import { Imovel } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ScheduleVisitModal } from "@/components/ScheduleVisitModal";
// --- Imports de Ícones ---
import {
  Bed,
  Bath,
  Scan,
  MapPin,
  CarFront,
  Sofa,
  CheckCircle2,
  CalendarPlus,
  MessageSquare,
  Mail,
  X,
  ArrowLeftCircle,
} from "lucide-react";

// --- Import do Novo Componente de Galeria ---
// (Vamos criar este componente no próximo passo)
import { PropertyMediaGallery } from "@/components/PropertyMediaGallery";

// --- Componentes Auxiliares ---

// Função para formatar números como moeda brasileira
const formatPrice = (price: number) => {
  if (!price || price === 0) return "A consultar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

// Componente para renderizar uma lista de características
const FeatureList = ({
  title,
  features,
}: {
  title: string;
  features?: { [key: string]: boolean | string };
}) => {
  if (!features) return null;

  // Filtra apenas as características que estão marcadas como 'true'
  const activeFeatures = Object.entries(features)
    .filter(([key, value]) => value === true)
    .map(([key]) => {
      // Formata a chave para um texto legível (ex: 'aceitaPermuta' -> 'Aceita Permuta')
      const formatted = key.replace(/([A-Z])/g, " $1");
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    });

  if (activeFeatures.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-sm  text-gray-800 mb-4">{title}</h3>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
        {activeFeatures.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm  text-gray-700"
          >
            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Componente Principal da Página de Detalhes ---
export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  // Estado para guardar o imóvel encontrado
  const [imovel, setImovel] = useState<Imovel | null>(null);
  // Estado para controlar o modal de contato
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Efeito para buscar o imóvel quando a página carrega
  useEffect(() => {
    if (id) {
      const imovelEncontrado = mockImoveis.find((p) => p.id === id);
      setImovel(imovelEncontrado || null);
    }
  }, [id]);

  // Efeito para preencher a mensagem padrão quando o modal abre
  useEffect(() => {
    if (isContactModalOpen && imovel) {
      setContactMessage(
        `Olá, tenho interesse no imóvel "${imovel.titulo}" (Cód: ${imovel.id}) e gostaria de mais informações.`
      );
    }
  }, [isContactModalOpen, imovel]);

  const handleContactSubmit = (e: React.FormEvent) => {
    // 1. Previne o recarregamento padrão da página
    e.preventDefault();
    setIsSubmitting(true);
  };

  const leadData = {
    nome: contactName,
    email: contactEmail,
    telefone: contactPhone,
    mensagem: contactMessage,
    imovelDeInteresse: {
      id: imovel?.id,
      titulo: imovel?.titulo,
    },
  };

  // Enquanto os dados do imóvel não são carregados, exibe uma mensagem
  if (!imovel) {
    return (
      <div className="flex items-center justify-center h-screen">
        Carregando dados do imóvel...
      </div>
    );
  }

  // --- RENDERIZAÇÃO DO JSX ---
  return (
    <>
      <main className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-3">
          {/* Componente da Galeria de Mídia */}
          <PropertyMediaGallery imovel={imovel} />
          <hr className="my-0 h-px border-0 bg-gray-200" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* Coluna Principal (Esquerda) */}
            <div className="col-span-2 text-sm max-w-200 ">
              <div className="mb-8">
                {/* Título*/}
                <h2 className="text-4xl lg:text-3xl font-bold text-gray-900 py-3">
                  {imovel.titulo}
                </h2>

                {/* endereço*/}
                <div className="flex items-center gap-2 text-gray-600 mt-0 py-0">
                  <MapPin size={20} />
                  <span>
                    {imovel.endereco.bairro}, {imovel.endereco.cidade}
                  </span>
                </div>

                {/* icones*/}
                <div className="grid grid-cols-5 gap-2 text-left py-7 max-w-200">
                  <div className="flex flex-col items-center">
                    <Bed size={24} className="mb-1 text-gray-600" />{" "}
                    <span className="text-sm text-black">
                      {imovel.quartos} Quartos
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Sofa size={24} className="mb-1 text-gray-600" />{" "}
                    <span className="text-sm text-black ">
                      {imovel.suites} Suítes
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Bath size={24} className="mb-1 text-gray-600" />{" "}
                    <span className="text-sm text-black">
                      {imovel.banheiros} Banheiros
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CarFront size={24} className="mb-1 text-gray-600" />{" "}
                    <span className="text-sm text-black">
                      {imovel.vagas} Vagas
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Scan size={24} className="mb-1 text-gray-600" />{" "}
                    <span className="text-sm text-black">{imovel.area} m²</span>
                  </div>
                </div>

                <hr className="my-0 h-px border-0 bg-gray-200 max-w-200" />
                <div className="prose lg:prose-lg  text-sm max-w-150 text-gray-700 leading-relaxed whitespace-pre-line">
                  Descrição Imovel:<br></br>
                  <br></br>
                  {imovel.descricao}
                </div>
              </div>
              <h6>
                <FeatureList
                  title="Características do Imóvel"
                  features={imovel.caracteristicasImovel}
                />
              </h6>
              <FeatureList
                title="Características do Edifício"
                features={imovel.caracteristicasEdificio}
              />
              {imovel.caracteristicasEdificio.tipoPortaria !== "Nenhuma" && (
                <div className="mt-4 flex items-center gap-2 text-gray-700">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>
                    Portaria: {imovel.caracteristicasEdificio.tipoPortaria}
                  </span>
                </div>
              )}
            </div>

            {/* Coluna Lateral (Direita) com o novo Card de Ação */}
            <div className="row-start-1 lg:row-auto py-3">
              <div className="bg-white p-6 rounded-lg shadow-lg border sticky top-24">
                {/* Cabeçalho do Card */}
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-sm font-semibold text-gray-500">
                    IMÓVEL
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    Cód. imóvel: {imovel.id}
                  </span>
                </div>

                <hr className="my-0 h-px border-0 bg-gray-200" />

                {/* Seção de Valores */}
                <div className="py-4 border-b">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-gray-600">VALOR</span>
                    <span className="text-1xl font-bold text-red-600">
                      {formatPrice(imovel.preco)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-gray-500">
                    <span>Condomínio</span>
                    <span>{formatPrice(imovel.valorCondominio)}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-gray-500">
                    <span>IPTU</span>
                    <span>{formatPrice(imovel.valorIptu)}</span>
                  </div>
                </div>
                <hr className="my-0 h-px border-0 bg-gray-200" />
                {/* Seção do Corretor */}
                <div className="py-4 flex items-center gap-4">
                  <Image
                    src="/Adhimar.png" // Foto de exemplo
                    alt="Foto do Corretor"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-800">Adhimar Chagas</p>
                    <p className="text-sm text-gray-600">(31) 99417-8066</p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full text-center py-3 px-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition-colors"
                  >
                    TENHO INTERESSE
                  </button>
                  <button
                    onClick={() => setIsVisitModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 font-bold py-3 rounded-lg border-2 border-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <CalendarPlus size={20} />
                    AGENDAR UMA VISITA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Contato (pop-up) */}
      {isContactModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
          onClick={() => setIsContactModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-8 relative w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2">Contatar sobre o imóvel</h2>
            <p className="text-sm text-gray-600 mb-6">"{imovel.titulo}"</p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-gray-700"
                >
                  Seu nome*
                </label>
                <input
                  type="text"
                  id="nome"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Seu email*
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="telefone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Seu telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="mensagem"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>
        </div>
      )}
      <ScheduleVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        propertyTitle={imovel.titulo}
      />
    </>
  );
}
