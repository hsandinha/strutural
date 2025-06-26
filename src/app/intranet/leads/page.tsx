"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftCircle, PlusCircle } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Lead } from "@/types";

import ProtectedRoute from "@/components/ProtectedRoute"; // Import do componente de proteção

const StatusBadge = ({ status }: { status: Lead["status"] }) => {
  const statusClasses = {
    Novo: "bg-blue-100 text-blue-800",
    "Em Contato": "bg-yellow-100 text-yellow-800",
    Qualificado: "bg-green-100 text-green-800",
    Perdido: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const leadsRef = collection(db, "leads");
        const snapshot = await getDocs(leadsRef);
        const listaLeads = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[];
        setLeads(listaLeads);
      } catch (error) {
        console.error("Erro ao buscar leads:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Carregando leads...</div>;
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
              Gerenciamento de Leads
            </h1>
          </div>
          <Link
            href="/intranet/leads/novo"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            Adicionar Novo Lead
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-black">Nome</th>
                <th className="px-6 py-3 text-left text-black">Contato</th>
                <th className="px-6 py-3 text-left text-black">Interesse</th>
                <th className="px-6 py-3 text-left text-black">Status</th>
                <th className="px-6 py-3 text-left text-black">Corretor</th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4 text-black font-medium">
                    {lead.nome}
                  </td>
                  <td className="px-6 py-4 text-black">{lead.contato}</td>
                  <td className="px-6 py-4 text-black">{lead.interesse}</td>
                  <td className="px-6 py-4 text-black">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-4 text-black">
                    {lead.corretorAtribuido || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/intranet/leads/${lead.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
