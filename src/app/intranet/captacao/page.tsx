"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftCircle, PlusCircle } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import ProtectedRoute from "@/components/ProtectedRoute";

interface Captacao {
  id: string;
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
  status?: string;
  criadoEm?: any;
  // adicione outros campos que quiser exibir
}

export default function CaptacaoPage() {
  const [captacoes, setCaptacoes] = useState<Captacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCaptacoes() {
      try {
        const captacaoRef = collection(db, "captacao");
        const snapshot = await getDocs(captacaoRef);
        const listaCaptacoes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Captacao[];
        setCaptacoes(listaCaptacoes);
      } catch (error) {
        console.error("Erro ao buscar captações:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCaptacoes();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-10">Carregando imóveis captados...</div>
    );
  }

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
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
              Imóveis em Captação
            </h1>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-black">Nome</th>
                <th className="px-6 py-3 text-left text-black">Telefone</th>
                <th className="px-6 py-3 text-left text-black">Email</th>
                <th className="px-6 py-3 text-left text-black">Finalidade</th>
                <th className="px-6 py-3 text-left text-black">Tipo</th>
                <th className="px-6 py-3 text-left text-black">Valor</th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {captacoes.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-black font-medium">
                    {item.dadosPessoais?.nome || "-"}
                  </td>
                  <td className="px-6 py-4 text-black">
                    {item.dadosPessoais?.telefone || "-"}
                  </td>
                  <td className="px-6 py-4 text-black">
                    {item.dadosPessoais?.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-black">
                    {item.finalidade || "-"}
                  </td>
                  <td className="px-6 py-4 text-black">{item.tipo || "-"}</td>
                  <td className="px-6 py-4 text-black">
                    {item.valor !== null && item.valor !== undefined
                      ? item.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/intranet/captacao/${item.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
              {captacoes.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    Nenhum imóvel em captação encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
