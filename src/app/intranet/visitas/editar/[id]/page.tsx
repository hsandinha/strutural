"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { Visita } from "@/types";
import { VisitForm } from "@/components/intranet/VisitForm";

import ProtectedRoute from "@/components/ProtectedRoute"; // Import do componente de proteção

export default function EditarVisitaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [visitData, setVisitData] = useState<Partial<Visita> | null>(null);
  const [imoveis, setImoveis] = useState<
    { id: string; titulo: string; fotos?: string[] }[]
  >([]);
  const [corretores, setCorretores] = useState<{ id: string; nome: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        // Buscar visita
        const docRef = doc(db, "visitas", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setVisitData({
            id: docSnap.id,
            ...docSnap.data(),
          } as Partial<Visita>);
        } else {
          alert("Visita não encontrada!");
          router.push("/intranet/visitas");
          return;
        }

        // Buscar imóveis
        const imoveisRef = collection(db, "imoveis");
        const imoveisSnap = await getDocs(imoveisRef);
        setImoveis(
          imoveisSnap.docs
            .map((doc) => {
              const data = doc.data() as { titulo?: string; fotos?: string[] };
              if (!data.titulo) {
                console.warn(`Imóvel ${doc.id} sem título, ignorado.`);
                return null;
              }
              return {
                id: doc.id,
                titulo: data.titulo,
                fotos: data.fotos || [],
              };
            })
            .filter(
              (
                imovel
              ): imovel is { id: string; titulo: string; fotos: string[] } =>
                imovel !== null
            )
        );

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
        alert("Erro ao carregar dados. Tente novamente.");
        router.push("/intranet/visitas");
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitData || !id) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const docRef = doc(db, "visitas", id);
      await updateDoc(docRef, visitData);
      setSuccessMessage("Alterações salvas com sucesso!");
      setTimeout(() => {
        router.push("/intranet/visitas");
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar visita:", error);
      setErrorMessage("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="text-center p-10">Carregando dados da visita...</div>
    );
  }

  if (!visitData) {
    return null;
  }

  return (
    <ProtectedRoute allowedProfiles={["admin", "corretor"]}>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/intranet/visitas"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2"
          >
            <ArrowLeftCircle size={24} /> Voltar para a Agenda
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Editar Visita</h1>

        {errorMessage && (
          <p className="mb-4 text-red-600 font-semibold">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mb-4 text-green-600 font-semibold">{successMessage}</p>
        )}

        <VisitForm
          visita={visitData}
          setVisita={setVisitData as any}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          buttonText="Salvar Alterações"
          imoveis={imoveis}
          corretores={corretores}
        />
      </div>
    </ProtectedRoute>
  );
}
