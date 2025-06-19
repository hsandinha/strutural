// src/app/intranet/leads/novo/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { Lead } from "@/types";
import { mockCorretores } from "@/lib/mockCorretores";

export default function AdicionarLeadPage() {
  const router = useRouter();

  // Estado para guardar os dados do novo lead que está sendo criado
  const [novoLead, setNovoLead] = useState<Partial<Lead>>({
    status: "Novo", // Valor padrão para um novo lead
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setNovoLead({
      ...novoLead,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando novo lead:", {
      ...novoLead,
      id: `lead-${new Date().getTime()}`, // Gera um ID de exemplo
      dataCriacao: new Date().toISOString().split("T")[0], // Pega a data de hoje
    });

    // SIMULAÇÃO DE UMA CHAMADA DE API PARA SALVAR
    setTimeout(() => {
      alert(
        "Lead salvo com sucesso! (Simulação)\nVerifique o console para ver os dados."
      );
      setIsLoading(false);
      // Redireciona de volta para a lista de leads após salvar
      router.push("/intranet/leads");
    }, 1500);
  };

  const inputClass =
    "w-full bg-white border border-gray-300 rounded-md h-12 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/intranet/leads"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftCircle size={24} />
          Voltar para a lista de leads
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Adicionar Novo Lead
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border space-y-6"
      >
        <fieldset>
          <legend className="text-lg font-semibold text-gray-700 mb-4">
            Informações do Lead
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Nome do Cliente
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="contato"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Contato (Email ou Telefone)
              </label>
              <input
                type="text"
                id="contato"
                name="contato"
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="origem"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Origem do Lead
              </label>
              <select
                id="origem"
                name="origem"
                onChange={handleChange}
                className={inputClass}
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione a origem
                </option>
                <option>Site</option>
                <option>Indicação</option>
                <option>Portal Imobiliário</option>
                <option>Redes Sociais</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={novoLead.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Novo</option>
                <option>Em Contato</option>
                <option>Qualificado</option>
                <option>Perdido</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="interesse"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Interesse
              </label>
              <textarea
                id="interesse"
                name="interesse"
                rows={3}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-md p-4 ..."
                placeholder="Ex: Apartamentos de 3 quartos na Savassi"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="corretorAtribuido"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Atribuir ao Corretor
              </label>
              <select
                id="corretorAtribuido"
                name="corretorAtribuido"
                onChange={handleChange}
                className={inputClass}
                defaultValue=""
              >
                <option value="">Nenhum</option>
                {mockCorretores.map((corretor) => (
                  <option key={corretor.id} value={corretor.nome}>
                    {corretor.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? "Salvando..." : "Salvar Lead"}
          </button>
        </div>
      </form>
    </div>
  );
}
