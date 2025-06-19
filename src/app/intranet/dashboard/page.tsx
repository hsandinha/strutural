// src/app/intranet/dashboard/page.tsx
"use client";

import {
  BarChart3,
  Home,
  Users,
  CalendarPlus,
  PlusCircle,
  Bell,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { mockLembretes } from "@/lib/mockLembretes";
import { mockImoveis } from "@/lib/mockData";

// Componente para os cards de estatísticas
const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const lembretesPendentes = mockLembretes
  .filter((l) => !l.concluido)
  .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
  .slice(0, 3);

export default function IntranetDashboardPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Cabeçalho de Boas-Vindas */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Pagina de Gerenciamento.
          </h1>
          <p className="text-gray-600 mt-1">Bem-vindo, Hebert!</p>
        </div>
        <button
          // onClick={signOutUser}
          className="flex items-center gap-2 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>

        {/* Seção de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <StatCard title="Novos Leads (Hoje)" value="12" icon={Users} />
          <StatCard title="Imóveis Ativos" value="256" icon={Home} />
          <StatCard title="Visitas Agendadas" value="8" icon={CalendarPlus} />
          <StatCard title="Vendas (Mês)" value="R$ 1.2M" icon={BarChart3} />
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal: Ações Rápidas e Atividade Recente */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ações Rápidas */}
            <div className="bg-white p-10 rounded-lg shadow-lg border">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Ações Rápidas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Link
                  href="/intranet/imoveis/novo"
                  className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <PlusCircle className="mx-auto w-10 h-10 text-blue-600 mb-2" />
                  <span className="font-semibold text-blue-800">
                    Adicionar Imóvel
                  </span>
                </Link>
                <Link
                  href="/intranet/imoveis"
                  className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Home className="mx-auto w-10 h-10 text-gray-600 mb-2" />
                  <span className="font-semibold text-gray-800">
                    Gerenciar Imóveis
                  </span>
                </Link>
                <Link
                  href="/intranet/leads"
                  className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Users className="mx-auto w-10 h-10 text-gray-600 mb-2" />
                  <span className="font-semibold text-gray-800">Ver Leads</span>
                </Link>
                <Link
                  href="/intranet/visitas"
                  className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <CalendarPlus className="mx-auto w-10 h-10 text-gray-600 mb-2" />
                  <span className="font-semibold text-gray-800">
                    Agendar Visita
                  </span>
                </Link>
              </div>
            </div>

            {/* Atividade Recente */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Atividade Recente
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center text-sm">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold mr-3 px-2.5 py-0.5 rounded-full">
                    NOVO LEAD
                  </span>
                  <span className="text-black">
                    Contato de "Maria Silva" para o imóvel Cód. 49578
                  </span>
                  <span className="ml-auto text-gray-400">agora</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-3 px-2.5 py-0.5 rounded-full">
                    VISITA
                  </span>
                  <span className="text-black">
                    Visita agendada para o imóvel no bairro Sion
                  </span>
                  <span className="ml-auto text-gray-400">há 2 horas</span>
                </li>
                <li className="flex items-center text-sm">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-3 px-2.5 py-0.5 rounded-full">
                    IMÓVEL
                  </span>
                  <span className="text-black">
                    Novo imóvel cadastrado no bairro Belvedere
                  </span>
                  <span className="ml-auto text-gray-400">ontem</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Coluna Lateral (Ex: Lembretes, etc.) */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Lembretes</h2>
              <Link
                href="/intranet/lembretes"
                className="text-sm text-blue-600 hover:underline"
              >
                Ver todos
              </Link>
            </div>
            <ul className="space-y-3">
              {lembretesPendentes.length > 0 ? (
                lembretesPendentes.map((lembrete) => (
                  <li key={lembrete.id} className="flex items-start gap-3">
                    <div className="bg-amber-100 text-amber-600 p-1.5 rounded-full mt-1">
                      <Bell size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {lembrete.titulo}
                      </p>
                      <p className="text-xs text-gray-500">
                        Vence em:{" "}
                        {new Date(lembrete.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Nenhum lembrete pendente.
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
