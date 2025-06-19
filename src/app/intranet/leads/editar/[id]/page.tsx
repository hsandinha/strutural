// src/app/intranet/leads/editar/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockLeads } from "@/lib/mockLeads";
import { Lead } from "@/types";
import { LeadForm } from "@/components/intranet/LeadForm"; // Importe o novo formulário
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export default function EditarLeadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [leadData, setLeadData] = useState<Partial<Lead> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const leadEncontrado = mockLeads.find((l) => l.id === id);
      setLeadData(leadEncontrado || null);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando alterações para o lead:", leadData);
    setTimeout(() => {
      alert("Alterações salvas com sucesso! (Simulação)");
      setIsLoading(false);
      router.push("/intranet/leads");
    }, 1500);
  };

  if (!leadData) {
    return <div className="text-center p-10">Carregando dados do lead...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href={`/intranet/leads/${id}`}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2"
        >
          <ArrowLeftCircle size={24} /> Voltar para os Detalhes do Lead
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Editar Lead: <span className="font-normal">{leadData.nome}</span>
      </h1>

      <LeadForm
        lead={leadData}
        setLead={setLeadData as any}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText="Salvar Alterações"
      />
    </div>
  );
}
