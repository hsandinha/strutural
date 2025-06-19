// src/app/intranet/visitas/agendar/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { mockImoveis } from "@/lib/mockData";
import { ArrowLeftCircle } from "lucide-react";
import { Visita } from "@/types";
import { VisitForm } from "@/components/intranet/VisitForm"; // Importe o novo formulário

function AgendarVisitaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [novaVisita, setNovaVisita] = useState<Partial<Visita>>({
    status: "Agendada",
  });
  const [isLoading, setIsLoading] = useState(false);
  const returnTo = searchParams.get("returnTo") || "/intranet/visitas";
  useEffect(() => {
    // Lê todos os parâmetros relevantes da URL
    const nomeCliente = searchParams.get("nomeCliente");
    const telefoneCliente = searchParams.get("telefoneCliente");
    const imovelId = searchParams.get("imovelId");

    // Cria um objeto apenas com os dados que vieram da URL
    const initialStateFromUrl: Partial<Visita> = {};
    if (nomeCliente) initialStateFromUrl.nomeCliente = nomeCliente;
    if (telefoneCliente) initialStateFromUrl.telefoneCliente = telefoneCliente;
    if (imovelId) initialStateFromUrl.imovelId = imovelId;

    // Atualiza o estado da visita com os dados pré-preenchidos
    // Usamos uma função no set para garantir que pegamos o estado anterior corretamente
    if (Object.keys(initialStateFromUrl).length > 0) {
      setNovaVisita((prev) => ({ ...prev, ...initialStateFromUrl }));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    // 1. Previne o comportamento padrão do formulário, que é recarregar a página.
    e.preventDefault();

    // 2. Ativa o estado de carregamento para dar feedback ao usuário (ex: desabilitar o botão).
    setIsLoading(true);

    // 3. Adiciona informações que não estão no formulário, mas são necessárias para o objeto 'Visita'.
    const imovelSelecionado = mockImoveis.find(
      (i) => i.id === novaVisita.imovelId
    );

    const dadosCompletosParaSalvar = {
      ...novaVisita,
      id: `vis-${new Date().getTime()}`, // Gera um ID de exemplo, já que não temos um banco real.
      imovelTitulo: imovelSelecionado?.titulo || "Título não encontrado",
      imovelFoto: imovelSelecionado?.fotos[0] || "/imovel-placeholder.png",
    };

    // 4. Exibe os dados finais no console do navegador para você poder depurar e ver se está tudo certo.
    console.log(
      "Agendando nova visita (dados completos):",
      dadosCompletosParaSalvar
    );

    // --- SIMULAÇÃO DE UMA CHAMADA DE API PARA SALVAR NO BANCO DE DADOS ---
    // Em um app real, aqui você faria um `fetch` para sua API que salvaria no Firebase.
    // O setTimeout simula o tempo que a internet levaria para responder.
    setTimeout(() => {
      alert("Visita agendada com sucesso! (Isto é uma simulação)");
      setIsLoading(false);
      router.push(returnTo);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href={returnTo}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftCircle size={24} />
          {returnTo.includes("/leads/")
            ? "Voltar para o Lead"
            : "Voltar para a Agenda"}
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Agendar Nova Visita
      </h1>

      {/* Usamos nosso novo componente de formulário reutilizável */}
      <VisitForm
        visita={novaVisita}
        setVisita={setNovaVisita}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText="Confirmar Agendamento"
      />
    </div>
  );
}

export default function AgendarVisitaPage() {
  return (
    <Suspense>
      <AgendarVisitaPageContent />
    </Suspense>
  );
}
