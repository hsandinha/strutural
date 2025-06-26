"use client";

import {
  BarChart3,
  Home,
  Users,
  CalendarPlus,
  Bell,
  LogOut,
  PlusCircle,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

type Lembrete = {
  id: string;
  titulo: string;
  data: any;
  concluido: boolean;
};

type Visita = {
  id: string;
  titulo?: string;
  data: any;
  endereco?: {
    rua: string;
    numero: string | number;
  };
  status?: string;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  className,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  className?: string;
}) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 ${className}`}
  >
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

const ImoveisStatusCard = ({
  ativos,
  inativos,
  vendidos,
  icon: Icon,
  className,
}: {
  ativos: number;
  inativos: number;
  vendidos: number;
  icon: React.ElementType;
  className?: string;
}) => (
  <div
    className={`bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full ${className}`}
  >
    <div className="flex items-center mb-4">
      <Icon className="w-6 h-6 text-gray-500 mr-2" />
      <p className="text-sm font-medium text-gray-500">Imóveis</p>
    </div>
    <div className="flex justify-between text-gray-800 font-semibold text-lg">
      <div className="flex flex-col items-center">
        <span className="text-green-600">{ativos}</span>
        <span className="text-sm text-gray-500">Ativos</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-gray-600">{inativos}</span>
        <span className="text-sm text-gray-500">Inativos</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-indigo-600">{vendidos}</span>
        <span className="text-sm text-gray-500">Vendidos</span>
      </div>
    </div>
  </div>
);

export default function IntranetDashboardPage() {
  // Estados para estatísticas
  const [novosLeadsHoje, setNovosLeadsHoje] = useState<number>(0);
  const [imoveisAtivosCount, setImoveisAtivosCount] = useState<number>(0);
  const [imoveisInativosCount, setImoveisInativosCount] = useState<number>(0);
  const [imoveisVendidosCount, setImoveisVendidosCount] = useState<number>(0);
  const [visitasAgendadasCount, setVisitasAgendadasCount] = useState<number>(0);
  const [vendasMes, setVendasMes] = useState<number>(0);

  // Estados para listas laterais
  const [lembretesPendentes, setLembretesPendentes] = useState<Lembrete[]>([]);
  const [visitasFuturas, setVisitasFuturas] = useState<Visita[]>([]);

  // Estado para nome do usuário e loading
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Verifica autenticação e busca nome do usuário
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setNomeUsuario(userDoc.data().nome || "");
        } else {
          setNomeUsuario("");
        }
        setLoading(false);
      } else {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Busca todas as estatísticas e listas
  useEffect(() => {
    async function fetchStats() {
      try {
        // Data de hoje formatada "YYYY-MM-DD"
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const dia = String(hoje.getDate()).padStart(2, "0");
        const dataHojeStr = `${ano}-${mes}-${dia}`;

        // 1. Contagem imóveis por status
        const imoveisRef = collection(db, "imoveis");

        const ativosQuery = query(imoveisRef, where("status", "==", "Ativo"));
        const ativosSnapshot = await getDocs(ativosQuery);
        setImoveisAtivosCount(ativosSnapshot.size);

        const inativosQuery = query(
          imoveisRef,
          where("status", "==", "Inativo")
        );
        const inativosSnapshot = await getDocs(inativosQuery);
        setImoveisInativosCount(inativosSnapshot.size);

        const vendidosQuery = query(
          imoveisRef,
          where("status", "==", "Vendido")
        );
        const vendidosSnapshot = await getDocs(vendidosQuery);
        setImoveisVendidosCount(vendidosSnapshot.size);

        // 2. Novos Leads hoje (campo dataCriacao string)
        const leadsRef = collection(db, "leads");
        const leadsQuery = query(
          leadsRef,
          where("dataCriacao", "==", dataHojeStr)
        );
        const leadsSnapshot = await getDocs(leadsQuery);
        setNovosLeadsHoje(leadsSnapshot.size);

        // 3. Visitas futuras (campo data string)
        const visitasRef = collection(db, "visitas");
        const visitasSnapshot = await getDocs(visitasRef);
        const visitasFuturasList = visitasSnapshot.docs
          .map(
            (doc): Visita => ({
              id: doc.id,
              ...(doc.data() as Omit<Visita, "id">),
            })
          )
          .filter((visita) => visita.data >= dataHojeStr)
          .sort((a, b) => (a.data > b.data ? 1 : -1));
        setVisitasFuturas(visitasFuturasList);
        setVisitasAgendadasCount(visitasFuturasList.length);

        // 4. Vendas do mês (exemplo simples, ajustar conforme seu modelo)
        setVendasMes(0);

        // 5. Lembretes pendentes
        const lembretesRef = collection(db, "lembretes");
        const lembretesQuery = query(
          lembretesRef,
          where("concluido", "==", false),
          orderBy("data", "asc")
        );
        const lembretesSnapshot = await getDocs(lembretesQuery);
        const lembretes = lembretesSnapshot.docs.map(
          (doc): Lembrete => ({
            id: doc.id,
            ...(doc.data() as Omit<Lembrete, "id">),
          })
        );
        setLembretesPendentes(lembretes);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    }

    fetchStats();
  }, []);

  // Logout
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Erro ao sair. Tente novamente.");
    }
  };

  if (loading) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  return (
    <ProtectedRoute allowedProfiles={["admin"]}>
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Página de Gerenciamento.
              </h1>
              <p className="text-gray-600 mt-1">Bem-vindo, {nomeUsuario}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mt-8">
            <StatCard
              title="Novos Leads (Hoje)"
              value={novosLeadsHoje}
              icon={Users}
            />

            <StatCard
              title="Visitas Agendadas"
              value={visitasAgendadasCount}
              icon={CalendarPlus}
            />
            <StatCard
              title="Vendas (Mês)"
              value={vendasMes.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
              icon={BarChart3}
            />
            <ImoveisStatusCard
              ativos={imoveisAtivosCount}
              inativos={imoveisInativosCount}
              vendidos={imoveisVendidosCount}
              icon={Home}
            />

            {/* Lembretes maior, ocupando 2 colunas no lg */}
            <div className="bg-white p-8 rounded-lg shadow-md border lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Lembretes</h2>
                <Link
                  href="/intranet/lembretes"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver todos
                </Link>
              </div>
              <ul className="space-y-6 max-h-80 overflow-y-auto">
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

          {/* Conteúdo principal e lateral */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Espaço principal para outras seções */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-lg shadow-lg border">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Ações Rápidas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
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
                    <span className="font-semibold text-gray-800">
                      Ver Leads
                    </span>
                  </Link>
                  <Link
                    href="/intranet/usuarios-favoritos"
                    className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Heart className="mx-auto w-10 h-10 text-gray-600 mb-2" />
                    <span className="font-semibold text-gray-800">
                      Favoritos
                    </span>
                  </Link>
                  <Link
                    href="/intranet/usuarios"
                    className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Users className="mx-auto w-10 h-10 text-gray-600 mb-2" />
                    <span className="font-semibold text-gray-800">
                      Gerenciar Usuário
                    </span>
                  </Link>
                  <Link
                    href="/intranet/captacao"
                    className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Users className="mx-auto w-10 h-10 text-gray-600 mb-2" />
                    <span className="font-semibold text-gray-800">Vendas</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Área lateral com lembretes e visitas */}
            <div className="space-y-8">
              {/* Visitas Futuras */}
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Visitas Futuras
                  </h2>
                  <Link
                    href="/intranet/visitas"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ver todas
                  </Link>
                </div>
                <ul className="space-y-3 max-h-64 overflow-y-auto">
                  {visitasFuturas.length > 0 ? (
                    visitasFuturas.map((visita) => {
                      const dataFormatada = visita.data?.toDate
                        ? visita.data.toDate()
                        : new Date(visita.data);

                      // Exibir status da visita, se existir, senão "Visita agendada"
                      const statusVisita = visita.status || "Visita agendada";

                      return (
                        <li key={visita.id} className="flex items-start gap-3">
                          <div className="bg-blue-100 text-blue-600 p-1.5 rounded-full mt-1">
                            <CalendarPlus size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {visita.titulo || statusVisita}
                            </p>
                            <p className="text-xs text-gray-500">
                              Data: {dataFormatada.toLocaleDateString("pt-BR")}
                            </p>
                            {visita.endereco && (
                              <p className="text-xs text-gray-500">
                                Local: {visita.endereco.rua},{" "}
                                {visita.endereco.numero}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 italic">
                              {statusVisita}
                            </p>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500">
                      Nenhuma visita futura.
                    </p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
