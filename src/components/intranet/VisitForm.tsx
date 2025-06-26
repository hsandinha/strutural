"use client";

import { Visita } from "@/types";

interface VisitFormProps {
  visita: Partial<Visita>;
  setVisita: React.Dispatch<React.SetStateAction<Partial<Visita>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  buttonText: string;
  imoveis: { id: string; titulo: string; fotos?: string[] }[]; // lista de imóveis
  corretores: { id: string; nome: string }[]; // lista de corretores
}

export function VisitForm({
  visita,
  setVisita,
  onSubmit,
  isLoading,
  buttonText,
  imoveis,
  corretores,
}: VisitFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setVisita({
      ...visita,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass =
    "w-full bg-white border border-gray-300 rounded-md h-12 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <form
      onSubmit={onSubmit}
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
              value={visita.imovelId || ""}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="" disabled>
                Selecione o imóvel
              </option>
              {imoveis.map((imovel) => (
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
              value={visita.data || ""}
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
              value={visita.nomeCliente || ""}
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
              value={visita.telefoneCliente || ""}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-gray-700 mb-4">
          Responsável e Status
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              value={visita.corretorResponsavel || ""}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="" disabled>
                Selecione um corretor
              </option>
              {corretores.map((corretor) => (
                <option key={corretor.id} value={corretor.nome}>
                  {corretor.nome}
                </option>
              ))}
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
              value={visita.status || "Agendada"}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Agendada</option>
              <option>Confirmada</option>
              <option>Realizada</option>
              <option>Cancelada</option>
            </select>
          </div>
        </div>
      </fieldset>

      <div className="pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-black font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? "Salvando..." : buttonText}
        </button>
      </div>
    </form>
  );
}
