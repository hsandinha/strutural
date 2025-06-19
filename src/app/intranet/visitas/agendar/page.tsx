// src/app/intranet/visitas/agendar/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { Visita } from "@/types";
import { mockImoveis } from "@/lib/mockData";
import { mockCorretores } from "@/lib/mockCorretores";

// Componente Wrapper com Suspense, necessário para usar useSearchParams
function AgendarVisitaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- ESTADOS DO COMPONENTE ---
  // Guarda os dados da nova visita que está sendo criada no formulário.
  const [novaVisita, setNovaVisita] = useState<Partial<Visita>>({
    status: "Agendada", // Valor padrão para uma nova visita
    imovelId: "",
    corretorResponsavel: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const returnTo = searchParams.get("returnTo") || "/intranet/dashboard";
  // --- LÓGICA DO COMPONENTE ---

  // Este 'useEffect' roda quando a página carrega.
  // Ele verifica se a URL tem parâmetros para pré-preencher o formulário.
  useEffect(() => {
    const nomeCliente = searchParams.get("nomeCliente");
    const telefoneCliente = searchParams.get("telefoneCliente");
    const imovelId = searchParams.get("imovelId");

    // Cria um objeto com os valores da URL para preencher o estado
    const initialStateFromUrl: Partial<Visita> = {};
    if (nomeCliente) initialStateFromUrl.nomeCliente = nomeCliente;
    if (telefoneCliente) initialStateFromUrl.telefoneCliente = telefoneCliente;
    if (imovelId) initialStateFromUrl.imovelId = imovelId;

    // Atualiza o estado com os dados pré-preenchidos
    if (Object.keys(initialStateFromUrl).length > 0) {
      setNovaVisita((prev) => ({ ...prev, ...initialStateFromUrl }));
    }
  }, [searchParams]);

  // Função genérica para atualizar o estado quando qualquer campo do formulário muda.
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setNovaVisita({
      ...novaVisita,
      [e.target.name]: e.target.value,
    });
  };

  // Função para quando o formulário é enviado.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Adiciona informações que não estão no formulário, mas são necessárias
    const imovelSelecionado = mockImoveis.find(
      (i) => i.id === novaVisita.imovelId
    );
    const dadosCompletos = {
      ...novaVisita,
      id: `vis-${new Date().getTime()}`, // Gera um ID de exemplo
      dataCriacao: new Date().toISOString(),
      imovelTitulo: imovelSelecionado?.titulo || "Título não encontrado",
      imovelFoto: imovelSelecionado?.fotos[0] || "/imovel-placeholder.png",
    };

    console.log("Agendando nova visita:", dadosCompletos);

    // SIMULAÇÃO DE UMA CHAMADA DE API PARA SALVAR
    setTimeout(() => {
      alert(
        "Visita agendada com sucesso! (Simulação)\nVerifique o console para ver os dados."
      );
      setIsLoading(false);
      // Redireciona de volta para a lista de visitas após agendar
      router.push("/intranet/visitas");
    }, 1500);
  };

  // Classe de estilo reutilizável para os campos do formulário
  const inputClass =
    "w-full bg-white border border-gray-300 rounded-md h-12 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  // --- RENDERIZAÇÃO DO JSX ---
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

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border space-y-6"
      >
        <fieldset>
          <legend className="text-lg font-semibold text-gray-700 mb-4">
            Dados da Visita
          </legend>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="imovelId"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Imóvel*
              </label>
              <select
                id="imovelId"
                name="imovelId"
                value={novaVisita.imovelId || ""}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="" disabled>
                  Selecione o imóvel
                </option>
                {mockImoveis.map((imovel) => (
                  <option key={imovel.id} value={imovel.id}>
                    Cód: {imovel.id} - {imovel.titulo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="data"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Data e Hora da Visita*
              </label>
              <input
                type="datetime-local"
                id="data"
                name="data"
                value={novaVisita.data || ""}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-semibold text-gray-700 mb-4">
            Dados do Cliente
          </legend>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="nomeCliente"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Nome do Cliente*
              </label>
              <input
                type="text"
                id="nomeCliente"
                name="nomeCliente"
                value={novaVisita.nomeCliente || ""}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="telefoneCliente"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Telefone do Cliente*
              </label>
              <input
                type="tel"
                id="telefoneCliente"
                name="telefoneCliente"
                value={novaVisita.telefoneCliente || ""}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-semibold text-gray-700 mb-4">
            Responsável
          </legend>
          <div>
            <label
              htmlFor="corretorResponsavel"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Corretor*
            </label>
            <select
              id="corretorResponsavel"
              name="corretorResponsavel"
              value={novaVisita.corretorResponsavel || ""}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="" disabled>
                Selecione um corretor
              </option>
              {mockCorretores.map((corretor) => (
                <option key={corretor.id} value={corretor.nome}>
                  {corretor.nome}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? "Agendando..." : "Confirmar Agendamento"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AgendarVisitaPageWrapper() {
  return (
    <Suspense>
      <AgendarVisitaPageContent />
    </Suspense>
  );
}
