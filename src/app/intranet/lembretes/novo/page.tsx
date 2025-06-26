"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { Lembrete } from "@/types";
import { LembreteForm } from "@/components/intranet/LembreteForm";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import ProtectedRoute from "@/components/ProtectedRoute"; // Import do componente de proteção

export default function AdicionarLembretePage() {
  const router = useRouter();
  const [novoLembrete, setNovoLembrete] = useState<Partial<Lembrete>>({
    concluido: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!novoLembrete.titulo || !novoLembrete.data) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsLoading(true);

    try {
      const lembretesRef = collection(db, "lembretes");
      const sanitizedData = {
        ...novoLembrete,
        titulo: novoLembrete.titulo.trim(),
        data: novoLembrete.data,
        concluido: novoLembrete.concluido || false,
        criadoEm: serverTimestamp(),
      };
      await addDoc(lembretesRef, sanitizedData);
      setSuccessMessage("Lembrete salvo com sucesso!");
      setTimeout(() => {
        router.push("/intranet/lembretes");
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar lembrete:", error);
      setErrorMessage("Erro ao salvar lembrete. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

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
          Adicionar Novo Lembrete
        </h1>
        <LembreteForm
          lembrete={novoLembrete}
          setLembrete={setNovoLembrete}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          buttonText="Salvar Lembrete"
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </div>
    </ProtectedRoute>
  );
}
