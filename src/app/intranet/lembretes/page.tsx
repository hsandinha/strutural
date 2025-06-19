// src/app/intranet/lembretes/page.tsx
"use client";

import { useState, useMemo } from "react";
import { mockLembretes } from "@/lib/mockLembretes";
import { Lembrete } from "@/types";
import Link from "next/link";
import {
  ArrowLeftCircle,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Search,
  Clock,
  FilePenLine,
} from "lucide-react";

export default function GerenciarLembretesPage() {
  const [lembretes, setLembretes] = useState<Lembrete[]>(mockLembretes);
  const [filtroConcluido, setFiltroConcluido] = useState<boolean>(false); // false = Pendentes, true = Concluídos
  const [searchQuery, setSearchQuery] = useState("");

  const toggleConcluido = (id: string) => {
    setLembretes(
      lembretes.map((l) =>
        l.id === id ? { ...l, concluido: !l.concluido } : l
      )
    );
  };

  const deletarLembrete = (id: string) => {
    setLembretes(lembretes.filter((l) => l.id !== id));
  };

  const lembretesFiltrados = useMemo(() => {
    const porStatus = lembretes.filter(
      (lembrete) => lembrete.concluido === filtroConcluido
    );
    if (!searchQuery) return porStatus;
    const lowercasedQuery = searchQuery.toLowerCase();
    return porStatus.filter((lembrete) =>
      lembrete.titulo.toLowerCase().includes(lowercasedQuery)
    );
  }, [lembretes, filtroConcluido, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href="/intranet/dashboard"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2"
          >
            <ArrowLeftCircle size={20} /> Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            Gerenciar Lembretes
          </h1>
        </div>

        <Link
          href="/intranet/lembretes/novo"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} /> Adicionar Lembrete
        </Link>
      </div>

      <div className="flex border-b mb-6">
        <button
          onClick={() => setFiltroConcluido(false)}
          className={`py-2 px-4 text-sm font-medium ${
            !filtroConcluido
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFiltroConcluido(true)}
          className={`py-2 px-4 text-sm font-medium ${
            filtroConcluido
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Concluídos
        </button>
      </div>

      <div className="mb-6 relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar em lembretes..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {lembretesFiltrados.length > 0 ? (
          lembretesFiltrados.map((lembrete) => (
            <div
              key={lembrete.id}
              className={`p-4 rounded-md flex items-center gap-4 ${
                lembrete.concluido ? "bg-gray-100" : "bg-white border"
              }`}
            >
              <div className="flex-grow">
                <p
                  className={`font-medium ${
                    lembrete.concluido
                      ? "text-gray-500 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {lembrete.titulo}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <Clock size={14} /> Vence em:{" "}
                  {new Date(lembrete.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/intranet/lembretes/editar/${lembrete.id}`}
                  className="p-2 text-gray-400 hover:text-blue-600"
                  title="Editar Lembrete"
                >
                  <FilePenLine size={20} />
                </Link>
                <button
                  onClick={() => toggleConcluido(lembrete.id)}
                  className={`p-2 rounded-full ${
                    lembrete.concluido
                      ? "text-green-500"
                      : "text-gray-400 hover:text-green-500"
                  }`}
                  title={
                    lembrete.concluido
                      ? "Marcar como pendente"
                      : "Marcar como concluído"
                  }
                >
                  <CheckCircle2 size={22} />
                </button>
                <button
                  onClick={() => deletarLembrete(lembrete.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full"
                  title="Excluir lembrete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhum lembrete encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
