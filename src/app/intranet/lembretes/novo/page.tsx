// src/app/intranet/lembretes/novo/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { Lembrete } from "@/types";
import { LembreteForm } from "@/components/intranet/LembreteForm";

export default function AdicionarLembretePage() {
  const router = useRouter();
  const [novoLembrete, setNovoLembrete] = useState<Partial<Lembrete>>({
    concluido: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando novo lembrete:", novoLembrete);
    setTimeout(() => {
      alert("Lembrete salvo com sucesso! (Simulação)");
      setIsLoading(false);
      router.push("/intranet/lembretes");
    }, 1000);
  };

  return (
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
      />
    </div>
  );
}
