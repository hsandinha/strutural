// src/app/intranet/visitas/editar/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockVisitas } from "@/lib/mockVisitas";
import { Visita } from "@/types";
import { VisitForm } from "@/components/intranet/VisitForm";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export default function EditarVisitaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [visitData, setVisitData] = useState<Partial<Visita> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const visitaEncontrada = mockVisitas.find((v) => v.id === id);
      if (visitaEncontrada) {
        setVisitData(visitaEncontrada);
      } else {
        alert("Visita não encontrada!");
        router.push("/intranet/visitas");
      }
    }
  }, [id, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando alterações para a visita:", visitData);
    setTimeout(() => {
      alert("Alterações salvas com sucesso! (Simulação)");
      setIsLoading(false);
      router.push("/intranet/visitas");
    }, 1500);
  };

  if (!visitData) {
    return (
      <div className="text-center p-10">Carregando dados da visita...</div>
    );
  }

  return (
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

      {/* Usamos o MESMO formulário, mas agora para editar */}
      <VisitForm
        visita={visitData}
        setVisita={setVisitData as any} // Usamos 'as any' para contornar um detalhe do TypeScript aqui
        onSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText="Salvar Alterações"
      />
    </div>
  );
}
