// src/components/intranet/LeadForm.tsx
"use client";

import { Lead } from "@/types";
import { mockCorretores } from "@/lib/mockCorretores";

// Definimos as propriedades que o formulário vai receber
interface LeadFormProps {
  lead: Partial<Lead>;
  setLead: React.Dispatch<React.SetStateAction<Partial<Lead>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  buttonText: string;
}

export function LeadForm({
  lead,
  setLead,
  onSubmit,
  isLoading,
  buttonText,
}: LeadFormProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setLead({
      ...lead,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass =
    "w-full bg-white border border-gray-300 rounded-md h-12 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <form
      onSubmit={onSubmit}
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
              Nome do Cliente*
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={lead.nome || ""}
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
              Contato (Email ou Telefone)*
            </label>
            <input
              type="text"
              id="contato"
              name="contato"
              value={lead.contato || ""}
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
              Origem do Lead*
            </label>
            <select
              id="origem"
              name="origem"
              value={lead.origem || ""}
              onChange={handleChange}
              className={inputClass}
              required
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
              Status*
            </label>
            <select
              id="status"
              name="status"
              value={lead.status || "Novo"}
              onChange={handleChange}
              className={inputClass}
              required
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
              value={lead.interesse || ""}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={lead.corretorAtribuido || ""}
              onChange={handleChange}
              className={inputClass}
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
          {isLoading ? "Salvando..." : buttonText}
        </button>
      </div>
    </form>
  );
}
