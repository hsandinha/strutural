"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Lembrete } from "@/types";
import { LembreteForm } from "@/components/intranet/LembreteForm";

import ProtectedRoute from "@/components/ProtectedRoute"; // Import do componente de proteção

export default function EditarLembretePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [lembreteData, setLembreteData] = useState<Partial<Lembrete> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchLembrete() {
      if (!id) return;

      try {
        const docRef = doc(db, "lembretes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLembreteData({
            id: docSnap.id,
            ...docSnap.data(),
          } as Partial<Lembrete>);
        } else {
          alert("Lembrete não encontrado!");
          router.push("/intranet/lembretes");
        }
      } catch (error) {
        console.error("Erro ao buscar lembrete:", error);
        alert("Erro ao carregar lembrete.");
        router.push("/intranet/lembretes");
      } finally {
        setLoadingData(false);
      }
    }

    fetchLembrete();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lembreteData || !id) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const docRef = doc(db, "lembretes", id);
      await updateDoc(docRef, lembreteData);
      setSuccessMessage("Alterações salvas com sucesso!");
      setTimeout(() => {
        router.push("/intranet/lembretes");
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar lembrete:", error);
      setErrorMessage("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="text-center p-10">Carregando dados do lembrete...</div>
    );
  }

  if (!lembreteData) {
    return null;
  }

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/intranet/lembretes"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800"
          >
            <ArrowLeftCircle size={24} /> Voltar para Lembretes
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Editar Lembrete
        </h1>
        <LembreteForm
          lembrete={lembreteData}
          setLembrete={setLembreteData as any}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          buttonText="Salvar Alterações"
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </div>
    </ProtectedRoute>
  );
}
