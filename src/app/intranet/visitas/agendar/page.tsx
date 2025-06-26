"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { Visita } from "@/types";
import { VisitForm } from "@/components/intranet/VisitForm";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, getDoc, doc, getDocs } from "firebase/firestore";

function AgendarVisitaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [novaVisita, setNovaVisita] = useState<Partial<Visita>>({
    status: "Agendada",
  });
  const [imoveis, setImoveis] = useState<{ id: string; titulo: string }[]>([]);
  const [corretores, setCorretores] = useState<{ id: string; nome: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const returnTo = searchParams.get("returnTo") || "/intranet/visitas";

  useEffect(() => {
    const nomeCliente = searchParams.get("nomeCliente");
    const telefoneCliente = searchParams.get("telefoneCliente");
    const imovelId = searchParams.get("imovelId");

    const initialStateFromUrl: Partial<Visita> = {};
    if (nomeCliente) initialStateFromUrl.nomeCliente = nomeCliente;
    if (telefoneCliente) initialStateFromUrl.telefoneCliente = telefoneCliente;
    if (imovelId) initialStateFromUrl.imovelId = imovelId;

    if (Object.keys(initialStateFromUrl).length > 0) {
      setNovaVisita((prev) => ({ ...prev, ...initialStateFromUrl }));
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar imóveis
        const imoveisRef = collection(db, "imoveis");
        const imoveisSnap = await getDocs(imoveisRef);
        const imoveisData = imoveisSnap.docs
          .map((doc) => {
            const data = doc.data() as { titulo?: string };
            if (!data.titulo) return null;
            return { id: doc.id, titulo: data.titulo };
          })
          .filter(
            (imovel): imovel is { id: string; titulo: string } =>
              imovel !== null
          );
        setImoveis(imoveisData);

        // Buscar corretores
        const corretoresRef = collection(db, "users");
        const corretoresSnap = await getDocs(corretoresRef);
        const corretoresData = corretoresSnap.docs
          .map((doc) => {
            const data = doc.data() as { nome?: string; perfil?: string };
            if (data.perfil === "corretor" && data.nome) {
              return { id: doc.id, nome: data.nome };
            }
            return null;
          })
          .filter(
            (corretor): corretor is { id: string; nome: string } =>
              corretor !== null
          );
        setCorretores(corretoresData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErrorMessage("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (!novaVisita.imovelId) {
        setErrorMessage("Por favor, selecione um imóvel.");
        setIsLoading(false);
        return;
      }

      // Buscar imóvel no Firestore pelo ID
      const imovelDocRef = doc(db, "imoveis", novaVisita.imovelId);
      const imovelDocSnap = await getDoc(imovelDocRef);

      if (!imovelDocSnap.exists()) {
        setErrorMessage("Imóvel selecionado não encontrado.");
        setIsLoading(false);
        return;
      }

      const imovelData = imovelDocSnap.data();

      // Preparar dados completos para salvar
      const dadosCompletosParaSalvar = {
        ...novaVisita,
        imovelTitulo: imovelData.titulo || "Título não encontrado",
        imovelFoto:
          (imovelData.fotos && imovelData.fotos[0]) ||
          "/imovel-placeholder.png",
        status: novaVisita.status || "Agendada",
        criadoEm: new Date(),
      };

      // Salvar no Firestore
      const visitasRef = collection(db, "visitas");
      await addDoc(visitasRef, dadosCompletosParaSalvar);

      alert("Visita agendada com sucesso!");
      router.push(returnTo);
    } catch (error) {
      console.error("Erro ao agendar visita:", error);
      setErrorMessage("Erro ao agendar visita. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="text-center p-10">
        Carregando dados para agendamento...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href={returnTo}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftCircle size={24} />
          {returnTo.includes("/leads/")
            ? "Voltar para o Lead"
            : "Voltar para a Agenda"}
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Agendar Nova Visita
      </h1>

      {errorMessage && (
        <p className="mb-4 text-red-600 font-semibold">{errorMessage}</p>
      )}

      <VisitForm
        visita={novaVisita}
        setVisita={setNovaVisita}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText="Confirmar Agendamento"
        imoveis={imoveis}
        corretores={corretores}
      />
    </div>
  );
}
export default function AgendarVisitaPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Carregando...</div>}>
      <AgendarVisitaPageContent />
    </Suspense>
  );
}
