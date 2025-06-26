"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftCircle,
  CalendarPlus,
  Check,
  X,
  Phone,
  Search,
  FilePenLine,
  ThumbsUp,
} from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Visita } from "@/types";

import ProtectedRoute from "@/components/ProtectedRoute"; // Import do componente de proteção

type StatusVisitaFiltro = "Agendada" | "Confirmada" | "Realizada" | "Cancelada";

const StatusBadge = ({ status }: { status: Visita["status"] }) => {
  const statusClasses = {
    Agendada: "bg-blue-100 text-blue-800",
    Confirmada: "bg-green-100 text-green-800",
    Realizada: "bg-indigo-100 text-indigo-800",
    Cancelada: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
};

export default function VisitasPage() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [statusFiltro, setStatusFiltro] =
    useState<StatusVisitaFiltro>("Agendada");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVisitas() {
      try {
        const visitasRef = collection(db, "visitas");
        const snapshot = await getDocs(visitasRef);
        const listaVisitas = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Visita[];
        setVisitas(listaVisitas);
      } catch (error) {
        console.error("Erro ao buscar visitas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVisitas();
  }, []);

  const handleStatusChange = async (
    id: string,
    novoStatus: Visita["status"]
  ) => {
    try {
      const docRef = doc(db, "visitas", id);
      await updateDoc(docRef, { status: novoStatus });
      setVisitas((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: novoStatus } : v))
      );
      alert(`Visita ${id} marcada como "${novoStatus}"!`);
    } catch (error) {
      console.error("Erro ao atualizar status da visita:", error);
      alert("Erro ao atualizar status. Tente novamente.");
    }
  };

  const visitasFiltradas = useMemo(() => {
    const porStatus = visitas.filter((v) => v.status === statusFiltro);
    if (!searchQuery) return porStatus;
    const lowercasedQuery = searchQuery.toLowerCase();
    return porStatus.filter(
      (v) =>
        v.nomeCliente.toLowerCase().includes(lowercasedQuery) ||
        v.imovelTitulo.toLowerCase().includes(lowercasedQuery)
    );
  }, [visitas, statusFiltro, searchQuery]);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(data);
  };

  if (loading) {
    return <div className="text-center p-10">Carregando visitas...</div>;
  }

  return (
    <ProtectedRoute allowedProfiles={["admin", "corretor"]}>
      <div className="container mx-auto px-4 py-12">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Link
              href="/intranet/dashboard"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2"
            >
              <ArrowLeftCircle size={20} /> Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              Gerenciar Visitas
            </h1>
          </div>
          <Link
            href="/intranet/visitas/agendar"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <CalendarPlus size={20} /> Agendar Nova Visita
          </Link>
        </div>

        {/* Abas de Filtro por Status */}
        <div className="flex border-b mb-6">
          {(
            [
              "Agendada",
              "Confirmada",
              "Realizada",
              "Cancelada",
            ] as StatusVisitaFiltro[]
          ).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFiltro(status)}
              className={`py-2 px-4 text-sm font-medium ${
                statusFiltro === status
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {status}s
            </button>
          ))}
        </div>

        {/* Campo de Busca */}
        <div className="mb-6 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Buscar em visitas ${statusFiltro.toLowerCase()}s...`}
            className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg shadow-sm"
          />
        </div>

        {/* Lista de Cards de Visita */}
        <div className="space-y-4">
          {visitasFiltradas.length > 0 ? (
            visitasFiltradas.map((visita) => (
              <div
                key={visita.id}
                className="bg-white p-4 rounded-lg shadow-md border flex flex-col sm:flex-row gap-4"
              >
                <div className="w-full sm:w-32 h-32 sm:h-auto relative rounded-md overflow-hidden shrink-0">
                  <Image
                    src={visita.imovelFoto}
                    alt={visita.imovelTitulo}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-500">
                      Cód. Imóvel: {visita.imovelId}
                    </p>
                    <StatusBadge status={visita.status} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 hover:text-blue-600">
                    <Link href={`/imoveis/${visita.imovelId}`}>
                      {visita.imovelTitulo}
                    </Link>
                  </h2>
                  <p className="text-sm font-semibold text-gray-700 mt-2">
                    Cliente: {visita.nomeCliente}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone size={14} />
                    <span>{visita.telefoneCliente}</span>
                  </div>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l pl-0 sm:pl-4 pt-4 sm:pt-0 flex flex-col items-start sm:items-end justify-between shrink-0">
                  <div>
                    <p className="text-sm font-semibold">Data da Visita:</p>
                    <p className="text-lg font-bold text-blue-700">
                      {formatarData(visita.data)}h
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    {visita.status === "Agendada" && (
                      <button
                        onClick={() =>
                          handleStatusChange(visita.id, "Confirmada")
                        }
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
                        title="Confirmar Visita"
                      >
                        <ThumbsUp size={18} />
                      </button>
                    )}

                    {visita.status === "Confirmada" && (
                      <button
                        onClick={() =>
                          handleStatusChange(visita.id, "Realizada")
                        }
                        className="p-2 text-green-500 hover:bg-green-100 rounded-full"
                        title="Marcar como Realizada"
                      >
                        <Check size={18} />
                      </button>
                    )}

                    <Link
                      href={`/intranet/visitas/editar/${visita.id}`}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                      title="Editar Visita"
                    >
                      <FilePenLine size={18} />
                    </Link>

                    {visita.status !== "Cancelada" &&
                      visita.status !== "Realizada" && (
                        <button
                          onClick={() =>
                            handleStatusChange(visita.id, "Cancelada")
                          }
                          className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                          title="Cancelar Visita"
                        >
                          <X size={18} />
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              Nenhuma visita encontrada para o status "{statusFiltro}".
            </p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
