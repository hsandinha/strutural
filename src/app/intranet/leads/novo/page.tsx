// src/app/intranet/leads/novo/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { Lead } from "@/types";
import { LeadForm } from "@/components/intranet/LeadForm"; // Importe o novo formulário

export default function AdicionarLeadPage() {
  const router = useRouter();
  const [novoLead, setNovoLead] = useState<Partial<Lead>>({ status: "Novo" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // ... sua lógica de simulação de salvar ...
    console.log("Salvando novo lead:", novoLead);
    setTimeout(() => {
      alert("Lead salvo com sucesso! (Simulação)");
      setIsLoading(false);
      router.push("/intranet/leads");
    }, 1500);
  };

  return (
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

      {/* Usamos nosso novo componente de formulário reutilizável */}
      <LeadForm
        lead={novoLead}
        setLead={setNovoLead}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText="Salvar Lead"
      />
    </div>
  );
}
