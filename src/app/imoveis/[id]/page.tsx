"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Imovel } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ScheduleVisitModal } from "@/components/ScheduleVisitModal";
import {
  Bed,
  Bath,
  Scan,
  MapPin,
  CarFront,
  Sofa,
  CheckCircle2,
  CalendarPlus,
  X,
} from "lucide-react";
import { PropertyMediaGallery } from "@/components/PropertyMediaGallery";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

const formatPrice = (price: number) => {
  if (!price || price === 0) return "A consultar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

const FeatureList = ({
  title,
  features,
}: {
  title: string;
  features?: { [key: string]: boolean | string };
}) => {
  if (!features) return null;

  const activeFeatures = Object.entries(features)
    .filter(([_, value]) => value === true)
    .map(([key]) => {
      const formatted = key.replace(/([A-Z])/g, " $1");
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    });

  if (activeFeatures.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-sm text-gray-800 mb-4">{title}</h3>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
        {activeFeatures.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const inputClass =
    "mt-1 w-full p-2 rounded-md shadow-sm border border-white focus:ring-blue-500 focus:border-blue-500 transition-colors";

  useEffect(() => {
    async function fetchImovel() {
      if (!id) return;
      try {
        const docRef = doc(db, "imoveis", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setImovel({ id: docSnap.id, ...docSnap.data() } as Imovel);
        } else {
          setImovel(null);
        }
      } catch (error) {
        console.error("Erro ao buscar imóvel:", error);
        setImovel(null);
      }
    }
    fetchImovel();
  }, [id]);

  useEffect(() => {
    if (isContactModalOpen && imovel) {
      setContactMessage(
        `Olá, tenho interesse no imóvel "${imovel.titulo}" (Cód: ${imovel.id}) e gostaria de mais informações.`
      );
    }
  }, [isContactModalOpen, imovel]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Buscar o último lead para pegar o número sequencial
      const leadsRef = collection(db, "leads");
      const q = query(leadsRef, orderBy("id", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let lastNum = 0;
      querySnapshot.forEach((doc) => {
        const idStr = doc.data().id as string; // ex: "lead-12"
        const num = parseInt(idStr.split("-")[1]);
        if (!isNaN(num) && num > lastNum) lastNum = num;
      });

      const newNum = lastNum + 1;
      const newId = `lead-${newNum}`;

      // 2. Formatar data atual como string "YYYY-MM-DD"
      const now = new Date();
      const dataCriacao = now.toISOString().split("T")[0];

      // 3. Montar o objeto para salvar
      const contatoData = {
        contato: contactEmail,
        corretorAtribuido: "Hebert",
        dataCriacao,
        id: newId,
        interesse: imovel ? imovel.titulo : "Interesse não especificado",
        nome: contactName,
        origem: "Portal Imobiliário",
        status: "Qualificado",
      };

      // 4. Salvar no Firestore com o ID customizado
      await setDoc(doc(db, "leads", newId), contatoData);

      alert("Contato salvo com sucesso!");
      // Limpar formulário e fechar modal
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMessage("");
      setIsContactModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
      alert("Erro ao salvar contato. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVisitSubmit = async (data: {
    nomeCliente: string;
    emailCliente: string;
    telefoneCliente: string;
    dataHora: string;
  }) => {
    setIsSubmitting(true);
    try {
      const visitasRef = collection(db, "visitas");
      const q = query(visitasRef, orderBy("id", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let lastNum = 0;
      querySnapshot.forEach((doc) => {
        const idStr = doc.data().id as string; // ex: "vis-12"
        const num = parseInt(idStr.split("-")[1]);
        if (!isNaN(num) && num > lastNum) lastNum = num;
      });

      const newNum = lastNum + 1;
      const newId = `vis-${newNum.toString().padStart(2, "0")}`;

      const visitaData = {
        corretorResponsavel: "Hebert",
        data: data.dataHora,
        id: newId,
        imovelFoto: imovel?.fotos?.[0] || "/imoveis/default.jpg",
        imovelId: imovel?.id || "",
        imovelTitulo: imovel?.titulo || "",
        nomeCliente: data.nomeCliente,
        status: "Confirmada",
        telefoneCliente: data.telefoneCliente,
      };

      await setDoc(doc(db, "visitas", newId), visitaData);

      alert("Visita agendada com sucesso!");
      setIsVisitModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar visita:", error);
      alert("Erro ao agendar visita. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!imovel) {
    return (
      <div className="flex items-center justify-center h-screen text-black">
        Carregando dados do imóvel...
      </div>
    );
  }

  return (
    <>
      <main className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-3">
          <PropertyMediaGallery imovel={imovel} />
          <hr className="my-0 h-px border-0 bg-gray-200" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="col-span-2 text-sm max-w-200 ">
              <div className="mb-8">
                <h2 className="text-4xl lg:text-3xl font-bold text-gray-900 py-3">
                  {imovel.titulo}
                </h2>

                <div className="flex items-center gap-2 text-gray-600 mt-0 py-0">
                  <MapPin size={20} />
                  <span>
                    {imovel.endereco.bairro}, {imovel.endereco.cidade}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-left py-7 max-w-200">
                  <div className="flex flex-col items-center">
                    <Bed size={24} className="mb-1 text-gray-600" />
                    <span className="text-sm text-black">
                      {imovel.quartos} Quartos
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Sofa size={24} className="mb-1 text-gray-600" />
                    <span className="text-sm text-black">
                      {imovel.suites} Suítes
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Bath size={24} className="mb-1 text-gray-600" />
                    <span className="text-sm text-black">
                      {imovel.banheiros} Banheiros
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CarFront size={24} className="mb-1 text-gray-600" />
                    <span className="text-sm text-black">
                      {imovel.vagas} Vagas
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Scan size={24} className="mb-1 text-gray-600" />
                    <span className="text-sm text-black">{imovel.area} m²</span>
                  </div>
                </div>

                <hr className="my-0 h-px border-0 bg-gray-200 max-w-200" />
                <div className="prose lg:prose-lg text-sm max-w-150 text-gray-700 leading-relaxed whitespace-pre-line">
                  Descrição Imovel:
                  <br />
                  <br />
                  {imovel.descricao}
                </div>
              </div>

              <FeatureList
                title="Características do Imóvel"
                features={imovel.caracteristicasImovel}
              />
              <FeatureList
                title="Características do Edifício"
                features={imovel.caracteristicasEdificio}
              />

              {imovel.caracteristicasEdificio?.tipoPortaria !== "Nenhuma" && (
                <div className="mt-4 flex items-center gap-2 text-gray-700">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>
                    Portaria: {imovel.caracteristicasEdificio.tipoPortaria}
                  </span>
                </div>
              )}
            </div>

            <div className="py-3 order-last lg:order-none">
              <div className="bg-white p-6 rounded-lg shadow-lg border sticky lg:top-24">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-sm font-semibold text-gray-500">
                    IMÓVEL
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    Cód. imóvel: {imovel.id}
                  </span>
                </div>

                <hr className="my-0 h-px border-0 bg-gray-200" />

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

                <div className="py-4 flex items-center gap-4">
                  <Image
                    src="/adhimar.png"
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

      {isContactModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
          onClick={() => setIsContactModalOpen(false)}
        >
          <div
            className="bg-black/60 rounded-xl p-8 relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X size={24} />
            </button>
            <p className="text-sm text-white mb-2 ">
              Contato sobre o imóvel - "{imovel.titulo}"
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nome"
                  className="block text-xs font-medium text-white"
                >
                  Seu nome*
                </label>
                <input
                  type="text"
                  id="nome"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-white"
                >
                  Seu email*
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="telefone"
                  className="block text-xs font-medium text-white"
                >
                  Seu telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="mensagem"
                  className="block text-xs font-medium text-white"
                >
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className={inputClass}
                />
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
        onSubmit={handleVisitSubmit}
      />
    </>
  );
}
