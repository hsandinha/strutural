"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle, Edit, CalendarPlus, BellPlus } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Lead } from "@/types";

import ProtectedRoute from "@/components/ProtectedRoute"; // Import do componente de proteção

// Componente para o "badge" de status do lead
const StatusBadge = ({ status }: { status: Lead["status"] }) => {
  const statusClasses = {
    Novo: "bg-blue-100 text-blue-800",
    "Em Contato": "bg-yellow-100 text-yellow-800",
    Qualificado: "bg-green-100 text-green-800",
    Perdido: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2.5 py-1 text-sm font-semibold rounded-full ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
};

export default function LeadDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLead() {
      if (!id) return;

      try {
        const docRef = doc(db, "leads", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLead({ id: docSnap.id, ...docSnap.data() } as Lead);
        } else {
          alert("Lead não encontrado!");
          router.push("/intranet/leads");
        }
      } catch (error) {
        console.error("Erro ao buscar lead:", error);
        alert("Erro ao carregar lead.");
        router.push("/intranet/leads");
      } finally {
        setLoading(false);
      }
    }

    fetchLead();
  }, [id, router]);

  // Função para alterar o status do lead e salvar no Firestore
  const handleStatusChange = async (novoStatus: Lead["status"]) => {
    if (!lead) return;

    try {
      const docRef = doc(db, "leads", lead.id);
      await updateDoc(docRef, { status: novoStatus });
      setLead({ ...lead, status: novoStatus });
      console.log(`Status do lead ${lead.id} alterado para: ${novoStatus}`);
    } catch (error) {
      console.error("Erro ao atualizar status do lead:", error);
      alert("Erro ao atualizar status. Tente novamente.");
    }
  };

  const handleAdicionarLembrete = async () => {
    if (!lead) return;
    const textoLembrete = prompt(
      `Adicionar lembrete para o lead "${lead.nome}":`
    );
    if (textoLembrete) {
      try {
        // Supondo que você tenha uma coleção "lembretes" com campo leadId para relacionar
        await addDoc(collection(db, "lembretes"), {
          leadId: lead.id,
          texto: textoLembrete,
          criadoEm: serverTimestamp(),
          concluido: false,
        });
        alert("Lembrete salvo com sucesso!");
        // Aqui você pode atualizar a lista de lembretes se quiser mostrar na UI
      } catch (error) {
        console.error("Erro ao salvar lembrete:", error);
        alert("Erro ao salvar lembrete. Tente novamente.");
      }
    }
  };

  if (loading) {
    return <div className="text-center p-10">Carregando dados do lead...</div>;
  }

  if (!lead) {
    return null; // Ou uma mensagem de erro, se preferir
  }

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/intranet/leads"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2"
          >
            <ArrowLeftCircle size={20} /> Voltar para a Lista de Leads
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda: Informações do Lead */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {lead.nome}
                </h1>
                <p className="text-gray-500">{lead.contato}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            <hr className="my-6" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Interesse Principal
              </h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
                {lead.interesse}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-500">Origem</p>
                <p className="text-gray-800">{lead.origem}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-500">Corretor</p>
                <p className="text-gray-800">
                  {lead.corretorAtribuido || "Não atribuído"}
                </p>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Ações */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Alterar Status
              </h3>
              <div className="flex flex-col space-y-2">
                {(
                  [
                    "Novo",
                    "Em Contato",
                    "Qualificado",
                    "Perdido",
                  ] as Lead["status"][]
                ).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={lead.status === status}
                    className={`px-4 py-2 text-left rounded-md text-black transition-colors ${
                      lead.status === status
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Próximas Ações
              </h3>
              <div className="flex flex-col space-y-2">
                <Link
                  href={`/intranet/visitas/agendar?nomeCliente=${encodeURIComponent(
                    lead.nome
                  )}&telefoneCliente=${encodeURIComponent(
                    lead.contato
                  )}&imovelId=${lead.id}&returnTo=/intranet/leads/${lead.id}`}
                  className="flex items-center gap-2 text-left text-black p-2 rounded-md hover:bg-gray-100"
                >
                  <CalendarPlus size={18} /> Agendar Visita
                </Link>
                <button
                  onClick={handleAdicionarLembrete}
                  className="flex items-center gap-2 text-left text-black p-2 rounded-md hover:bg-gray-100"
                >
                  <BellPlus size={18} /> Adicionar Lembrete
                </button>
                <Link
                  href={`/intranet/leads/editar/${lead.id}`}
                  className="flex items-center gap-2 text-left text-black p-2 rounded-md hover:bg-gray-100"
                >
                  <Edit size={18} /> Editar Dados do Lead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
