// src/app/intranet/lembretes/editar/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockLembretes } from "@/lib/mockLembretes";
import { Lembrete } from "@/types";
import { LembreteForm } from "@/components/intranet/LembreteForm";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export default function EditarLembretePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [lembreteData, setLembreteData] = useState<Partial<Lembrete> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const lembreteEncontrado = mockLembretes.find((l) => l.id === id);
      if (lembreteEncontrado) setLembreteData(lembreteEncontrado);
      else router.push("/intranet/lembretes");
    }
  }, [id, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando alterações para o lembrete:", lembreteData);
    setTimeout(() => {
      alert("Alterações salvas com sucesso! (Simulação)");
      setIsLoading(false);
      router.push("/intranet/lembretes");
    }, 1000);
  };

  if (!lembreteData) return <div>Carregando...</div>;

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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Editar Lembrete</h1>
      <LembreteForm
        lembrete={lembreteData}
        setLembrete={setLembreteData as any}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText="Salvar Alterações"
      />
    </div>
  );
}
