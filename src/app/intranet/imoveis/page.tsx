// src/app/intranet/imoveis/page.tsx (ou o caminho onde está GerenciarImoveisPage)

"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { WhatsappLogo } from "@phosphor-icons/react";
import {
  PlusCircle,
  FilePenLine,
  Unplug,
  PlugZap,
  AlertTriangle,
  Search,
  DollarSign,
  ArrowLeftCircle,
  Printer, // <-- Importe o ícone Printer aqui
} from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Imovel } from "@/types";

import ProtectedRoute from "@/components/ProtectedRoute";

type StatusFiltro = "Ativo" | "Inativo" | "Vendido";

const StatusBadge = ({ status }: { status: Imovel["status"] }) => {
  const statusClasses = {
    Ativo: "bg-green-100 text-green-800",
    Vendido: "bg-indigo-100 text-indigo-800",
    Inativo: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
};

export default function GerenciarImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Ativo");
  const [imovelParaAcao, setImovelParaAcao] = useState<{
    imovel: Imovel;
    acao: "vender" | "inativar" | "reativar";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchImoveis() {
      setLoading(true);
      try {
        const imoveisRef = collection(db, "imoveis");
        const snapshot = await getDocs(imoveisRef);
        const listaImoveis = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Imovel[];
        setImoveis(listaImoveis);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImoveis();
  }, []);

  const confirmarAcao = async () => {
    if (!imovelParaAcao) return;

    const { imovel, acao } = imovelParaAcao;

    let novoStatus: Imovel["status"] = imovel.status;
    if (acao === "inativar") novoStatus = "Inativo";
    if (acao === "reativar") novoStatus = "Ativo";
    if (acao === "vender") novoStatus = "Vendido";

    try {
      const docRef = doc(db, "imoveis", imovel.id);
      await updateDoc(docRef, { status: novoStatus });

      setImoveis((prev) =>
        prev.map((p) => (p.id === imovel.id ? { ...p, status: novoStatus } : p))
      );
      setImovelParaAcao(null);
    } catch (error) {
      console.error("Erro ao atualizar status do imóvel:", error);
      alert("Erro ao atualizar status. Tente novamente.");
    }
  };

  const imoveisFiltrados = useMemo(() => {
    const porStatus = imoveis.filter(
      (imovel) => imovel.status === statusFiltro
    );
    if (!searchQuery) {
      return porStatus;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return porStatus.filter(
      (imovel) =>
        imovel.titulo.toLowerCase().includes(lowercasedQuery) ||
        imovel.id.toLowerCase().includes(lowercasedQuery)
    );
  }, [imoveis, searchQuery, statusFiltro]);

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <Link
              href="/intranet/dashboard"
              className="text-gray-400 hover:text-gray-700 transition-colors"
              title="Voltar ao Dashboard"
            >
              <ArrowLeftCircle size={28} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              Gerenciar Imóveis
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {imoveisFiltrados.length} imóveis encontrados
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/intranet/imoveis/novo"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={20} />
              Adicionar Novo Imóvel
            </Link>
          </div>
        </div>

        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Pesquisar por título ou código do imóvel..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          {(["Ativo", "Inativo", "Vendido"] as StatusFiltro[]).map((status) => (
            <button
              key={status}
              onClick={() => {
                setSearchQuery("");
                setStatusFiltro(status);
              }}
              className={`py-2 px-4 text-sm font-medium focus:outline-none ${
                statusFiltro === status
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
              }`}
            >
              {status}s
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Carregando imóveis...
          </p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imóvel / Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proprietário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {imoveisFiltrados.map((imovel) => (
                  <tr key={imovel.id}>
                    <td className="px-6 py-4">
                      {imovel.fotos && imovel.fotos.length > 0 ? (
                        <Image
                          src={imovel.fotos[0]}
                          alt={imovel.titulo}
                          width={80}
                          height={64}
                          className="w-20 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-20 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                          Sem foto
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {imovel.titulo}
                      </div>
                      <div className="text-sm text-gray-500">
                        Cód: {imovel.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {imovel.endereco ? (
                        <>
                          {imovel.endereco.rua}, {imovel.endereco.numero}
                          {imovel.endereco.complemento
                            ? ` - ${imovel.endereco.complemento}`
                            : ""}
                          , {imovel.endereco.bairro}
                        </>
                      ) : (
                        <span className="text-gray-400">
                          Endereço não informado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {imovel.proprietario ? (
                        imovel.proprietario.nome
                      ) : (
                        <span className="text-gray-400">
                          Proprietário não informado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={imovel.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        {/* NOVO BOTÃO DE IMPRIMIR AQUI */}
                        <Link
                          href={`/imprimir-imovel/${imovel.id}`}
                          target="_blank" // Abre em uma nova aba
                          className="text-gray-500 hover:text-purple-600"
                          title="Imprimir Detalhes do Imóvel"
                        >
                          <Printer size={20} />
                        </Link>
                        {imovel.proprietario?.contato ? (
                          <a
                            href={`https://wa.me/${imovel.proprietario.contato}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800"
                            title={`Conversar com ${imovel.proprietario.nome}`}
                          >
                            <WhatsappLogo size={20} />
                          </a>
                        ) : (
                          <span
                            className="text-gray-400"
                            title="Contato não informado"
                          >
                            <WhatsappLogo size={20} />
                          </span>
                        )}
                        <Link
                          href={`/intranet/imoveis/editar/${imovel.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar Imóvel"
                        >
                          <FilePenLine size={20} />
                        </Link>
                        {imovel.status === "Ativo" ? (
                          <>
                            <button
                              onClick={() =>
                                setImovelParaAcao({ imovel, acao: "vender" })
                              }
                              className="text-gray-500 hover:text-indigo-600"
                              title="Marcar como Vendido"
                            >
                              <DollarSign size={20} />
                            </button>
                            <button
                              onClick={() =>
                                setImovelParaAcao({ imovel, acao: "inativar" })
                              }
                              className="text-gray-500 hover:text-red-600"
                              title="Inativar Imóvel"
                            >
                              <Unplug size={20} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              setImovelParaAcao({ imovel, acao: "reativar" })
                            }
                            className="text-gray-500 hover:text-green-600"
                            title="Reativar Imóvel"
                          >
                            <PlugZap size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {imovelParaAcao && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
              <AlertTriangle
                className={`mx-auto h-12 w-12 ${
                  imovelParaAcao.acao === "inativar"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Deseja confirmar a ação?
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                O imóvel "{imovelParaAcao.imovel.titulo}" será marcado como '
                {imovelParaAcao.acao === "inativar"
                  ? "Inativo"
                  : imovelParaAcao.acao === "reativar"
                  ? "Ativo"
                  : "Vendido"}
                '.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setImovelParaAcao(null)}
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarAcao}
                  type="button"
                  className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    imovelParaAcao.acao === "inativar"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Sim, {imovelParaAcao.acao}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
