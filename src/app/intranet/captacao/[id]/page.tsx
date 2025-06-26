"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Endereco {
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
  cidade?: string;
}

interface Captacao {
  dadosPessoais: {
    nome: string;
    telefone?: string;
    email?: string;
  };
  finalidade?: string;
  tipo?: string;
  tipoTexto?: string;
  destinacao?: string;
  valor?: number | null;
  valorCondominio?: number | null;
  valorIptu?: number | null;
  areaInterna?: number | null;
  areaExterna?: number | null;
  areaLote?: number | null;
  andar?: string;
  quartos?: number | null;
  suites?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  aceitaPermuta?: boolean;
  aceitaFinanciamento?: boolean;
  ocupado?: boolean;
  endereco?: Endereco;
  criadoEm?: Timestamp;
}

export default function CaptacaoDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [captacao, setCaptacao] = useState<Captacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchCaptacao() {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "captacao", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCaptacao(docSnap.data() as Captacao);
        } else {
          setError("Imóvel não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar imóvel:", err);
        setError("Erro ao buscar imóvel.");
      } finally {
        setLoading(false);
      }
    }

    fetchCaptacao();
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Carregando detalhes...</div>;
  }

  if (error) {
    return (
      <ProtectedRoute allowedProfiles={["admin"]}>
        <div className="container mx-auto px-4 py-12 text-center text-red-600">
          {error}
          <div className="mt-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
            >
              <ArrowLeftCircle size={20} />
              Voltar
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/intranet/captacao"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"
        >
          <ArrowLeftCircle size={20} /> Voltar à lista de captação
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Detalhes do Imóvel: {captacao?.dadosPessoais?.nome || "Sem nome"}
        </h1>

        <section className="bg-white rounded-lg shadow p-8 space-y-8">
          {/* Dados Pessoais */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-700">
              Dados Pessoais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <p className="text-gray-900">
                  {captacao?.dadosPessoais?.nome || "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <p className="text-gray-900">
                  {captacao?.dadosPessoais?.telefone || "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">
                  {captacao?.dadosPessoais?.email || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Informações do Imóvel */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-700">
              Informações do Imóvel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Finalidade
                </label>
                <p className="text-gray-900">{captacao?.finalidade || "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <p className="text-gray-900">{captacao?.tipo || "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo Texto
                </label>
                <p className="text-gray-900">{captacao?.tipoTexto || "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destinação
                </label>
                <p className="text-gray-900">{captacao?.destinacao || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <p className="text-gray-900">
                  {captacao?.valor != null
                    ? captacao.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Condomínio
                </label>
                <p className="text-gray-900">
                  {captacao?.valorCondominio != null
                    ? captacao.valorCondominio.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor IPTU
                </label>
                <p className="text-gray-900">
                  {captacao?.valorIptu != null
                    ? captacao.valorIptu.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Andar
                </label>
                <p className="text-gray-900">{captacao?.andar || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quartos
                </label>
                <p className="text-gray-900">{captacao?.quartos ?? "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suítes
                </label>
                <p className="text-gray-900">{captacao?.suites ?? "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banheiros
                </label>
                <p className="text-gray-900">{captacao?.banheiros ?? "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vagas
                </label>
                <p className="text-gray-900">{captacao?.vagas ?? "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aceita Permuta
                </label>
                <p className="text-gray-900">
                  {captacao?.aceitaPermuta ? "Sim" : "Não"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aceita Financiamento
                </label>
                <p className="text-gray-900">
                  {captacao?.aceitaFinanciamento ? "Sim" : "Não"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ocupado
              </label>
              <p className="text-gray-900">
                {captacao?.ocupado ? "Sim" : "Não"}
              </p>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-700">
              Endereço
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <p className="text-gray-900">
                  {captacao?.endereco?.cep || "-"}
                </p>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <p className="text-gray-900">
                  {captacao?.endereco?.endereco || "-"}
                </p>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <p className="text-gray-900">
                  {captacao?.endereco?.numero || "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <p className="text-gray-900">
                  {captacao?.endereco?.bairro || "-"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento
                </label>
                <p className="text-gray-900">
                  {captacao?.endereco?.complemento || "-"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <p className="text-gray-900">
                  {captacao?.endereco?.cidade || "-"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
