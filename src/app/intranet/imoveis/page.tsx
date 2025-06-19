"use client";

import { useState, useMemo } from "react";
import { mockImoveis } from "@/lib/mockData";
import { Imovel } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  FilePenLine,
  Unplug,
  PlugZap,
  AlertTriangle,
  Search,
  DollarSign,
  Send,
  ArrowLeftCircle,
} from "lucide-react";

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
  const [imoveis, setImoveis] = useState<Imovel[]>(mockImoveis);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("Ativo");
  const [imovelParaAcao, setImovelParaAcao] = useState<{
    imovel: Imovel;
    acao: "vender" | "inativar" | "reativar";
  } | null>(null);

  const confirmarAcao = () => {
    if (!imovelParaAcao) return;

    let novoStatus: Imovel["status"] = imovelParaAcao.imovel.status;
    if (imovelParaAcao.acao === "inativar") novoStatus = "Inativo";
    if (imovelParaAcao.acao === "reativar") novoStatus = "Ativo";
    if (imovelParaAcao.acao === "vender") novoStatus = "Vendido";

    setImoveis(
      imoveis.map((p) =>
        p.id === imovelParaAcao.imovel.id ? { ...p, status: novoStatus } : p
      )
    );
    setImovelParaAcao(null);
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
        imovel.id.toString().toLowerCase().includes(lowercasedQuery)
    );
  }, [imoveis, searchQuery, statusFiltro]);

  return (
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
        <Link
          href="/intranet/imoveis/novo"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          Adicionar Novo Imóvel
        </Link>
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

      <div className="mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Buscar em ${statusFiltro}s...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Foto
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Imóvel / Código
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Endereço
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Proprietário
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
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
                  <div className="text-sm text-gray-500">Cód: {imovel.id}</div>
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
                    {imovel.proprietario?.contato ? (
                      <a
                        href={`https://wa.me/${imovel.proprietario.contato}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                        title={`Conversar com ${imovel.proprietario.nome}`}
                      >
                        <Send size={20} />
                      </a>
                    ) : (
                      <span
                        className="text-gray-400"
                        title="Contato não informado"
                      >
                        <Send size={20} />
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
  );
}
