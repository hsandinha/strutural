"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { Lead } from "@/types";
import { LeadForm } from "@/components/intranet/LeadForm";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

import ProtectedRoute from "@/components/ProtectedRoute"; // Import do componente de proteção

export default function AdicionarLeadPage() {
  const router = useRouter();
  const [novoLead, setNovoLead] = useState<Partial<Lead>>({ status: "Novo" });
  const [isLoading, setIsLoading] = useState(false);
  const [corretores, setCorretores] = useState<{ id: string; nome: string }[]>(
    []
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Buscar corretores para o select
  useEffect(() => {
    async function fetchCorretores() {
      try {
        const corretoresRef = collection(db, "corretores");
        const snapshot = await getDocs(corretoresRef);
        const listaCorretores = snapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
        }));
        setCorretores(listaCorretores);
      } catch (error) {
        console.error("Erro ao buscar corretores:", error);
      }
    }
    fetchCorretores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !novoLead?.nome ||
      !novoLead?.contato ||
      !novoLead?.origem ||
      !novoLead?.status
    ) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsLoading(true);

    try {
      const leadsRef = collection(db, "leads");
      const sanitizedData = {
        ...novoLead,
        nome: novoLead.nome.trim(),
        contato: novoLead.contato.trim(),
        origem: novoLead.origem.trim(),
        status: novoLead.status.trim(),
        interesse: novoLead.interesse?.trim() || "",
        corretorAtribuido: novoLead.corretorAtribuido?.trim() || "",
        criadoEm: new Date(),
      };
      await addDoc(leadsRef, sanitizedData);
      setSuccessMessage("Lead salvo com sucesso!");
      setTimeout(() => {
        router.push("/intranet/leads");
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      setErrorMessage("Erro ao salvar lead. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/intranet/leads"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2"
          >
            <ArrowLeftCircle size={24} /> Voltar para a lista de leads
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Adicionar Novo Lead
        </h1>

        <LeadForm
          lead={novoLead}
          setLead={setNovoLead}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          buttonText="Salvar Lead"
          corretores={corretores}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </div>
    </ProtectedRoute>
  );
}
